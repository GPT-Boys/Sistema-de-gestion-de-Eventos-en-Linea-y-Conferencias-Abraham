const ResponseDTO = require("../DTO/ResponseDTO");
const NotificacionAsistenteDTO = require("../DTO/NotificacionAsistenteDTO");
const NotificacionAsistenteENT = require("../ENT/NotificacionAsistenteENT");
const ConferenciaNotificacionDTO = require("../DTO/ConferenciaNotificacionDTO");
const ConferenciaNotificacionENT = require("../ENT/ConferenciaNotificacionENT");
const AsistenteDTO = require("../DTO/AsistenteDTO");
const AsistenteENT = require("../ENT/AsistenteENT");

const getAllNotificacionAsistente = async () => {
  console.log("Getting All NotificacionAsistente...");
  try {
    const records = await NotificacionAsistenteENT.findAll({
      include: [
        { model: ConferenciaNotificacionENT, as: "conferencia_notificacion" },
        { model: AsistenteENT, as: "asistente" },
      ],
    });
    const recordsDTO = records.map((record) => {
      const conferenciaNotificacionDTO = new ConferenciaNotificacionDTO(
        record.conferencia_notificacion.id_conferencia_notificacion,
        record.conferencia_notificacion.id_conferencia,
        record.conferencia_notificacion.notificacion
      );
      const asistenteDTO = new AsistenteDTO(
        record.asistente.id_asistente,
        record.asistente.id_usuario,
        record.asistente.descripcion
      );
      return new NotificacionAsistenteDTO(
        record.id_notificacion_asistente,
        conferenciaNotificacionDTO,
        asistenteDTO
      );
    });
    return new ResponseDTO("NA-000", 200, recordsDTO, "Records Obtained.");
  } catch (error) {
    return new ResponseDTO("NA-101", 500, null, `Error: ${error}`);
  }
};

const getNotificacionAsistenteById = async (id) => {
  console.log(`Getting NotificacionAsistente with ID: ${id}...`);
  try {
    const record = await NotificacionAsistenteENT.findByPk(id, {
      include: [
        { model: ConferenciaNotificacionENT, as: "conferencia_notificacion" },
        { model: AsistenteENT, as: "asistente" },
      ],
    });
    if (!record)
      return new ResponseDTO("NA-102", 404, null, "Record Not Found.");
    const conferenciaNotificacionDTO = new ConferenciaNotificacionDTO(
      record.conferencia_notificacion.id_conferencia_notificacion,
      record.conferencia_notificacion.id_conferencia,
      record.conferencia_notificacion.notificacion
    );
    const asistenteDTO = new AsistenteDTO(
      record.asistente.id_asistente,
      record.asistente.id_usuario,
      record.asistente.descripcion
    );
    const recordDTO = new NotificacionAsistenteDTO(
      record.id_notificacion_asistente,
      conferenciaNotificacionDTO,
      asistenteDTO
    );
    return new ResponseDTO("NA-000", 200, recordDTO, "Record Obtained.");
  } catch (error) {
    return new ResponseDTO("NA-102", 500, null, `Error: ${error}`);
  }
};

const createNotificacionAsistente = async (data) => {
  console.log("Creating NotificacionAsistente...");
  try {
    const newRecord = await NotificacionAsistenteENT.create({
      id_conferencia_notificacion:
        data.conferencia_notificacion.id_conferencia_notificacion,
      id_asistente: data.asistente.id_asistente,
    });

    const conferenceNotificationID =
      newRecord.conferencia_notificacion.id_conferencia_notificacion;
    const conferenceNotificationValues =
      await ConferenciaNotificacionENT.findByPk(conferenceNotificationID);
    const conferenciaNotificacionDTO = new ConferenciaNotificacionDTO(
      conferenceNotificationID,
      conferenceNotificationValues.id_conferencia,
      conferenceNotificationValues.notificacion
    );

    const assistantID = newRecord.asistente.id_asistente;
    const assistantValues = await AsistenteENT.findByPk(assistantID);
    const asistenteDTO = new AsistenteDTO(
      assistantID,
      assistantValues.id_usuario,
      assistantValues.descripcion
    );

    const recordDTO = new NotificacionAsistenteDTO(
      newRecord.id_notificacion_asistente,
      conferenciaNotificacionDTO,
      asistenteDTO
    );
    // Placeholder para notificación real-time
    return new ResponseDTO("NA-000", 201, recordDTO, "Record Created.");
  } catch (error) {
    return new ResponseDTO("NA-103", 500, null, `Error: ${error}`);
  }
};

const updateNotificacionAsistente = async (id, data) => {
  console.log(`Updating NotificacionAsistente ID: ${id}...`);
  try {
    const record = await NotificacionAsistenteENT.findByPk(id, {
      include: [
        { model: ConferenciaNotificacionENT, as: "conferencia_notificacion" },
        { model: AsistenteENT, as: "asistente" },
      ],
    });
    if (!record)
      return new ResponseDTO("NA-104", 404, null, "Record Not Found.");
    await record.update({
      id_conferencia_notificacion:
        data.conferencia_notificacion.id_conferencia_notificacion,
      id_asistente: data.asistente.id_asistente,
    });

    const conferenceNotificationID =
      record.conferencia_notificacion.id_conferencia_notificacion;
    const conferenceNotificationValues =
      await ConferenciaNotificacionENT.findByPk(conferenceNotificationID);
    const conferenciaNotificacionDTO = new ConferenciaNotificacionDTO(
      conferenceNotificationID,
      conferenceNotificationValues.id_conferencia,
      conferenceNotificationValues.notificacion
    );

    const assistantID = record.asistente.id_asistente;
    const assistantValues = await AsistenteENT.findByPk(assistantID);
    const asistenteDTO = new AsistenteDTO(
      assistantID,
      assistantValues.id_usuario,
      assistantValues.descripcion
    );

    const updatedDTO = new NotificacionAsistenteDTO(
      record.id_notificacion_asistente,
      conferenciaNotificacionDTO,
      asistenteDTO
    );
    return new ResponseDTO("NA-000", 200, updatedDTO, "Record Updated.");
  } catch (error) {
    return new ResponseDTO("NA-104", 500, null, `Error: ${error}`);
  }
};

const deleteNotificacionAsistente = async (id) => {
  console.log(`Deleting NotificacionAsistente ID: ${id}...`);
  try {
    const record = await NotificacionAsistenteENT.findByPk(id);
    if (!record)
      return new ResponseDTO("NA-105", 404, null, "Record Not Found.");
    await record.destroy();
    return new ResponseDTO("NA-000", 200, null, "Record Deleted.");
  } catch (error) {
    return new ResponseDTO("NA-105", 500, null, `Error: ${error}`);
  }
};

module.exports = {
  getAllNotificacionAsistente,
  getNotificacionAsistenteById,
  createNotificacionAsistente,
  updateNotificacionAsistente,
  deleteNotificacionAsistente,
};
