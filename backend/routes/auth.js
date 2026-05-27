/* ================================================================
   PriceScope — routes/auth.js
   Registro, login y verificación de token
================================================================ */
const router  = require('express').Router();
const bcrypt  = require('bcryptjs');
const jwt     = require('jsonwebtoken');
const db      = require('../db');

/* ── Middleware verificar token ── */
const verificarToken = (req, res, next) => {
  const auth = req.headers['authorization'];
  if (!auth) return res.status(401).json({ error: 'Token requerido' });
  const token = auth.split(' ')[1];
  try {
    req.usuario = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ error: 'Token inválido' });
  }
};

/* ── POST /api/auth/registro ── */
router.post('/registro', async (req, res) => {
  const { nombre, correo, contrasena } = req.body;
  if (!nombre || !correo || !contrasena)
    return res.status(400).json({ error: 'Todos los campos son obligatorios' });
  if (contrasena.length < 6)
    return res.status(400).json({ error: 'La contraseña debe tener al menos 6 caracteres' });
  try {
    const [existe] = await db.query('SELECT id FROM usuarios WHERE correo = ?', [correo]);
    if (existe.length > 0)
      return res.status(400).json({ error: 'El correo ya está registrado' });

    const hash = await bcrypt.hash(contrasena, 10);
    const [result] = await db.query(
      'INSERT INTO usuarios (nombre, correo, contrasena) VALUES (?, ?, ?)',
      [nombre, correo, hash]
    );
    const token = jwt.sign(
      { id: result.insertId, nombre, correo },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    res.json({ ok: true, token, usuario: { id: result.insertId, nombre, correo } });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

/* ── POST /api/auth/login ── */
router.post('/login', async (req, res) => {
  const { correo, contrasena } = req.body;
  if (!correo || !contrasena)
    return res.status(400).json({ error: 'Correo y contraseña requeridos' });
  try {
    const [rows] = await db.query('SELECT * FROM usuarios WHERE correo = ?', [correo]);
    if (rows.length === 0)
      return res.status(401).json({ error: 'Correo o contraseña incorrectos' });

    const usuario = rows[0];
    const ok = await bcrypt.compare(contrasena, usuario.contrasena);
    if (!ok)
      return res.status(401).json({ error: 'Correo o contraseña incorrectos' });

    const token = jwt.sign(
      { id: usuario.id, nombre: usuario.nombre, correo: usuario.correo },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    res.json({ ok: true, token, usuario: { id: usuario.id, nombre: usuario.nombre, correo: usuario.correo } });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

/* ── GET /api/auth/perfil ── */
router.get('/perfil', verificarToken, async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT id, nombre, correo, fecha_registro FROM usuarios WHERE id = ?',
      [req.usuario.id]
    );
    if (rows.length === 0) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json({ ok: true, usuario: rows[0] });
  } catch (e) {
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

module.exports = router;
module.exports.verificarToken = verificarToken;
