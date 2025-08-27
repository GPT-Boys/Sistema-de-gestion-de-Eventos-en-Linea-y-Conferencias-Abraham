// src/routes/index.js
const { Router } = require('express');
const router = Router();

// Health (opcional)
router.get('/health', (req, res) => {
  res.json({ ok: true, msg: 'API routes root' });
});

// ⛱️ Fallback 404: SIN path → coincide con cualquier método y ruta no atendida
router.use((req, res) => {
  res.status(404).json({ ok: false, msg: 'Not found' });
});

module.exports = router;
