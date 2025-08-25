const { Router } = require("express");

const router = Router();

// Ruta principal
router.get("/", (req, res) => {
  res.send(
    "¡Welcome to Our First Software Architecture Project: AbrahamEventSphere! 💻✨"
  );
});

module.exports = router;
