/* ================================================================
   PriceScope — routes/auth.js
   Registro con verificación por correo (código 4 dígitos)
   Login y verificación de token JWT
================================================================ */
const router  = require('express').Router();
const bcrypt  = require('bcryptjs');
const jwt     = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const db      = require('../db');

/* ─────────────────────────────────────────────────────────────
   TRANSPORTER DE GMAIL
   Requiere en .env:
     GMAIL_USER=tu@gmail.com
     GMAIL_PASS=xxxx xxxx xxxx xxxx   ← contraseña de aplicación
───────────────────────────────────────────────────────────── */
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS
  }
});

/* ─────────────────────────────────────────────────────────────
   ALMACÉN TEMPORAL de códigos de verificación
   { correo → { codigo, nombre, hashContrasena, expira } }
   Solo vive en memoria — se limpia solo al verificar o expirar
───────────────────────────────────────────────────────────── */
const pendientes = new Map();

/* ── Middleware verificar token JWT ── */
const verificarToken = (req, res, next) => {
  const auth = req.headers['authorization'];
  if (!auth) return res.status(401).json({ ok: false, error: 'Token requerido' });
  const token = auth.split(' ')[1];
  try {
    req.usuario = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ ok: false, error: 'Token inválido' });
  }
};

/* ─────────────────────────────────────────────────────────────
   POST /api/auth/registro
   Paso 1: valida datos, guarda pendiente, envía código al correo
   Responde { ok: true, pendiente: true } para que el frontend
   muestre el input del código
───────────────────────────────────────────────────────────── */
router.post('/registro', async (req, res) => {
  const { nombre, correo, contrasena } = req.body;

  if (!nombre || !correo || !contrasena)
    return res.status(400).json({ ok: false, error: 'Todos los campos son obligatorios' });
  if (contrasena.length < 6)
    return res.status(400).json({ ok: false, error: 'La contraseña debe tener al menos 6 caracteres' });

  try {
    /* Verificar que el correo no esté registrado ya */
    const [existe] = await db.query('SELECT id FROM usuarios WHERE correo = ?', [correo]);
    if (existe.length > 0)
      return res.status(400).json({ ok: false, error: 'El correo ya está registrado' });

    /* Generar código de 4 dígitos */
    const codigo = String(Math.floor(1000 + Math.random() * 9000));

    /* Hash de la contraseña (lo guardamos para cuando confirme) */
    const hashContrasena = await bcrypt.hash(contrasena, 10);

    /* Guardar en pendientes con expiración de 10 minutos */
    pendientes.set(correo, {
      codigo,
      nombre,
      hashContrasena,
      expira: Date.now() + 10 * 60 * 1000
    });

    /* Enviar correo */
    await transporter.sendMail({
      from:    `"PriceScope" <${process.env.GMAIL_USER}>`,
      to:      correo,
      subject: 'Tu código de verificación — PriceScope',
      html: `
        <div style="font-family:sans-serif;max-width:420px;margin:auto;padding:32px;border:1px solid #e5e7eb;border-radius:12px">
          <h2 style="color:#1e40af;margin-bottom:8px">PriceScope</h2>
          <p style="color:#374151">Hola <strong>${nombre}</strong>, ingresá este código para confirmar tu cuenta:</p>
          <div style="background:#f0f6ff;border-radius:10px;padding:20px;text-align:center;margin:24px 0">
            <span style="font-size:40px;font-weight:800;letter-spacing:12px;color:#1e40af">${codigo}</span>
          </div>
          <p style="color:#6b7280;font-size:13px">Este código expira en <strong>10 minutos</strong>.</p>
          <p style="color:#6b7280;font-size:13px">Si no creaste esta cuenta, ignorá este mensaje.</p>
        </div>
      `
    });

    console.log(`✉️  Código ${codigo} enviado a ${correo}`);
    res.json({ ok: true, pendiente: true, mensaje: `Código enviado a ${correo}` });

  } catch (e) {
    console.error('Error en /registro:', e);
    /* Si el error es de nodemailer, dar mensaje específico */
    if (e.code === 'EAUTH' || e.responseCode === 535) {
      return res.status(500).json({ ok: false, error: 'Error al enviar el correo. Verificá las credenciales de Gmail en .env' });
    }
    res.status(500).json({ ok: false, error: 'Error en el servidor' });
  }
});

/* ─────────────────────────────────────────────────────────────
   POST /api/auth/verificar
   Paso 2: recibe { correo, codigo } → si coincide, crea la cuenta
───────────────────────────────────────────────────────────── */
router.post('/verificar', async (req, res) => {
  const { correo, codigo } = req.body;

  if (!correo || !codigo)
    return res.status(400).json({ ok: false, error: 'Correo y código son obligatorios' });

  const pendiente = pendientes.get(correo);

  if (!pendiente)
    return res.status(400).json({ ok: false, error: 'No hay un registro pendiente para ese correo' });

  if (Date.now() > pendiente.expira) {
    pendientes.delete(correo);
    return res.status(400).json({ ok: false, error: 'El código expiró. Volvé a registrarte.' });
  }

  if (pendiente.codigo !== String(codigo).trim())
    return res.status(400).json({ ok: false, error: 'Código incorrecto. Revisá tu correo.' });

  /* Código correcto → insertar usuario en la BD */
  try {
    const [result] = await db.query(
      'INSERT INTO usuarios (nombre, correo, contrasena) VALUES (?, ?, ?)',
      [pendiente.nombre, correo, pendiente.hashContrasena]
    );

    /* Limpiar pendiente */
    pendientes.delete(correo);

    /* Generar JWT */
    const token = jwt.sign(
      { id: result.insertId, nombre: pendiente.nombre, correo },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      ok: true,
      token,
      usuario: { id: result.insertId, nombre: pendiente.nombre, correo }
    });

  } catch (e) {
    console.error('Error en /verificar:', e);
    res.status(500).json({ ok: false, error: 'Error guardando el usuario en la base de datos' });
  }
});

/* ─────────────────────────────────────────────────────────────
   POST /api/auth/login
───────────────────────────────────────────────────────────── */
router.post('/login', async (req, res) => {
  const { correo, contrasena } = req.body;
  if (!correo || !contrasena)
    return res.status(400).json({ ok: false, error: 'Correo y contraseña requeridos' });

  try {
    const [rows] = await db.query('SELECT * FROM usuarios WHERE correo = ?', [correo]);
    if (rows.length === 0)
      return res.status(401).json({ ok: false, error: 'Correo o contraseña incorrectos' });

    const usuario = rows[0];
    const ok = await bcrypt.compare(contrasena, usuario.contrasena);
    if (!ok)
      return res.status(401).json({ ok: false, error: 'Correo o contraseña incorrectos' });

    const token = jwt.sign(
      { id: usuario.id, nombre: usuario.nombre, correo: usuario.correo },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    res.json({ ok: true, token, usuario: { id: usuario.id, nombre: usuario.nombre, correo: usuario.correo } });

  } catch (e) {
    console.error('Error en /login:', e);
    res.status(500).json({ ok: false, error: 'Error en el servidor' });
  }
});

/* ─────────────────────────────────────────────────────────────
   GET /api/auth/perfil
───────────────────────────────────────────────────────────── */
router.get('/perfil', verificarToken, async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT id, nombre, correo, fecha_registro FROM usuarios WHERE id = ?',
      [req.usuario.id]
    );
    if (rows.length === 0) return res.status(404).json({ ok: false, error: 'Usuario no encontrado' });
    res.json({ ok: true, usuario: rows[0] });
  } catch (e) {
    res.status(500).json({ ok: false, error: 'Error en el servidor' });
  }
});

module.exports = router;
module.exports.verificarToken = verificarToken;
