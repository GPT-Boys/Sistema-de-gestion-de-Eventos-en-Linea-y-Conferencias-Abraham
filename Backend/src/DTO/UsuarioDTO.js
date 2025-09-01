class UsuarioDTO {
  constructor(
    id_usuario,
    usuario,
    contrasenia,
    id_tipo_usuario,
    nombres,
    apellidos,
    fecha_nacimiento,
    id_ciudad,
    telefono,
    correo_electronico,
    fecha_creacion
  ) {
    this.id_usuario = id_usuario;
    this.usuario = usuario;
    this.contrasenia = contrasenia;
    this.id_tipo_usuario = id_tipo_usuario;
    this.nombres = nombres;
    this.apellidos = apellidos;
    this.fecha_nacimiento = fecha_nacimiento;
    this.id_ciudad = id_ciudad;
    this.telefono = telefono;
    this.correo_electronico = correo_electronico;
    this.fecha_creacion = fecha_creacion;
  }
}

module.exports = UsuarioDTO;
