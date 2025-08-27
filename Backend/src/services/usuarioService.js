const ResponseDTO = require("../DTO/ResponseDTO");
const TipoUsuarioDTO = require("../DTO/TipoUsuarioDTO");
const UsuarioDTO = require("../DTO/UsuarioDTO");
const CiudadDTO = require("../DTO/CiudadDTO");
const UsuarioENT = require("../ENT/UsuarioENT");
const bcrypt = require("bcrypt");

const createUser = async (userData) => {
  console.log("Creating a new User...");
  try {
    const plain = (userData?.contrasenia ?? '').toString();
    if (!plain) {
      throw new Error('Missing "contrasenia"');
    }

    const hashedPassword = await bcrypt.hash(plain, 10);

    const newUser = await UsuarioENT.create({
      usuario: userData.usuario,
      contrasenia: hashedPassword,
      id_tipo_usuario: userData.TIPO_USUARIO.id_tipo_usuario,
      nombres: userData.nombres,
      apellidos: userData.apellidos,
      fecha_nacimiento: userData.fecha_nacimiento,
      id_ciudad: userData.CIUDAD.id_ciudad,
      telefono: userData.telefono,
      correo_electronico: userData.correo_electronico,
    });

    const tipoUsuarioDTO = new TipoUsuarioDTO(
      userData.TIPO_USUARIO.id_tipo_usuario,
      userData.TIPO_USUARIO.tipo_usuario
    );
    const ciudadDTO = new CiudadDTO(
      userData.CIUDAD.id_ciudad,
      userData.CIUDAD.ciudad
    );
    const newUserDTO = new UsuarioDTO(
      newUser.usuario,
      newUser.contrasenia,
      tipoUsuarioDTO,
      newUser.nombres,
      newUser.apellidos,
      newUser.fecha_nacimiento,
      ciudadDTO,
      newUser.telefono,
      newUser.correo_electronico
    );

    console.log("User created Successfully.");
    return new ResponseDTO("U-000", 201, newUserDTO, "User created Successfully.");
  } catch (error) {
    console.error(`Error Creating New User: ${error}.`);
    return new ResponseDTO("U-103", 500, null, `Error Creating New User: ${error}.`);
  }
};

module.exports = { createUser };
