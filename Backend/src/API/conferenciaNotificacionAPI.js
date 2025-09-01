const express = require("express");
const router = express.Router();
const conferenciaNotificacionService = require("../services/conferenciaNotificacionService");

/**
 * @swagger
 * tags:
 *   name: ConferenciaNotificacion
 *   description: API para gestionar notificaciones de conferencias
 */

/**
 * @swagger
 * /conferenciaNotificacion/:
 *   get:
 *     summary: Obtiene todas las notificaciones de conferencias
 *     tags: [ConferenciaNotificacion]
 *     responses:
 *       200:
 *         description: Lista de notificaciones
 *       500:
 *         description: Error interno
 */
router.get("/", async (req, res) => {
  const response =
    await conferenciaNotificacionService.getAllConferenciaNotificacion();
  res.json({
    method: "getAllConferenciaNotificacion",
    code: response.code,
    status: response.status,
    data: response.data,
    message: response.message,
  });
});

/**
 * @swagger
 * /conferenciaNotificacion/{id}:
 *   get:
 *     summary: Obtiene una notificación por ID
 *     tags: [ConferenciaNotificacion]
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
    await conferenciaNotificacionService.getConferenciaNotificacionById(
      req.params.id
    );
  res.json({
    method: "getConferenciaNotificacionById",
    code: response.code,
    status: response.status,
    data: response.data,
    message: response.message,
  });
});

/**
 * @swagger
 * /conferenciaNotificacion/:
 *   post:
 *     summary: Crea una nueva notificación
 *     tags: [ConferenciaNotificacion]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id_conferencia:
 *                 type: integer
 *               notificacion:
 *                 type: string
 *     responses:
 *       201:
 *         description: Notificación creada
 *       500:
 *         description: Error interno
 */
router.post("/", async (req, res) => {
  const response =
    await conferenciaNotificacionService.createConferenciaNotificacion(
      req.body
    );
  res.status(response.code === "CN-000" ? 201 : 500).json({
    method: "createConferenciaNotificacion",
    code: response.code,
    status: response.status,
    data: response.data,
    message: response.message,
  });
});

/**
 * @swagger
 * /conferenciaNotificacion/{id}:
 *   put:
 *     summary: Actualiza una notificación
 *     tags: [ConferenciaNotificacion]
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
 *               id_conferencia:
 *                 type: integer
 *               notificacion:
 *                 type: string
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
    await conferenciaNotificacionService.updateConferenciaNotificacion(
      req.params.id,
      req.body
    );
  res.json({
    method: "updateConferenciaNotificacion",
    code: response.code,
    status: response.status,
    data: response.data,
    message: response.message,
  });
});

/**
 * @swagger
 * /conferenciaNotificacion/{id}:
 *   delete:
 *     summary: Elimina una notificación
 *     tags: [ConferenciaNotificacion]
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
    await conferenciaNotificacionService.deleteConferenciaNotificacion(
      req.params.id
    );
  res.json({
    method: "deleteConferenciaNotificacion",
    code: response.code,
    status: response.status,
    data: response.data,
    message: response.message,
  });
});

module.exports = router;
