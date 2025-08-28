class ConferenciaDTO {
  constructor(
    id_conferencia,
    titulo,
    descripcion,
    id_marca_conferencia,
    id_orador,
    id_tipo_conferencia,
    votos_a_favor,
    votos_en_contra,
    fecha,
    hora_empieza,
    hora_termina,
    sala,
    evaluacion,
    material
  ) {
    this.id_conferencia = id_conferencia;
    this.titulo = titulo;
    this.descripcion = descripcion;
    this.id_marca_conferencia = id_marca_conferencia;
    this.id_orador = id_orador;
    this.id_tipo_conferencia = id_tipo_conferencia;
    this.votos_a_favor = votos_a_favor;
    this.votos_en_contra = votos_en_contra;
    this.fecha = fecha;
    this.hora_empieza = hora_empieza;
    this.hora_termina = hora_termina;
    this.sala = sala;
    this.evaluacion = evaluacion;
    this.material = material;
  }
}

module.exports = ConferenciaDTO;
