const express = require("express");
const router = express.Router();
const notificacionAsistenteService = require("../services/notificacionAsistenteService");

/**
 * @swagger
 * tags:
 *   name: NotificacionAsistente
 *   description: API para gestionar notificaciones a asistentes
 */

/**
 * @swagger
 * /notificacionAsistente/:
 *   get:
 *     summary: Obtiene todas las notificaciones a asistentes
 *     tags: [NotificacionAsistente]
 *     responses:
 *       200:
 *         description: Lista de notificaciones
 *       500:
 *         description: Error interno
 */
router.get("/", async (req, res) => {
  const response =
    await notificacionAsistenteService.getAllNotificacionAsistente();
  res.json({
    method: "getAllNotificacionAsistente",
    code: response.code,
    status: response.status,
    data: response.data,
    message: response.message,
  });
});

/**
 * @swagger
 * /notificacionAsistente/{id}:
 *   get:
 *     summary: Obtiene una notificación por ID
 *     tags: [NotificacionAsistente]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       200:
 *         description: Notificación encontrada
 *       404:
 *         description: Notificación no encontrada
 *       500:
 *         description: Error interno
 */
router.get("/:id", async (req, res) => {
  const response =
    await notificacionAsistenteService.getNotificacionAsistenteById(
      req.params.id
    );
  res.json({
    method: "getNotificacionAsistenteById",
    code: response.code,
    status: response.status,
    data: response.data,
    message: response.message,
  });
});

/**
 * @swagger
 * /notificacionAsistente/:
 *   post:
 *     summary: Crea una nueva notificación para asistente
 *     tags: [NotificacionAsistente]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id_conferencia_notificacion:
 *                 type: integer
 *               id_asistente:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Notificación creada
 *       500:
 *         description: Error interno
 */
router.post("/", async (req, res) => {
  const response =
    await notificacionAsistenteService.createNotificacionAsistente(req.body);
  res.status(response.code === "NA-000" ? 201 : 500).json({
    method: "createNotificacionAsistente",
    code: response.code,
    status: response.status,
    data: response.data,
    message: response.message,
  });
});

/**
 * @swagger
 * /notificacionAsistente/{id}:
 *   put:
 *     summary: Actualiza una notificación
 *     tags: [NotificacionAsistente]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id_conferencia_notificacion:
 *                 type: integer
 *               id_asistente:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Notificación actualizada
 *       404:
 *         description: Notificación no encontrada
 *       500:
 *         description: Error interno
 */
router.put("/:id", async (req, res) => {
  const response =
    await notificacionAsistenteService.updateNotificacionAsistente(
      req.params.id,
      req.body
    );
  res.json({
    method: "updateNotificacionAsistente",
    code: response.code,
    status: response.status,
    data: response.data,
    message: response.message,
  });
});

/**
 * @swagger
 * /notificacionAsistente/{id}:
 *   delete:
 *     summary: Elimina una notificación
 *     tags: [NotificacionAsistente]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       200:
 *         description: Notificación eliminada
 *       404:
 *         description: Notificación no encontrada
 *       500:
 *         description: Error interno
 */
router.delete("/:id", async (req, res) => {
  const response =
    await notificacionAsistenteService.deleteNotificacionAsistente(
      req.params.id
    );
  res.json({
    method: "deleteNotificacionAsistente",
    code: response.code,
    status: response.status,
    data: response.data,
    message: response.message,
  });
});

/**
 * @swagger
 * /notificacionAsistente/notificaciones/{asistenteId}:
 *   get:
 *     summary: Obtiene notificaciones de un asistente
 *     tags: [NotificacionAsistente]
 *     parameters:
 *       - in: path
 *         name: asistenteId
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       200:
 *         description: Lista de notificaciones
 *       500:
 *         description: Error interno
 */
router.get("/notificaciones/:asistenteId", async (req, res) => {
  const response =
    await notificacionAsistenteService.getNotificacionesByAsistente(
      req.params.asistenteId
    );
  res.json({
    method: "getNotificacionesByAsistente",
    code: response.code,
    status: response.status,
    data: response.data,
    message: response.message,
  });
});

module.exports = router;
