const ResponseDTO = require("../DTO/ResponseDTO");
const VotacionDTO = require("../DTO/VotacionDTO");
const VotacionENT = require("../ENT/VotacionENT");
const AsistenteConferenciaVotacionENT = require("../ENT/AsistenteConferenciaVotacionENT");

const getAllVotaciones = async () => {
  console.log("Getting All Votaciones...");
  try {
    const votaciones = await VotacionENT.findAll();
    const votacionesDTO = votaciones.map(
      (votacion) => new VotacionDTO(votacion.id_votacion, votacion.votacion)
    );
    return new ResponseDTO(
      "V-000",
      200,
      votacionesDTO,
      "Votaciones Successfully Obtained."
    );
  } catch (error) {
    return new ResponseDTO(
      "V-101",
      500,
      null,
      `Error Getting All Votaciones: ${error}`
    );
  }
};

const getVotacionById = async (id) => {
  console.log(`Getting Votacion with ID: ${id}...`);
  try {
    const votacion = await VotacionENT.findByPk(id);
    if (!votacion)
      return new ResponseDTO(
        "V-102",
        404,
        null,
        `Votacion with ID ${id} Not Found.`
      );
    const votacionDTO = new VotacionDTO(
      votacion.id_votacion,
      votacion.votacion
    );
    return new ResponseDTO(
      "V-000",
      200,
      votacionDTO,
      "Votacion Successfully Obtained."
    );
  } catch (error) {
    return new ResponseDTO(
      "V-102",
      500,
      null,
      `Error Getting Votacion: ${error}`
    );
  }
};

const createVotacion = async (votacionData) => {
  console.log("Creating Votacion...");
  try {
    const newVotacion = await VotacionENT.create({
      votacion: votacionData.votacion,
    });
    const votacionDTO = new VotacionDTO(
      newVotacion.id_votacion,
      newVotacion.votacion
    );
    return new ResponseDTO(
      "V-000",
      201,
      votacionDTO,
      "Votacion Created Successfully."
    );
  } catch (error) {
    return new ResponseDTO(
      "V-103",
      500,
      null,
      `Error Creating Votacion: ${error}`
    );
  }
};

const updateVotacion = async (id, votacionData) => {
  console.log(`Updating Votacion ID: ${id}...`);
  try {
    const votacion = await VotacionENT.findByPk(id);
    if (!votacion)
      return new ResponseDTO("V-104", 404, null, "Votacion Not Found.");
    await votacion.update({ votacion: votacionData.votacion });
    const updatedDTO = new VotacionDTO(votacion.id_votacion, votacion.votacion);
    return new ResponseDTO(
      "V-000",
      200,
      updatedDTO,
      "Votacion Updated Successfully."
    );
  } catch (error) {
    return new ResponseDTO(
      "V-104",
      500,
      null,
      `Error Updating Votacion: ${error}`
    );
  }
};

const deleteVotacion = async (id) => {
  console.log(`Deleting Votacion ID: ${id}...`);
  try {
    const votacion = await VotacionENT.findByPk(id);
    if (!votacion)
      return new ResponseDTO("V-105", 404, null, "Votacion Not Found.");
    await votacion.destroy();
    return new ResponseDTO(
      "V-000",
      200,
      null,
      "Votacion Deleted Successfully."
    );
  } catch (error) {
    return new ResponseDTO(
      "V-105",
      500,
      null,
      `Error Deleting Votacion: ${error}`
    );
  }
};

const getReporteVotos = async (conferenciaId) => {
  console.log(`Getting Reporte Votos for Conferencia ID: ${conferenciaId}...`);
  try {
    const votos = await AsistenteConferenciaVotacionENT.findAll({
      where: { id_asistente_conferencia: conferenciaId },
      include: [{ model: VotacionENT, as: "votacion" }],
    });
    const reporte = votos.reduce((acc, voto) => {
      acc[voto.votacion.votacion] = (acc[voto.votacion.votacion] || 0) + 1;
      return acc;
    }, {});
    return new ResponseDTO("V-000", 200, reporte, "Reporte Votos Obtained.");
  } catch (error) {
    return new ResponseDTO("V-106", 500, null, `Error: ${error}`);
  }
};

module.exports = {
  getAllVotaciones,
  getVotacionById,
  createVotacion,
  updateVotacion,
  deleteVotacion,
  getReporteVotos,
};
