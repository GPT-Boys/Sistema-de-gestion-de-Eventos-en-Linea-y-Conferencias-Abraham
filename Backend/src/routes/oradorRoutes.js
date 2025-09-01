const express = require("express");
const router = express.Router();
const oradorAPI = require("../API/oradorAPI");
const conferenciaAPI = require("../API/conferenciaAPI");
const authService = require("../services/authService");
const conferenciaService = require("../services/conferenciaService");

// Middleware de autenticación y roles
const isAuthenticated = authService.isAuthenticated;
const checkRole = authService.checkRole;

// Rutas accesibles para oradores (rol: 'ORADOR')
router.use(isAuthenticated, checkRole(["ORADOR"]));

// Gestión de perfil del orador
router.use("/orador", oradorAPI);

// Gestión de conferencias a cargo
router.use("/conferencia", conferenciaAPI);

// Rutas específicas para oradores
router.get("/conferenciasAsignadas/:oradorId", async (req, res) => {
  const response = await conferenciaService.getConferenciasByOrador(
    req.params.oradorId
  );
  res.json(response);
});

router.post("/materiales/:conferenciaId", async (req, res) => {
  const response = await conferenciaService.addMaterial(
    req.params.conferenciaId,
    req.body.material
  );
  res.json(response);
});

router.post("/evaluacion/:conferenciaId", async (req, res) => {
  const response = await conferenciaService.addEvaluacion(
    req.params.conferenciaId,
    req.body.evaluacion
  );
  res.json(response);
});

router.put("/charla/:conferenciaId", async (req, res) => {
  const response = await conferenciaService.updateCharla(
    req.params.conferenciaId,
    req.body
  );
  res.json(response);
});

router.get("/votos/:conferenciaId", async (req, res) => {
  const response = await conferenciaService.getVotos(req.params.conferenciaId);
  res.json(response);
});

module.exports = router;
