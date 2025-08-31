const ResponseDTO = require("../DTO/ResponseDTO");
const ConferenciaDTO = require("../DTO/ConferenciaDTO");
const ConferenciaENT = require("../ENT/ConferenciaENT");
const MarcaConferenciaDTO = require("../DTO/MarcaConferenciaDTO");
const MarcaConferenciaENT = require("../ENT/MarcaConferenciaENT");
const OradorDTO = require("../DTO/OradorDTO");
const OradorENT = require("../ENT/OradorENT");
const TipoConferenciaDTO = require("../DTO/TipoConferenciaDTO");
const TipoConferenciaENT = require("../ENT/TipoConferenciaENT");

const getAllConferencias = async () => {
  console.log("Getting All Conferencias...");
  try {
    const conferencias = await ConferenciaENT.findAll({
      include: [
        { model: MarcaConferenciaENT, as: "marca_conferencia" },
        { model: OradorENT, as: "orador" },
        { model: TipoConferenciaENT, as: "tipo_conferencia" },
      ],
    });
    const conferenciasDTO = conferencias.map((conf) => {
      const marcaConferenciaDTO = new MarcaConferenciaDTO(
        conf.id_marca_conferencia.id_marca_conferencia,
        conf.id_marca_conferencia.marca_conferencia
      );
      const oradorDTO = new OradorDTO(
        conf.id_orador.id_orador,
        conf.id_orador.id_usuario,
        conf.id_orador.descripcion,
        conf.id_orador.experiencia,
        conf.id_orador.contacto
      );
      const tipoConferenciaDTO = TipoConferenciaDTO(
        conf.id_tipo_conferencia.id_tipo_conferencia,
        conf.id_tipo_conferencia.tipo_conferencia
      );
      return new ConferenciaDTO(
        conf.id_conferencia,
        conf.titulo,
        conf.descripcion,
        marcaConferenciaDTO,
        oradorDTO,
        tipoConferenciaDTO,
        conf.votos_a_favor,
        conf.votos_en_contra,
        conf.fecha,
        conf.hora_empieza,
        conf.hora_termina,
        conf.sala,
        conf.evaluacion,
        conf.material
      );
    });
    return new ResponseDTO(
      "C-000",
      200,
      conferenciasDTO,
      "Conferencias Successfully Obtained."
    );
  } catch (error) {
    return new ResponseDTO(
      "C-101",
      500,
      null,
      `Error Getting All Conferencias: ${error}`
    );
  }
};

const getConferenciaById = async (id) => {
  console.log(`Getting Conferencia with ID: ${id}...`);
  try {
    const conferencia = await ConferenciaENT.findByPk(id, {
      include: [
        { model: MarcaConferenciaENT, as: "marca_conferencia" },
        { model: OradorENT, as: "orador" },
        { model: TipoConferenciaENT, as: "tipo_conferencia" },
      ],
    });
    if (!conferencia)
      return new ResponseDTO(
        "C-102",
        404,
        null,
        `Conferencia with ID ${id} Not Found.`
      );
    const marcaConferenciaDTO = new MarcaConferenciaDTO(
      conferencia.id_marca_conferencia.id_marca_conferencia,
      conferencia.id_marca_conferencia.marca_conferencia
    );
    const oradorDTO = new OradorDTO(
      conferencia.id_orador.id_orador,
      conferencia.id_orador.id_usuario,
      conferencia.id_orador.descripcion,
      conferencia.id_orador.experiencia,
      conferencia.id_orador.contacto
    );
    const tipoConferenciaDTO = TipoConferenciaDTO(
      conferencia.id_tipo_conferencia.id_tipo_conferencia,
      conferencia.id_tipo_conferencia.tipo_conferencia
    );
    const conferenciaDTO = new ConferenciaDTO(
      conferencia.id_conferencia,
      conferencia.titulo,
      conferencia.descripcion,
      marcaConferenciaDTO,
      oradorDTO,
      tipoConferenciaDTO,
      conferencia.votos_a_favor,
      conferencia.votos_en_contra,
      conferencia.fecha,
      conferencia.hora_empieza,
      conferencia.hora_termina,
      conferencia.sala,
      conferencia.evaluacion,
      conferencia.material
    );
    return new ResponseDTO(
      "C-000",
      200,
      conferenciaDTO,
      "Conferencia Successfully Obtained."
    );
  } catch (error) {
    return new ResponseDTO(
      "C-102",
      500,
      null,
      `Error Getting Conferencia: ${error}`
    );
  }
};

const createConferencia = async (conferenciaData) => {
  console.log("Creating Conferencia...");
  try {
    const newConferencia = await ConferenciaENT.create({
      titulo: conferenciaData.titulo,
      descripcion: conferenciaData.descripcion,
      id_marca_conferencia:
        conferenciaData.id_marca_conferencia.id_marca_conferencia,
      id_orador: conferenciaData.id_orador.id_orador,
      id_tipo_conferencia:
        conferenciaData.id_tipo_conferencia.id_tipo_conferencia,
      votos_a_favor: 0,
      votos_en_contra: 0,
      fecha: conferenciaData.fecha,
      hora_empieza: conferenciaData.hora_empieza,
      hora_termina: conferenciaData.hora_termina,
      sala: conferenciaData.sala,
      evaluacion: conferenciaData.evaluacion,
      material: conferenciaData.material,
    });
    const marcaConferenciaDTO = new MarcaConferenciaDTO(
      conferenciaData.id_marca_conferencia.id_marca_conferencia,
      conferenciaData.id_marca_conferencia.marca_conferencia
    );
    const oradorDTO = new OradorDTO(
      conferenciaData.id_orador.id_orador,
      conferenciaData.id_orador.id_usuario,
      conferenciaData.id_orador.descripcion,
      conferenciaData.id_orador.experiencia,
      conferenciaData.id_orador.contacto
    );
    const tipoConferenciaDTO = TipoConferenciaDTO(
      conferenciaData.id_tipo_conferencia.id_tipo_conferencia,
      conferenciaData.id_tipo_conferencia.tipo_conferencia
    );
    const conferenciaDTO = new ConferenciaDTO(
      newConferencia.id_conferencia,
      newConferencia.titulo,
      newConferencia.descripcion,
      marcaConferenciaDTO,
      oradorDTO,
      tipoConferenciaDTO,
      newConferencia.votos_a_favor,
      newConferencia.votos_en_contra,
      newConferencia.fecha,
      newConferencia.hora_empieza,
      newConferencia.hora_termina,
      newConferencia.sala,
      newConferencia.evaluacion,
      newConferencia.material
    );
    return new ResponseDTO(
      "C-000",
      201,
      conferenciaDTO,
      "Conferencia Created Successfully."
    );
  } catch (error) {
    return new ResponseDTO(
      "C-103",
      500,
      null,
      `Error Creating Conferencia: ${error}`
    );
  }
};

const updateConferencia = async (id, conferenciaData) => {
  console.log(`Updating Conferencia ID: ${id}...`);
  try {
    const conferencia = await ConferenciaENT.findByPk(id, {
      include: [
        { model: MarcaConferenciaENT, as: "marca_conferencia" },
        { model: OradorENT, as: "orador" },
        { model: TipoConferenciaENT, as: "tipo_conferencia" },
      ],
    });
    if (!conferencia)
      return new ResponseDTO("C-104", 404, null, "Conferencia Not Found.");
    await conferencia.update({
      titulo: conferenciaData.titulo,
      descripcion: conferenciaData.descripcion,
      id_marca_conferencia:
        conferenciaData.id_marca_conferencia.id_marca_conferencia,
      id_orador: conferenciaData.id_orador.id_orador,
      id_tipo_conferencia:
        conferenciaData.id_tipo_conferencia.id_tipo_conferencia,
      fecha: conferenciaData.fecha,
      hora_empieza: conferenciaData.hora_empieza,
      hora_termina: conferenciaData.hora_termina,
      sala: conferenciaData.sala,
      evaluacion: conferenciaData.evaluacion,
      material: conferenciaData.material,
    });
    const marcaConferenciaDTO = new MarcaConferenciaDTO(
      conferencia.id_marca_conferencia.id_marca_conferencia,
      conferencia.id_marca_conferencia.marca_conferencia
    );
    const oradorDTO = new OradorDTO(
      conferencia.id_orador.id_orador,
      conferencia.id_orador.id_usuario,
      conferencia.id_orador.descripcion,
      conferencia.id_orador.experiencia,
      conferencia.id_orador.contacto
    );
    const tipoConferenciaDTO = TipoConferenciaDTO(
      conferencia.id_tipo_conferencia.id_tipo_conferencia,
      conferencia.id_tipo_conferencia.tipo_conferencia
    );
    const updatedDTO = new ConferenciaDTO(
      conferencia.id_conferencia,
      conferencia.titulo,
      conferencia.descripcion,
      marcaConferenciaDTO,
      oradorDTO,
      tipoConferenciaDTO,
      conferencia.votos_a_favor,
      conferencia.votos_en_contra,
      conferencia.fecha,
      conferencia.hora_empieza,
      conferencia.hora_termina,
      conferencia.sala,
      conferencia.evaluacion,
      conferencia.material
    );
    // Placeholder para notificación real-time
    return new ResponseDTO(
      "C-000",
      200,
      updatedDTO,
      "Conferencia Updated Successfully."
    );
  } catch (error) {
    return new ResponseDTO(
      "C-104",
      500,
      null,
      `Error Updating Conferencia: ${error}`
    );
  }
};

const deleteConferencia = async (id) => {
  console.log(`Deleting Conferencia ID: ${id}...`);
  try {
    const conferencia = await ConferenciaENT.findByPk(id);
    if (!conferencia)
      return new ResponseDTO("C-105", 404, null, "Conferencia Not Found.");
    await conferencia.destroy();
    return new ResponseDTO(
      "C-000",
      200,
      null,
      "Conferencia Deleted Successfully."
    );
  } catch (error) {
    return new ResponseDTO(
      "C-105",
      500,
      null,
      `Error Deleting Conferencia: ${error}`
    );
  }
};

const updateVotos = async (id, votoPositivo) => {
  console.log(`Updating Votos for Conferencia ID: ${id}...`);
  try {
    const conferencia = await ConferenciaENT.findByPk(id);
    if (!conferencia)
      return new ResponseDTO("C-106", 404, null, "Conferencia Not Found.");
    if (votoPositivo) conferencia.votos_a_favor += 1;
    else conferencia.votos_en_contra += 1;
    await conferencia.save();
    // Placeholder para notificación real-time
    return new ResponseDTO("C-000", 200, null, "Votos Updated Successfully.");
  } catch (error) {
    return new ResponseDTO(
      "C-106",
      500,
      null,
      `Error Updating Votos: ${error}`
    );
  }
};

module.exports = {
  getAllConferencias,
  getConferenciaById,
  createConferencia,
  updateConferencia,
  deleteConferencia,
  updateVotos,
};
