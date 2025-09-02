const express = require("express");
const router = express.Router();
const tipoConferenciaService = require("../services/tipoConferenciaService");

/**
 * @swagger
 * tags:
 *   name: TipoConferencia
 *   description: API para gestionar tipos de conferencias
 */

/**
 * @swagger
 * /tipoConferencia/:
 *   get:
 *     summary: Obtiene todos los tipos de conferencias
 *     tags: [TipoConferencia]
 *     responses:
 *       200:
 *         description: Lista de tipos
 *       500:
 *         description: Error interno
 */
router.get("/", async (req, res) => {
  const response = await tipoConferenciaService.getAllTipoConferencia();
  res.json({
    method: "getAllTipoConferencia",
    code: response.code,
    status: response.status,
    data: response.data,
    message: response.message,
  });
});

/**
 * @swagger
 * /tipoConferencia/{id}:
 *   get:
 *     summary: Obtiene un tipo de conferencia por ID
 *     tags: [TipoConferencia]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       200:
 *         description: Tipo encontrado
 *       404:
 *         description: Tipo no encontrado
 *       500:
 *         description: Error interno
 */
router.get("/:id", async (req, res) => {
  const response = await tipoConferenciaService.getTipoConferenciaById(
    req.params.id
  );
  res.json({
    method: "getTipoConferenciaById",
    code: response.code,
    status: response.status,
    data: response.data,
    message: response.message,
  });
});

/**
 * @swagger
 * /tipoConferencia/:
 *   post:
 *     summary: Crea un nuevo tipo de conferencia
 *     tags: [TipoConferencia]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               tipo_conferencia:
 *                 type: string
 *     responses:
 *       201:
 *         description: Tipo creado
 *       500:
 *         description: Error interno
 */
router.post("/", async (req, res) => {
  const response = await tipoConferenciaService.createTipoConferencia(req.body);
  res.status(response.code === "TC-000" ? 201 : 500).json({
    method: "createTipoConferencia",
    code: response.code,
    status: response.status,
    data: response.data,
    message: response.message,
  });
});

/**
 * @swagger
 * /tipoConferencia/{id}:
 *   put:
 *     summary: Actualiza un tipo de conferencia
 *     tags: [TipoConferencia]
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
 *               tipo_conferencia:
 *                 type: string
 *     responses:
 *       200:
 *         description: Tipo actualizado
 *       404:
 *         description: Tipo no encontrado
 *       500:
 *         description: Error interno
 */
router.put("/:id", async (req, res) => {
  const response = await tipoConferenciaService.updateTipoConferencia(
    req.params.id,
    req.body
  );
  res.json({
    method: "updateTipoConferencia",
    code: response.code,
    status: response.status,
    data: response.data,
    message: response.message,
  });
});

/**
 * @swagger
 * /tipoConferencia/{id}:
 *   delete:
 *     summary: Elimina un tipo de conferencia
 *     tags: [TipoConferencia]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       200:
 *         description: Tipo eliminado
 *       404:
 *         description: Tipo no encontrado
 *       500:
 *         description: Error interno
 */
router.delete("/:id", async (req, res) => {
  const response = await tipoConferenciaService.deleteTipoConferencia(
    req.params.id
  );
  res.json({
    method: "deleteTipoConferencia",
    code: response.code,
    status: response.status,
    data: response.data,
    message: response.message,
  });
});

module.exports = router;
