import 'package:flutter_local_notifications/flutter_local_notifications.dart';

class NotificationService {
  static final NotificationService instance = NotificationService._internal();
  factory NotificationService() => instance;
  NotificationService._internal();

  final _notificationsPlugin = FlutterLocalNotificationsPlugin();

  // inicializacion de configuraciones locales
  Future<void> init() async {
    const androidSettings = AndroidInitializationSettings('@mipmap/ic_launcher');
    
    const initSettings = InitializationSettings(android: androidSettings);

    await _notificationsPlugin.initialize(initSettings);
  }

  // funcion para disparar la notificacion visual
  Future<void> showNotification(String title, String body) async {
    const androidDetails = AndroidNotificationDetails(
      'canal_incidentes',
      'alertas de incidentes', 
      importance: Importance.max,
      priority: Priority.high,
    );

    const details = NotificationDetails(android: androidDetails);

    
    await _notificationsPlugin.show(
      DateTime.now().millisecond, 
      title, 
      body, 
      details
    );
  }
}