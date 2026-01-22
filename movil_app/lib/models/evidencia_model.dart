class EvidenciaModel {
  int? eviId;
  int fkInciId;
  String? eviRuta;
  String eviDescripcion;
  String? fechaCreacion;

  EvidenciaModel({
    this.eviId,
    required this.fkInciId,
    this.eviRuta,
    required this.eviDescripcion,
    this.fechaCreacion,
  });

  factory EvidenciaModel.fromMap(Map<String, dynamic> data) {
    return EvidenciaModel(
      eviId: data['evi_id'],
      fkInciId: data['fk_inci_id'],
      eviRuta: data['evi_ruta'],
      eviDescripcion: data['evi_descripcion'],
      fechaCreacion: data['fecha_creacion'],
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'evi_id': eviId,
      'fk_inci_id': fkInciId,
      'evi_ruta': eviRuta,
      'evi_descripcion': eviDescripcion,
    };
  }
}