const ResponseDTO = require("../DTO/ResponseDTO");
const ConferenciaNotificacionDTO = require("../DTO/ConferenciaNotificacionDTO");
const ConferenciaNotificacionENT = require("../ENT/ConferenciaNotificacionENT");
const ConferenciaDTO = require("../DTO/ConferenciaDTO");
const ConferenciaENT = require("../ENT/ConferenciaENT");

const getAllConferenciaNotificacion = async () => {
  console.log("Getting All ConferenciaNotificacion...");
  try {
    const records = await ConferenciaNotificacionENT.findAll({
      include: [{ model: ConferenciaENT, as: "conferencia" }],
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
      return new ConferenciaNotificacionDTO(
        record.id_conferencia_notificacion,
        conferenciaDTO,
        record.notificacion
      );
    });
    return new ResponseDTO("CN-000", 200, recordsDTO, "Records Obtained.");
  } catch (error) {
    return new ResponseDTO("CN-101", 500, null, `Error: ${error}`);
  }
};

const getConferenciaNotificacionById = async (id) => {
  console.log(`Getting ConferenciaNotificacion with ID: ${id}...`);
  try {
    const record = await ConferenciaNotificacionENT.findByPk(id, {
      include: [{ model: ConferenciaENT, as: "conferencia" }],
    });
    if (!record)
      return new ResponseDTO("CN-102", 404, null, "Record Not Found.");
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
    const recordDTO = new ConferenciaNotificacionDTO(
      record.id_conferencia_notificacion,
      conferenciaDTO,
      record.notificacion
    );
    return new ResponseDTO("CN-000", 200, recordDTO, "Record Obtained.");
  } catch (error) {
    return new ResponseDTO("CN-102", 500, null, `Error: ${error}`);
  }
};

const createConferenciaNotificacion = async (data) => {
  console.log("Creating ConferenciaNotificacion...");
  try {
    const newRecord = await ConferenciaNotificacionENT.create({
      id_conferencia: data.conferencia.id_conferencia,
      notificacion: data.notificacion,
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

    const recordDTO = new ConferenciaNotificacionDTO(
      newRecord.id_conferencia_notificacion,
      conferenciaDTO,
      newRecord.notificacion
    );
    // Placeholder para notificación real-time
    return new ResponseDTO("CN-000", 201, recordDTO, "Record Created.");
  } catch (error) {
    return new ResponseDTO("CN-103", 500, null, `Error: ${error}`);
  }
};

const updateConferenciaNotificacion = async (id, data) => {
  console.log(`Updating ConferenciaNotificacion ID: ${id}...`);
  try {
    const record = await ConferenciaNotificacionENT.findByPk(id, {
      include: [{ model: ConferenciaENT, as: "conferencia" }],
    });
    if (!record)
      return new ResponseDTO("CN-104", 404, null, "Record Not Found.");
    await record.update({
      id_conferencia: data.conferencia.id_conferencia,
      notificacion: data.notificacion,
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

    const updatedDTO = new ConferenciaNotificacionDTO(
      record.id_conferencia_notificacion,
      conferenciaDTO,
      record.notificacion
    );
    return new ResponseDTO("CN-000", 200, updatedDTO, "Record Updated.");
  } catch (error) {
    return new ResponseDTO("CN-104", 500, null, `Error: ${error}`);
  }
};

const deleteConferenciaNotificacion = async (id) => {
  console.log(`Deleting ConferenciaNotificacion ID: ${id}...`);
  try {
    const record = await ConferenciaNotificacionENT.findByPk(id);
    if (!record)
      return new ResponseDTO("CN-105", 404, null, "Record Not Found.");
    await record.destroy();
    return new ResponseDTO("CN-000", 200, null, "Record Deleted.");
  } catch (error) {
    return new ResponseDTO("CN-105", 500, null, `Error: ${error}`);
  }
};

module.exports = {
  getAllConferenciaNotificacion,
  getConferenciaNotificacionById,
  createConferenciaNotificacion,
  updateConferenciaNotificacion,
  deleteConferenciaNotificacion,
};
