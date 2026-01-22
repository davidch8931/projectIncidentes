class IncidenteModel {
  int? inciId;
  String inciDescripcion;
  double inciLatitud;
  double inciLongitud;
  String inciEstado;
  String? fechaCreacion;
  int fkTipoInci;
  int fkSeveId;
  // nuevos campos para mostrar nombres
  String? tipoInciNombre;
  String? severidadNombre;

  IncidenteModel({
    this.inciId,
    required this.inciDescripcion,
    required this.inciLatitud,
    required this.inciLongitud,
    required this.inciEstado,
    this.fechaCreacion,
    required this.fkTipoInci,
    required this.fkSeveId,
    this.tipoInciNombre,
    this.severidadNombre,
  });

  // convertir de json a clase
  factory IncidenteModel.fromMap(Map<String, dynamic> data) {
    return IncidenteModel(
      inciId: data['inci_id'],
      inciDescripcion: data['inci_descripcion'] ?? '',
      inciLatitud: double.parse(data['inci_latitud'].toString()),
      inciLongitud: double.parse(data['inci_longitud'].toString()),
      inciEstado: data['inci_estado'] ?? 'Pendiente',
      fechaCreacion: data['fecha_creacion'],
      fkTipoInci: data['fk_tipo_inci'] ?? 0,
      fkSeveId: data['fk_seve_id'] ?? 0,
      // mapeamos los nuevos campos que vienen del serializer de django
      tipoInciNombre: data['tipo_inci_nombre'],
      severidadNombre: data['severidad_nombre'],
    );
  }

  // convertir de clase a map (para sqlite)
  Map<String, dynamic> toMap() {
    return {
      'inci_id': inciId,
      'inci_descripcion': inciDescripcion,
      'inci_latitud': inciLatitud,
      'inci_longitud': inciLongitud,
      'inci_estado': inciEstado,
      'fk_tipo_inci': fkTipoInci,
      'fk_seve_id': fkSeveId,
      // guardamos los nombres tambien en local
      'tipo_inci_nombre': tipoInciNombre,
      'severidad_nombre': severidadNombre,
    };
  }
}