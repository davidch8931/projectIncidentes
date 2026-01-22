import 'dart:convert';
import 'package:web_socket_channel/web_socket_channel.dart';
import 'notification_service.dart';

class WebSocketService {
  static final WebSocketService instance = WebSocketService._internal();
  factory WebSocketService() => instance;
  WebSocketService._internal();

  WebSocketChannel? _channel;

  // funcion para conectar y escuchar
  void connect(int userId) {
    try {
      final uri = Uri.parse('ws://10.198.42.125:8000/ws/incidentes/?user_id=$userId');
      _channel = WebSocketChannel.connect(uri);

      // escuchamos el stream de datos
      _channel!.stream.listen(
        (data) {
          _procesarMensaje(data);
        },
        onError: (error) {
          // manejo silencioso del error de conexion
        },
        onDone: () {
          // si se cierra la conexion podriamos intentar reconectar aqui
        }
      );
    } catch (e) {
    }
  }

  // logica para decidir si mostrar notificacion
  void _procesarMensaje(dynamic data) {
    try {
      final json = jsonDecode(data);
      
      // validamos la estructura que definimos en django consumers.py
      if (json['message'] != null) {
        final content = json['message'];
        
        // solo notificamos si la accion es asignar
        if (content['accion'] == 'asignar') {
          final titulo = "nuevo incidente: ${content['tipo']}";
          final cuerpo = "${content['severidad']} - ${content['descripcion']}";
          
          NotificationService.instance.showNotification(titulo, cuerpo);
        }
      }
    } catch (e) {
    }
  }

  // cerrar conexion al salir
  void disconnect() {
    if (_channel != null) {
      _channel!.sink.close();
    }
  }
}