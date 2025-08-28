class OradorDTO {
  constructor(id_orador, id_usuario, descripcion, experiencia, contacto) {
    this.id_orador = id_orador;
    this.id_usuario = id_usuario;
    this.descripcion = descripcion;
    this.experiencia = experiencia;
    this.contacto = contacto;
  }
}

module.exports = OradorDTO;
