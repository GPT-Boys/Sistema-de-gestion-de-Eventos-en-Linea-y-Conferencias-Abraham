const express = require("express");
const router = express.Router();
const asistenteAPI = require("../API/asistenteAPI");
const asistenteConferenciaAPI = require("../API/asistenteConferenciaAPI");
const asistenteConferenciaVotacionAPI = require("../API/asistenteConferenciaVotacionAPI");
const notificacionAsistenteAPI = require("../API/notificacionAsistenteAPI");
const conferenciaAPI = require("../API/conferenciaAPI");
const authService = require("../services/authService");
const asistenteConferenciaService = require("../services/asistenteConferenciaService");
const conferenciaService = require("../services/conferenciaService");

// Middleware de autenticación y roles
const isAuthenticated = authService.isAuthenticated;
const checkRole = authService.checkRole;

// Rutas accesibles para asistentes (rol: 'ASISTENTE')
router.use(isAuthenticated, checkRole(["ASISTENTE"]));

// Gestión de perfil del asistente
router.use("/asistente", asistenteAPI);

// Inscripción y gestión de conferencias
router.use("/asistenteConferencia", asistenteConferenciaAPI);

// Registro y gestión de votos
router.use("/asistenteConferenciaVotacion", asistenteConferenciaVotacionAPI);

// Notificaciones para el asistente
router.use("/notificacionAsistente", notificacionAsistenteAPI);

// Vista de conferencias (solo lectura para asistir)
router.use("/conferencia", conferenciaAPI);

// Rutas específicas para asistentes
router.get("/conferenciasInscritas/:asistenteId", async (req, res) => {
  const response = await asistenteConferenciaService.getConferenciasByAsistente(
    req.params.asistenteId
  );
  res.json(response);
});

router.post("/votar/:conferenciaId", async (req, res) => {
  const response = await conferenciaService.updateVotos(
    req.params.conferenciaId,
    req.body.positivo
  );
  res.json(response);
});

router.get("/materiales/:conferenciaId", async (req, res) => {
  const { asistenteId } = req.user; // Asume del token
  const response = await conferenciaService.getMateriales(
    req.params.conferenciaId,
    asistenteId
  );
  res.json(response);
});

module.exports = router;
