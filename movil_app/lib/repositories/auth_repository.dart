import 'package:dio/dio.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../settings/api_connection.dart';
import '../models/auth_response.dart';

class AuthRepository {
  final Dio _dio = ApiConnection.instance.dio;

  Future<bool> login(String username, String password) async {
    try {
      final response = await _dio.post('token/', data: {
        'username': username,
        'password': password,
      });

      if (response.statusCode == 200) {
        final authData = AuthResponse.fromJson(response.data);
        
        // Guardar token en memoria del teléfono
        final prefs = await SharedPreferences.getInstance();
        await prefs.setString('access_token', authData.access);
        await prefs.setString('refresh_token', authData.refresh);
        return true;
      }
      return false;
    } on DioException catch (e) {
      if (e.response?.statusCode == 401) {
        throw Exception("Usuario o contraseña incorrectos");
      }
      throw Exception("Error de conexión: ${e.message}");
    }
  }

  Future<void> logout() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('access_token');
    await prefs.remove('refresh_token');
  }
}