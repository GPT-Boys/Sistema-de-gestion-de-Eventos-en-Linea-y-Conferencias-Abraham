const { Router } = require("express");
const router = Router();

// Ruta principal
router.get("/", (req, res) => {
  res.send(
    "¡Welcome to Our Software Architecture Project: AbrahamEventSphere! 💻🌎✨"
  );
});

// Health (opcional)
router.get("/health", (req, res) => {
  res.json({ ok: true, msg: "API routes root" });
});

module.exports = router;
