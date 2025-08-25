class ConferenciaDTO {
  constructor(
    idConferencia,
    titulo,
    descripcion,
    idMarcaConferencia,
    idOrador,
    idTipoConferencia,
    votosAFavor,
    votosEnContra,
    fecha,
    horaEmpieza,
    horaTermina,
    sala,
    evaluacion,
    material
  ) {
    this.idConferencia = idConferencia;
    this.titulo = titulo;
    this.descripcion = descripcion;
    this.idMarcaConferencia = idMarcaConferencia;
    this.idOrador = idOrador;
    this.idTipoConferencia = idTipoConferencia;
    this.votosAFavor = votosAFavor;
    this.votosEnContra = votosEnContra;
    this.fecha = fecha;
    this.horaEmpieza = horaEmpieza;
    this.horaTermina = horaTermina;
    this.sala = sala;
    this.evaluacion = evaluacion;
    this.material = material;
  }
}

module.exports = ConferenciaDTO;
