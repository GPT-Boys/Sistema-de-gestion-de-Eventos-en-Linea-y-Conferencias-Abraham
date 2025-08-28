class AsistenteConferenciaVotacionDTO {
  constructor(
    id_asistente_conferencia_votacion,
    id_asistente_conferencia,
    id_votacion
  ) {
    this.id_asistente_conferencia_votacion = id_asistente_conferencia_votacion;
    this.id_asistente_conferencia = id_asistente_conferencia;
    this.id_votacion = id_votacion;
  }
}

module.exports = AsistenteConferenciaVotacionDTO;
