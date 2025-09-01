const express = require("express");
const router = express.Router();
const asistenteService = require("../services/asistenteService");

/**
 * @swagger
 * tags:
 *   name: Asistente
 *   description: API para gestionar asistentes
 */

/**
 * @swagger
 * /asistente/:
 *   get:
 *     summary: Obtiene todos los asistentes
 *     tags: [Asistente]
 *     responses:
 *       200:
 *         description: Lista de asistentes
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ResponseDTO'
 *       500:
 *         description: Error interno
 */
router.get("/", async (req, res) => {
  const response = await asistenteService.getAllAsistentes();
  res.json({
    method: "getAllAsistentes",
    code: response.code,
    status: response.status,
    data: response.data,
    message: response.message,
  });
});

/**
 * @swagger
 * /asistente/{id}:
 *   get:
 *     summary: Obtiene un asistente por ID
 *     tags: [Asistente]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del asistente
 *     responses:
 *       200:
 *         description: Asistente encontrado
 *       404:
 *         description: Asistente no encontrado
 *       500:
 *         description: Error interno
 */
router.get("/:id", async (req, res) => {
  const response = await asistenteService.getAsistenteById(req.params.id);
  res.json({
    method: "getAsistenteById",
    code: response.code,
    status: response.status,
    data: response.data,
    message: response.message,
  });
});

/**
 * @swagger
 * /asistente/:
 *   post:
 *     summary: Crea un nuevo asistente
 *     tags: [Asistente]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id_usuario:
 *                 type: integer
 *               descripcion:
 *                 type: string
 *     responses:
 *       201:
 *         description: Asistente creado
 *       500:
 *         description: Error interno
 */
router.post("/", async (req, res) => {
  const response = await asistenteService.createAsistente(req.body);
  res.status(response.code === "A-000" ? 201 : 500).json({
    method: "createAsistente",
    code: response.code,
    status: response.status,
    data: response.data,
    message: response.message,
  });
});

/**
 * @swagger
 * /asistente/{id}:
 *   put:
 *     summary: Actualiza un asistente
 *     tags: [Asistente]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del asistente
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               descripcion:
 *                 type: string
 *     responses:
 *       200:
 *         description: Asistente actualizado
 *       404:
 *         description: Asistente no encontrado
 *       500:
 *         description: Error interno
 */
router.put("/:id", async (req, res) => {
  const response = await asistenteService.updateAsistente(
    req.params.id,
    req.body
  );
  res.json({
    method: "updateAsistente",
    code: response.code,
    status: response.status,
    data: response.data,
    message: response.message,
  });
});

/**
 * @swagger
 * /asistente/{id}:
 *   delete:
 *     summary: Elimina un asistente
 *     tags: [Asistente]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del asistente
 *     responses:
 *       200:
 *         description: Asistente eliminado
 *       404:
 *         description: Asistente no encontrado
 *       500:
 *         description: Error interno
 */
router.delete("/:id", async (req, res) => {
  const response = await asistenteService.deleteAsistente(req.params.id);
  res.json({
    method: "deleteAsistente",
    code: response.code,
    status: response.status,
    data: response.data,
    message: response.message,
  });
});

module.exports = router;
