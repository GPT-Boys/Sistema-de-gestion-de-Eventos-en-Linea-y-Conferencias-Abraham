const ResponseDTO = require("../DTO/ResponseDTO");
const AsistenteConferenciaDTO = require("../DTO/AsistenteConferenciaDTO");
const AsistenteConferenciaENT = require("../ENT/AsistenteConferenciaENT");
const ConferenciaDTO = require("../DTO/ConferenciaDTO");
const ConferenciaENT = require("../ENT/ConferenciaENT");
const AsistenteDTO = require("../DTO/AsistenteDTO");
const AsistenteENT = require("../ENT/AsistenteENT");

const getAllAsistenteConferencia = async () => {
  console.log("Getting All AsistenteConferencia...");
  try {
    const records = await AsistenteConferenciaENT.findAll({
      include: [
        { model: ConferenciaENT, as: "conferencia" },
        { model: AsistenteENT, as: "asistente" },
      ],
    });
    const recordsDTO = records.map((record) => {
      const conferenciaDTO = ConferenciaDTO(
        record.id_conferencia.id_conferencia,
        record.id_conferencia.titulo,
        record.id_conferencia.descripcion,
        record.id_conferencia.id_marca_conferencia,
        record.id_conferencia.id_orador,
        record.id_conferencia.id_tipo_conferencia,
        record.id_conferencia.votos_a_favor,
        record.id_conferencia.votos_en_contra,
        record.id_conferencia.fecha,
        record.id_conferencia.hora_empieza,
        record.id_conferencia.hora_termina,
        record.id_conferencia.sala,
        record.id_conferencia.evaluacion,
        record.id_conferencia.material
      );
      const asistenteDTO = new AsistenteDTO(
        record.id_asistente.id_asistente,
        record.id_asistente.id_usuario,
        record.id_asistente.descripcion
      );
      return new AsistenteConferenciaDTO(
        record.id_asistente_conferencia,
        conferenciaDTO,
        asistenteDTO
      );
    });
    return new ResponseDTO(
      "AC-000",
      200,
      recordsDTO,
      "AsistenteConferencia Records Obtained."
    );
  } catch (error) {
    return new ResponseDTO("AC-101", 500, null, `Error: ${error}`);
  }
};

const getAsistenteConferenciaById = async (id) => {
  console.log(`Getting AsistenteConferencia with ID: ${id}...`);
  try {
    const record = await AsistenteConferenciaENT.findByPk(id, {
      include: [
        { model: ConferenciaENT, as: "conferencia" },
        { model: AsistenteENT, as: "asistente" },
      ],
    });
    if (!record)
      return new ResponseDTO("AC-102", 404, null, "Record Not Found.");
    const conferenciaDTO = ConferenciaDTO(
      record.id_conferencia.id_conferencia,
      record.id_conferencia.titulo,
      record.id_conferencia.descripcion,
      record.id_conferencia.id_marca_conferencia,
      record.id_conferencia.id_orador,
      record.id_conferencia.id_tipo_conferencia,
      record.id_conferencia.votos_a_favor,
      record.id_conferencia.votos_en_contra,
      record.id_conferencia.fecha,
      record.id_conferencia.hora_empieza,
      record.id_conferencia.hora_termina,
      record.id_conferencia.sala,
      record.id_conferencia.evaluacion,
      record.id_conferencia.material
    );
    const asistenteDTO = new AsistenteDTO(
      record.id_asistente.id_asistente,
      record.id_asistente.id_usuario,
      record.id_asistente.descripcion
    );
    const recordDTO = new AsistenteConferenciaDTO(
      record.id_asistente_conferencia,
      conferenciaDTO,
      asistenteDTO
    );
    return new ResponseDTO("AC-000", 200, recordDTO, "Record Obtained.");
  } catch (error) {
    return new ResponseDTO("AC-102", 500, null, `Error: ${error}`);
  }
};

const createAsistenteConferencia = async (data) => {
  console.log("Creating AsistenteConferencia...");
  try {
    const newRecord = await AsistenteConferenciaENT.create({
      id_conferencia: data.id_conferencia.id_conferencia,
      id_asistente: data.id_asistente.id_asistente,
    });
    const conferenciaDTO = ConferenciaDTO(
      data.id_conferencia.id_conferencia,
      data.id_conferencia.titulo,
      data.id_conferencia.descripcion,
      data.id_conferencia.id_marca_conferencia,
      data.id_conferencia.id_orador,
      data.id_conferencia.id_tipo_conferencia,
      data.id_conferencia.votos_a_favor,
      data.id_conferencia.votos_en_contra,
      data.id_conferencia.fecha,
      data.id_conferencia.hora_empieza,
      data.id_conferencia.hora_termina,
      data.id_conferencia.sala,
      data.id_conferencia.evaluacion,
      data.id_conferencia.material
    );
    const asistenteDTO = new AsistenteDTO(
      data.id_asistente.id_asistente,
      data.id_asistente.id_usuario,
      data.id_asistente.descripcion
    );
    const recordDTO = new AsistenteConferenciaDTO(
      newRecord.id_asistente_conferencia,
      conferenciaDTO,
      asistenteDTO
    );
    return new ResponseDTO("AC-000", 201, recordDTO, "Record Created.");
  } catch (error) {
    return new ResponseDTO("AC-103", 500, null, `Error: ${error}`);
  }
};

const updateAsistenteConferencia = async (id, data) => {
  console.log(`Updating AsistenteConferencia ID: ${id}...`);
  try {
    const record = await AsistenteConferenciaENT.findByPk(id, {
      include: [
        { model: ConferenciaENT, as: "conferencia" },
        { model: AsistenteENT, as: "asistente" },
      ],
    });
    if (!record)
      return new ResponseDTO("AC-104", 404, null, "Record Not Found.");
    await record.update({
      id_conferencia: data.id_conferencia.id_conferencia,
      id_asistente: data.id_asistente.id_asistente,
    });
    const conferenciaDTO = ConferenciaDTO(
      record.id_conferencia.id_conferencia,
      record.id_conferencia.titulo,
      record.id_conferencia.descripcion,
      record.id_conferencia.id_marca_conferencia,
      record.id_conferencia.id_orador,
      record.id_conferencia.id_tipo_conferencia,
      record.id_conferencia.votos_a_favor,
      record.id_conferencia.votos_en_contra,
      record.id_conferencia.fecha,
      record.id_conferencia.hora_empieza,
      record.id_conferencia.hora_termina,
      record.id_conferencia.sala,
      record.id_conferencia.evaluacion,
      record.id_conferencia.material
    );
    const asistenteDTO = new AsistenteDTO(
      record.id_asistente.id_asistente,
      record.id_asistente.id_usuario,
      record.id_asistente.descripcion
    );
    const updatedDTO = new AsistenteConferenciaDTO(
      record.id_asistente_conferencia,
      conferenciaDTO,
      asistenteDTO
    );
    return new ResponseDTO("AC-000", 200, updatedDTO, "Record Updated.");
  } catch (error) {
    return new ResponseDTO("AC-104", 500, null, `Error: ${error}`);
  }
};

const deleteAsistenteConferencia = async (id) => {
  console.log(`Deleting AsistenteConferencia ID: ${id}...`);
  try {
    const record = await AsistenteConferenciaENT.findByPk(id);
    if (!record)
      return new ResponseDTO("AC-105", 404, null, "Record Not Found.");
    await record.destroy();
    return new ResponseDTO("AC-000", 200, null, "Record Deleted.");
  } catch (error) {
    return new ResponseDTO("AC-105", 500, null, `Error: ${error}`);
  }
};

module.exports = {
  getAllAsistenteConferencia,
  getAsistenteConferenciaById,
  createAsistenteConferencia,
  updateAsistenteConferencia,
  deleteAsistenteConferencia,
};
