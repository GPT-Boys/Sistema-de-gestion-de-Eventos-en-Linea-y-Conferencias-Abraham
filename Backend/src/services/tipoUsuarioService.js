const ResponseDTO = require("../DTO/ResponseDTO");
const TipoUsuarioDTO = require("../DTO/TipoUsuarioDTO");
const TipoUsuarioENT = require("../ENT/TipoUsuarioENT");

const getAllTipoUsuario = async () => {
  console.log("Getting All TipoUsuario...");
  try {
    const tipos = await TipoUsuarioENT.findAll();
    const tiposDTO = tipos.map(
      (tipo) => new TipoUsuarioDTO(tipo.id_tipo_usuario, tipo.tipo_usuario)
    );
    return new ResponseDTO(
      "TU-000",
      200,
      tiposDTO,
      "Tipos Successfully Obtained."
    );
  } catch (error) {
    return new ResponseDTO(
      "TU-101",
      500,
      null,
      `Error Getting All Tipos: ${error}`
    );
  }
};

const getTipoUsuarioById = async (id) => {
  console.log(`Getting TipoUsuario with ID: ${id}...`);
  try {
    const tipo = await TipoUsuarioENT.findByPk(id);
    if (!tipo)
      return new ResponseDTO(
        "TU-102",
        404,
        null,
        `Tipo with ID ${id} Not Found.`
      );
    const tipoDTO = new TipoUsuarioDTO(tipo.id_tipo_usuario, tipo.tipo_usuario);
    return new ResponseDTO(
      "TU-000",
      200,
      tipoDTO,
      "Tipo Successfully Obtained."
    );
  } catch (error) {
    return new ResponseDTO("TU-102", 500, null, `Error Getting Tipo: ${error}`);
  }
};

const createTipoUsuario = async (tipoData) => {
  console.log("Creating TipoUsuario...");
  try {
    const newTipo = await TipoUsuarioENT.create({
      tipo_usuario: tipoData.tipo_usuario,
    });
    const tipoDTO = new TipoUsuarioDTO(
      newTipo.id_tipo_usuario,
      newTipo.tipo_usuario
    );
    return new ResponseDTO(
      "TU-000",
      201,
      tipoDTO,
      "Tipo Created Successfully."
    );
  } catch (error) {
    return new ResponseDTO(
      "TU-103",
      500,
      null,
      `Error Creating Tipo: ${error}`
    );
  }
};

const updateTipoUsuario = async (id, tipoData) => {
  console.log(`Updating TipoUsuario ID: ${id}...`);
  try {
    const tipo = await TipoUsuarioENT.findByPk(id);
    if (!tipo) return new ResponseDTO("TU-104", 404, null, "Tipo Not Found.");
    await tipo.update({ tipo_usuario: tipoData.tipo_usuario });
    const updatedDTO = new TipoUsuarioDTO(
      tipo.id_tipo_usuario,
      tipo.tipo_usuario
    );
    return new ResponseDTO(
      "TU-000",
      200,
      updatedDTO,
      "Tipo Updated Successfully."
    );
  } catch (error) {
    return new ResponseDTO(
      "TU-104",
      500,
      null,
      `Error Updating Tipo: ${error}`
    );
  }
};

const deleteTipoUsuario = async (id) => {
  console.log(`Deleting TipoUsuario ID: ${id}...`);
  try {
    const tipo = await TipoUsuarioENT.findByPk(id);
    if (!tipo) return new ResponseDTO("TU-105", 404, null, "Tipo Not Found.");
    await tipo.destroy();
    return new ResponseDTO("TU-000", 200, null, "Tipo Deleted Successfully.");
  } catch (error) {
    return new ResponseDTO(
      "TU-105",
      500,
      null,
      `Error Deleting Tipo: ${error}`
    );
  }
};

module.exports = {
  getAllTipoUsuario,
  getTipoUsuarioById,
  createTipoUsuario,
  updateTipoUsuario,
  deleteTipoUsuario,
};
