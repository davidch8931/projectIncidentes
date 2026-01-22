import 'package:shared_preferences/shared_preferences.dart';
import '../settings/api_connection.dart';
import '../models/auth_response.dart';

class AuthRepository {
  final _api = ApiConnection.instance;

  // funcion para realizar el login
  Future<bool> login(String username, String password) async {
    final response = await _api.post('token/mobile/', {
      'username': username,
      'password': password,
    });

    // si tiene el token
    if (response != null && response['access'] != null) {
      final authData = AuthResponse.fromJson(response);
      
      final prefs = await SharedPreferences.getInstance();
      await prefs.setString('access_token', authData.access);
      await prefs.setString('refresh_token', authData.refresh);

      // guardamos el id del usuario
      if (response['user_id'] != null) {
        await prefs.setInt('user_id', response['user_id']);
      }
      return true;
    }
    return false;
  }

  // funcion para cerrar sesion
  Future<void> logout() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('access_token');
    await prefs.remove('refresh_token');
    await prefs.remove('user_id');
  }
}