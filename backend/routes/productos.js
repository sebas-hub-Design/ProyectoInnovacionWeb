/* ================================================================
   PriceScope — routes/productos.js
   Búsqueda en MercadoLibre, eBay y Amazon
   Guarda los 4 precios más bajos en historial_precios
================================================================ */
const router = require('express').Router();
const axios  = require('axios');
const db     = require('../db');

const USD_TO_PEN = 3.70;

/* ── Helpers ── */
function usdToPen(usd) {
  const n = parseFloat(usd);
  return isNaN(n) ? 0 : parseFloat((n * USD_TO_PEN).toFixed(2));
}

function extraerMarca(titulo) {
  const marcas = ['Samsung','LG','Sony','TCL','Hisense','Apple','Xiaomi','Google','Motorola',
                  'NVIDIA','AMD','Intel','Kingston','Corsair','Seagate','Western Digital','ASUS'];
  const t = titulo.toLowerCase();
  return marcas.find(m => t.includes(m.toLowerCase())) || '';
}

function extraerPulgadas(titulo) {
  const match = titulo.match(/(\d{2,3})["\s]*(pulgadas|"|''|in\b)/i);
  return match ? match[1] : '';
}

function extraerModelo(titulo) {
  const match = titulo.match(/\b([A-Z]{2,}[-\s]?[0-9A-Z]{3,})\b/);
  return match ? match[1] : '';
}

/* ── Guardar historial (4 precios más bajos) ── */
async function guardarHistorial(productos) {
  if (!productos.length) return;
  const ordenados = [...productos].sort((a, b) => a.precioNum - b.precioNum).slice(0, 4);
  for (const p of ordenados) {
    await db.query(
      `INSERT INTO historial_precios 
       (producto_nombre, producto_marca, producto_modelo, pulgadas, precio, fuente, url_producto)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [p.titulo, p.marca, p.modelo, p.pulgadas, p.precioNum, p.fuente, p.url]
    );
  }
}

/* ── MercadoLibre — búsqueda pública sin token ── */
async function buscarMeli(query, offset = 0) {
  try {
    console.log(`MeLi: obteniendo token...`);

    /* Generar token con client_credentials */
    const tokenRes = await axios.post(
      'https://api.mercadolibre.com/oauth/token',
      `grant_type=client_credentials&client_id=${process.env.MELI_CLIENT_ID}&client_secret=${process.env.MELI_CLIENT_SECRET}`,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept':       'application/json'
        }
      }
    );

    const token = tokenRes.data.access_token;
    console.log(`MeLi: token OK, buscando "${query}"...`);

    const res = await axios.get('https://api.mercadolibre.com/sites/MLA/search', {
      params:  { q: query, offset, limit: 20 },
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept':        'application/json'
      }
    });

    const resultados = res.data.results || [];
    console.log(`MeLi: ${resultados.length} productos ✅`);

    return resultados.map(p => ({
      id:        'meli-' + p.id,
      fuente:    'MercadoLibre',
      titulo:    p.title,
      imagen:    p.thumbnail ? p.thumbnail.replace('I.jpg', 'O.jpg') : null,
      precio:    'S/ ' + parseFloat(p.price).toLocaleString('es-PE', { minimumFractionDigits: 2 }),
      precioNum: parseFloat(p.price) || 0,
      precioOld: p.original_price
        ? 'S/ ' + parseFloat(p.original_price).toLocaleString('es-PE', { minimumFractionDigits: 2 })
        : null,
      url:      p.permalink,
      vendedor: p.seller?.nickname || 'Vendedor MeLi',
      marca:    extraerMarca(p.title),
      modelo:   extraerModelo(p.title),
      pulgadas: extraerPulgadas(p.title)
    }));
  } catch (e) {
    console.error('MeLi error:', e.response?.data || e.message);
    return [];
  }
}

/* ── eBay ── */
async function buscarEbay(query, offset = 0) {
  if (!process.env.EBAY_APP_ID || process.env.EBAY_APP_ID === 'AQUI_TU_EBAY_APP_ID') return [];
  try {
    const creds    = Buffer.from(`${process.env.EBAY_APP_ID}:${process.env.EBAY_CERT_ID}`).toString('base64');
    const tokenRes = await axios.post(
      'https://api.ebay.com/identity/v1/oauth2/token',
      'grant_type=client_credentials&scope=https%3A%2F%2Fapi.ebay.com%2Foauth%2Fapi_scope',
      { headers: { Authorization: `Basic ${creds}`, 'Content-Type': 'application/x-www-form-urlencoded' } }
    );
    const token = tokenRes.data.access_token;

    const res = await axios.get('https://api.ebay.com/buy/browse/v1/item_summary/search', {
      params:  { q: query, filter: 'deliveryCountry:PE', limit: 20, offset },
      headers: { Authorization: `Bearer ${token}`, 'X-EBAY-C-MARKETPLACE-ID': 'EBAY_US' }
    });

    return (res.data.itemSummaries || []).map(p => {
      const pen = usdToPen(p.price?.value || 0);
      return {
        id:        'ebay-' + p.itemId,
        fuente:    'eBay',
        titulo:    p.title,
        imagen:    p.image?.imageUrl || null,
        precio:    'S/ ' + pen.toLocaleString('es-PE', { minimumFractionDigits: 2 }),
        precioNum: pen,
        precioOld: null,
        url:       p.itemWebUrl,
        vendedor:  p.seller?.username || 'Vendedor eBay',
        marca:     extraerMarca(p.title),
        modelo:    extraerModelo(p.title),
        pulgadas:  extraerPulgadas(p.title)
      };
    });
  } catch (e) {
    console.error('eBay error:', e.message);
    return [];
  }
}

/* ── GET /api/productos/buscar?q=samsung+tv&categoria=Televisores&offset=0 ── */
router.get('/buscar', async (req, res) => {
  const { q, categoria, offset = 0 } = req.query;
  if (!q) return res.status(400).json({ error: 'Parámetro q requerido' });

  try {
    const [meli, ebay] = await Promise.all([
      buscarMeli(q, parseInt(offset)),
      buscarEbay(q, parseInt(offset))
    ]);

    let productos = [...meli, ...ebay];

    /* Filtrar por categoría si viene */
    if (categoria && categoria !== 'Todas las categorías') {
      productos = productos.filter(p => detectarCategoria(p.titulo) === categoria);
    }

    /* Guardar los 4 más baratos en historial */
    if (productos.length > 0) {
      guardarHistorial(productos).catch(e => console.error('Historial error:', e.message));
    }

    res.json({ ok: true, total: productos.length, productos });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Error buscando productos' });
  }
});

function detectarCategoria(titulo) {
  const t = titulo.toLowerCase();
  if (/tv|televisor|smart tv|qled|oled|led \d+|pantalla/.test(t)) return 'Televisores';
  if (/iphone|samsung galaxy|xiaomi|pixel|celular|smartphone|android/.test(t)) return 'Celulares';
  if (/gpu|rtx|gtx|cpu|ryzen|intel|ram|ssd|nvme|motherboard|placa/.test(t)) return 'Hardware PC';
  return 'Otros';
}

module.exports = router;
