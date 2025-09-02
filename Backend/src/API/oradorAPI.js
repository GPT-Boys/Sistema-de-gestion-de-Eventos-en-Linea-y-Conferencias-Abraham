const express = require("express");
const router = express.Router();
const oradorService = require("../services/oradorService");

/**
 * @swagger
 * tags:
 *   name: Orador
 *   description: API para gestionar oradores
 */

/**
 * @swagger
 * /orador/:
 *   get:
 *     summary: Obtiene todos los oradores
 *     tags: [Orador]
 *     responses:
 *       200:
 *         description: Lista de oradores
 *       500:
 *         description: Error interno
 */
router.get("/", async (req, res) => {
  const response = await oradorService.getAllOradores();
  res.json({
    method: "getAllOradores",
    code: response.code,
    status: response.status,
    data: response.data,
    message: response.message,
  });
});

/**
 * @swagger
 * /orador/{id}:
 *   get:
 *     summary: Obtiene un orador por ID
 *     tags: [Orador]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       200:
 *         description: Orador encontrado
 *       404:
 *         description: Orador no encontrado
 *       500:
 *         description: Error interno
 */
router.get("/:id", async (req, res) => {
  const response = await oradorService.getOradorById(req.params.id);
  res.json({
    method: "getOradorById",
    code: response.code,
    status: response.status,
    data: response.data,
    message: response.message,
  });
});

/**
 * @swagger
 * /orador/:
 *   post:
 *     summary: Crea un nuevo orador
 *     tags: [Orador]
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
 *               experiencia:
 *                 type: string
 *               contacto:
 *                 type: string
 *     responses:
 *       201:
 *         description: Orador creado
 *       500:
 *         description: Error interno
 */
router.post("/", async (req, res) => {
  const response = await oradorService.createOrador(req.body);
  res.status(response.code === "O-000" ? 201 : 500).json({
    method: "createOrador",
    code: response.code,
    status: response.status,
    data: response.data,
    message: response.message,
  });
});

/**
 * @swagger
 * /orador/{id}:
 *   put:
 *     summary: Actualiza un orador
 *     tags: [Orador]
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
 *               descripcion:
 *                 type: string
 *               experiencia:
 *                 type: string
 *               contacto:
 *                 type: string
 *     responses:
 *       200:
 *         description: Orador actualizado
 *       404:
 *         description: Orador no encontrado
 *       500:
 *         description: Error interno
 */
router.put("/:id", async (req, res) => {
  const response = await oradorService.updateOrador(req.params.id, req.body);
  res.json({
    method: "updateOrador",
    code: response.code,
    status: response.status,
    data: response.data,
    message: response.message,
  });
});

/**
 * @swagger
 * /orador/{id}:
 *   delete:
 *     summary: Elimina un orador
 *     tags: [Orador]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       200:
 *         description: Orador eliminado
 *       404:
 *         description: Orador no encontrado
 *       500:
 *         description: Error interno
 */
router.delete("/:id", async (req, res) => {
  const response = await oradorService.deleteOrador(req.params.id);
  res.json({
    method: "deleteOrador",
    code: response.code,
    status: response.status,
    data: response.data,
    message: response.message,
  });
});

module.exports = router;
