const express = require("express");
const router = express.Router();
const ciudadService = require("../services/ciudadService");

/**
 * @swagger
 * tags:
 *   name: Ciudad
 *   description: API para gestionar ciudades
 */

/**
 * @swagger
 * /ciudad/:
 *   get:
 *     summary: Obtiene todas las ciudades
 *     tags: [Ciudad]
 *     responses:
 *       200:
 *         description: Lista de ciudades
 *       500:
 *         description: Error interno
 */
router.get("/", async (req, res) => {
  const response = await ciudadService.getAllCiudades();
  res.json({
    method: "getAllCiudades",
    code: response.code,
    status: response.status,
    data: response.data,
    message: response.message,
  });
});

/**
 * @swagger
 * /ciudad/{id}:
 *   get:
 *     summary: Obtiene una ciudad por ID
 *     tags: [Ciudad]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       200:
 *         description: Ciudad encontrada
 *       404:
 *         description: Ciudad no encontrada
 *       500:
 *         description: Error interno
 */
router.get("/:id", async (req, res) => {
  const response = await ciudadService.getCiudadById(req.params.id);
  res.json({
    method: "getCiudadById",
    code: response.code,
    status: response.status,
    data: response.data,
    message: response.message,
  });
});

/**
 * @swagger
 * /ciudad/:
 *   post:
 *     summary: Crea una nueva ciudad
 *     tags: [Ciudad]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ciudad:
 *                 type: string
 *     responses:
 *       201:
 *         description: Ciudad creada
 *       500:
 *         description: Error interno
 */
router.post("/", async (req, res) => {
  const response = await ciudadService.createCiudad(req.body);
  res.status(response.code === "C-000" ? 201 : 500).json({
    method: "createCiudad",
    code: response.code,
    status: response.status,
    data: response.data,
    message: response.message,
  });
});

/**
 * @swagger
 * /ciudad/{id}:
 *   put:
 *     summary: Actualiza una ciudad
 *     tags: [Ciudad]
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
 *               ciudad:
 *                 type: string
 *     responses:
 *       200:
 *         description: Ciudad actualizada
 *       404:
 *         description: Ciudad no encontrada
 *       500:
 *         description: Error interno
 */
router.put("/:id", async (req, res) => {
  const response = await ciudadService.updateCiudad(req.params.id, req.body);
  res.json({
    method: "updateCiudad",
    code: response.code,
    status: response.status,
    data: response.data,
    message: response.message,
  });
});

/**
 * @swagger
 * /ciudad/{id}:
 *   delete:
 *     summary: Elimina una ciudad
 *     tags: [Ciudad]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       200:
 *         description: Ciudad eliminada
 *       404:
 *         description: Ciudad no encontrada
 *       500:
 *         description: Error interno
 */
router.delete("/:id", async (req, res) => {
  const response = await ciudadService.deleteCiudad(req.params.id);
  res.json({
    method: "deleteCiudad",
    code: response.code,
    status: response.status,
    data: response.data,
    message: response.message,
  });
});

module.exports = router;
