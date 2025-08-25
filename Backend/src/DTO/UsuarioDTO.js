class UsuarioDTO {
  constructor(
    idUsuario,
    usuario,
    contrasenia,
    idTipoUsuario,
    nombres,
    aprllidos,
    fechaNacimiento,
    idCiudad,
    telefono,
    correoElectronico,
    fechaCreacion
  ) {
    this.idUsuario = idUsuario;
    this.usuario = usuario;
    this.contrasenia = contrasenia;
    this.idTipoUsuario = idTipoUsuario;
    this.nombres = nombres;
    this.aprllidos = aprllidos;
    this.fechaNacimiento = fechaNacimiento;
    this.idCiudad = idCiudad;
    this.telefono = telefono;
    this.correoElectronico = correoElectronico;
    this.fechaCreacion = fechaCreacion;
  }
}

module.exports = UsuarioDTO;
