const ResponseDTO = require("../DTO/ResponseDTO");
const AsistenteConferenciaVotacionDTO = require("../DTO/AsistenteConferenciaVotacionDTO");
const AsistenteConferenciaVotacionENT = require("../ENT/AsistenteConferenciaVotacionENT");
const AsistenteConferenciaDTO = require("../DTO/AsistenteConferenciaDTO");
const AsistenteConferenciaENT = require("../ENT/AsistenteConferenciaENT");
const VotacionDTO = require("../DTO/VotacionDTO");
const VotacionENT = require("../ENT/VotacionENT");

const getAllAsistenteConferenciaVotacion = async () => {
  console.log("Getting All AsistenteConferenciaVotacion...");
  try {
    const records = await AsistenteConferenciaVotacionENT.findAll({
      include: [
        { model: VotacionENT, as: "votacion" },
        { model: AsistenteConferenciaENT, as: "asistente_conferencia" },
      ],
    });
    const recordsDTO = records.map((record) => {
      const asistenteConferenciaDTO = new AsistenteConferenciaDTO(
        record.asistente_conferencia.id_asistente_conferencia,
        record.asistente_conferencia.id_conferencia,
        record.asistente_conferencia.id_asistente
      );
      const votacionDTO = new VotacionDTO(
        record.votacion.id_votacion,
        record.votacion.votacion
      );
      return new AsistenteConferenciaVotacionDTO(
        record.id_asistente_conferencia_votacion,
        asistenteConferenciaDTO,
        votacionDTO
      );
    });
    return new ResponseDTO("ACV-000", 200, recordsDTO, "Records Obtained.");
  } catch (error) {
    return new ResponseDTO("ACV-101", 500, null, `Error: ${error}`);
  }
};

const getAsistenteConferenciaVotacionById = async (id) => {
  console.log(`Getting AsistenteConferenciaVotacion with ID: ${id}...`);
  try {
    const record = await AsistenteConferenciaVotacionENT.findByPk(id, {
      include: [
        { model: VotacionENT, as: "votacion" },
        { model: AsistenteConferenciaENT, as: "asistente_conferencia" },
      ],
    });
    if (!record)
      return new ResponseDTO("ACV-102", 404, null, "Record Not Found.");
    const asistenteConferenciaDTO = new AsistenteConferenciaDTO(
      record.asistente_conferencia.id_asistente_conferencia,
      record.asistente_conferencia.id_conferencia,
      record.asistente_conferencia.id_asistente
    );
    const votacionDTO = new VotacionDTO(
      record.votacion.id_votacion,
      record.votacion.votacion
    );
    const recordDTO = new AsistenteConferenciaVotacionDTO(
      record.id_asistente_conferencia_votacion,
      asistenteConferenciaDTO,
      votacionDTO
    );
    return new ResponseDTO("ACV-000", 200, recordDTO, "Record Obtained.");
  } catch (error) {
    return new ResponseDTO("ACV-102", 500, null, `Error: ${error}`);
  }
};

const createAsistenteConferenciaVotacion = async (data) => {
  console.log("Creating AsistenteConferenciaVotacion...");
  try {
    const newRecord = await AsistenteConferenciaVotacionENT.create({
      id_asistente_conferencia:
        data.asistente_conferencia.id_asistente_conferencia,
      id_votacion: data.votacion.id_votacion,
    });

    const assistantConferenceID = newRecord.id_asistente_conferencia;
    const assistantConferenceValues = await AsistenteConferenciaENT.findByPk(
      assistantConferenceID
    );
    const asistenteConferenciaDTO = new AsistenteConferenciaDTO(
      assistantConferenceID,
      assistantConferenceValues.id_conferencia,
      assistantConferenceValues.id_asistente
    );

    const voteID = newRecord.id_votacion;
    const voteValues = await VotacionENT.findByPk(voteID);
    const votacionDTO = new VotacionDTO(voteID, voteValues.votacion);

    const recordDTO = new AsistenteConferenciaVotacionDTO(
      newRecord.id_asistente_conferencia_votacion,
      asistenteConferenciaDTO,
      votacionDTO
    );
    // Placeholder para notificación real-time: emitir evento WebSocket
    return new ResponseDTO("ACV-000", 201, recordDTO, "Record Created.");
  } catch (error) {
    return new ResponseDTO("ACV-103", 500, null, `Error: ${error}`);
  }
};

const updateAsistenteConferenciaVotacion = async (id, data) => {
  console.log(`Updating AsistenteConferenciaVotacion ID: ${id}...`);
  try {
    const record = await AsistenteConferenciaVotacionENT.findByPk(id, {
      include: [
        { model: VotacionENT, as: "votacion" },
        { model: AsistenteConferenciaENT, as: "asistente_conferencia" },
      ],
    });
    if (!record)
      return new ResponseDTO("ACV-104", 404, null, "Record Not Found.");
    await record.update({
      id_asistente_conferencia:
        data.asistente_conferencia.id_asistente_conferencia,
      id_votacion: data.votacion.id_votacion,
    });

    const assistantConferenceID = record.id_asistente_conferencia;
    const assistantConferenceValues = await AsistenteConferenciaENT.findByPk(
      assistantConferenceID
    );
    const asistenteConferenciaDTO = new AsistenteConferenciaDTO(
      assistantConferenceID,
      assistantConferenceValues.id_conferencia,
      assistantConferenceValues.id_asistente
    );

    const voteID = record.id_votacion;
    const voteValues = await VotacionENT.findByPk(voteID);
    const votacionDTO = new VotacionDTO(voteID, voteValues.votacion);

    const updatedDTO = new AsistenteConferenciaVotacionDTO(
      record.id_asistente_conferencia_votacion,
      asistenteConferenciaDTO,
      votacionDTO
    );
    return new ResponseDTO("ACV-000", 200, updatedDTO, "Record Updated.");
  } catch (error) {
    return new ResponseDTO("ACV-104", 500, null, `Error: ${error}`);
  }
};

const deleteAsistenteConferenciaVotacion = async (id) => {
  console.log(`Deleting AsistenteConferenciaVotacion ID: ${id}...`);
  try {
    const record = await AsistenteConferenciaVotacionENT.findByPk(id);
    if (!record)
      return new ResponseDTO("ACV-105", 404, null, "Record Not Found.");
    await record.destroy();
    return new ResponseDTO("ACV-000", 200, null, "Record Deleted.");
  } catch (error) {
    return new ResponseDTO("ACV-105", 500, null, `Error: ${error}`);
  }
};

module.exports = {
  getAllAsistenteConferenciaVotacion,
  getAsistenteConferenciaVotacionById,
  createAsistenteConferenciaVotacion,
  updateAsistenteConferenciaVotacion,
  deleteAsistenteConferenciaVotacion,
};
