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
      id_conferencia: data.id_conferencia.id_conferencia,
      notificacion: data.notificacion,
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
      id_conferencia: data.id_conferencia.id_conferencia,
      notificacion: data.notificacion,
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
