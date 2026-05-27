/* ================================================================
   PriceScope — routes/alertas.js
   CRUD de alertas de precio por usuario
================================================================ */
const router = require('express').Router();
const db     = require('../db');
const { verificarToken } = require('./auth');

/* ── POST /api/alertas — crear alerta (requiere login) ── */
router.post('/', verificarToken, async (req, res) => {
  const { producto_nombre, producto_marca, producto_modelo, pulgadas, precio_objetivo, fuentes } = req.body;
  if (!producto_nombre || !precio_objetivo)
    return res.status(400).json({ error: 'Nombre del producto y precio objetivo son obligatorios' });
  try {
    const [result] = await db.query(
      `INSERT INTO alertas 
       (usuario_id, producto_nombre, producto_marca, producto_modelo, pulgadas, precio_objetivo, fuentes)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [req.usuario.id, producto_nombre, producto_marca || '', producto_modelo || '',
       pulgadas || '', precio_objetivo, fuentes || 'MercadoLibre,eBay,Amazon']
    );
    res.json({ ok: true, id: result.insertId, mensaje: 'Alerta creada correctamente' });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Error creando alerta' });
  }
});

/* ── GET /api/alertas — obtener alertas del usuario ── */
router.get('/', verificarToken, async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT a.*, 
        (SELECT h.precio FROM historial_precios h 
         WHERE h.producto_nombre LIKE CONCAT('%', SUBSTRING(a.producto_nombre, 1, 20), '%')
         ORDER BY h.fecha DESC LIMIT 1) AS precio_actual
       FROM alertas a 
       WHERE a.usuario_id = ? AND a.activa = 1
       ORDER BY a.fecha_creacion DESC`,
      [req.usuario.id]
    );
    res.json({ ok: true, alertas: rows });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Error obteniendo alertas' });
  }
});

/* ── DELETE /api/alertas/:id — eliminar alerta ── */
router.delete('/:id', verificarToken, async (req, res) => {
  try {
    await db.query(
      'UPDATE alertas SET activa = 0 WHERE id = ? AND usuario_id = ?',
      [req.params.id, req.usuario.id]
    );
    res.json({ ok: true, mensaje: 'Alerta eliminada' });
  } catch (e) {
    res.status(500).json({ error: 'Error eliminando alerta' });
  }
});

module.exports = router;
