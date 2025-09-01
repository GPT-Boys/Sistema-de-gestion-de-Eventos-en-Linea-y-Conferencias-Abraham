const express = require("express");
const router = express.Router();
const conferenciaService = require("../services/conferenciaService");

/**
 * @swagger
 * tags:
 *   name: Conferencia
 *   description: API para gestionar conferencias
 */

/**
 * @swagger
 * /conferencia/:
 *   get:
 *     summary: Obtiene todas las conferencias
 *     tags: [Conferencia]
 *     responses:
 *       200:
 *         description: Lista de conferencias
 *       500:
 *         description: Error interno
 */
router.get("/", async (req, res) => {
  const response = await conferenciaService.getAllConferencias();
  res.json({
    method: "getAllConferencias",
    code: response.code,
    status: response.status,
    data: response.data,
    message: response.message,
  });
});

/**
 * @swagger
 * /conferencia/{id}:
 *   get:
 *     summary: Obtiene una conferencia por ID
 *     tags: [Conferencia]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       200:
 *         description: Conferencia encontrada
 *       404:
 *         description: Conferencia no encontrada
 *       500:
 *         description: Error interno
 */
router.get("/:id", async (req, res) => {
  const response = await conferenciaService.getConferenciaById(req.params.id);
  res.json({
    method: "getConferenciaById",
    code: response.code,
    status: response.status,
    data: response.data,
    message: response.message,
  });
});

/**
 * @swagger
 * /conferencia/:
 *   post:
 *     summary: Crea una nueva conferencia
 *     tags: [Conferencia]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               titulo:
 *                 type: string
 *               descripcion:
 *                 type: string
 *               id_marca_conferencia:
 *                 type: integer
 *               id_orador:
 *                 type: integer
 *               id_tipo_conferencia:
 *                 type: integer
 *               fecha:
 *                 type: string
 *               hora_empieza:
 *                 type: string
 *               hora_termina:
 *                 type: string
 *               sala:
 *                 type: string
 *               evaluacion:
 *                 type: string
 *               material:
 *                 type: string
 *     responses:
 *       201:
 *         description: Conferencia creada
 *       500:
 *         description: Error interno
 */
router.post("/", async (req, res) => {
  const response = await conferenciaService.createConferencia(req.body);
  res.status(response.code === "C-000" ? 201 : 500).json({
    method: "createConferencia",
    code: response.code,
    status: response.status,
    data: response.data,
    message: response.message,
  });
});

/**
 * @swagger
 * /conferencia/{id}:
 *   put:
 *     summary: Actualiza una conferencia
 *     tags: [Conferencia]
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
 *               titulo:
 *                 type: string
 *               descripcion:
 *                 type: string
 *               id_marca_conferencia:
 *                 type: integer
 *               id_orador:
 *                 type: integer
 *               id_tipo_conferencia:
 *                 type: integer
 *               fecha:
 *                 type: string
 *               hora_empieza:
 *                 type: string
 *               hora_termina:
 *                 type: string
 *               sala:
 *                 type: string
 *               evaluacion:
 *                 type: string
 *               material:
 *                 type: string
 *     responses:
 *       200:
 *         description: Conferencia actualizada
 *       404:
 *         description: Conferencia no encontrada
 *       500:
 *         description: Error interno
 */
router.put("/:id", async (req, res) => {
  const response = await conferenciaService.updateConferencia(
    req.params.id,
    req.body
  );
  res.json({
    method: "updateConferencia",
    code: response.code,
    status: response.status,
    data: response.data,
    message: response.message,
  });
});

/**
 * @swagger
 * /conferencia/{id}:
 *   delete:
 *     summary: Elimina una conferencia
 *     tags: [Conferencia]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       200:
 *         description: Conferencia eliminada
 *       404:
 *         description: Conferencia no encontrada
 *       500:
 *         description: Error interno
 */
router.delete("/:id", async (req, res) => {
  const response = await conferenciaService.deleteConferencia(req.params.id);
  res.json({
    method: "deleteConferencia",
    code: response.code,
    status: response.status,
    data: response.data,
    message: response.message,
  });
});

/**
 * @swagger
 * /conferencia/{id}/voto:
 *   put:
 *     summary: Actualiza los votos de una conferencia
 *     tags: [Conferencia]
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
 *               positivo:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Votos actualizados
 *       404:
 *         description: Conferencia no encontrada
 *       500:
 *         description: Error interno
 */
router.put("/:id/voto", async (req, res) => {
  const response = await conferenciaService.updateVotos(
    req.params.id,
    req.body.positivo
  );
  res.json({
    method: "updateVotos",
    code: response.code,
    status: response.status,
    data: response.data,
    message: response.message,
  });
});

module.exports = router;
