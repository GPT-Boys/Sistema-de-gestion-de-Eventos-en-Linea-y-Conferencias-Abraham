const ResponseDTO = require("../DTO/ResponseDTO");
const OradorDTO = require("../DTO/OradorDTO");
const OradorENT = require("../ENT/OradorENT");
const UsuarioDTO = require("../DTO/UsuarioDTO");
const UsuarioENT = require("../ENT/UsuarioENT");

const getAllOradores = async () => {
  console.log("Getting All Oradores...");
  try {
    const oradores = await OradorENT.findAll({
      include: [{ model: UsuarioENT, as: "usuario" }],
    });
    const oradoresDTO = oradores.map((orador) => {
      const usuarioDTO = new UsuarioDTO(
        orador.usuario.id_usuario,
        orador.usuario.usuario,
        orador.usuario.id_tipo_usuario,
        orador.usuario.nombres,
        orador.usuario.apellidos,
        orador.usuario.fecha_nacimiento,
        orador.usuario.id_ciudad,
        orador.usuario.telefono,
        orador.usuario.correo_electronico,
        orador.usuario.fecha_creacion
      );
      return new OradorDTO(
        orador.id_orador,
        usuarioDTO,
        orador.descripcion,
        orador.experiencia,
        orador.contacto
      );
    });
    return new ResponseDTO(
      "O-000",
      200,
      oradoresDTO,
      "Oradores Successfully Obtained."
    );
  } catch (error) {
    return new ResponseDTO(
      "O-101",
      500,
      null,
      `Error Getting All Oradores: ${error}.`
    );
  }
};

const getOradorById = async (id) => {
  console.log(`Getting Orador with ID: ${id}...`);
  try {
    const orador = await OradorENT.findByPk(id, {
      include: [{ model: UsuarioENT, as: "usuario" }],
    });
    if (!orador)
      return new ResponseDTO(
        "O-102",
        404,
        null,
        `Orador with ID ${id} Not Found.`
      );
    const usuarioDTO = new UsuarioDTO(
      orador.usuario.id_usuario,
      orador.usuario.usuario,
      orador.usuario.id_tipo_usuario,
      orador.usuario.nombres,
      orador.usuario.apellidos,
      orador.usuario.fecha_nacimiento,
      orador.usuario.id_ciudad,
      orador.usuario.telefono,
      orador.usuario.correo_electronico,
      orador.usuario.fecha_creacion
    );
    const oradorDTO = new OradorDTO(
      orador.id_orador,
      usuarioDTO,
      orador.descripcion,
      orador.experiencia,
      orador.contacto
    );
    return new ResponseDTO(
      "O-000",
      200,
      oradorDTO,
      "Orador Successfully Obtained."
    );
  } catch (error) {
    return new ResponseDTO(
      "O-102",
      500,
      null,
      `Error Getting Orador: ${error}.`
    );
  }
};

const createOrador = async (oradorData) => {
  console.log("Creating Orador...");
  try {
    const newOrador = await OradorENT.create({
      id_usuario: oradorData.usuario.id_usuario,
      descripcion: oradorData.descripcion,
      experiencia: oradorData.experiencia,
      contacto: oradorData.contacto,
    });
    const oradorUserID = newOrador.id_usuario;
    const oradorUserValues = await UsuarioENT.findByPk(oradorUserID);
    const usuarioDTO = new UsuarioDTO(
      oradorUserID,
      oradorUserValues.usuario,
      oradorUserValues.id_tipo_usuario,
      oradorUserValues.nombres,
      oradorUserValues.apellidos,
      oradorUserValues.fecha_nacimiento,
      oradorUserValues.id_ciudad,
      oradorUserValues.telefono,
      oradorUserValues.correo_electronico,
      oradorUserValues.fecha_creacion
    );
    const oradorDTO = new OradorDTO(
      newOrador.id_orador,
      usuarioDTO,
      newOrador.descripcion,
      newOrador.experiencia,
      newOrador.contacto
    );
    return new ResponseDTO(
      "O-000",
      201,
      oradorDTO,
      "Orador Created Successfully."
    );
  } catch (error) {
    return new ResponseDTO(
      "O-103",
      500,
      null,
      `Error Creating Orador: ${error}.`
    );
  }
};

const updateOrador = async (id, oradorData) => {
  console.log(`Updating Orador ID: ${id}...`);
  try {
    const orador = await OradorENT.findByPk(id, {
      include: [{ model: UsuarioENT, as: "usuario" }],
    });
    if (!orador)
      return new ResponseDTO("O-104", 404, null, "Orador Not Found.");
    await orador.update({
      descripcion: oradorData.descripcion,
      experiencia: oradorData.experiencia,
      contacto: oradorData.contacto,
    });
    const oradorUserID = orador.id_usuario;
    const oradorUserValues = await UsuarioENT.findByPk(oradorUserID);
    const usuarioDTO = new UsuarioDTO(
      oradorUserID,
      oradorUserValues.usuario,
      oradorUserValues.id_tipo_usuario,
      oradorUserValues.nombres,
      oradorUserValues.apellidos,
      oradorUserValues.fecha_nacimiento,
      oradorUserValues.id_ciudad,
      oradorUserValues.telefono,
      oradorUserValues.correo_electronico,
      oradorUserValues.fecha_creacion
    );
    const updatedDTO = new OradorDTO(
      orador.id_orador,
      usuarioDTO,
      orador.descripcion,
      orador.experiencia,
      orador.contacto
    );
    return new ResponseDTO(
      "O-000",
      200,
      updatedDTO,
      "Orador Updated Successfully."
    );
  } catch (error) {
    return new ResponseDTO(
      "O-104",
      500,
      null,
      `Error Updating Orador: ${error}.`
    );
  }
};

const deleteOrador = async (id) => {
  console.log(`Deleting Orador ID: ${id}...`);
  try {
    const orador = await OradorENT.findByPk(id);
    if (!orador)
      return new ResponseDTO("O-105", 404, null, "Orador Not Found.");
    await orador.destroy();
    return new ResponseDTO("O-000", 200, null, "Orador Deleted Successfully.");
  } catch (error) {
    return new ResponseDTO(
      "O-105",
      500,
      null,
      `Error Deleting Orador: ${error}.`
    );
  }
};

module.exports = {
  getAllOradores,
  getOradorById,
  createOrador,
  updateOrador,
  deleteOrador,
};
