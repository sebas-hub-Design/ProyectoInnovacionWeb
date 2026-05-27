/* ================================================================
   PriceScope — app.js
   APIs integradas:
     - Productos hardcodeados → vitrina inicial (sin búsqueda)
     - MercadoLibre API       → tienda 1 (agregar CLIENT_ID y CLIENT_SECRET)
     - eBay Browse API        → tienda 2 (agregar EBAY_APP_ID)
     - Amazon PAAPI           → tienda 3 (agregar ACCESS_KEY, SECRET_KEY, PARTNER_TAG)
   Conversión: tasa fija 1 USD = 3.70 soles peruanos
================================================================ */


/* ─────────────────────────────────────────────────────────────
   1. CONFIGURACIÓN DE APIs
   Cuando tengas las keys, pegálas acá abajo
───────────────────────────────────────────────────────────── */
const CONFIG = {
  USD_TO_PEN: 3.70,

  MELI: {
    CLIENT_ID:     5840807838394811,
    CLIENT_SECRET: "L00vTVPNrTI3si52sZZouQtdiTHM8Lyn",
    SITE_ID:       'MPE',
    BASE_URL:      'https://api.mercadolibre.com'
  },

  EBAY: {
    APP_ID:   'AQUI_TU_EBAY_APP_ID',
    BASE_URL: 'https://api.ebay.com/buy/browse/v1',
    SHIP_TO:  'PE'
  },

  AMAZON: {
    ACCESS_KEY:  'AQUI_TU_AMAZON_ACCESS_KEY',
    SECRET_KEY:  'AQUI_TU_AMAZON_SECRET_KEY',
    PARTNER_TAG: 'AQUI_TU_PARTNER_TAG',
    REGION:      'us-east-1',
    HOST:        'webservices.amazon.com'
  }
};

const CAT_KEYWORDS = {
  'Televisores': 'smart tv',
  'Hardware PC': 'hardware pc componentes',
  'Celulares':   'celular smartphone'
};


/* ─────────────────────────────────────────────────────────────
   2. PRODUCTOS HARDCODEADOS — vitrina inicial
   Reemplazan a Fake Store. Productos realistas con
   imágenes públicas, precios en soles y las 3 categorías.
───────────────────────────────────────────────────────────── */
const VITRINA = [

  /* ── TELEVISORES ── */
  {
    id:        'demo-tv-1',
    fuente:    'Demo',
    categoria: 'Televisores',
    titulo:    'Samsung Smart TV 55" QLED 4K QN55Q70C',
    imagen:    'https://images.samsung.com/is/image/samsung/p6pim/levant/qn55q70cafxza/gallery/levant-qled-q70c-qn55q70cafxza-536919466?$650_519_PNG$',
    precio:    'S/ 2,149.00',
    precioNum: 2149,
    precioOld: 'S/ 2,619.00',
    url:       '#',
    vendedor:  'Demo — MercadoLibre'
  },
  {
    id:        'demo-tv-2',
    fuente:    'Demo',
    categoria: 'Televisores',
    titulo:    'LG Smart TV 65" OLED evo C3 4K',
    imagen:    'https://www.lg.com/us/images/tvs/md08003672/gallery/medium01.jpg',
    precio:    'S/ 4,899.00',
    precioNum: 4899,
    precioOld: null,
    url:       '#',
    vendedor:  'Demo — MercadoLibre'
  },
  {
    id:        'demo-tv-3',
    fuente:    'Demo',
    categoria: 'Televisores',
    titulo:    'TCL Smart TV 50" QLED 4K Google TV S546G',
    imagen:    'https://www.tcl.com/content/dam/tcl/product-images/tv/s5-qled/50/tcl-50s546-front.png',
    precio:    'S/ 1,299.00',
    precioNum: 1299,
    precioOld: 'S/ 1,879.00',
    url:       '#',
    vendedor:  'Demo — eBay'
  },
  {
    id:        'demo-tv-4',
    fuente:    'Demo',
    categoria: 'Televisores',
    titulo:    'Sony Bravia XR 75" Mini LED 4K X90L',
    imagen:    'https://www.sony.com/image/5d02da5df552836db894cead8a68f5f3?fmt=png-alpha&wid=440',
    precio:    'S/ 6,250.00',
    precioNum: 6250,
    precioOld: null,
    url:       '#',
    vendedor:  'Demo — Amazon'
  },

  /* ── HARDWARE PC ── */
  {
    id:        'demo-hw-1',
    fuente:    'Demo',
    categoria: 'Hardware PC',
    titulo:    'NVIDIA GeForce RTX 4070 Super 12GB GDDR6X',
    imagen:    'https://www.nvidia.com/content/dam/en-zz/Solutions/geforce/ada/rtx-4070-super/geforce-ada-4070-super-shop-630-d@2x.jpg',
    precio:    'S/ 2,880.00',
    precioNum: 2880,
    precioOld: 'S/ 3,270.00',
    url:       '#',
    vendedor:  'Demo — MercadoLibre'
  },
  {
    id:        'demo-hw-2',
    fuente:    'Demo',
    categoria: 'Hardware PC',
    titulo:    'AMD Ryzen 9 7950X 16-Core AM5 5.7GHz',
    imagen:    'https://www.amd.com/system/files/2022-08/ryzen-9-7950x-pib-left-facing.png',
    precio:    'S/ 2,199.00',
    precioNum: 2199,
    precioOld: null,
    url:       '#',
    vendedor:  'Demo — MercadoLibre'
  },
  {
    id:        'demo-hw-3',
    fuente:    'Demo',
    categoria: 'Hardware PC',
    titulo:    'Kingston FURY Beast DDR5 32GB 6000MHz CL36',
    imagen:    'https://www.kingston.com/dataSheets/KF560C36BBEK2-32_en.pdf',
    precio:    'S/ 389.00',
    precioNum: 389,
    precioOld: 'S/ 499.00',
    url:       '#',
    vendedor:  'Demo — eBay'
  },
  {
    id:        'demo-hw-4',
    fuente:    'Demo',
    categoria: 'Hardware PC',
    titulo:    'Samsung 990 Pro NVMe M.2 SSD 2TB PCIe 4.0',
    imagen:    'https://images.samsung.com/is/image/samsung/p6pim/levant/mz-v9p2t0bw/gallery/levant-990-pro-mz-v9p2t0bw-536765656?$650_519_PNG$',
    precio:    'S/ 549.00',
    precioNum: 549,
    precioOld: null,
    url:       '#',
    vendedor:  'Demo — Amazon'
  },

  /* ── CELULARES ── */
  {
    id:        'demo-cel-1',
    fuente:    'Demo',
    categoria: 'Celulares',
    titulo:    'Apple iPhone 16 Pro Max 256GB Titanio Negro',
    imagen:    'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-16-pro-finish-select-202409-6-9inch-deserttitanium?wid=400&hei=400&fmt=png-alpha',
    precio:    'S/ 6,499.00',
    precioNum: 6499,
    precioOld: null,
    url:       '#',
    vendedor:  'Demo — MercadoLibre'
  },
  {
    id:        'demo-cel-2',
    fuente:    'Demo',
    categoria: 'Celulares',
    titulo:    'Samsung Galaxy S24 Ultra 512GB Titanium Gray',
    imagen:    'https://images.samsung.com/is/image/samsung/p6pim/levant/sm-s928bzageub/gallery/levant-galaxy-s24-ultra-sm-s928bzageub-thumb-539770798?$650_519_PNG$',
    precio:    'S/ 4,890.00',
    precioNum: 4890,
    precioOld: 'S/ 5,750.00',
    url:       '#',
    vendedor:  'Demo — MercadoLibre'
  },
  {
    id:        'demo-cel-3',
    fuente:    'Demo',
    categoria: 'Celulares',
    titulo:    'Xiaomi 14 Ultra 512GB Leica Optics 6.73"',
    imagen:    'https://i01.appmifile.com/v1/MI_18455B3E4DA706226CF7535A58E875F0/pms_1708336920.35303497.png',
    precio:    'S/ 3,780.00',
    precioNum: 3780,
    precioOld: null,
    url:       '#',
    vendedor:  'Demo — eBay'
  },
  {
    id:        'demo-cel-4',
    fuente:    'Demo',
    categoria: 'Celulares',
    titulo:    'Google Pixel 9 Pro 256GB Porcelain 6.3"',
    imagen:    'https://lh3.googleusercontent.com/nu4jLpUkFg7JVVaJGxKjhA5aEA1EeD63oBbV-5x-YzR_hHbmgVMJMy4NrPzaQh39_0I2HFTqlWIc=rw-e365-w440',
    precio:    'S/ 3,199.00',
    precioNum: 3199,
    precioOld: 'S/ 3,999.00',
    url:       '#',
    vendedor:  'Demo — Amazon'
  }
];


/* ─────────────────────────────────────────────────────────────
   3. ESTADO GLOBAL
───────────────────────────────────────────────────────────── */
const STATE = {
  query:      '',
  categoria:  'Todas las categorías',
  apiOffset:  0,
  pageSize:   4,            // muestra de a 4
  results:    [],           // productos visibles en pantalla
  allFetched: [],           // todos los traídos (se van mostrando de a 4)
  isLoading:  false,
  hasMore:    true,
  mode:       'vitrina'
};


/* ─────────────────────────────────────────────────────────────
   4. REFERENCIAS AL DOM
───────────────────────────────────────────────────────────── */
const DOM = {
  grid:         document.querySelector('.products-grid'),
  loadMoreWrap: document.querySelector('.loadmore-wrap'),
  loadMoreBtn:  document.querySelector('.btn-loadmore'),
  searchInput:  document.querySelector('.search-input'),
  searchBtn:    document.querySelector('.search-btn'),
  catBtn:       document.getElementById('catBtn'),
  catLabel:     document.getElementById('catLabel'),
  catArrow:     document.getElementById('catArrow'),
  catDropdown:  document.getElementById('catDropdown'),
  sectionTitle: document.querySelector('.catalogo .section-title'),
  sectionDesc:  document.querySelector('.catalogo .section-desc')
};


/* ─────────────────────────────────────────────────────────────
   5. CONVERSIÓN Y FORMATO DE MONEDA
───────────────────────────────────────────────────────────── */
function usdToPen(usd) {
  const n = parseFloat(usd);
  return isNaN(n) ? null : parseFloat((n * CONFIG.USD_TO_PEN).toFixed(2));
}

function formatPen(amount) {
  const n = parseFloat(amount);
  if (isNaN(n)) return 'S/ —';
  return 'S/ ' + n.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}


/* ─────────────────────────────────────────────────────────────
   6. MERCADO LIBRE API
───────────────────────────────────────────────────────────── */
async function fetchMercadoLibre(query, offset) {
  if (CONFIG.MELI.CLIENT_ID === 'AQUI_TU_MELI_CLIENT_ID') return [];
  try {
    const url = `${CONFIG.MELI.BASE_URL}/sites/${CONFIG.MELI.SITE_ID}/search`
              + `?q=${encodeURIComponent(query)}&offset=${offset}&limit=20`;
    const res  = await fetch(url, {
      headers: { 'Authorization': `Bearer ${CONFIG.MELI.CLIENT_ID}` }
    });
    const data = await res.json();
    if (!data.results) return [];
    return data.results.map(p => ({
      id:        'meli-' + p.id,
      fuente:    'MercadoLibre',
      titulo:    p.title,
      imagen:    p.thumbnail ? p.thumbnail.replace('I.jpg','O.jpg') : null,
      precio:    formatPen(p.price),
      precioNum: parseFloat(p.price) || 0,
      precioOld: p.original_price ? formatPen(p.original_price) : null,
      url:       p.permalink,
      vendedor:  p.seller?.nickname || 'Vendedor MeLi',
      categoria: detectarCategoria(p.title)
    }));
  } catch (e) {
    console.error('MercadoLibre error:', e);
    return [];
  }
}


/* ─────────────────────────────────────────────────────────────
   7. eBay BROWSE API
───────────────────────────────────────────────────────────── */
async function fetchEbay(query, offset) {
  if (CONFIG.EBAY.APP_ID === 'AQUI_TU_EBAY_APP_ID') return [];
  try {
    const url = `${CONFIG.EBAY.BASE_URL}/item_summary/search`
              + `?q=${encodeURIComponent(query)}`
              + `&filter=deliveryCountry:${CONFIG.EBAY.SHIP_TO}`
              + `&limit=20&offset=${offset}`;
    const res  = await fetch(url, {
      headers: {
        'Authorization':           `Bearer ${CONFIG.EBAY.APP_ID}`,
        'X-EBAY-C-MARKETPLACE-ID': 'EBAY_US',
        'Content-Type':            'application/json'
      }
    });
    const data = await res.json();
    if (!data.itemSummaries) return [];
    return data.itemSummaries.map(p => {
      const pen = usdToPen(p.price?.value || 0);
      return {
        id:        'ebay-' + p.itemId,
        fuente:    'eBay',
        titulo:    p.title,
        imagen:    p.image?.imageUrl || null,
        precio:    formatPen(pen),
        precioNum: pen || 0,
        precioOld: null,
        url:       p.itemWebUrl,
        vendedor:  p.seller?.username || 'Vendedor eBay',
        categoria: detectarCategoria(p.title)
      };
    });
  } catch (e) {
    console.error('eBay error:', e);
    return [];
  }
}


/* ─────────────────────────────────────────────────────────────
   8. AMAZON PAAPI
───────────────────────────────────────────────────────────── */
async function fetchAmazon(query) {
  if (CONFIG.AMAZON.ACCESS_KEY === 'AQUI_TU_AMAZON_ACCESS_KEY') return [];
  try {
    const payload = {
      Keywords:    query,
      Resources:   ['Images.Primary.Medium','ItemInfo.Title','Offers.Listings.Price'],
      PartnerTag:  CONFIG.AMAZON.PARTNER_TAG,
      PartnerType: 'Associates',
      SearchIndex: 'Electronics',
      ItemCount:   20
    };
    const endpoint = '/paapi5/searchitems';
    const host     = CONFIG.AMAZON.HOST;
    const region   = CONFIG.AMAZON.REGION;
    const service  = 'ProductAdvertisingAPI';
    const now      = new Date();
    const amzDate  = now.toISOString().replace(/[:\-]|\.\d{3}/g,'').slice(0,15) + 'Z';
    const dateStamp= amzDate.slice(0,8);
    const bodyStr  = JSON.stringify(payload);
    const enc      = new TextEncoder();

    const keyStr = async (key, msg) => {
      const k = await crypto.subtle.importKey('raw', key, {name:'HMAC',hash:'SHA-256'}, false, ['sign']);
      return new Uint8Array(await crypto.subtle.sign('HMAC', k, enc.encode(msg)));
    };
    const hashHex = async (msg) => {
      const buf = await crypto.subtle.digest('SHA-256', enc.encode(msg));
      return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2,'0')).join('');
    };

    const bodyHash      = await hashHex(bodyStr);
    const canonHeaders  = `content-encoding:amz-1.0\ncontent-type:application/json; charset=utf-8\nhost:${host}\nx-amz-date:${amzDate}\nx-amz-target:com.amazon.paapi5.v1.ProductAdvertisingAPIv1.SearchItems\n`;
    const signedHeaders = 'content-encoding;content-type;host;x-amz-date;x-amz-target';
    const canonReq      = `POST\n${endpoint}\n\n${canonHeaders}\n${signedHeaders}\n${bodyHash}`;
    const credScope     = `${dateStamp}/${region}/${service}/aws4_request`;
    const strToSign     = `AWS4-HMAC-SHA256\n${amzDate}\n${credScope}\n${await hashHex(canonReq)}`;

    let sigKey = enc.encode('AWS4' + CONFIG.AMAZON.SECRET_KEY);
    sigKey = await keyStr(sigKey, dateStamp);
    sigKey = await keyStr(sigKey, region);
    sigKey = await keyStr(sigKey, service);
    sigKey = await keyStr(sigKey, 'aws4_request');
    const signature  = Array.from(await keyStr(sigKey, strToSign)).map(b => b.toString(16).padStart(2,'0')).join('');
    const authHeader = `AWS4-HMAC-SHA256 Credential=${CONFIG.AMAZON.ACCESS_KEY}/${credScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`;

    const res  = await fetch(`https://${host}${endpoint}`, {
      method: 'POST',
      headers: {
        'content-encoding': 'amz-1.0',
        'content-type':     'application/json; charset=utf-8',
        'host':              host,
        'x-amz-date':        amzDate,
        'x-amz-target':      'com.amazon.paapi5.v1.ProductAdvertisingAPIv1.SearchItems',
        'Authorization':     authHeader
      },
      body: bodyStr
    });
    const data  = await res.json();
    const items = data?.SearchResult?.Items || [];
    return items.map(p => {
      const pen = usdToPen(p.Offers?.Listings?.[0]?.Price?.Amount || 0);
      return {
        id:        'amz-' + p.ASIN,
        fuente:    'Amazon',
        titulo:    p.ItemInfo?.Title?.DisplayValue || 'Producto Amazon',
        imagen:    p.Images?.Primary?.Medium?.URL || null,
        precio:    formatPen(pen),
        precioNum: pen || 0,
        precioOld: null,
        url:       `https://www.amazon.com/dp/${p.ASIN}?tag=${CONFIG.AMAZON.PARTNER_TAG}`,
        vendedor:  'Amazon',
        categoria: detectarCategoria(p.ItemInfo?.Title?.DisplayValue || '')
      };
    });
  } catch (e) {
    console.error('Amazon error:', e);
    return [];
  }
}


/* ─────────────────────────────────────────────────────────────
   9. DETECTAR CATEGORÍA desde el título
───────────────────────────────────────────────────────────── */
function detectarCategoria(titulo) {
  const t = titulo.toLowerCase();
  if (/tv|televisor|smart tv|qled|oled|led \d+|pantalla/.test(t)) return 'Televisores';
  if (/iphone|samsung galaxy|xiaomi|pixel|celular|smartphone|android/.test(t)) return 'Celulares';
  if (/gpu|rtx|gtx|cpu|ryzen|intel|ram|ssd|nvme|motherboard|placa/.test(t)) return 'Hardware PC';
  return 'Otros';
}


/* ─────────────────────────────────────────────────────────────
   10. SKELETON LOADER
───────────────────────────────────────────────────────────── */
function mostrarSkeletons(cantidad) {
  DOM.grid.innerHTML = '';
  DOM.grid.style.display = 'grid';
  for (let i = 0; i < cantidad; i++) {
    DOM.grid.innerHTML += `
      <article class="pcard pcard--skeleton">
        <div class="skeleton skeleton--img"></div>
        <div class="pcard__body">
          <div class="skeleton skeleton--line skeleton--line-short"></div>
          <div class="skeleton skeleton--line"></div>
          <div class="skeleton skeleton--line skeleton--line-med"></div>
          <div class="skeleton skeleton--price"></div>
          <div class="skeleton skeleton--btn"></div>
        </div>
      </article>`;
  }
}

function agregarSkeletons(cantidad) {
  for (let i = 0; i < cantidad; i++) {
    const art = document.createElement('article');
    art.className = 'pcard pcard--skeleton';
    art.innerHTML = `
      <div class="skeleton skeleton--img"></div>
      <div class="pcard__body">
        <div class="skeleton skeleton--line skeleton--line-short"></div>
        <div class="skeleton skeleton--line"></div>
        <div class="skeleton skeleton--line skeleton--line-med"></div>
        <div class="skeleton skeleton--price"></div>
        <div class="skeleton skeleton--btn"></div>
      </div>`;
    DOM.grid.appendChild(art);
  }
}

function quitarSkeletons() {
  document.querySelectorAll('.pcard--skeleton').forEach(el => el.remove());
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


/* ─────────────────────────────────────────────────────────────
   11. RENDERIZAR CARDS (agrega al grid sin borrar lo anterior)
───────────────────────────────────────────────────────────── */
function renderCards(productos) {
  if (productos.length === 0 && STATE.results.length === 0) {
    DOM.grid.innerHTML = `
      <div class="state-empty" style="grid-column:1/-1">
        <div class="state-empty__icon">😕</div>
        <p class="state-empty__title">No encontramos resultados</p>
        <p class="state-empty__desc">Intentá con otro nombre, marca o categoría.</p>
      </div>`;
    DOM.loadMoreWrap.style.display = 'none';
    return;
  }

  productos.forEach(p => {
    const badgeHtml = p.precioOld
      ? `<span class="badge badge--deal">Oferta</span>`
      : `<span class="badge badge--new">${p.fuente}</span>`;
    const precioOld = p.precioOld
      ? `<p class="pold">${p.precioOld}</p>` : '';
    const imgHtml   = p.imagen
      ? `<img src="${p.imagen}" alt="${escapeHtml(p.titulo)}" class="pcard__img pcard__img--real" loading="lazy" onerror="this.style.display='none'">`
      : `<div class="pcard__img pimg--default"></div>`;

    const card = document.createElement('article');
    card.className  = 'pcard';
    card.dataset.id = p.id;
    card.innerHTML  = `
      <div class="pcard__img-wrap">
        ${imgHtml}
        ${badgeHtml}
        <button class="btn-bell" aria-label="Alerta de precio" onclick="abrirAlerta(event,'${p.id}')">
          <svg width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
          </svg>
        </button>
      </div>
      <div class="pcard__body">
        <div class="pcard__meta">
          <span class="pbrand">${escapeHtml(p.categoria)}</span>
          <div class="stags">${getFuenteTag(p.fuente)}</div>
        </div>
        <h3 class="pname">${escapeHtml(p.titulo)}</h3>
        <div class="pprice-row">
          <div>
            <p class="pfrom">Desde</p>
            <p class="pprice">${p.precio}</p>
          </div>
          ${precioOld}
        </div>
        <button class="btn-ver" onclick="verProducto('${p.id}')">Ver precios →</button>
      </div>`;

    DOM.grid.appendChild(card);
    STATE.results.push(p);
  });
}

function getFuenteTag(fuente) {
  const map = {
    'MercadoLibre': '<span class="stag stag--meli">MeLi</span>',
    'eBay':         '<span class="stag stag--ebay">eBay</span>',
    'Amazon':       '<span class="stag stag--api3">Amazon</span>',
    'Demo':         '<span class="stag stag--fake">Demo</span>'
  };
  return map[fuente] || `<span class="stag stag--fake">${fuente}</span>`;
}

function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}


/* ─────────────────────────────────────────────────────────────
   12. ACTUALIZAR BOTÓN CARGAR MÁS
───────────────────────────────────────────────────────────── */
function actualizarBotonCargarMas() {
  const hayMasEnMemoria = STATE.results.length < STATE.allFetched.length;
  const hayMasEnAPI     = STATE.hasMore;
  DOM.loadMoreWrap.style.display = (hayMasEnMemoria || hayMasEnAPI) ? 'flex' : 'none';
}


/* ─────────────────────────────────────────────────────────────
   13. VITRINA INICIAL — muestra los 12 productos demo de a 4
───────────────────────────────────────────────────────────── */
async function cargarVitrina() {
  STATE.mode       = 'vitrina';
  STATE.allFetched = [...VITRINA];
  STATE.results    = [];
  STATE.hasMore    = false;

  DOM.grid.innerHTML = '';
  DOM.grid.style.display = 'grid';
  DOM.loadMoreWrap.style.display = 'none';

  /* Skeleton breve para simular carga */
  mostrarSkeletons(STATE.pageSize);
  await delay(600);
  quitarSkeletons();

  /* Mostrar primeros 4 */
  renderCards(STATE.allFetched.slice(0, STATE.pageSize));
  actualizarBotonCargarMas();
}


/* ─────────────────────────────────────────────────────────────
   14. MOSTRAR SIGUIENTE PÁGINA — de a 4 desde allFetched
   Si se agota la memoria, pide más a las APIs
───────────────────────────────────────────────────────────── */
async function mostrarSiguientePagina() {
  if (STATE.isLoading) return;

  const yaVistos    = STATE.results.length;
  const disponibles = STATE.allFetched.slice(yaVistos, yaVistos + STATE.pageSize);

  if (disponibles.length > 0) {
    /* Hay productos en memoria → mostrar los próximos 4 */
    agregarSkeletons(disponibles.length);
    await delay(400);
    quitarSkeletons();
    renderCards(disponibles);
    actualizarBotonCargarMas();
  } else {
    /* Se agotó la memoria → pedir más a las APIs */
    await pedirMasALaAPI();
  }
}


/* ─────────────────────────────────────────────────────────────
   15. BÚSQUEDA PRINCIPAL
   MercadoLibre → llamada directa desde el navegador (CORS OK)
   Backend      → solo para login, alertas e historial
───────────────────────────────────────────────────────────── */

/* Llamada directa a MercadoLibre desde el navegador */
async function fetchMeliDirecto(query, offset) {
  try {
    const url  = `https://api.mercadolibre.com/sites/MPE/search?q=${encodeURIComponent(query)}&offset=${offset}&limit=20`;
    const res  = await fetch(url);
    const data = await res.json();
    return (data.results || []).map(p => ({
      id:        'meli-' + p.id,
      fuente:    'MercadoLibre',
      titulo:    p.title,
      imagen:    p.thumbnail ? p.thumbnail.replace('I.jpg', 'O.jpg') : null,
      precio:    formatPen(p.price),
      precioNum: parseFloat(p.price) || 0,
      precioOld: p.original_price ? formatPen(p.original_price) : null,
      url:       p.permalink,
      vendedor:  p.seller?.nickname || 'Vendedor MeLi',
      marca:     '',
      modelo:    '',
      pulgadas:  ''
    }));
  } catch (e) {
    console.error('MeLi error:', e.message);
    return [];
  }
}

async function buscar(query, resetear) {
  if (STATE.isLoading) return;

  const q = query.trim();

  if (!q && STATE.categoria === 'Todas las categorias') {
    cargarVitrina();
    return;
  }

  STATE.isLoading = true;
  STATE.mode      = 'busqueda';
  STATE.query     = q;

  if (resetear) {
    STATE.apiOffset  = 0;
    STATE.results    = [];
    STATE.allFetched = [];
    STATE.hasMore    = true;
    DOM.grid.innerHTML = '';
  }

  actualizarTituloSeccion(q);
  mostrarSkeletons(STATE.pageSize);
  DOM.loadMoreWrap.style.display = 'none';

  const termino = q || CAT_KEYWORDS[STATE.categoria] || STATE.categoria;

  try {
    /* Llamar directo a MercadoLibre desde el navegador */
    let nuevos = await fetchMeliDirecto(termino, STATE.apiOffset);

    /* Filtrar por categoria si está seleccionada */
    if (STATE.categoria !== 'Todas las categorias') {
      nuevos = nuevos.filter(p => detectarCategoria(p.titulo) === STATE.categoria);
    }

    /* Si no hay resultados → usar vitrina demo filtrada */
    if (nuevos.length === 0) {
      nuevos = VITRINA.filter(p => {
        const matchQuery = !q || p.titulo.toLowerCase().includes(q.toLowerCase());
        const matchCat   = STATE.categoria === 'Todas las categorias' || p.categoria === STATE.categoria;
        return matchQuery && matchCat;
      });
      STATE.hasMore = false;
    } else {
      STATE.hasMore = nuevos.length >= 20;
    }

    /* Ordenar */
    const orden = document.querySelector('.sort-select')?.value || 'relevance';
    if (orden === 'price-asc')  nuevos.sort((a,b) => a.precioNum - b.precioNum);
    if (orden === 'price-desc') nuevos.sort((a,b) => b.precioNum - a.precioNum);

    STATE.allFetched.push(...nuevos);
    STATE.apiOffset += 20;

    quitarSkeletons();
    DOM.grid.innerHTML = '';
    STATE.results = [];
    renderCards(STATE.allFetched.slice(0, STATE.pageSize));

    /* Guardar historial en backend en segundo plano */
    fetch(`http://localhost:3000/api/productos/buscar?q=${encodeURIComponent(termino)}&categoria=${encodeURIComponent(STATE.categoria)}&offset=0`)
      .catch(() => {});

  } catch (e) {
    console.warn('Error buscando:', e.message);
    const demo = VITRINA.filter(p => {
      const matchQuery = !q || p.titulo.toLowerCase().includes(q.toLowerCase());
      const matchCat   = STATE.categoria === 'Todas las categorias' || p.categoria === STATE.categoria;
      return matchQuery && matchCat;
    });
    STATE.allFetched.push(...demo);
    STATE.hasMore = false;
    quitarSkeletons();
    DOM.grid.innerHTML = '';
    STATE.results = [];
    renderCards(STATE.allFetched.slice(0, STATE.pageSize));
    mostrarToast('Mostrando productos demo');
  }

  actualizarBotonCargarMas();
  STATE.isLoading = false;
}


/* ─────────────────────────────────────────────────────────────
   16. CARGAR MÁS — pide siguiente página directo a MercadoLibre
───────────────────────────────────────────────────────────── */
async function pedirMasALaAPI() {
  if (STATE.isLoading || !STATE.hasMore) {
    mostrarToast('No hay más productos para mostrar');
    DOM.loadMoreWrap.style.display = 'none';
    return;
  }
  STATE.isLoading = true;
  agregarSkeletons(STATE.pageSize);
  DOM.loadMoreWrap.style.display = 'none';

  const termino = STATE.query || CAT_KEYWORDS[STATE.categoria] || STATE.categoria;

  try {
    let nuevos = await fetchMeliDirecto(termino, STATE.apiOffset);

    if (STATE.categoria !== 'Todas las categorias') {
      nuevos = nuevos.filter(p => detectarCategoria(p.titulo) === STATE.categoria);
    }

    if (nuevos.length === 0) {
      STATE.hasMore = false;
      quitarSkeletons();
      actualizarBotonCargarMas();
      STATE.isLoading = false;
      mostrarToast('No hay más productos para mostrar');
      return;
    }

    STATE.allFetched.push(...nuevos);
    STATE.apiOffset += 20;
    STATE.hasMore    = nuevos.length >= 20;

    quitarSkeletons();
    const siguientes = STATE.allFetched.slice(STATE.results.length, STATE.results.length + STATE.pageSize);
    renderCards(siguientes);

  } catch (e) {
    console.warn('Error cargando más:', e.message);
    STATE.hasMore = false;
    quitarSkeletons();
    mostrarToast('No se pudieron cargar más productos');
  }

  actualizarBotonCargarMas();
  STATE.isLoading = false;
}


/* ─────────────────────────────────────────────────────────────
   17. ACTUALIZAR TÍTULO DE SECCIÓN
───────────────────────────────────────────────────────────── */
function actualizarTituloSeccion(q) {
  if (!DOM.sectionTitle) return;
  if (q) {
    DOM.sectionTitle.textContent = `Resultados para "${q}"`;
    if (DOM.sectionDesc) DOM.sectionDesc.textContent = 'Precios en soles desde MercadoLibre, eBay y Amazon';
  } else if (STATE.categoria !== 'Todas las categorías') {
    DOM.sectionTitle.textContent = STATE.categoria;
    if (DOM.sectionDesc) DOM.sectionDesc.textContent = 'Precios en soles desde todas las plataformas';
  } else {
    DOM.sectionTitle.textContent = 'Explorá productos por categoría';
    if (DOM.sectionDesc) DOM.sectionDesc.textContent = 'Usá el buscador o elegí una categoría para ver los precios actuales.';
  }
}


/* ─────────────────────────────────────────────────────────────
   18. MODAL — Ver producto
───────────────────────────────────────────────────────────── */
function verProducto(id) {
  const p = STATE.results.find(r => r.id === id);
  if (!p) return;

  document.getElementById('modalProducto')?.remove();
  const modal = document.createElement('div');
  modal.id        = 'modalProducto';
  modal.className = 'modal-overlay';
  modal.innerHTML = `
    <div class="modal">
      <button class="modal__close" onclick="cerrarModal()" aria-label="Cerrar">
        <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path d="M18 6 6 18M6 6l12 12"/>
        </svg>
      </button>
      <div class="modal__layout">
        <div class="modal__left">
          <div class="modal__imgbox">
            ${p.imagen
              ? `<img src="${p.imagen}" alt="${escapeHtml(p.titulo)}" class="modal__img-real"/>`
              : `<div class="pimg--default" style="width:100%;height:100%"></div>`}
          </div>
          <button class="maction maction--hist" onclick="verHistorial('${p.id}')">
            <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
            </svg>
            Historial de precios
          </button>
          <button class="maction maction--alrt" onclick="abrirAlertaModal('${p.id}')">
            <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
            </svg>
            Crear alerta de precio
          </button>
        </div>
        <div class="modal__right">
          <p class="modal__brand">${escapeHtml(p.categoria)}</p>
          <h2 class="modal__name">${escapeHtml(p.titulo)}</h2>
          <p class="modal__best-lbl">Precio más bajo encontrado</p>
          <p class="modal__best-price">${p.precio}</p>
          <p class="modal__sellers-lbl">Vendedor</p>
          <div class="modal__sellers">
            <div class="srow srow--best">
              <div class="srow__l">
                ${getFuenteTag(p.fuente)}
                <span class="srow__seller">${escapeHtml(p.vendedor || p.fuente)}</span>
              </div>
              <div class="srow__r">
                <span class="srow__price">${p.precio}</span>
                <a href="${p.url}" target="_blank" rel="noopener" class="btn-go">
                  Ir
                  <svg width="10" height="10" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                    <polyline points="15 3 21 3 21 9"/>
                    <line x1="10" y1="14" x2="21" y2="3"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>`;

  document.body.appendChild(modal);
  requestAnimationFrame(() => modal.classList.add('is-open'));
  document.body.style.overflow = 'hidden';
}

function cerrarModal() {
  const modal = document.getElementById('modalProducto');
  if (!modal) return;
  modal.classList.remove('is-open');
  setTimeout(() => { modal.remove(); document.body.style.overflow = ''; }, 250);
}


/* ─────────────────────────────────────────────────────────────
   19. HISTORIAL DE PRECIOS (simulado)
───────────────────────────────────────────────────────────── */
function verHistorial(id) {
  const p = STATE.results.find(r => r.id === id);
  if (!p) return;
  const puntos = generarHistorialSimulado(p.precioNum || 100, 8);
  cerrarModal();
  setTimeout(() => abrirHistorial(p, puntos), 260);
}

function generarHistorialSimulado(base, n) {
  const meses = ['Oct','Nov','Dic','Ene','Feb','Mar','Abr','May'];
  return meses.slice(0, n).map((mes, i) => {
    const v = (Math.random() - 0.45) * base * 0.15;
    return { mes, precio: parseFloat(Math.max(base * 0.7, base + v * (i % 3 === 0 ? -1 : 1)).toFixed(2)) };
  });
}

function abrirHistorial(p, puntos) {
  document.getElementById('modalHistorial')?.remove();
  const min  = Math.min(...puntos.map(x => x.precio));
  const max  = Math.max(...puntos.map(x => x.precio));
  const prom = (puntos.reduce((a,b) => a + b.precio, 0) / puntos.length).toFixed(2);

  const svgH = 140, svgPad = 20;
  const xs   = puntos.map((_,i) => 40 + i * (460 / (puntos.length - 1)));
  const ys   = puntos.map(pt => {
    const range = max - min || 1;
    return svgH - ((pt.precio - min) / range) * (svgH - svgPad) + 20;
  });

  const polyline = xs.map((x,i) => `${x},${ys[i]}`).join(' ');
  const polygon  = `${xs[0]},${ys[0]} ` + polyline + ` ${xs[xs.length-1]},${svgH+20} ${xs[0]},${svgH+20}`;
  const dots     = xs.map((x,i) => `<circle cx="${x}" cy="${ys[i]}" r="4" fill="${i===ys.length-1?'#fff':'var(--blue-600)'}" stroke="var(--blue-600)" stroke-width="2"/>`).join('');
  const labels   = xs.map((x,i) => `<text x="${x}" y="${svgH+40}" text-anchor="middle" font-size="10" fill="#94a3b8">${puntos[i].mes}</text>`).join('');

  const modal = document.createElement('div');
  modal.id        = 'modalHistorial';
  modal.className = 'modal-overlay';
  modal.innerHTML = `
    <div class="modal">
      <button class="modal__close" onclick="document.getElementById('modalHistorial').remove();document.body.style.overflow=''" aria-label="Cerrar">
        <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M18 6 6 18M6 6l12 12"/></svg>
      </button>
      <h3 class="modal__view-title">Historial de precios</h3>
      <p class="modal__view-sub">${escapeHtml(p.titulo)}</p>
      <div class="chart-wrap">
        <svg viewBox="0 0 540 190" xmlns="http://www.w3.org/2000/svg" style="width:100%">
          <defs>
            <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#2563eb" stop-opacity="0.15"/>
              <stop offset="100%" stop-color="#2563eb" stop-opacity="0.01"/>
            </linearGradient>
          </defs>
          <line x1="40" y1="20"  x2="520" y2="20"  stroke="#e2e8f0" stroke-width="1"/>
          <line x1="40" y1="60"  x2="520" y2="60"  stroke="#e2e8f0" stroke-width="1"/>
          <line x1="40" y1="100" x2="520" y2="100" stroke="#e2e8f0" stroke-width="1"/>
          <line x1="40" y1="140" x2="520" y2="140" stroke="#e2e8f0" stroke-width="1"/>
          <polygon points="${polygon}" fill="url(#chartGrad)"/>
          <polyline points="${polyline}" fill="none" stroke="#2563eb" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/>
          ${dots}
          ${labels}
        </svg>
      </div>
      <div class="hstats">
        <div class="hstat"><p class="hstat__lbl">Precio actual</p><p class="hstat__val hstat__val--cur">${p.precio}</p></div>
        <div class="hstat"><p class="hstat__lbl">Mínimo histórico</p><p class="hstat__val hstat__val--low">${formatPen(min)}</p></div>
        <div class="hstat"><p class="hstat__lbl">Máximo histórico</p><p class="hstat__val hstat__val--high">${formatPen(max)}</p></div>
        <div class="hstat"><p class="hstat__lbl">Promedio 8 meses</p><p class="hstat__val">${formatPen(prom)}</p></div>
      </div>
    </div>`;

  document.body.appendChild(modal);
  requestAnimationFrame(() => modal.classList.add('is-open'));
  document.body.style.overflow = 'hidden';
}


/* ─────────────────────────────────────────────────────────────
   20. MODAL ALERTA DE PRECIO
───────────────────────────────────────────────────────────── */
function abrirAlerta(event, id) {
  event.stopPropagation();
  abrirAlertaModal(id);
}

function abrirAlertaModal(id) {
  const p = STATE.results.find(r => r.id === id);
  if (!p) return;
  document.getElementById('modalAlerta')?.remove();
  cerrarModal();

  setTimeout(() => {
    const modal = document.createElement('div');
    modal.id        = 'modalAlerta';
    modal.className = 'modal-overlay';
    modal.innerHTML = `
      <div class="modal modal--sm">
        <button class="modal__close" onclick="document.getElementById('modalAlerta').remove();document.body.style.overflow=''" aria-label="Cerrar">
          <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M18 6 6 18M6 6l12 12"/></svg>
        </button>
        <h3 class="modal__view-title">Crear alerta de precio</h3>
        <p class="modal__view-sub">Te avisamos cuando cualquier vendedor baje al precio que fijás.</p>
        <div class="alert-form">
          <div class="alert-cur">
            <span class="alert-cur__lbl">Precio actual más bajo</span>
            <span class="alert-cur__price">${p.precio}</span>
          </div>
          <label class="flabel" for="alertPrecio">¿A qué precio querés comprar?</label>
          <div class="finput-price-wrap">
            <span class="finput-cur">S/</span>
            <input type="number" id="alertPrecio" placeholder="0.00" min="0" step="0.01"/>
          </div>
          <label class="flabel" for="alertCorreo">Tu correo electrónico</label>
          <input type="email" id="alertCorreo" class="finput-email" placeholder="tu@correo.com"/>
          <p class="alert-note">
            <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            Revisamos precios cada hora en todas las plataformas.
          </p>
          <button class="btn-activate" onclick="guardarAlerta('${p.id}')">
            <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
            </svg>
            Activar alerta
          </button>
        </div>
      </div>`;
    document.body.appendChild(modal);
    requestAnimationFrame(() => modal.classList.add('is-open'));
    document.body.style.overflow = 'hidden';
  }, 260);
}

function guardarAlerta(id) {
  const precio = document.getElementById('alertPrecio')?.value;
  const correo = document.getElementById('alertCorreo')?.value;
  const p      = STATE.results.find(r => r.id === id);

  if (!precio || !correo) { alert('Completá el precio y el correo.'); return; }
  if (!correo.includes('@')) { alert('Ingresá un correo válido.'); return; }

  const alertas = JSON.parse(localStorage.getItem('ps_alertas') || '[]');
  alertas.push({
    id:       Date.now(),
    producto: p?.titulo || id,
    fuente:   p?.fuente || '',
    url:      p?.url || '#',
    precio:   parseFloat(precio),
    correo,
    fecha:    new Date().toISOString()
  });
  localStorage.setItem('ps_alertas', JSON.stringify(alertas));

  document.getElementById('modalAlerta').remove();
  document.body.style.overflow = '';
  mostrarToast('✅ Alerta creada para S/ ' + precio);
}


/* ─────────────────────────────────────────────────────────────
   21. TOAST
───────────────────────────────────────────────────────────── */
function mostrarToast(msg) {
  document.getElementById('psToast')?.remove();
  const t = document.createElement('div');
  t.id          = 'psToast';
  t.className   = 'ps-toast';
  t.textContent = msg;
  document.body.appendChild(t);
  requestAnimationFrame(() => t.classList.add('is-visible'));
  setTimeout(() => { t.classList.remove('is-visible'); setTimeout(() => t.remove(), 300); }, 3000);
}


/* ─────────────────────────────────────────────────────────────
   22. DROPDOWN DE CATEGORÍAS
───────────────────────────────────────────────────────────── */
function toggleCat() {
  const open = DOM.catDropdown.classList.toggle('is-open');
  DOM.catBtn.setAttribute('aria-expanded', open);
  DOM.catArrow.style.transform = open ? 'rotate(180deg)' : 'rotate(0)';
}

function selectCat(nombre, el) {
  STATE.categoria = nombre;
  DOM.catLabel.textContent = nombre;
  document.querySelectorAll('.cat-option').forEach(o => o.classList.remove('cat-option--active'));
  el.classList.add('cat-option--active');
  DOM.catDropdown.classList.remove('is-open');
  DOM.catBtn.setAttribute('aria-expanded', 'false');
  DOM.catArrow.style.transform = 'rotate(0)';
  buscar(STATE.query, true);
  document.getElementById('catalogo')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

document.addEventListener('click', function(e) {
  if (!DOM.catBtn?.closest('.cat-selector')?.contains(e.target)) {
    DOM.catDropdown?.classList.remove('is-open');
    DOM.catBtn?.setAttribute('aria-expanded', 'false');
    if (DOM.catArrow) DOM.catArrow.style.transform = 'rotate(0)';
  }
});


/* ─────────────────────────────────────────────────────────────
   23. EVENTOS
───────────────────────────────────────────────────────────── */
DOM.searchBtn?.addEventListener('click', () => {
  buscar(DOM.searchInput?.value || '', true);
  document.getElementById('catalogo')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
});

DOM.searchInput?.addEventListener('keydown', e => {
  if (e.key === 'Enter') {
    buscar(DOM.searchInput.value, true);
    document.getElementById('catalogo')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
});

DOM.loadMoreBtn?.addEventListener('click', mostrarSiguientePagina);

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    cerrarModal();
    document.getElementById('modalHistorial')?.remove();
    document.getElementById('modalAlerta')?.remove();
    document.body.style.overflow = '';
  }
});

document.addEventListener('click', e => {
  if (e.target.classList.contains('modal-overlay')) {
    e.target.remove();
    document.body.style.overflow = '';
  }
});


/* ─────────────────────────────────────────────────────────────
   24. INICIO
───────────────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  cargarVitrina();
});


/* ═══════════════════════════════════════════════
   LOGIN / REGISTRO / SESIÓN
═══════════════════════════════════════════════ */
const API = 'http://localhost:3000/api';

/* ── Estado de sesión ── */
let SESSION = {
  token:   localStorage.getItem('ps_token') || null,
  usuario: JSON.parse(localStorage.getItem('ps_usuario') || 'null')
};

/* ── Inicializar sesión al cargar ── */
function inicializarSesion() {
  if (SESSION.token && SESSION.usuario) {
    mostrarUsuarioLogueado(SESSION.usuario);
  }
}

function mostrarUsuarioLogueado(usuario) {
  document.getElementById('authGuest').style.display  = 'none';
  document.getElementById('authUser').style.display   = 'flex';
  document.getElementById('authNombre').textContent   = '👤 ' + usuario.nombre;
  document.getElementById('navAlertas').style.display = 'inline';
  document.getElementById('mis-alertas').style.display = 'block';
  cargarMisAlertas();
}

function cerrarSesion() {
  SESSION = { token: null, usuario: null };
  localStorage.removeItem('ps_token');
  localStorage.removeItem('ps_usuario');
  document.getElementById('authGuest').style.display   = 'flex';
  document.getElementById('authUser').style.display    = 'none';
  document.getElementById('navAlertas').style.display  = 'none';
  document.getElementById('mis-alertas').style.display = 'none';
  mostrarToast('👋 Sesión cerrada');
}

/* ── Abrir / cerrar modal login ── */
function abrirLogin() {
  document.getElementById('loginOverlay').classList.add('is-open');
  document.body.style.overflow = 'hidden';
}

function cerrarLogin() {
  document.getElementById('loginOverlay').classList.remove('is-open');
  document.body.style.overflow = '';
  limpiarCamposLogin();
}

function cerrarLoginOverlay(e) {
  if (e.target === document.getElementById('loginOverlay')) cerrarLogin();
}

function limpiarCamposLogin() {
  ['loginCorreo','loginPassword','regNombre','regCorreo','regPassword','regCodigo'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
  document.getElementById('loginError').textContent    = '';
  document.getElementById('registroError').textContent = '';
  const principal = document.getElementById('regFormPrincipal');
  const codigo    = document.getElementById('regFormCodigo');
  if (principal) principal.style.display = 'block';
  if (codigo)    codigo.style.display    = 'none';
}

/* ── Tabs login / registro ── */
function switchTab(tab) {
  const isLogin = tab === 'login';
  document.getElementById('formLogin').style.display    = isLogin ? 'block' : 'none';
  document.getElementById('formRegistro').style.display = isLogin ? 'none'  : 'block';
  document.getElementById('tabLogin').classList.toggle('active', isLogin);
  document.getElementById('tabRegistro').classList.toggle('active', !isLogin);
  document.getElementById('loginError').textContent    = '';
  document.getElementById('registroError').textContent = '';
}

/* ── Hacer login ── */
async function hacerLogin() {
  const correo    = document.getElementById('loginCorreo').value.trim();
  const contrasena = document.getElementById('loginPassword').value;
  const errEl     = document.getElementById('loginError');
  const btn       = document.querySelector('#formLogin .login-submit');

  if (!correo || !contrasena) { errEl.textContent = 'Completá todos los campos.'; return; }

  btn.disabled     = true;
  btn.textContent  = 'Ingresando…';
  errEl.textContent = '';

  try {
    const res  = await fetch(`${API}/auth/login`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ correo, contrasena })
    });
    const data = await res.json();

    if (!data.ok) { errEl.textContent = data.error || 'Error al iniciar sesión.'; return; }

    SESSION.token   = data.token;
    SESSION.usuario = data.usuario;
    localStorage.setItem('ps_token',   data.token);
    localStorage.setItem('ps_usuario', JSON.stringify(data.usuario));

    cerrarLogin();
    mostrarUsuarioLogueado(data.usuario);
    mostrarToast(`✅ Bienvenido, ${data.usuario.nombre}`);
  } catch {
    errEl.textContent = 'No se pudo conectar al servidor.';
  } finally {
    btn.disabled    = false;
    btn.textContent = 'Iniciar sesión';
  }
}

/* ── Hacer registro — PASO 1: enviar código al correo ── */
async function hacerRegistro() {
  const nombre     = document.getElementById('regNombre').value.trim();
  const correo     = document.getElementById('regCorreo').value.trim();
  const contrasena = document.getElementById('regPassword').value;
  const errEl      = document.getElementById('registroError');
  const btn        = document.querySelector('#regFormPrincipal .login-submit');

  if (!nombre || !correo || !contrasena) { errEl.textContent = 'Completá todos los campos.'; return; }
  if (contrasena.length < 6) { errEl.textContent = 'La contraseña debe tener al menos 6 caracteres.'; return; }

  btn.disabled    = true;
  btn.textContent = 'Enviando código…';
  errEl.textContent = '';

  try {
    const res  = await fetch(`${API}/auth/registro`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ nombre, correo, contrasena })
    });
    const data = await res.json();

    if (!data.ok) { errEl.textContent = data.error || 'Error al registrarse.'; return; }

    /* Guardar correo para el paso 2 */
    document.getElementById('regCorreoOculto').value = correo;

    /* Mostrar panel del código, ocultar formulario principal */
    document.getElementById('regFormPrincipal').style.display = 'none';
    document.getElementById('regFormCodigo').style.display    = 'block';
    errEl.textContent = '';

  } catch {
    errEl.textContent = 'No se pudo conectar al servidor.';
  } finally {
    btn.disabled    = false;
    btn.textContent = 'Crear cuenta';
  }
}

/* ── Hacer registro — PASO 2: verificar código ── */
async function verificarCodigo() {
  const correo = document.getElementById('regCorreoOculto').value;
  const codigo = document.getElementById('regCodigo').value.trim();
  const errEl  = document.getElementById('registroError');
  const btn    = document.getElementById('btnVerificarCodigo');

  if (!codigo || codigo.length !== 4) { errEl.textContent = 'Ingresá el código de 4 dígitos.'; return; }

  btn.disabled    = true;
  btn.textContent = 'Verificando…';
  errEl.textContent = '';

  try {
    const res  = await fetch(`${API}/auth/verificar`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ correo, codigo })
    });
    const data = await res.json();

    if (!data.ok) { errEl.textContent = data.error || 'Código incorrecto.'; return; }

    SESSION.token   = data.token;
    SESSION.usuario = data.usuario;
    localStorage.setItem('ps_token',   data.token);
    localStorage.setItem('ps_usuario', JSON.stringify(data.usuario));

    cerrarLogin();
    mostrarUsuarioLogueado(data.usuario);
    mostrarToast(`✅ Cuenta creada. Bienvenido, ${data.usuario.nombre}`);

  } catch {
    errEl.textContent = 'No se pudo conectar al servidor.';
  } finally {
    btn.disabled    = false;
    btn.textContent = 'Confirmar código';
  }
}

/* ── Volver al paso 1 del registro ── */
function volverARegistro() {
  document.getElementById('regFormPrincipal').style.display = 'block';
  document.getElementById('regFormCodigo').style.display    = 'none';
  document.getElementById('regCodigo').value = '';
  document.getElementById('registroError').textContent = '';
}

/* ── Guardar alerta (requiere login) ── */
async function guardarAlerta(id) {
  const precio = document.getElementById('alertPrecio')?.value;
  const correo = document.getElementById('alertCorreo')?.value;
  const p      = STATE.results.find(r => r.id === id);

  if (!precio || !correo) { alert('Completá el precio y el correo.'); return; }
  if (!correo.includes('@')) { alert('Ingresá un correo válido.'); return; }

  /* Si hay sesión → guardar en backend */
  if (SESSION.token) {
    try {
      const res = await fetch(`${API}/alertas`, {
        method:  'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${SESSION.token}`
        },
        body: JSON.stringify({
          producto_nombre: p?.titulo || id,
          producto_marca:  p?.marca  || '',
          producto_modelo: p?.modelo || '',
          pulgadas:        p?.pulgadas || '',
          precio_objetivo: parseFloat(precio),
          fuentes:         p?.fuente || 'MercadoLibre,eBay'
        })
      });
      const data = await res.json();
      if (data.ok) {
        document.getElementById('modalAlerta')?.remove();
        document.body.style.overflow = '';
        mostrarToast('✅ Alerta guardada para S/ ' + precio);
        cargarMisAlertas();
        return;
      }
    } catch (e) {
      console.error('Error guardando alerta:', e);
    }
  }

  /* Sin sesión → guardar en localStorage y pedir login */
  document.getElementById('modalAlerta')?.remove();
  document.body.style.overflow = '';
  mostrarToast('⚠️ Iniciá sesión para guardar alertas permanentes');
  setTimeout(() => abrirLogin(), 1500);
}

/* ── Cargar mis alertas ── */
async function cargarMisAlertas() {
  if (!SESSION.token) return;
  const grid = document.getElementById('alertasGrid');
  if (!grid) return;

  try {
    const res  = await fetch(`${API}/alertas`, {
      headers: { 'Authorization': `Bearer ${SESSION.token}` }
    });
    const data = await res.json();

    if (!data.ok || data.alertas.length === 0) {
      grid.innerHTML = `
        <div class="alertas-empty">
          <p>No tenés alertas activas todavía.</p>
          <p>Buscá un producto y hacé clic en 🔔 para crear una.</p>
        </div>`;
      return;
    }

    grid.innerHTML = data.alertas.map(a => {
      const precioActual = a.precio_actual
        ? `<div><p class="alerta-precio__lbl">Precio actual</p><p class="alerta-precio__val ${parseFloat(a.precio_actual) <= parseFloat(a.precio_objetivo) ? 'alerta-precio__val--cur' : 'alerta-precio__val--high'}">S/ ${parseFloat(a.precio_actual).toLocaleString('es-PE',{minimumFractionDigits:2})}</p></div>`
        : '';
      return `
        <div class="alerta-card">
          <p class="alerta-card__nombre">${escapeHtml(a.producto_nombre)}</p>
          <div class="alerta-card__precios">
            <div>
              <p class="alerta-precio__lbl">Tu precio objetivo</p>
              <p class="alerta-precio__val alerta-precio__val--obj">S/ ${parseFloat(a.precio_objetivo).toLocaleString('es-PE',{minimumFractionDigits:2})}</p>
            </div>
            ${precioActual}
          </div>
          <p class="alerta-card__fecha">Creada: ${new Date(a.fecha_creacion).toLocaleDateString('es-PE')}</p>
          <button class="alerta-card__del" onclick="eliminarAlerta(${a.id})">Eliminar alerta</button>
        </div>`;
    }).join('');
  } catch (e) {
    console.error('Error cargando alertas:', e);
  }
}

/* ── Eliminar alerta ── */
async function eliminarAlerta(id) {
  if (!SESSION.token) return;
  try {
    await fetch(`${API}/alertas/${id}`, {
      method:  'DELETE',
      headers: { 'Authorization': `Bearer ${SESSION.token}` }
    });
    mostrarToast('🗑️ Alerta eliminada');
    cargarMisAlertas();
  } catch (e) {
    console.error('Error eliminando alerta:', e);
  }
}

/* ── Cerrar login con Escape ── */
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    cerrarLogin();
  }
});

/* ── Inicializar sesión al cargar la página ── */
document.addEventListener('DOMContentLoaded', () => {
  inicializarSesion();
});
