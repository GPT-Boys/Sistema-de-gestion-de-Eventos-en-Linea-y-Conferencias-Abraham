class ConferenciaNotificacionDTO {
  constructor(id_conferencia_notificacion, id_conferencia, notificacion) {
    this.id_conferencia_notificacion = id_conferencia_notificacion;
    this.id_conferencia = id_conferencia;
    this.notificacion = notificacion;
  }
}

module.exports = ConferenciaNotificacionDTO;
