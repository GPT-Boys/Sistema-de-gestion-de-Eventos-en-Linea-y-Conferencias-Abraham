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
      const conferenciaDTO = new ConferenciaDTO(
        record.conferencia.id_conferencia,
        record.conferencia.titulo,
        record.conferencia.descripcion,
        record.conferencia.id_marca_conferencia,
        record.conferencia.id_orador,
        record.conferencia.id_tipo_conferencia,
        record.conferencia.votos_a_favor,
        record.conferencia.votos_en_contra,
        record.conferencia.fecha,
        record.conferencia.hora_empieza,
        record.conferencia.hora_termina,
        record.conferencia.sala,
        record.conferencia.evaluacion,
        record.conferencia.material
      );
      const asistenteDTO = new AsistenteDTO(
        record.asistente.id_asistente,
        record.asistente.id_usuario,
        record.asistente.descripcion
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
    const conferenciaDTO = new ConferenciaDTO(
      record.conferencia.id_conferencia,
      record.conferencia.titulo,
      record.conferencia.descripcion,
      record.conferencia.id_marca_conferencia,
      record.conferencia.id_orador,
      record.conferencia.id_tipo_conferencia,
      record.conferencia.votos_a_favor,
      record.conferencia.votos_en_contra,
      record.conferencia.fecha,
      record.conferencia.hora_empieza,
      record.conferencia.hora_termina,
      record.conferencia.sala,
      record.conferencia.evaluacion,
      record.conferencia.material
    );
    const asistenteDTO = new AsistenteDTO(
      record.asistente.id_asistente,
      record.asistente.id_usuario,
      record.asistente.descripcion
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
      id_conferencia: data.conferencia.id_conferencia,
      id_asistente: data.asistente.id_asistente,
    });

    const conferenceID = newRecord.id_conferencia;
    const conferenceValues = await ConferenciaENT.findByPk(conferenceID);
    const conferenciaDTO = new ConferenciaDTO(
      conferenceID,
      conferenceValues.titulo,
      conferenceValues.descripcion,
      conferenceValues.id_marca_conferencia,
      conferenceValues.id_orador,
      conferenceValues.id_tipo_conferencia,
      conferenceValues.votos_a_favor,
      conferenceValues.votos_en_contra,
      conferenceValues.fecha,
      conferenceValues.hora_empieza,
      conferenceValues.hora_termina,
      conferenceValues.sala,
      conferenceValues.evaluacion,
      conferenceValues.material
    );

    const assistantID = newRecord.id_asistente;
    const assistantValues = await AsistenteENT.findByPk(assistantID);
    const asistenteDTO = new AsistenteDTO(
      assistantID,
      assistantValues.id_usuario,
      assistantValues.descripcion
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
      id_conferencia: data.conferencia.id_conferencia,
      id_asistente: data.asistente.id_asistente,
    });

    const conferenceID = record.id_conferencia;
    const conferenceValues = await ConferenciaENT.findByPk(conferenceID);
    const conferenciaDTO = new ConferenciaDTO(
      conferenceID,
      conferenceValues.titulo,
      conferenceValues.descripcion,
      conferenceValues.id_marca_conferencia,
      conferenceValues.id_orador,
      conferenceValues.id_tipo_conferencia,
      conferenceValues.votos_a_favor,
      conferenceValues.votos_en_contra,
      conferenceValues.fecha,
      conferenceValues.hora_empieza,
      conferenceValues.hora_termina,
      conferenceValues.sala,
      conferenceValues.evaluacion,
      conferenceValues.material
    );

    const assistantID = record.id_asistente;
    const assistantValues = await AsistenteENT.findByPk(assistantID);
    const asistenteDTO = new AsistenteDTO(
      assistantID,
      assistantValues.id_usuario,
      assistantValues.descripcion
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

const getConferenciasByAsistente = async (asistenteId) => {
  console.log(`Getting Conferencias for Asistente ID: ${asistenteId}...`);
  try {
    const inscripciones = await AsistenteConferenciaENT.findAll({
      where: { id_asistente: asistenteId },
      include: [{ model: ConferenciaENT, as: "conferencia" }],
    });
    const conferenciasDTO = inscripciones.map(
      (inscripcion) =>
        new ConferenciaDTO(
          inscripcion.conferencia.id_conferencia,
          inscripcion.conferencia.titulo,
          inscripcion.conferencia.descripcion,
          inscripcion.conferencia.id_marca_conferencia,
          inscripcion.conferencia.id_orador,
          inscripcion.conferencia.id_tipo_conferencia,
          inscripcion.conferencia.votos_a_favor,
          inscripcion.conferencia.votos_en_contra,
          inscripcion.conferencia.fecha,
          inscripcion.conferencia.hora_empieza,
          inscripcion.conferencia.hora_termina,
          inscripcion.conferencia.sala,
          inscripcion.conferencia.evaluacion,
          inscripcion.conferencia.material
        )
    );
    return new ResponseDTO(
      "AC-000",
      200,
      conferenciasDTO,
      "Conferencias Obtained."
    );
  } catch (error) {
    return new ResponseDTO("AC-106", 500, null, `Error: ${error}`);
  }
};

const getAsistentesByConferencia = async (conferenciaId) => {
  console.log(`Getting Asistentes for Conferencia ID: ${conferenciaId}...`);
  try {
    const inscripciones = await AsistenteConferenciaENT.findAll({
      where: { id_conferencia: conferenciaId },
      include: [{ model: AsistenteENT, as: "asistente" }],
    });
    const asistentesDTO = inscripciones.map(
      (inscripcion) =>
        new AsistenteDTO(
          inscripcion.asistente.id_asistente,
          inscripcion.asistente.id_usuario,
          inscripcion.asistente.descripcion
        )
    );
    return new ResponseDTO(
      "AC-000",
      200,
      asistentesDTO,
      "Asistentes Obtained."
    );
  } catch (error) {
    return new ResponseDTO("AC-107", 500, null, `Error: ${error}`);
  }
};

module.exports = {
  getAllAsistenteConferencia,
  getAsistenteConferenciaById,
  createAsistenteConferencia,
  updateAsistenteConferencia,
  deleteAsistenteConferencia,
  getConferenciasByAsistente,
  getAsistentesByConferencia,
};
