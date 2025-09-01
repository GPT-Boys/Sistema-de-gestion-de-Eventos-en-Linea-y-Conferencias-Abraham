const ResponseDTO = require("../DTO/ResponseDTO");
const TipoConferenciaDTO = require("../DTO/TipoConferenciaDTO");
const TipoConferenciaENT = require("../ENT/TipoConferenciaENT");

const getAllTipoConferencia = async () => {
  console.log("Getting All TipoConferencia...");
  try {
    const tipos = await TipoConferenciaENT.findAll();
    const tiposDTO = tipos.map(
      (tipo) =>
        new TipoConferenciaDTO(tipo.id_tipo_conferencia, tipo.tipo_conferencia)
    );
    return new ResponseDTO(
      "TC-000",
      200,
      tiposDTO,
      "Tipos Successfully Obtained."
    );
  } catch (error) {
    return new ResponseDTO(
      "TC-101",
      500,
      null,
      `Error Getting All Tipos: ${error}`
    );
  }
};

const getTipoConferenciaById = async (id) => {
  console.log(`Getting TipoConferencia with ID: ${id}...`);
  try {
    const tipo = await TipoConferenciaENT.findByPk(id);
    if (!tipo)
      return new ResponseDTO(
        "TC-102",
        404,
        null,
        `Tipo with ID ${id} Not Found.`
      );
    const tipoDTO = new TipoConferenciaDTO(
      tipo.id_tipo_conferencia,
      tipo.tipo_conferencia
    );
    return new ResponseDTO(
      "TC-000",
      200,
      tipoDTO,
      "Tipo Successfully Obtained."
    );
  } catch (error) {
    return new ResponseDTO("TC-102", 500, null, `Error Getting Tipo: ${error}`);
  }
};

const createTipoConferencia = async (tipoData) => {
  console.log("Creating TipoConferencia...");
  try {
    const newTipo = await TipoConferenciaENT.create({
      tipo_conferencia: tipoData.tipo_conferencia,
    });
    const tipoDTO = new TipoConferenciaDTO(
      newTipo.id_tipo_conferencia,
      newTipo.tipo_conferencia
    );
    return new ResponseDTO(
      "TC-000",
      201,
      tipoDTO,
      "Tipo Created Successfully."
    );
  } catch (error) {
    return new ResponseDTO(
      "TC-103",
      500,
      null,
      `Error Creating Tipo: ${error}`
    );
  }
};

const updateTipoConferencia = async (id, tipoData) => {
  console.log(`Updating TipoConferencia ID: ${id}...`);
  try {
    const tipo = await TipoConferenciaENT.findByPk(id);
    if (!tipo) return new ResponseDTO("TC-104", 404, null, "Tipo Not Found.");
    await tipo.update({ tipo_conferencia: tipoData.tipo_conferencia });
    const updatedDTO = new TipoConferenciaDTO(
      tipo.id_tipo_conferencia,
      tipo.tipo_conferencia
    );
    return new ResponseDTO(
      "TC-000",
      200,
      updatedDTO,
      "Tipo Updated Successfully."
    );
  } catch (error) {
    return new ResponseDTO(
      "TC-104",
      500,
      null,
      `Error Updating Tipo: ${error}`
    );
  }
};

const deleteTipoConferencia = async (id) => {
  console.log(`Deleting TipoConferencia ID: ${id}...`);
  try {
    const tipo = await TipoConferenciaENT.findByPk(id);
    if (!tipo) return new ResponseDTO("TC-105", 404, null, "Tipo Not Found.");
    await tipo.destroy();
    return new ResponseDTO("TC-000", 200, null, "Tipo Deleted Successfully.");
  } catch (error) {
    return new ResponseDTO(
      "TC-105",
      500,
      null,
      `Error Deleting Tipo: ${error}`
    );
  }
};

module.exports = {
  getAllTipoConferencia,
  getTipoConferenciaById,
  createTipoConferencia,
  updateTipoConferencia,
  deleteTipoConferencia,
};
