import 'package:dio/dio.dart';
import '../settings/api_connection.dart';

class EvidenciaRepository {
  final _api = ApiConnection.instance;

  // funcion para subir evidencia con foto
  Future<bool> subirEvidencia(int incidenteId, String descripcion, String pathImagen) async {
    try {
      String nombreArchivo = pathImagen.split('/').last;

      FormData formData = FormData.fromMap({
        'fk_inci_id': incidenteId,
        'evi_descripcion': descripcion,
        'evi_ruta': await MultipartFile.fromFile(pathImagen, filename: nombreArchivo),
      });

      final response = await _api.dio.post(
        'evidencias/', 
        data: formData
      );

      return response.statusCode == 201;
    } catch (e) {
      return false;
    }
  }
}