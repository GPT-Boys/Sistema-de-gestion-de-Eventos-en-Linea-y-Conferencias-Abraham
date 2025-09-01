const express = require("express");
const router = express.Router();
const asistenteConferenciaService = require("../services/asistenteConferenciaService");

/**
 * @swagger
 * tags:
 *   name: AsistenteConferencia
 *   description: API para gestionar relaciones asistente-conferencia
 */

/**
 * @swagger
 * /asistenteConferencia/:
 *   get:
 *     summary: Obtiene todas las relaciones asistente-conferencia
 *     tags: [AsistenteConferencia]
 *     responses:
 *       200:
 *         description: Lista de relaciones
 *       500:
 *         description: Error interno
 */
router.get("/", async (req, res) => {
  const response =
    await asistenteConferenciaService.getAllAsistenteConferencia();
  res.json({
    method: "getAllAsistenteConferencia",
    code: response.code,
    status: response.status,
    data: response.data,
    message: response.message,
  });
});

/**
 * @swagger
 * /asistenteConferencia/{id}:
 *   get:
 *     summary: Obtiene una relación asistente-conferencia por ID
 *     tags: [AsistenteConferencia]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       200:
 *         description: Relación encontrada
 *       404:
 *         description: Relación no encontrada
 *       500:
 *         description: Error interno
 */
router.get("/:id", async (req, res) => {
  const response =
    await asistenteConferenciaService.getAsistenteConferenciaById(
      req.params.id
    );
  res.json({
    method: "getAsistenteConferenciaById",
    code: response.code,
    status: response.status,
    data: response.data,
    message: response.message,
  });
});

/**
 * @swagger
 * /asistenteConferencia/:
 *   post:
 *     summary: Crea una nueva relación asistente-conferencia
 *     tags: [AsistenteConferencia]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id_conferencia:
 *                 type: integer
 *               id_asistente:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Relación creada
 *       500:
 *         description: Error interno
 */
router.post("/", async (req, res) => {
  const response = await asistenteConferenciaService.createAsistenteConferencia(
    req.body
  );
  res.status(response.code === "AC-000" ? 201 : 500).json({
    method: "createAsistenteConferencia",
    code: response.code,
    status: response.status,
    data: response.data,
    message: response.message,
  });
});

/**
 * @swagger
 * /asistenteConferencia/{id}:
 *   put:
 *     summary: Actualiza una relación asistente-conferencia
 *     tags: [AsistenteConferencia]
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
 *               id_asistente:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Relación actualizada
 *       404:
 *         description: Relación no encontrada
 *       500:
 *         description: Error interno
 */
router.put("/:id", async (req, res) => {
  const response = await asistenteConferenciaService.updateAsistenteConferencia(
    req.params.id,
    req.body
  );
  res.json({
    method: "updateAsistenteConferencia",
    code: response.code,
    status: response.status,
    data: response.data,
    message: response.message,
  });
});

/**
 * @swagger
 * /asistenteConferencia/{id}:
 *   delete:
 *     summary: Elimina una relación asistente-conferencia
 *     tags: [AsistenteConferencia]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       200:
 *         description: Relación eliminada
 *       404:
 *         description: Relación no encontrada
 *       500:
 *         description: Error interno
 */
router.delete("/:id", async (req, res) => {
  const response = await asistenteConferenciaService.deleteAsistenteConferencia(
    req.params.id
  );
  res.json({
    method: "deleteAsistenteConferencia",
    code: response.code,
    status: response.status,
    data: response.data,
    message: response.message,
  });
});

module.exports = router;
