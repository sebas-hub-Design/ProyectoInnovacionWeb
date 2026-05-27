/* ================================================================
   PriceScope — routes/ebay.js
   Endpoint requerido por eBay para apps en Production:
   Marketplace Account Deletion Notification
================================================================ */
const router = require('express').Router();

/* ── POST /api/ebay/account-deletion ── */
router.post('/account-deletion', (req, res) => {
  /* eBay envía notificaciones cuando un usuario elimina su cuenta.
     Para cumplir con los requisitos de Production, respondemos 200. */
  console.log('eBay account deletion notification recibida:', req.body);
  res.status(200).json({ ok: true });
});

/* ── GET /api/ebay/account-deletion (verificación de eBay) ── */
router.get('/account-deletion', (req, res) => {
  res.status(200).json({ ok: true, service: 'PriceScope eBay Endpoint' });
});

module.exports = router;
