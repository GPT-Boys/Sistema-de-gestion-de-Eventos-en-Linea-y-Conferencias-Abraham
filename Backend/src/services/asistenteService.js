const ResponseDTO = require("../DTO/ResponseDTO");
const UsuarioDTO = require("../DTO/UsuarioDTO");
const UsuarioENT = require("../ENT/UsuarioENT");
const AsistenteDTO = require("../DTO/AsistenteDTO");
const AsistenteENT = require("../ENT/AsistenteENT");

const getAllAsistentes = async () => {
  console.log("Getting All Asistentes...");
  try {
    const asistentes = await AsistenteENT.findAll({
      include: [{ model: UsuarioENT, as: "usuario" }],
    });
    const asistentesDTO = asistentes.map((asistente) => {
      const usuarioDTO = new UsuarioDTO(
        asistente.usuario.id_usuario,
        asistente.usuario.usuario,
        asistente.usuario.id_tipo_usuario,
        asistente.usuario.nombres,
        asistente.usuario.apellidos,
        asistente.usuario.fecha_nacimiento,
        asistente.usuario.id_ciudad,
        asistente.usuario.telefono,
        asistente.usuario.correo_electronico,
        asistente.usuario.fecha_creacion
      );
      return new AsistenteDTO(
        asistente.id_asistente,
        usuarioDTO,
        asistente.descripcion
      );
    });
    return new ResponseDTO(
      "A-000",
      200,
      asistentesDTO,
      "Asistentes Successfully Obtained."
    );
  } catch (error) {
    return new ResponseDTO(
      "A-101",
      500,
      null,
      `Error Getting All Asistentes: ${error}`
    );
  }
};

const getAsistenteById = async (id) => {
  console.log(`Getting Asistente with ID: ${id}...`);
  try {
    const asistente = await AsistenteENT.findByPk(id, {
      include: [{ model: UsuarioENT, as: "usuario" }],
    });
    if (!asistente)
      return new ResponseDTO(
        "A-102",
        404,
        null,
        `Asistente with ID ${id} Not Found.`
      );
    const usuarioDTO = new UsuarioDTO(
      asistente.usuario.id_usuario,
      asistente.usuario.usuario,
      asistente.usuario.id_tipo_usuario,
      asistente.usuario.nombres,
      asistente.usuario.apellidos,
      asistente.usuario.fecha_nacimiento,
      asistente.usuario.id_ciudad,
      asistente.usuario.telefono,
      asistente.usuario.correo_electronico,
      asistente.usuario.fecha_creacion
    );
    const asistenteDTO = new AsistenteDTO(
      asistente.id_asistente,
      usuarioDTO,
      asistente.descripcion
    );
    return new ResponseDTO(
      "A-000",
      200,
      asistenteDTO,
      "Asistente Successfully Obtained."
    );
  } catch (error) {
    return new ResponseDTO(
      "A-102",
      500,
      null,
      `Error Getting Asistente: ${error}`
    );
  }
};

const createAsistente = async (asistenteData) => {
  console.log("Creating Asistente...");
  try {
    const newAsistente = await AsistenteENT.create({
      id_usuario: asistenteData.usuario.id_usuario,
      descripcion: asistenteData.descripcion,
    });

    const assistantUserID = newAsistente.usuario.id_usuario;
    const assistantUserValues = await UsuarioENT.findByPk(assistantUserID);
    const usuarioDTO = new UsuarioDTO(
      assistantUserID,
      assistantUserValues.usuario,
      assistantUserValues.id_tipo_usuario,
      assistantUserValues.nombres,
      assistantUserValues.apellidos,
      assistantUserValues.fecha_nacimiento,
      assistantUserValues.id_ciudad,
      assistantUserValues.telefono,
      assistantUserValues.correo_electronico,
      assistantUserValues.fecha_creacion
    );

    const asistenteDTO = new AsistenteDTO(
      newAsistente.id_asistente,
      usuarioDTO,
      newAsistente.descripcion
    );
    return new ResponseDTO(
      "A-000",
      201,
      asistenteDTO,
      "Asistente Created Successfully."
    );
  } catch (error) {
    return new ResponseDTO(
      "A-103",
      500,
      null,
      `Error Creating Asistente: ${error}`
    );
  }
};

const updateAsistente = async (id, asistenteData) => {
  console.log(`Updating Asistente ID: ${id}...`);
  try {
    const asistente = await AsistenteENT.findByPk(id, {
      include: [{ model: UsuarioENT, as: "usuario" }],
    });
    if (!asistente)
      return new ResponseDTO("A-104", 404, null, "Asistente Not Found.");
    await asistente.update({ descripcion: asistenteData.descripcion });

    const assistantUserID = asistente.usuario.id_usuario;
    const assistantUserValues = await UsuarioENT.findByPk(assistantUserID);
    const usuarioDTO = new UsuarioDTO(
      assistantUserID,
      assistantUserValues.usuario,
      assistantUserValues.id_tipo_usuario,
      assistantUserValues.nombres,
      assistantUserValues.apellidos,
      assistantUserValues.fecha_nacimiento,
      assistantUserValues.id_ciudad,
      assistantUserValues.telefono,
      assistantUserValues.correo_electronico,
      assistantUserValues.fecha_creacion
    );

    const updatedDTO = new AsistenteDTO(
      asistente.id_asistente,
      usuarioDTO,
      asistente.descripcion
    );
    return new ResponseDTO(
      "A-000",
      200,
      updatedDTO,
      "Asistente Updated Successfully."
    );
  } catch (error) {
    return new ResponseDTO(
      "A-104",
      500,
      null,
      `Error Updating Asistente: ${error}`
    );
  }
};

const deleteAsistente = async (id) => {
  console.log(`Deleting Asistente ID: ${id}...`);
  try {
    const asistente = await AsistenteENT.findByPk(id);
    if (!asistente)
      return new ResponseDTO("A-105", 404, null, "Asistente Not Found.");
    await asistente.destroy();
    return new ResponseDTO(
      "A-000",
      200,
      null,
      "Asistente Deleted Successfully."
    );
  } catch (error) {
    return new ResponseDTO(
      "A-105",
      500,
      null,
      `Error Deleting Asistente: ${error}`
    );
  }
};

module.exports = {
  getAllAsistentes,
  getAsistenteById,
  createAsistente,
  updateAsistente,
  deleteAsistente,
};
