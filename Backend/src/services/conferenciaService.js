const ResponseDTO = require("../DTO/ResponseDTO");
const ConferenciaDTO = require("../DTO/ConferenciaDTO");
const ConferenciaENT = require("../ENT/ConferenciaENT");
const MarcaConferenciaDTO = require("../DTO/MarcaConferenciaDTO");
const MarcaConferenciaENT = require("../ENT/MarcaConferenciaENT");
const OradorDTO = require("../DTO/OradorDTO");
const OradorENT = require("../ENT/OradorENT");
const TipoConferenciaDTO = require("../DTO/TipoConferenciaDTO");
const TipoConferenciaENT = require("../ENT/TipoConferenciaENT");

const nodemailer = require("nodemailer");
const twilio = require("twilio");
const { io } = require("../app");

// Configuración de Nodemailer
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false, // true para 465, false para otros puertos
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Configuración de Twilio
const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

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
        conf.marca_conferencia.id_marca_conferencia,
        conf.marca_conferencia.marca_conferencia
      );
      const oradorDTO = new OradorDTO(
        conf.orador.id_orador,
        conf.orador.id_usuario,
        conf.orador.descripcion,
        conf.orador.experiencia,
        conf.orador.contacto
      );
      const tipoConferenciaDTO = new TipoConferenciaDTO(
        conf.tipo_conferencia.id_tipo_conferencia,
        conf.tipo_conferencia.tipo_conferencia
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
      conferencia.marca_conferencia.id_marca_conferencia,
      conferencia.marca_conferencia.marca_conferencia
    );
    const oradorDTO = new OradorDTO(
      conferencia.orador.id_orador,
      conferencia.orador.id_usuario,
      conferencia.orador.descripcion,
      conferencia.orador.experiencia,
      conferencia.orador.contacto
    );
    const tipoConferenciaDTO = new TipoConferenciaDTO(
      conferencia.tipo_conferencia.id_tipo_conferencia,
      conferencia.tipo_conferencia.tipo_conferencia
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
        conferenciaData.marca_conferencia.id_marca_conferencia,
      id_orador: conferenciaData.orador.id_orador,
      id_tipo_conferencia: conferenciaData.tipo_conferencia.id_tipo_conferencia,
      votos_a_favor: 0,
      votos_en_contra: 0,
      fecha: conferenciaData.fecha,
      hora_empieza: conferenciaData.hora_empieza,
      hora_termina: conferenciaData.hora_termina,
      sala: conferenciaData.sala,
      evaluacion: conferenciaData.evaluacion,
      material: conferenciaData.material,
    });

    const brandConferenceID =
      newConferencia.marca_conferencia.id_marca_conferencia;
    const brandConferenceValues = await MarcaConferenciaENT.findByPk(
      brandConferenceID
    );
    const marcaConferenciaDTO = new MarcaConferenciaDTO(
      brandConferenceID,
      brandConferenceValues.marca_conferencia
    );

    const oradorID = newConferencia.orador.id_orador;
    const oradorValues = await OradorENT.findByPk(oradorID);
    const oradorDTO = new OradorDTO(
      oradorID,
      oradorValues.id_usuario,
      oradorValues.descripcion,
      oradorValues.experiencia,
      oradorValues.contacto
    );

    const typeConferenceID =
      newConferencia.tipo_conferencia.id_tipo_conferencia;
    const typeConferenceValues = await TipoConferenciaENT.findByPk(
      typeConferenceID
    );
    const tipoConferenciaDTO = new TipoConferenciaDTO(
      typeConferenceID,
      typeConferenceValues.tipo_conferencia
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

// Obtener asistentes inscritos
const getAsistentesInscritos = async (conferenciaId) => {
  const AsistenteConferenciaENT = require("../ENT/AsistenteConferenciaENT");
  const UsuarioENT = require("../ENT/UsuarioENT");
  const asistentes = await AsistenteConferenciaENT.findAll({
    where: { id_conferencia: conferenciaId },
    include: [
      { model: UsuarioENT, attributes: ["correo_electronico", "telefono"] },
    ],
  });
  return asistentes.map((ac) => ac.usuario);
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
      titulo: conferenciaData.titulo || conferencia.titulo,
      descripcion: conferenciaData.descripcion || conferencia.descripcion,
      id_marca_conferencia:
        conferenciaData.marca_conferencia.id_marca_conferencia ||
        conferencia.marca_conferencia.id_marca_conferencia,
      id_orador:
        conferenciaData.orador.id_orador || conferencia.orador.id_orador,
      id_tipo_conferencia:
        conferenciaData.tipo_conferencia.id_tipo_conferencia ||
        conferencia.tipo_conferencia.id_tipo_conferencia,
      fecha: conferenciaData.fecha || conferencia.fecha,
      hora_empieza: conferenciaData.hora_empieza || conferencia.hora_empieza,
      hora_termina: conferenciaData.hora_termina || conferencia.hora_termina,
      sala: conferenciaData.sala || conferencia.sala,
      evaluacion: conferenciaData.evaluacion || conferencia.evaluacion,
      material: conferenciaData.material || conferencia.material,
    });

    const brandConferenceID =
      conferencia.marca_conferencia.id_marca_conferencia;
    const brandConferenceValues = await MarcaConferenciaENT.findByPk(
      brandConferenceID
    );
    const marcaConferenciaDTO = new MarcaConferenciaDTO(
      brandConferenceID,
      brandConferenceValues.marca_conferencia
    );

    const oradorID = conferencia.orador.id_orador;
    const oradorValues = await OradorENT.findByPk(oradorID);
    const oradorDTO = new OradorDTO(
      oradorID,
      oradorValues.id_usuario,
      oradorValues.descripcion,
      oradorValues.experiencia,
      oradorValues.contacto
    );

    const typeConferenceID = conferencia.tipo_conferencia.id_tipo_conferencia;
    const typeConferenceValues = await TipoConferenciaENT.findByPk(
      typeConferenceID
    );
    const tipoConferenciaDTO = new TipoConferenciaDTO(
      typeConferenceID,
      typeConferenceValues.tipo_conferencia
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

    // Detectar cambios para la notificación
    const changes = [];
    if (conferenciaData.fecha && conferenciaData.fecha !== conferencia.fecha)
      changes.push(`Fecha cambiada a ${conferenciaData.fecha}`);
    if (
      conferenciaData.hora_empieza &&
      conferenciaData.hora_empieza !== conferencia.hora_empieza
    )
      changes.push(`Hora inicio cambiada a ${conferenciaData.hora_empieza}`);
    if (
      conferenciaData.hora_termina &&
      conferenciaData.hora_termina !== conferencia.hora_termina
    )
      changes.push(`Hora fin cambiada a ${conferenciaData.hora_termina}`);
    if (conferenciaData.sala && conferenciaData.sala !== conferencia.sala)
      changes.push(`Sala cambiada a ${conferenciaData.sala}`);

    if (changes.length > 0) {
      const message = `Conferencia "${
        conferencia.titulo
      }" actualizada: ${changes.join(". ")}.`;

      const asistentes = await getAsistentesInscritos(id);

      io.to(`conferencia_${id}`).emit("conferenceUpdated", {
        conferenceID: id,
        message: message,
        timestamp: new Date().toISOString(),
      });

      // Enviar correos electrónicos
      const emailPromises = asistentes.map((asistente) =>
        transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: asistente.correo_electronico,
          subject: "Actualización de Conferencia",
          text: message,
          html: `<p>${message}</p><p>Fecha: ${
            conferenciaData.fecha || conferencia.fecha
          }</p>`,
        })
      );
      await Promise.all(emailPromises);
      console.log(`Emails sent to ${asistentes.length} asistentes.`);

      // Enviar SMS
      const smsPromises = asistentes.map((asistente) =>
        twilioClient.messages.create({
          body: message,
          from: process.env.TWILIO_PHONE_NUMBER,
          to: asistente.telefono, // +1234567890
        })
      );
      await Promise.all(smsPromises);
      console.log(`SMS sent to ${asistentes.length} asistentes.`);
    }

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
