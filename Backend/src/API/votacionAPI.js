const express = require("express");
const router = express.Router();
const votacionService = require("../services/votacionService");

/**
 * @swagger
 * tags:
 *   name: Votacion
 *   description: API para gestionar votaciones
 */

/**
 * @swagger
 * /votacion/:
 *   get:
 *     summary: Obtiene todas las votaciones
 *     tags: [Votacion]
 *     responses:
 *       200:
 *         description: Lista de votaciones
 *       500:
 *         description: Error interno
 */
router.get("/", async (req, res) => {
  const response = await votacionService.getAllVotaciones();
  res.json({
    method: "getAllVotaciones",
    code: response.code,
    status: response.status,
    data: response.data,
    message: response.message,
  });
});

/**
 * @swagger
 * /votacion/{id}:
 *   get:
 *     summary: Obtiene una votación por ID
 *     tags: [Votacion]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       200:
 *         description: Votación encontrada
 *       404:
 *         description: Votación no encontrada
 *       500:
 *         description: Error interno
 */
router.get("/:id", async (req, res) => {
  const response = await votacionService.getVotacionById(req.params.id);
  res.json({
    method: "getVotacionById",
    code: response.code,
    status: response.status,
    data: response.data,
    message: response.message,
  });
});

/**
 * @swagger
 * /votacion/:
 *   post:
 *     summary: Crea una nueva votación
 *     tags: [Votacion]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               votacion:
 *                 type: string
 *     responses:
 *       201:
 *         description: Votación creada
 *       500:
 *         description: Error interno
 */
router.post("/", async (req, res) => {
  const response = await votacionService.createVotacion(req.body);
  res.status(response.code === "V-000" ? 201 : 500).json({
    method: "createVotacion",
    code: response.code,
    status: response.status,
    data: response.data,
    message: response.message,
  });
});

/**
 * @swagger
 * /votacion/{id}:
 *   put:
 *     summary: Actualiza una votación
 *     tags: [Votacion]
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
 *               votacion:
 *                 type: string
 *     responses:
 *       200:
 *         description: Votación actualizada
 *       404:
 *         description: Votación no encontrada
 *       500:
 *         description: Error interno
 */
router.put("/:id", async (req, res) => {
  const response = await votacionService.updateVotacion(
    req.params.id,
    req.body
  );
  res.json({
    method: "updateVotacion",
    code: response.code,
    status: response.status,
    data: response.data,
    message: response.message,
  });
});

/**
 * @swagger
 * /votacion/{id}:
 *   delete:
 *     summary: Elimina una votación
 *     tags: [Votacion]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       200:
 *         description: Votación eliminada
 *       404:
 *         description: Votación no encontrada
 *       500:
 *         description: Error interno
 */
router.delete("/:id", async (req, res) => {
  const response = await votacionService.deleteVotacion(req.params.id);
  res.json({
    method: "deleteVotacion",
    code: response.code,
    status: response.status,
    data: response.data,
    message: response.message,
  });
});

module.exports = router;
