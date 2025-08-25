class AsistenteConferenciaVotacionDTO {
  constructor(
    idAsistenteConferenciaVotacion,
    idAsistenteConferencia,
    idVotacion
  ) {
    this.idAsistenteConferenciaVotacion = idAsistenteConferenciaVotacion;
    this.idAsistenteConferencia = idAsistenteConferencia;
    this.idVotacion = idVotacion;
  }
}

module.exports = AsistenteConferenciaVotacionDTO;
