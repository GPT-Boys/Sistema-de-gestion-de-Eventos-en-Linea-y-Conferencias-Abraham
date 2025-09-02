const ResponseDTO = require("../DTO/ResponseDTO");
const MarcaConferenciaDTO = require("../DTO/MarcaConferenciaDTO");
const MarcaConferenciaENT = require("../ENT/MarcaConferenciaENT");

const getAllMarcaConferencia = async () => {
  console.log("Getting All MarcaConferencia...");
  try {
    const marcas = await MarcaConferenciaENT.findAll();
    const marcasDTO = marcas.map(
      (marca) =>
        new MarcaConferenciaDTO(
          marca.id_marca_conferencia,
          marca.marca_conferencia
        )
    );
    return new ResponseDTO(
      "MC-000",
      200,
      marcasDTO,
      "Marcas Successfully Obtained."
    );
  } catch (error) {
    return new ResponseDTO(
      "MC-101",
      500,
      null,
      `Error Getting All Marcas: ${error}`
    );
  }
};

const getMarcaConferenciaById = async (id) => {
  console.log(`Getting MarcaConferencia with ID: ${id}...`);
  try {
    const marca = await MarcaConferenciaENT.findByPk(id);
    if (!marca)
      return new ResponseDTO(
        "MC-102",
        404,
        null,
        `Marca with ID ${id} Not Found.`
      );
    const marcaDTO = new MarcaConferenciaDTO(
      marca.id_marca_conferencia,
      marca.marca_conferencia
    );
    return new ResponseDTO(
      "MC-000",
      200,
      marcaDTO,
      "Marca Successfully Obtained."
    );
  } catch (error) {
    return new ResponseDTO(
      "MC-102",
      500,
      null,
      `Error Getting Marca: ${error}`
    );
  }
};

const createMarcaConferencia = async (marcaData) => {
  console.log("Creating MarcaConferencia...");
  try {
    const newMarca = await MarcaConferenciaENT.create({
      marca_conferencia: marcaData.marca_conferencia,
    });
    const marcaDTO = new MarcaConferenciaDTO(
      newMarca.id_marca_conferencia,
      newMarca.marca_conferencia
    );
    return new ResponseDTO(
      "MC-000",
      201,
      marcaDTO,
      "Marca Created Successfully."
    );
  } catch (error) {
    return new ResponseDTO(
      "MC-103",
      500,
      null,
      `Error Creating Marca: ${error}`
    );
  }
};

const updateMarcaConferencia = async (id, marcaData) => {
  console.log(`Updating MarcaConferencia ID: ${id}...`);
  try {
    const marca = await MarcaConferenciaENT.findByPk(id);
    if (!marca) return new ResponseDTO("MC-104", 404, null, "Marca Not Found.");
    await marca.update({ marca_conferencia: marcaData.marca_conferencia });
    const updatedDTO = new MarcaConferenciaDTO(
      marca.id_marca_conferencia,
      marca.marca_conferencia
    );
    return new ResponseDTO(
      "MC-000",
      200,
      updatedDTO,
      "Marca Updated Successfully."
    );
  } catch (error) {
    return new ResponseDTO(
      "MC-104",
      500,
      null,
      `Error Updating Marca: ${error}`
    );
  }
};

const deleteMarcaConferencia = async (id) => {
  console.log(`Deleting MarcaConferencia ID: ${id}...`);
  try {
    const marca = await MarcaConferenciaENT.findByPk(id);
    if (!marca) return new ResponseDTO("MC-105", 404, null, "Marca Not Found.");
    await marca.destroy();
    return new ResponseDTO("MC-000", 200, null, "Marca Deleted Successfully.");
  } catch (error) {
    return new ResponseDTO(
      "MC-105",
      500,
      null,
      `Error Deleting Marca: ${error}`
    );
  }
};

module.exports = {
  getAllMarcaConferencia,
  getMarcaConferenciaById,
  createMarcaConferencia,
  updateMarcaConferencia,
  deleteMarcaConferencia,
};
