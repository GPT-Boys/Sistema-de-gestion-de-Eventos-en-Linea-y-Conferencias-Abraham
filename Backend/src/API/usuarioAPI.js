const express = require('express');
const usuarioService = require('../services/usuarioService');
const ResponseDTO = require('../DTO/ResponseDTO');

const router = express.Router();

/** Normaliza el body a la forma que espera usuarioService.createUser */
function normalizeUserPayload(b = {}) {
  // Acepta mayúsculas/minúsculas y planos/anidados
  const contrasenia =
    b.contrasenia ??
    b.CONTRASENIA ??
    b.password ??
    b.PASSWORD;

  const id_tipo_usuario =
    b?.TIPO_USUARIO?.id_tipo_usuario ??
    b.id_tipo_usuario ??
    b.ID_TIPO_USUARIO;

  const id_ciudad =
    b?.CIUDAD?.id_ciudad ??
    b.id_ciudad ??
    b.ID_CIUDAD;

  return {
    usuario: b.usuario ?? b.USUARIO,
    contrasenia, // <- CLAVE
    TIPO_USUARIO: { id_tipo_usuario: id_tipo_usuario ?? null },
    nombres: b.nombres ?? b.NOMBRES,
    apellidos: b.apellidos ?? b.APELLIDOS,
    fecha_nacimiento: b.fecha_nacimiento ?? b.FECHA_NACIMIENTO,
    CIUDAD: { id_ciudad: id_ciudad ?? null },
    telefono: b.telefono ?? b.TELEFONO,
    correo_electronico: b.correo_electronico ?? b.CORREO_ELECTRONICO,
  };
}

router.post('/', async (req, res) => {
  try {
    // Log útil (no como [object Object])
    console.log('createUser body:', JSON.stringify(req.body, null, 2));

    const data = normalizeUserPayload(req.body);

    // Validaciones mínimas antes del service
    if (!data.usuario) {
      return res
        .status(400)
        .json(new ResponseDTO('U-100', 400, null, 'Falta "usuario".'));
    }

    if (!data.contrasenia) {
      return res
        .status(400)
        .json(new ResponseDTO('U-101', 400, null, 'Falta "contrasenia".'));
    }

    if (!data.TIPO_USUARIO?.id_tipo_usuario) {
      return res
        .status(400)
        .json(new ResponseDTO('U-102', 400, null, 'Falta "id_tipo_usuario".'));
    }

    if (!data.CIUDAD?.id_ciudad) {
      return res
        .status(400)
        .json(new ResponseDTO('U-102B', 400, null, 'Falta "id_ciudad".'));
    }

    const result = await usuarioService.createUser(data);

    // Usa el status del DTO (tu log mostraba 200 aunque fallaba)
    return res.status(Number(result?.status || 200)).json(result);
  } catch (err) {
    console.error('createUser error:', err);
    return res
      .status(500)
      .json(new ResponseDTO('U-103', 500, null, 'Error interno creando usuario.'));
  }
});

module.exports = router;
