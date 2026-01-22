import 'dart:convert';
import '../services/sync_service.dart';
import '../settings/api_connection.dart';
import '../models/incidente_model.dart';
import '../settings/database_connection.dart';


class IncidenteRepository {
  final _api = ApiConnection.instance;
  final _db = DatabaseConnection.instance;
  final _syncService = SyncService();

  // obtener asignaciones (logica hibrida)
  Future<List<IncidenteModel>> getMisAsignaciones() async {
    // intentamos sincronizar bajada (internet)
    bool online = await _syncService.sincronizarBajada();
    
    if (online) {
      // si hubo internet, aprovechamos y subimos pendientes tambien
      _syncService.sincronizarSubida();
    }

    // siempre devolvemos desde la base local (single source of truth)
    // asi aseguramos que la ui siempre funcione igual con o sin internet
    return await _db.getIncidentesLocales();
  }

  // actualizar estado (logica hibrida con cola)
  Future<bool> updateEstado(int id, String nuevoEstado) async {
    String url = 'incidentes/$id/';
    Map<String, dynamic> body = {'inci_estado': nuevoEstado};

    // intento online
    final response = await _api.patch(url, body);

    if (response != null) {
      // exito online: actualizamos tambien el espejo local para reflejar cambio inmediato
      // nota: en una app real idealmente harias un update sql aqui tambien
      return true;
    } 

    // fallo (offline): guardamos en cola
    await _db.agregarPendiente(
      url, 
      'PATCH', 
      body: jsonEncode(body)
    );
    
    return true; // retornamos true para la ui (optimistic ui)
  }
}