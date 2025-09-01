// usuarioAPI.js
const express = require("express");
const router = express.Router();
const usuarioService = require("../services/usuarioService");
const ResponseDTO = require("../DTO/ResponseDTO");

/**
 * @swagger
 * tags:
 *   name: Usuario
 *   description: API para gestionar usuarios
 */

/**
 * @swagger
 * /usuario/:
 *   get:
 *     summary: Obtiene todos los usuarios
 *     tags: [Usuario]
 *     responses:
 *       200:
 *         description: Lista de usuarios
 *       500:
 *         description: Error interno
 */
router.get("/", async (req, res) => {
  const response = await usuarioService.getAllUsers();
  res.json({
    method: "getAllUsers",
    code: response.code,
    status: response.status,
    data: response.data,
    message: response.message,
  });
});

/**
 * @swagger
 * /usuario/{id}:
 *   get:
 *     summary: Obtiene un usuario por ID
 *     tags: [Usuario]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       200:
 *         description: Usuario encontrado
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error interno
 */
router.get("/:id", async (req, res) => {
  const response = await usuarioService.getUserByID(req.params.id);
  res.json({
    method: "getUserById",
    code: response.code,
    status: response.status,
    data: response.data,
    message: response.message,
  });
});

/** Normaliza el body a la forma que espera usuarioService.createUser */
function normalizeUserPayload(b = {}) {
  // Acepta mayúsculas/minúsculas y planos/anidados
  const contrasenia =
    b.contrasenia ?? b.CONTRASENIA ?? b.password ?? b.PASSWORD;

  const id_tipo_usuario =
    b?.tipo_usuario?.id_tipo_usuario ?? b.id_tipo_usuario ?? b.ID_TIPO_USUARIO;

  const id_ciudad = b?.ciudad?.id_ciudad ?? b.id_ciudad ?? b.ID_CIUDAD;

  return {
    usuario: b.usuario ?? b.USUARIO,
    contrasenia, // <- CLAVE
    tipo_usuario: { id_tipo_usuario: id_tipo_usuario ?? null },
    nombres: b.nombres ?? b.NOMBRES,
    apellidos: b.apellidos ?? b.APELLIDOS,
    fecha_nacimiento: b.fecha_nacimiento ?? b.FECHA_NACIMIENTO,
    ciudad: { id_ciudad: id_ciudad ?? null },
    telefono: b.telefono ?? b.TELEFONO,
    correo_electronico: b.correo_electronico ?? b.CORREO_ELECTRONICO,
  };
}

/**
 * @swagger
 * /usuario/:
 *   post:
 *     summary: Crea un nuevo usuario
 *     tags: [Usuario]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               usuario:
 *                 type: string
 *               contrasenia:
 *                 type: string
 *               id_tipo_usuario:
 *                 type: integer
 *               nombres:
 *                 type: string
 *               apellidos:
 *                 type: string
 *               fecha_nacimiento:
 *                 type: string
 *               id_ciudad:
 *                 type: integer
 *               telefono:
 *                 type: string
 *               correo_electronico:
 *                 type: string
 *     responses:
 *       201:
 *         description: Usuario creado
 *       500:
 *         description: Error interno
 */
router.post("/", async (req, res) => {
  try {
    console.log("createUser body:", JSON.stringify(req.body, null, 2));

    const data = normalizeUserPayload(req.body);

    // Validaciones mínimas antes del service
    if (!data.usuario) {
      return res
        .status(400)
        .json(new ResponseDTO("U-100", 400, null, 'Falta "usuario".'));
    }

    if (!data.contrasenia) {
      return res
        .status(400)
        .json(new ResponseDTO("U-101", 400, null, 'Falta "contrasenia".'));
    }

    if (!data.tipo_usuario?.id_tipo_usuario) {
      return res
        .status(400)
        .json(new ResponseDTO("U-102", 400, null, 'Falta "id_tipo_usuario".'));
    }

    if (!data.ciudad?.id_ciudad) {
      return res
        .status(400)
        .json(new ResponseDTO("U-102B", 400, null, 'Falta "id_ciudad".'));
    }

    const response = await usuarioService.createUser(data);

    return res.status(response.code === "U-000" ? 201 : 500).json({
      method: "createUser",
      code: response.code,
      status: response.status,
      data: response.data,
      message: response.message,
    });
  } catch (err) {
    console.error("createUser error:", err);
    return res
      .status(500)
      .json(
        new ResponseDTO("U-103", 500, null, "Error interno creando usuario.")
      );
  }
});

/**
 * @swagger
 * /usuario/{id}:
 *   put:
 *     summary: Actualiza un usuario
 *     tags: [Usuario]
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
 *               usuario:
 *                 type: string
 *               contrasenia:
 *                 type: string
 *               id_tipo_usuario:
 *                 type: integer
 *               nombres:
 *                 type: string
 *               apellidos:
 *                 type: string
 *               fecha_nacimiento:
 *                 type: string
 *               id_ciudad:
 *                 type: integer
 *               telefono:
 *                 type: string
 *               correo_electronico:
 *                 type: string
 *     responses:
 *       200:
 *         description: Usuario actualizado
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error interno
 */
router.put("/:id", async (req, res) => {
  const response = await usuarioService.updateUser(req.params.id, req.body);
  res.json({
    method: "updateUser",
    code: response.code,
    status: response.status,
    data: response.data,
    message: response.message,
  });
});

/**
 * @swagger
 * /usuario/{id}:
 *   delete:
 *     summary: Elimina un usuario
 *     tags: [Usuario]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       200:
 *         description: Usuario eliminado
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error interno
 */
router.delete("/:id", async (req, res) => {
  const response = await usuarioService.deleteUser(req.params.id);
  res.json({
    method: "deleteUser",
    code: response.code,
    status: response.status,
    data: response.data,
    message: response.message,
  });
});

/**
 * @swagger
 * /usuario/password:
 *   put:
 *     summary: Actualiza la contraseña de un usuario
 *     tags: [Usuario]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               contrasenia:
 *                 type: string
 *     responses:
 *       200:
 *         description: Contraseña actualizada
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error interno
 */
router.put("/password", async (req, res) => {
  const response = await usuarioService.updatePassword(req);
  res.json({
    method: "updatePassword",
    code: response.code,
    status: response.status,
    data: response.data,
    message: response.message,
  });
});

module.exports = router;
