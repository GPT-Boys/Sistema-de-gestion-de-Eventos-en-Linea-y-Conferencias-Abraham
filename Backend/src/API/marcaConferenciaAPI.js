const express = require("express");
const router = express.Router();
const marcaConferenciaService = require("../services/marcaConferenciaService");

/**
 * @swagger
 * tags:
 *   name: MarcaConferencia
 *   description: API para gestionar marcas de conferencias
 */

/**
 * @swagger
 * /marcaConferencia/:
 *   get:
 *     summary: Obtiene todas las marcas de conferencias
 *     tags: [MarcaConferencia]
 *     responses:
 *       200:
 *         description: Lista de marcas
 *       500:
 *         description: Error interno
 */
router.get("/", async (req, res) => {
  const response = await marcaConferenciaService.getAllMarcaConferencia();
  res.json({
    method: "getAllMarcaConferencia",
    code: response.code,
    status: response.status,
    data: response.data,
    message: response.message,
  });
});

/**
 * @swagger
 * /marcaConferencia/{id}:
 *   get:
 *     summary: Obtiene una marca por ID
 *     tags: [MarcaConferencia]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       200:
 *         description: Marca encontrada
 *       404:
 *         description: Marca no encontrada
 *       500:
 *         description: Error interno
 */
router.get("/:id", async (req, res) => {
  const response = await marcaConferenciaService.getMarcaConferenciaById(
    req.params.id
  );
  res.json({
    method: "getMarcaConferenciaById",
    code: response.code,
    status: response.status,
    data: response.data,
    message: response.message,
  });
});

/**
 * @swagger
 * /marcaConferencia/:
 *   post:
 *     summary: Crea una nueva marca
 *     tags: [MarcaConferencia]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               marca_conferencia:
 *                 type: string
 *     responses:
 *       201:
 *         description: Marca creada
 *       500:
 *         description: Error interno
 */
router.post("/", async (req, res) => {
  const response = await marcaConferenciaService.createMarcaConferencia(
    req.body
  );
  res.status(response.code === "MC-000" ? 201 : 500).json({
    method: "createMarcaConferencia",
    code: response.code,
    status: response.status,
    data: response.data,
    message: response.message,
  });
});

/**
 * @swagger
 * /marcaConferencia/{id}:
 *   put:
 *     summary: Actualiza una marca
 *     tags: [MarcaConferencia]
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
 *               marca_conferencia:
 *                 type: string
 *     responses:
 *       200:
 *         description: Marca actualizada
 *       404:
 *         description: Marca no encontrada
 *       500:
 *         description: Error interno
 */
router.put("/:id", async (req, res) => {
  const response = await marcaConferenciaService.updateMarcaConferencia(
    req.params.id,
    req.body
  );
  res.json({
    method: "updateMarcaConferencia",
    code: response.code,
    status: response.status,
    data: response.data,
    message: response.message,
  });
});

/**
 * @swagger
 * /marcaConferencia/{id}:
 *   delete:
 *     summary: Elimina una marca
 *     tags: [MarcaConferencia]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       200:
 *         description: Marca eliminada
 *       404:
 *         description: Marca no encontrada
 *       500:
 *         description: Error interno
 */
router.delete("/:id", async (req, res) => {
  const response = await marcaConferenciaService.deleteMarcaConferencia(
    req.params.id
  );
  res.json({
    method: "deleteMarcaConferencia",
    code: response.code,
    status: response.status,
    data: response.data,
    message: response.message,
  });
});

module.exports = router;
