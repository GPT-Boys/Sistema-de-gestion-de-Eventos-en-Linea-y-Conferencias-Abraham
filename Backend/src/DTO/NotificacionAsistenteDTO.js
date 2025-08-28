class NotificacionAsistenteDTO {
  constructor(
    id_notificacion_asistente,
    id_conferencia_notificacion,
    id_asistente
  ) {
    this.id_notificacion_asistente = id_notificacion_asistente;
    this.id_conferencia_notificacion = id_conferencia_notificacion;
    this.id_asistente = id_asistente;
  }
}

module.exports = NotificacionAsistenteDTO;
