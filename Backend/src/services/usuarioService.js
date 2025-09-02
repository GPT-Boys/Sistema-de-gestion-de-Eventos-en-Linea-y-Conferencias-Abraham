const ResponseDTO = require("../DTO/ResponseDTO");
const TipoUsuarioDTO = require("../DTO/TipoUsuarioDTO");
const TipoUsuarioENT = require("../ENT/TipoUsuarioENT");
const UsuarioDTO = require("../DTO/UsuarioDTO");
const UsuarioENT = require("../ENT/UsuarioENT");
const CiudadDTO = require("../DTO/CiudadDTO");
const CiudadENT = require("../ENT/CiudadENT");
const OradorDTO = require("../DTO/OradorDTO");
const OradorENT = require("../ENT/OradorENT");
const AsistenteDTO = require("../DTO/AsistenteDTO");
const AsistenteENT = require("../ENT/AsistenteENT");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const SECRET_KEY_CODES = require("../../config/secretKey");

const getAllUsers = async () => {
  console.log("Getting All Users...");
  try {
    const users = await UsuarioENT.findAll({
      include: [
        { model: TipoUsuarioENT, as: "tipo_usuario" },
        { model: CiudadENT, as: "ciudad" },
      ],
    });
    const usersDTO = users.map((user) => {
      const tipoUsuarioDTO = new TipoUsuarioDTO(
        user.tipo_usuario.id_tipo_usuario,
        user.tipo_usuario.tipo_usuario
      );
      const ciudadDTO = new CiudadDTO(
        user.ciudad.id_ciudad,
        user.ciudad.ciudad
      );
      return new UsuarioDTO(
        user.id_usuario,
        user.usuario,
        tipoUsuarioDTO,
        user.nombres,
        user.apellidos,
        user.fecha_nacimiento,
        ciudadDTO,
        user.telefono,
        user.correo_electronico,
        user.fecha_creacion
      );
    });
    console.log("Users Successfully Obtained.");
    return new ResponseDTO(
      "U-000",
      200,
      usersDTO,
      "Users Successfully Obtained."
    );
  } catch (error) {
    console.error(`Error Getting All Users: ${error}.`);
    return new ResponseDTO(
      "U-101",
      404,
      null,
      `Error Getting All Users: ${error}.`
    );
  }
};

const getUserByID = async (id) => {
  console.log(`Getting User with ID: ${id}...`);
  try {
    const user = await UsuarioENT.findByPk(id, {
      include: [
        { model: TipoUsuarioENT, as: "tipo_usuario" },
        { model: CiudadENT, as: "ciudad" },
      ],
    });

    if (!user) {
      console.log(`User with ID: ${id} Does Not Exist.`);
      return new ResponseDTO(
        "U-102",
        404,
        null,
        `User with ID: ${id} Does Not Exist.`
      );
    }

    const tipoUsuarioDTO = new TipoUsuarioDTO(
      user.tipo_usuario.id_tipo_usuario,
      user.tipo_usuario.tipo_usuario
    );
    const ciudadDTO = new CiudadDTO(user.ciudad.id_ciudad, user.ciudad.ciudad);
    const userDTO = new UsuarioDTO(
      user.id_usuario,
      user.usuario,
      tipoUsuarioDTO,
      user.nombres,
      user.apellidos,
      user.fecha_nacimiento,
      ciudadDTO,
      user.telefono,
      user.correo_electronico,
      user.fecha_creacion
    );
    console.log("User Successfully Obtained.");
    return new ResponseDTO(
      "U-000",
      200,
      userDTO,
      "User Successfully Obtained."
    );
  } catch (error) {
    console.error(`Error Getting User with ID: ${id}: ${error}.`);
    return new ResponseDTO(
      "U-102",
      404,
      null,
      `Error Getting User with ID: ${id}: ${error}.`
    );
  }
};

const createUser = async (userData) => {
  console.log("Creating a New User...");
  try {
    const plain = (userData?.contrasenia ?? "").toString();
    if (!plain) {
      throw new Error('Missing "contrasenia"');
    }

    const hashedPassword = await bcrypt.hash(plain, 10);

    const newUser = await UsuarioENT.create({
      usuario: userData.usuario,
      contrasenia: hashedPassword,
      id_tipo_usuario: userData.tipo_usuario.id_tipo_usuario,
      nombres: userData.nombres,
      apellidos: userData.apellidos,
      fecha_nacimiento: userData.fecha_nacimiento,
      id_ciudad: userData.ciudad.id_ciudad,
      telefono: userData.telefono,
      correo_electronico: userData.correo_electronico,
    });

    const tipoUsuarioDTO = new TipoUsuarioDTO(
      newUser.id_tipo_usuario,
      (await TipoUsuarioENT.findByPk(newUser.id_tipo_usuario)).tipo_usuario
    );
    const ciudadDTO = new CiudadDTO(
      newUser.id_ciudad,
      (await CiudadENT.findByPk(newUser.id_ciudad)).ciudad
    );
    const newUserDTO = new UsuarioDTO(
      newUser.id_usuario,
      newUser.usuario,
      tipoUsuarioDTO,
      newUser.nombres,
      newUser.apellidos,
      newUser.fecha_nacimiento,
      ciudadDTO,
      newUser.telefono,
      newUser.correo_electronico,
      newUser.fecha_creacion
    );

    console.log("User Created Successfully.");
    return new ResponseDTO(
      "U-000",
      201,
      newUserDTO,
      "User Created Successfully."
    );
  } catch (error) {
    console.error(`Error Creating New User: ${error}.`);
    return new ResponseDTO(
      "U-103",
      500,
      null,
      `Error Creating New User: ${error}.`
    );
  }
};

const updateUser = async (id, userData) => {
  console.log(`Updating User with ID: ${id}...`);
  try {
    const user = await UsuarioENT.findByPk(id);

    if (!user) {
      console.log(`User with ID: ${id} Does Not Exist.`);
      return new ResponseDTO(
        "U-104",
        404,
        null,
        `User with ID: ${id} Does Not Exist.`
      );
    }

    const hashedPassword = await bcrypt.hash(userData.contrasenia, 10);

    await user.update({
      usuario: userData.usuario,
      contrasenia: hashedPassword,
      id_tipo_usuario: userData.tipo_usuario.id_tipo_usuario,
      nombres: userData.nombres,
      apellidos: userData.apellidos,
      fecha_nacimiento: userData.fecha_nacimiento,
      id_ciudad: userData.ciudad.id_ciudad,
      telefono: userData.telefono,
      correo_electronico: userData.correo_electronico,
    });

    const tipoUsuarioDTO = new TipoUsuarioDTO(
      user.tipo_usuario.id_tipo_usuario,
      (
        await TipoUsuarioENT.findByPk(user.tipo_usuario.id_tipo_usuario)
      ).tipo_usuario
    );
    const ciudadDTO = new CiudadDTO(
      user.ciudad.id_ciudad,
      (await CiudadENT.findByPk(user.ciudad.id_ciudad)).ciudad
    );
    const updatedDTO = new UsuarioDTO(
      user.id_usuario,
      user.usuario,
      tipoUsuarioDTO,
      user.nombres,
      user.apellidos,
      user.fecha_nacimiento,
      ciudadDTO,
      user.telefono,
      user.correo_electronico,
      user.fecha_creacion
    );
    console.log(`User with ID: ${id} Successfully Updated.`);
    return new ResponseDTO(
      "U-000",
      200,
      updatedDTO,
      `User with ID: ${id} Successfully Updated.`
    );
  } catch (error) {
    console.error(`Error Updating User with ID: ${id}: ${error}.`);
    return new ResponseDTO(
      "U-104",
      400,
      null,
      `Error Updating User with ID: ${id}: ${error}.`
    );
  }
};

const updatePassword = async (req) => {
  console.log("Updating User Password...");
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, SECRET_KEY_CODES.SECRET_KEY); // SECRET_KEY_CODES en config
    const user = await UsuarioENT.findByPk(decoded.id);
    if (!user) return new ResponseDTO("U-106", 404, null, "User Not Found.");
    const hashedPassword = await bcrypt.hash(req.body.contrasenia, 10);
    await user.update({ contrasenia: hashedPassword });
    return new ResponseDTO(
      "U-000",
      200,
      null,
      "Password Updated Successfully."
    );
  } catch (error) {
    return new ResponseDTO(
      "U-106",
      500,
      null,
      `Error Updating Password: ${error}`
    );
  }
};

const deleteUser = async (id) => {
  console.log(`Deleting User with ID: ${id}...`);
  try {
    const user = UsuarioENT.findByPk(id);

    if (!user) {
      console.log(`User with ID: ${id} Does Not Exist.`);
      return new ResponseDTO(
        "U-105",
        404,
        null,
        `User with ID: ${id} Does Not Exist.`
      );
    }

    await user.destroy();
    console.log("User Successfully Deleted.");
    return new ResponseDTO("U-000", 200, null, "User Successfully Deleted.");
  } catch (error) {
    console.error(`Error Deleting User with ID: ${id}: ${error}.`);
    return new ResponseDTO(
      "U-105",
      400,
      null,
      `Error Deleting User with ID: ${id}: ${error}.`
    );
  }
};

const getUserByUsuario = async (usuario) => {
  console.log(`Getting User with USUARIO: ${usuario}...`);
  try {
    const user = await UsuarioENT.findOne({
      where: {
        usuario: usuario,
      },
      include: [
        { model: TipoUsuarioENT, as: "tipo_usuario" },
        { model: CiudadENT, as: "ciudad" },
      ],
    });

    if (!user) {
      console.log(`User with USUARIO: ${usuario} Does Not Exist.`);
      return new ResponseDTO(
        "U-102",
        404,
        null,
        `User with USUARIO: ${usuario} Does Not Exist.`
      );
    }

    if (user.tipo_usuario.id_tipo_usuario === 1) {
      return await getAdminByUsuario(usuario);
    } else if (user.tipo_usuario.id_tipo_usuario === 2) {
      return await getPersonalByUsuario(usuario);
    } else if (user.tipo_usuario.id_tipo_usuario === 3) {
      return await getOradorByIDUsuario(usuario);
    } else if (user.tipo_usuario.id_tipo_usuario === 4) {
      return await getAsistenteByIDUsuario(usuario);
    }

    return new ResponseDTO(
      "U-000",
      200,
      userDTO,
      `User with USUARIO: '${usuario}' Successfully Obtained.`
    );
  } catch (error) {
    console.error(`Error Getting User with USUARIO: '${usuario}': ${error}.`);
    return new ResponseDTO(
      "U-102",
      404,
      null,
      `Error Getting User with USUARIO: '${usuario}': ${error}.`
    );
  }
};

const getAdminByUsuario = async (usuario) => {
  console.log(`Getting Administrator with USUARIO: ${usuario}...`);
  try {
    const administrator = await UsuarioENT.findOne({
      where: {
        usuario: usuario,
      },
      include: [
        { model: TipoUsuarioENT, as: "tipo_usuario" },
        { model: CiudadENT, as: "ciudad" },
      ],
    });

    if (!administrator) {
      console.log(`Administrator with USUARIO: ${usuario} Does Not Exist.`);
      return new ResponseDTO(
        "U-102",
        404,
        null,
        `Administrator with USUARIO: ${usuario} Does Not Exist.`
      );
    }

    const tipoUsuarioDTO = new TipoUsuarioDTO(
      administrator.tipo_usuario.id_tipo_usuario,
      administrator.tipo_usuario.tipo_usuario
    );
    const ciudadDTO = new CiudadDTO(
      administrator.ciudad.id_ciudad,
      administrator.ciudad.ciudad
    );
    const administratorDTO = new UsuarioDTO(
      administrator.id_usuario,
      administrator.usuario,
      tipoUsuarioDTO,
      administrator.nombres,
      administrator.apellidos,
      administrator.fecha_nacimiento,
      ciudadDTO,
      administrator.telefono,
      administrator.correo_electronico,
      administrator.fecha_creacion
    );
    console.log("Administrator Successfully Obtained.");
    return new ResponseDTO(
      "U-000",
      200,
      administratorDTO,
      "Administrator Successfully Obtained."
    );
  } catch (error) {
    console.error(
      `Error Getting Administrator with USUARIO: '${usuario}': ${error}.`
    );
    return new ResponseDTO(
      "U-102",
      404,
      null,
      `Error Getting Administrator with USUARIO: '${usuario}': ${error}.`
    );
  }
};

const getPersonalByUsuario = async (usuario) => {
  console.log(`Getting Personal with USUARIO: ${usuario}...`);
  try {
    const personal = await UsuarioENT.findOne({
      where: {
        usuario: usuario,
      },
      include: [
        { model: TipoUsuarioENT, as: "tipo_usuario" },
        { model: CiudadENT, as: "ciudad" },
      ],
    });

    if (!personal) {
      console.log(`Personal with USUARIO: ${usuario} Does Not Exist.`);
      return new ResponseDTO(
        "U-102",
        404,
        null,
        `Personal with USUARIO: ${usuario} Does Not Exist.`
      );
    }

    const tipoUsuarioDTO = new TipoUsuarioDTO(
      personal.tipo_usuario.id_tipo_usuario,
      personal.tipo_usuario.tipo_usuario
    );
    const ciudadDTO = new CiudadDTO(
      personal.ciudad.id_ciudad,
      personal.ciudad.ciudad
    );
    const personalDTO = new UsuarioDTO(
      personal.id_usuario,
      personal.usuario,
      tipoUsuarioDTO,
      personal.nombres,
      personal.apellidos,
      personal.fecha_nacimiento,
      ciudadDTO,
      personal.telefono,
      personal.correo_electronico,
      personal.fecha_creacion
    );
    console.log("Personal Successfully Obtained.");
    return new ResponseDTO(
      "U-000",
      200,
      personalDTO,
      "Personal Successfully Obtained."
    );
  } catch (error) {
    console.error(
      `Error Getting Personal with USUARIO: '${usuario}': ${error}.`
    );
    return new ResponseDTO(
      "U-102",
      404,
      null,
      `Error Getting Personal with USUARIO: '${usuario}': ${error}.`
    );
  }
};

const getOradorByIDUsuario = async (id_usuario) => {
  console.log(`Getting Orador with ID_USUARIO: ${id_usuario}...`);
  try {
    const orador = await OradorENT.findOne({
      where: {
        id_usuario: id_usuario,
      },
      include: [{ model: UsuarioENT, as: "usuario" }],
    });

    if (!orador) {
      console.log(`Orador with ID_USUARIO: ${id_usuario} Does Not Exist.`);
      return new ResponseDTO(
        "U-102",
        404,
        null,
        `Orador with ID_USUARIO: ${id_usuario} Does Not Exist.`
      );
    }

    const usuarioDTO = new UsuarioDTO(
      orador.usuario.id_usuario,
      orador.usuario.usuario,
      orador.usuario.id_tipo_usuario,
      orador.usuario.nombres,
      orador.usuario.apellidos,
      orador.usuario.fecha_nacimiento,
      orador.usuario.id_ciudad,
      orador.usuario.telefono,
      orador.usuario.correo_electronico,
      orador.usuario.fecha_creacion
    );
    const oradorDTO = new OradorDTO(
      orador.id_orador,
      usuarioDTO,
      orador.descripcion,
      orador.experiencia,
      orador.contacto
    );
    console.log("Orador Successfully Obtained.");
    return new ResponseDTO(
      "U-000",
      200,
      oradorDTO,
      "Orador Successfully Obtained."
    );
  } catch (error) {
    console.error(
      `Error Getting Orador with ID_USUARIO: '${id_usuario}': ${error}.`
    );
    return new ResponseDTO(
      "U-102",
      404,
      null,
      `Error Getting Orador with ID_USUARIO: '${id_usuario}': ${error}.`
    );
  }
};

const getAsistenteByIDUsuario = async (id_usuario) => {
  console.log(`Getting Asistente with ID_USUARIO: ${id_usuario}...`);
  try {
    const asistente = await AsistenteENT.findOne({
      where: {
        id_usuario: id_usuario,
      },
      include: [{ model: UsuarioENT, as: "usuario" }],
    });

    if (!asistente) {
      console.log(`Asistente with ID_USUARIO: ${id_usuario} Does Not Exist.`);
      return new ResponseDTO(
        "U-102",
        404,
        null,
        `Asistente with ID_USUARIO: ${id_usuario} Does Not Exist.`
      );
    }

    const usuarioDTO = new UsuarioDTO(
      asistente.usuario.id_usuario,
      asistente.usuario.usuario,
      asistente.usuario.id_tipo_usuario,
      asistente.usuario.nombres,
      asistente.usuario.apellidos,
      asistente.usuario.fecha_nacimiento,
      asistente.usuario.id_ciudad,
      asistente.usuario.telefono,
      asistente.usuario.correo_electronico,
      asistente.usuario.fecha_creacion
    );
    const asistenteDTO = new AsistenteDTO(
      asistente.id_asistente,
      usuarioDTO,
      asistente.descripcion
    );
    console.log("Asistente Successfully Obtained.");
    return new ResponseDTO(
      "U-000",
      200,
      asistenteDTO,
      "Asistente Successfully Obtained."
    );
  } catch (error) {
    console.error(
      `Error Getting Asistente with ID_USUARIO: '${id_usuario}': ${error}.`
    );
    return new ResponseDTO(
      "U-102",
      404,
      null,
      `Error Getting Asistente with ID_USUARIO: '${id_usuario}': ${error}.`
    );
  }
};

module.exports = {
  getAllUsers,
  getUserByID,
  createUser,
  updateUser,
  deleteUser,
  updatePassword,
  getUserByUsuario,
};
