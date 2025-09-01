const express = require("express");
const router = express.Router();
const asistenteConferenciaVotacionService = require("../services/asistenteConferenciaVotacionService");

/**
 * @swagger
 * tags:
 *   name: AsistenteConferenciaVotacion
 *   description: API para gestionar votos de asistentes en conferencias
 */

/**
 * @swagger
 * /asistenteConferenciaVotacion/:
 *   get:
 *     summary: Obtiene todos los votos de asistentes
 *     tags: [AsistenteConferenciaVotacion]
 *     responses:
 *       200:
 *         description: Lista de votos
 *       500:
 *         description: Error interno
 */
router.get("/", async (req, res) => {
  const response =
    await asistenteConferenciaVotacionService.getAllAsistenteConferenciaVotacion();
  res.json({
    method: "getAllAsistenteConferenciaVotacion",
    code: response.code,
    status: response.status,
    data: response.data,
    message: response.message,
  });
});

/**
 * @swagger
 * /asistenteConferenciaVotacion/{id}:
 *   get:
 *     summary: Obtiene un voto por ID
 *     tags: [AsistenteConferenciaVotacion]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       200:
 *         description: Voto encontrado
 *       404:
 *         description: Voto no encontrado
 *       500:
 *         description: Error interno
 */
router.get("/:id", async (req, res) => {
  const response =
    await asistenteConferenciaVotacionService.getAsistenteConferenciaVotacionById(
      req.params.id
    );
  res.json({
    method: "getAsistenteConferenciaVotacionById",
    code: response.code,
    status: response.status,
    data: response.data,
    message: response.message,
  });
});

/**
 * @swagger
 * /asistenteConferenciaVotacion/:
 *   post:
 *     summary: Registra un nuevo voto
 *     tags: [AsistenteConferenciaVotacion]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id_asistente_conferencia:
 *                 type: integer
 *               id_votacion:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Voto registrado
 *       500:
 *         description: Error interno
 */
router.post("/", async (req, res) => {
  const response =
    await asistenteConferenciaVotacionService.createAsistenteConferenciaVotacion(
      req.body
    );
  res.status(response.code === "ACV-000" ? 201 : 500).json({
    method: "createAsistenteConferenciaVotacion",
    code: response.code,
    status: response.status,
    data: response.data,
    message: response.message,
  });
});

/**
 * @swagger
 * /asistenteConferenciaVotacion/{id}:
 *   put:
 *     summary: Actualiza un voto
 *     tags: [AsistenteConferenciaVotacion]
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
 *               id_asistente_conferencia:
 *                 type: integer
 *               id_votacion:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Voto actualizado
 *       404:
 *         description: Voto no encontrado
 *       500:
 *         description: Error interno
 */
router.put("/:id", async (req, res) => {
  const response =
    await asistenteConferenciaVotacionService.updateAsistenteConferenciaVotacion(
      req.params.id,
      req.body
    );
  res.json({
    method: "updateAsistenteConferenciaVotacion",
    code: response.code,
    status: response.status,
    data: response.data,
    message: response.message,
  });
});

/**
 * @swagger
 * /asistenteConferenciaVotacion/{id}:
 *   delete:
 *     summary: Elimina un voto
 *     tags: [AsistenteConferenciaVotacion]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       200:
 *         description: Voto eliminado
 *       404:
 *         description: Voto no encontrado
 *       500:
 *         description: Error interno
 */
router.delete("/:id", async (req, res) => {
  const response =
    await asistenteConferenciaVotacionService.deleteAsistenteConferenciaVotacion(
      req.params.id
    );
  res.json({
    method: "deleteAsistenteConferenciaVotacion",
    code: response.code,
    status: response.status,
    data: response.data,
    message: response.message,
  });
});

module.exports = router;
