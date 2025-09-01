const express = require("express");
const router = express.Router();
const asistenteAPI = require("../API/asistenteAPI");
const asistenteConferenciaAPI = require("../API/asistenteConferenciaAPI");
const asistenteConferenciaVotacionAPI = require("../API/asistenteConferenciaVotacionAPI");
const ciudadAPI = require("../API/ciudadAPI");
const conferenciaAPI = require("../API/conferenciaAPI");
const conferenciaNotificacionAPI = require("../API/conferenciaNotificacionAPI");
const marcaConferenciaAPI = require("../API/marcaConferenciaAPI");
const notificacionAsistenteAPI = require("../API/notificacionAsistenteAPI");
const oradorAPI = require("../API/oradorAPI");
const tipoConferenciaAPI = require("../API/tipoConferenciaAPI");
const tipoUsuarioAPI = require("../API/tipoUsuarioAPI");
const usuarioAPI = require("../API/usuarioAPI");
const votacionAPI = require("../API/votacionAPI");
const authService = require("../services/authService");
const asistenteConferenciaService = require("../services/asistenteConferenciaService");
const votacionService = require("../services/votacionService");
const notificacionAsistenteService = require("../services/notificacionAsistenteService");

// Middleware de autenticación y roles
const isAuthenticated = authService.isAuthenticated;
const checkRole = authService.checkRole;

// Rutas accesibles para administradores (rol: 'ADMINISTRADOR')
router.use(isAuthenticated, checkRole(["ADMINISTRADOR"]));

// Gestión de todas las entidades
router.use("/asistente", asistenteAPI);
router.use("/asistenteConferencia", asistenteConferenciaAPI);
router.use("/asistenteConferenciaVotacion", asistenteConferenciaVotacionAPI);
router.use("/ciudad", ciudadAPI);
router.use("/conferencia", conferenciaAPI);
router.use("/conferenciaNotificacion", conferenciaNotificacionAPI);
router.use("/marcaConferencia", marcaConferenciaAPI);
router.use("/notificacionAsistente", notificacionAsistenteAPI);
router.use("/orador", oradorAPI);
router.use("/tipoConferencia", tipoConferenciaAPI);
router.use("/tipoUsuario", tipoUsuarioAPI);
router.use("/usuario", usuarioAPI);
router.use("/votacion", votacionAPI);

// Rutas específicas para administradores
router.get("/reporteAsistencias/:conferenciaId", async (req, res) => {
  const response = await asistenteConferenciaService.getAsistentesByConferencia(
    req.params.conferenciaId
  );
  res.json(response);
});

router.get("/reporteVotos/:conferenciaId", async (req, res) => {
  const response = await votacionService.getReporteVotos(
    req.params.conferenciaId
  );
  res.json(response);
});

router.post("/notificacionGlobal", async (req, res) => {
  const response = await notificacionAsistenteService.enviarNotificacionGlobal(
    req.body.message
  );
  res.json(response);
});

module.exports = router;
