const ResponseDTO = require("../DTO/ResponseDTO");
const CiudadDTO = require("../DTO/CiudadDTO");
const CiudadENT = require("../ENT/CiudadENT");

const getAllCiudades = async () => {
  console.log("Getting All Ciudades...");
  try {
    const ciudades = await CiudadENT.findAll();
    const ciudadesDTO = ciudades.map(
      (ciudad) => new CiudadDTO(ciudad.id_ciudad, ciudad.ciudad)
    );
    return new ResponseDTO(
      "C-000",
      200,
      ciudadesDTO,
      "Ciudades Successfully Obtained."
    );
  } catch (error) {
    return new ResponseDTO(
      "C-101",
      500,
      null,
      `Error Getting All Ciudades: ${error}`
    );
  }
};

const getCiudadById = async (id) => {
  console.log(`Getting Ciudad with ID: ${id}...`);
  try {
    const ciudad = await CiudadENT.findByPk(id);
    if (!ciudad)
      return new ResponseDTO(
        "C-102",
        404,
        null,
        `Ciudad with ID ${id} Not Found.`
      );
    const ciudadDTO = new CiudadDTO(ciudad.id_ciudad, ciudad.ciudad);
    return new ResponseDTO(
      "C-000",
      200,
      ciudadDTO,
      "Ciudad Successfully Obtained."
    );
  } catch (error) {
    return new ResponseDTO(
      "C-102",
      500,
      null,
      `Error Getting Ciudad: ${error}`
    );
  }
};

const createCiudad = async (ciudadData) => {
  console.log("Creating Ciudad...");
  try {
    const newCiudad = await CiudadENT.create({
      ciudad: ciudadData.ciudad,
    });
    const ciudadDTO = new CiudadDTO(newCiudad.id_ciudad, newCiudad.ciudad);
    return new ResponseDTO(
      "C-000",
      201,
      ciudadDTO,
      "Ciudad Created Successfully."
    );
  } catch (error) {
    return new ResponseDTO(
      "C-103",
      500,
      null,
      `Error Creating Ciudad: ${error}`
    );
  }
};

const updateCiudad = async (id, ciudadData) => {
  console.log(`Updating Ciudad ID: ${id}...`);
  try {
    const ciudad = await CiudadENT.findByPk(id);
    if (!ciudad)
      return new ResponseDTO("C-104", 404, null, "Ciudad Not Found.");
    await ciudad.update({ ciudad: ciudadData.ciudad });
    const updatedDTO = new CiudadDTO(ciudad.id_ciudad, ciudad.ciudad);
    return new ResponseDTO(
      "C-000",
      200,
      updatedDTO,
      "Ciudad Updated Successfully."
    );
  } catch (error) {
    return new ResponseDTO(
      "C-104",
      500,
      null,
      `Error Updating Ciudad: ${error}`
    );
  }
};

const deleteCiudad = async (id) => {
  console.log(`Deleting Ciudad ID: ${id}...`);
  try {
    const ciudad = await CiudadENT.findByPk(id);
    if (!ciudad)
      return new ResponseDTO("C-105", 404, null, "Ciudad Not Found.");
    await ciudad.destroy();
    return new ResponseDTO("C-000", 200, null, "Ciudad Deleted Successfully.");
  } catch (error) {
    return new ResponseDTO(
      "C-105",
      500,
      null,
      `Error Deleting Ciudad: ${error}`
    );
  }
};

module.exports = {
  getAllCiudades,
  getCiudadById,
  createCiudad,
  updateCiudad,
  deleteCiudad,
};
