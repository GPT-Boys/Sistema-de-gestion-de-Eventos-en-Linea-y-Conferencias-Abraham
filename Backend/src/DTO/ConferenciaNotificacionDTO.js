class ConferenciaNotificacionDTO {
  constructor(idConferenciaNotificacion, idConferencia, notificacion) {
    this.idConferenciaNotificacion = idConferenciaNotificacion;
    this.idConferencia = idConferencia;
    this.notificacion = notificacion;
  }
}

module.exports = ConferenciaNotificacionDTO;
