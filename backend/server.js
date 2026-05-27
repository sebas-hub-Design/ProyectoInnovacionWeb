/* ================================================================
   PriceScope — server.js
   Servidor principal Express + MySQL
================================================================ */
require('dotenv').config();
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const express    = require('express');
const cors       = require('cors');
const app        = express();
const PORT       = process.env.PORT || 3000;

/* ── Middlewares ── */
app.use(cors({ origin: '*' }));
app.use(express.json());

/* ── Rutas ── */
app.use('/api/auth',      require('./routes/auth'));
app.use('/api/productos', require('./routes/productos'));
app.use('/api/alertas',   require('./routes/alertas'));
app.use('/api/historial', require('./routes/historial'));
app.use('/api/ebay',      require('./routes/ebay'));

/* ── Ruta de salud ── */
app.get('/', (req, res) => {
  res.json({ status: 'PriceScope backend corriendo ✅', port: PORT });
});

/* ── Iniciar servidor ── */
app.listen(PORT, () => {
  console.log(`✅ PriceScope backend corriendo en http://localhost:${PORT}`);
});
