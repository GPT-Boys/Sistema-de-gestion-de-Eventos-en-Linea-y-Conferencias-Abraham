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
const dotenv = require("dotenv");
const { io } = require("../app");

dotenv.config();

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
      `Error Getting All Conferencias: ${error}.`
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
      `Error Getting Conferencia: ${error}.`
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

    const brandConferenceID = newConferencia.id_marca_conferencia;
    const brandConferenceValues = await MarcaConferenciaENT.findByPk(
      brandConferenceID
    );
    const marcaConferenciaDTO = new MarcaConferenciaDTO(
      brandConferenceID,
      brandConferenceValues.marca_conferencia
    );

    const oradorID = newConferencia.id_orador;
    const oradorValues = await OradorENT.findByPk(oradorID);
    const oradorDTO = new OradorDTO(
      oradorID,
      oradorValues.id_usuario,
      oradorValues.descripcion,
      oradorValues.experiencia,
      oradorValues.contacto
    );

    const typeConferenceID = newConferencia.id_tipo_conferencia;
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
      `Error Creating Conferencia: ${error}.`
    );
  }
};

// Obtener asistentes inscritos
const getAsistentesInscritos = async (conferenciaId) => {
  const AsistenteConferenciaDTO = require("../DTO/AsistenteConferenciaDTO");
  const AsistenteConferenciaENT = require("../ENT/AsistenteConferenciaENT");
  const UsuarioDTO = require("../DTO/UsuarioDTO");
  const UsuarioENT = require("../ENT/UsuarioENT");
  const AsistenteDTO = require("../DTO/AsistenteDTO");
  const AsistenteENT = require("../ENT/AsistenteENT");

  console.log(`Getting Asistentes for Conferencia ID: ${conferenciaId}...`);
  try {
    const asistentes = await AsistenteConferenciaENT.findAll({
      where: { id_conferencia: conferenciaId },
      include: [
        { model: UsuarioENT, as: "usuario" },
        { model: ConferenciaENT, as: "conferencia" },
        { model: AsistenteENT, as: "asistente" },
      ],
    });
    const asistentesInscritosDTO = await Promise.all(
      asistentes.map(async (record) => {
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

        const assistantID = record.id_asistente;
        const assistantValues = await AsistenteENT.findByPk(assistantID);

        const usuarioDTO = new UsuarioDTO(
          assistantValues.usuario.id_usuario,
          assistantValues.usuario.usuario,
          assistantValues.usuario.id_tipo_usuario,
          assistantValues.usuario.nombres,
          assistantValues.usuario.apellidos,
          assistantValues.usuario.fecha_nacimiento,
          assistantValues.usuario.id_ciudad,
          assistantValues.usuario.telefono,
          assistantValues.usuario.correo_electronico,
          assistantValues.usuario.fecha_creacion
        );

        const asistenteDTO = new AsistenteDTO(
          record.asistente.id_asistente,
          usuarioDTO,
          record.asistente.descripcion
        );

        return new AsistenteConferenciaDTO(
          record.id_asistente_conferencia,
          conferenciaDTO,
          asistenteDTO
        );
      })
    );
    console.log(
      `Assistants Successfully Obtained. Found ${asistentesInscritosDTO.length} Assistants.`
    );
    return new ResponseDTO(
      "C-000",
      200,
      asistentesInscritosDTO,
      `Assistants Successfully Obtained. Found ${asistentesInscritosDTO.length} Assistants.`
    );
  } catch (error) {
    console.error(
      `Error Getting Assistants for Conference ID: ${conferenciaId}: ${error}.`
    );
    return new ResponseDTO(
      "C-0101",
      500,
      null,
      `Error Getting Assistants for Conference ID: ${conferenciaId}: ${error}.`
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

    const brandConferenceID = conferencia.id_marca_conferencia;
    const brandConferenceValues = await MarcaConferenciaENT.findByPk(
      brandConferenceID
    );
    const marcaConferenciaDTO = new MarcaConferenciaDTO(
      brandConferenceID,
      brandConferenceValues.marca_conferencia
    );

    const oradorID = conferencia.id_orador;
    const oradorValues = await OradorENT.findByPk(oradorID);
    const oradorDTO = new OradorDTO(
      oradorID,
      oradorValues.id_usuario,
      oradorValues.descripcion,
      oradorValues.experiencia,
      oradorValues.contacto
    );

    const typeConferenceID = conferencia.id_tipo_conferencia;
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
      const emailPromises = asistentes.data.map((asistente) =>
        transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: asistente.id_asistente.id_usuario.correo_electronico,
          subject: "Actualización de Conferencia",
          text: message,
          html: `<p>${message}</p><p>Fecha: ${new Date().toISOString()}</p>`,
        })
      );
      await Promise.all(emailPromises);
      console.log(`Emails sent to ${asistentes.data.length} asistentes.`);

      // Enviar SMS
      const smsPromises = asistentes.data.map((asistente) =>
        twilioClient.messages.create({
          body: message,
          from: process.env.TWILIO_PHONE_NUMBER,
          to: asistente.id_asistente.id_usuario.telefono, // +1234567890
        })
      );
      await Promise.all(smsPromises);
      console.log(`SMS sent to ${asistentes.data.length} asistentes.`);
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
      `Error Updating Conferencia: ${error}.`
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
      `Error Deleting Conferencia: ${error}.`
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

const updateCharla = async (id, charlaData) => {
  console.log(`Updating Charla for Conferencia ID: ${id}...`);
  try {
    const conferencia = await ConferenciaENT.findByPk(id);
    if (!conferencia)
      return new ResponseDTO("C-107", 404, null, "Conferencia Not Found.");
    await conferencia.update({
      titulo: charlaData.titulo || conferencia.titulo,
      descripcion: charlaData.descripcion || conferencia.descripcion,
      hora_empieza: charlaData.hora_empieza || conferencia.hora_empieza,
      hora_termina: charlaData.hora_termina || conferencia.hora_termina,
      sala: charlaData.sala || conferencia.sala,
    });

    const conferenceID = conferencia.id_conferencia;
    const conferenceValues = await ConferenciaENT.findByPk(conferenceID);
    const updatedDTO = new ConferenciaDTO(
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

    return new ResponseDTO(
      "C-000",
      200,
      updatedDTO,
      "Charla Updated Successfully."
    );
  } catch (error) {
    return new ResponseDTO(
      "C-107",
      500,
      null,
      `Error Updating Charla: ${error}.`
    );
  }
};

const getVotos = async (id) => {
  console.log(`Getting Votos for Conferencia ID: ${id}...`);
  try {
    const conferencia = await ConferenciaENT.findByPk(id);
    if (!conferencia)
      return new ResponseDTO("C-108", 404, null, "Conferencia Not Found.");
    return new ResponseDTO(
      "C-000",
      200,
      {
        votos_a_favor: conferencia.votos_a_favor,
        votos_en_contra: conferencia.votos_en_contra,
      },
      "Votos Obtained."
    );
  } catch (error) {
    return new ResponseDTO(
      "C-108",
      500,
      null,
      `Error Getting Votos: ${error}.`
    );
  }
};

const addMaterial = async (id, material) => {
  console.log(`Adding Material for Conferencia ID: ${id}...`);
  try {
    const conferencia = await ConferenciaENT.findByPk(id);
    if (!conferencia)
      return new ResponseDTO("C-109", 404, null, "Conferencia Not Found.");
    conferencia.material = material;
    await conferencia.save();
    return new ResponseDTO("C-000", 200, null, "Material Added Successfully.");
  } catch (error) {
    return new ResponseDTO(
      "C-109",
      500,
      null,
      `Error Adding Material: ${error}.`
    );
  }
};

const addEvaluacion = async (id, evaluacion) => {
  console.log(`Adding Evaluacion for Conferencia ID: ${id}...`);
  try {
    const conferencia = await ConferenciaENT.findByPk(id);
    if (!conferencia)
      return new ResponseDTO("C-110", 404, null, "Conferencia Not Found.");
    conferencia.evaluacion = evaluacion;
    await conferencia.save();
    return new ResponseDTO(
      "C-000",
      200,
      null,
      "Evaluacion Added Successfully."
    );
  } catch (error) {
    return new ResponseDTO(
      "C-110",
      500,
      null,
      `Error Adding Evaluacion: ${error}.`
    );
  }
};

const getMateriales = async (id, asistenteId) => {
  console.log(
    `Getting Materiales for Conferencia ID: ${id} and Asistente ID: ${asistenteId}...`
  );
  try {
    const conferencia = await ConferenciaENT.findByPk(id);
    if (!conferencia)
      return new ResponseDTO("C-111", 404, null, "Conferencia Not Found.");
    // Verificar si el asistente está inscrito
    const inscripcion = await AsistenteConferenciaENT.findOne({
      where: { id_conferencia: id, id_asistente: asistenteId },
    });
    if (!inscripcion)
      return new ResponseDTO("C-112", 403, null, "Access Denied.");
    return new ResponseDTO(
      "C-000",
      200,
      conferencia.material,
      "Materiales Obtained."
    );
  } catch (error) {
    return new ResponseDTO(
      "C-111",
      500,
      null,
      `Error Getting Materiales: ${error}.`
    );
  }
};

const getConferenciasByOrador = async (oradorId) => {
  console.log(`Getting Conferencias for Orador ID: ${oradorId}...`);
  try {
    const conferencias = await ConferenciaENT.findAll({
      where: { id_orador: oradorId },
    });
    const conferenciasDTO = conferencias.map(
      (conf) =>
        new ConferenciaDTO(
          conf.id_conferencia,
          conf.titulo,
          conf.descripcion,
          conf.id_marca_conferencia,
          conf.id_orador,
          conf.id_tipo_conferencia,
          conf.votos_a_favor,
          conf.votos_en_contra,
          conf.fecha,
          conf.hora_empieza,
          conf.hora_termina,
          conf.sala,
          conf.evaluacion,
          conf.material
        )
    );
    return new ResponseDTO(
      "C-000",
      200,
      conferenciasDTO,
      "Conferencias Obtained."
    );
  } catch (error) {
    return new ResponseDTO("C-113", 500, null, `Error: ${error}.`);
  }
};

module.exports = {
  getAllConferencias,
  getConferenciaById,
  createConferencia,
  getAsistentesInscritos,
  updateConferencia,
  deleteConferencia,
  updateVotos,
  updateCharla,
  getVotos,
  addMaterial,
  addEvaluacion,
  getMateriales,
  getConferenciasByOrador,
};
