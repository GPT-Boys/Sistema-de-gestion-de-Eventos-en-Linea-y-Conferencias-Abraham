const express = require("express");
const router = express.Router();
const tipoUsuarioService = require("../services/tipoUsuarioService");

/**
 * @swagger
 * tags:
 *   name: TipoUsuario
 *   description: API para gestionar tipos de usuarios
 */

/**
 * @swagger
 * /tipoUsuario/:
 *   get:
 *     summary: Obtiene todos los tipos de usuarios
 *     tags: [TipoUsuario]
 *     responses:
 *       200:
 *         description: Lista de tipos
 *       500:
 *         description: Error interno
 */
router.get("/", async (req, res) => {
  const response = await tipoUsuarioService.getAllTipoUsuario();
  res.json({
    method: "getAllTipoUsuario",
    code: response.code,
    status: response.status,
    data: response.data,
    message: response.message,
  });
});

/**
 * @swagger
 * /tipoUsuario/{id}:
 *   get:
 *     summary: Obtiene un tipo de usuario por ID
 *     tags: [TipoUsuario]
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
  const response = await tipoUsuarioService.getTipoUsuarioById(req.params.id);
  res.json({
    method: "getTipoUsuarioById",
    code: response.code,
    status: response.status,
    data: response.data,
    message: response.message,
  });
});

/**
 * @swagger
 * /tipoUsuario/:
 *   post:
 *     summary: Crea un nuevo tipo de usuario
 *     tags: [TipoUsuario]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               tipo_usuario:
 *                 type: string
 *     responses:
 *       201:
 *         description: Tipo creado
 *       500:
 *         description: Error interno
 */
router.post("/", async (req, res) => {
  const response = await tipoUsuarioService.createTipoUsuario(req.body);
  res.status(response.code === "TU-000" ? 201 : 500).json({
    method: "createTipoUsuario",
    code: response.code,
    status: response.status,
    data: response.data,
    message: response.message,
  });
});

/**
 * @swagger
 * /tipoUsuario/{id}:
 *   put:
 *     summary: Actualiza un tipo de usuario
 *     tags: [TipoUsuario]
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
 *               tipo_usuario:
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
  const response = await tipoUsuarioService.updateTipoUsuario(
    req.params.id,
    req.body
  );
  res.json({
    method: "updateTipoUsuario",
    code: response.code,
    status: response.status,
    data: response.data,
    message: response.message,
  });
});

/**
 * @swagger
 * /tipoUsuario/{id}:
 *   delete:
 *     summary: Elimina un tipo de usuario
 *     tags: [TipoUsuario]
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
  const response = await tipoUsuarioService.deleteTipoUsuario(req.params.id);
  res.json({
    method: "deleteTipoUsuario",
    code: response.code,
    status: response.status,
    data: response.data,
    message: response.message,
  });
});

module.exports = router;
