/* ================================================================
   PriceScope — routes/historial.js
   Historial de precios por nombre de producto
================================================================ */
const router = require('express').Router();
const db     = require('../db');

/* ── GET /api/historial?nombre=Samsung+TV+55 ── */
router.get('/', async (req, res) => {
  const { nombre } = req.query;
  if (!nombre) return res.status(400).json({ error: 'Parámetro nombre requerido' });

  /* Tomar las primeras 3 palabras para el filtro */
  const palabras = nombre.trim().split(' ').slice(0, 3).join(' ');

  try {
    const [rows] = await db.query(
      `SELECT 
         DATE_FORMAT(fecha, '%Y-%m-%d %H:%i') AS fecha,
         MIN(precio) AS precio_minimo,
         MAX(precio) AS precio_maximo,
         AVG(precio) AS precio_promedio,
         fuente
       FROM historial_precios
       WHERE producto_nombre LIKE ?
       GROUP BY DATE(fecha), fuente
       ORDER BY fecha ASC
       LIMIT 60`,
      [`%${palabras}%`]
    );

    /* Stats generales */
    const [stats] = await db.query(
      `SELECT 
         MIN(precio) AS minimo,
         MAX(precio) AS maximo,
         AVG(precio) AS promedio,
         COUNT(*) AS total_registros,
         (SELECT precio FROM historial_precios 
          WHERE producto_nombre LIKE ? 
          ORDER BY fecha DESC LIMIT 1) AS precio_actual
       FROM historial_precios
       WHERE producto_nombre LIKE ?`,
      [`%${palabras}%`, `%${palabras}%`]
    );

    res.json({
      ok: true,
      nombre: palabras,
      stats: stats[0],
      historial: rows
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Error obteniendo historial' });
  }
});

module.exports = router;
