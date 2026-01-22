import 'dart:convert';
import 'package:dio/dio.dart';
import '../settings/api_connection.dart';
import '../settings/database_connection.dart';
import '../models/incidente_model.dart';


class SyncService {
  final _api = ApiConnection.instance;
  final _db = DatabaseConnection.instance;

  // 1. sincronizacion de bajada (pull)
  // trae todo del servidor y actualiza la db local
  Future<bool> sincronizarBajada() async {
    final response = await _api.get('incidentes/mis-asignaciones/');

    if (response != null && response is List) {
      // mapeamos y guardamos en sqlite
      List<IncidenteModel> lista = response.map((e) => IncidenteModel.fromMap(e)).toList();
      await _db.guardarIncidentesOffline(lista);
      return true;
    }
    return false;
  }

  // 2. sincronizacion de subida (push)
  // recorre la cola y envia peticiones pendientes
  Future<void> sincronizarSubida() async {
    final pendientes = await _db.getPendientes();
    
    if (pendientes.isEmpty) return;

    for (var tarea in pendientes) {
      bool exito = false;
      int id = tarea['id'];
      String url = tarea['url'];
      String metodo = tarea['metodo'];
      String? bodyStr = tarea['body'];
      String? filePath = tarea['file_path'];

      Map<String, dynamic> data = bodyStr != null ? jsonDecode(bodyStr) : {};

      // determinamos el tipo de peticion a reconstruir
      if (metodo == 'PATCH') {
        final resp = await _api.patch(url, data);
        if (resp != null) exito = true;
      
      } else if (metodo == 'POST') {
        // caso especial para evidencias con foto
        if (filePath != null) {
          try {
            String nombreArchivo = filePath.split('/').last;
            FormData formData = FormData.fromMap({
              ...data,
              'evi_ruta': await MultipartFile.fromFile(filePath, filename: nombreArchivo),
            });
            // usamos dio directo para multipart
            final resp = await _api.dio.post(url, data: formData);
            if (resp.statusCode == 201) exito = true;
          } catch (e) {
            exito = false;
          }
        } else {
          // post normal json
          final resp = await _api.post(url, data);
          if (resp != null) exito = true;
        }
      }

      // si la api respondio ok, borramos de la cola
      if (exito) {
        await _db.eliminarPendiente(id);
      }
    }
  }
}