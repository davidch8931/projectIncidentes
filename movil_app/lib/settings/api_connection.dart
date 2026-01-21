import 'package:dio/dio.dart';
import 'package:shared_preferences/shared_preferences.dart';

class ApiConnection {
  static final ApiConnection instance = ApiConnection.internal();
  factory ApiConnection() => instance;

  late Dio _dio;

  ApiConnection.internal() {
    _dio = Dio(
      BaseOptions(
        baseUrl: "http://10.0.2.2:8000/api/",
        connectTimeout: const Duration(seconds: 10),
        receiveTimeout: const Duration(seconds: 10),
        responseType: ResponseType.json,
      ),
    );

    // interceptor para agregar el token en cada peticion
    _dio.interceptors.add(InterceptorsWrapper(
      onRequest: (options, handler) async {
        final prefs = await SharedPreferences.getInstance();
        final token = prefs.getString('access_token');
        if (token != null) {
          options.headers['Authorization'] = 'Bearer $token';
        }
        return handler.next(options);
      },
      onError: (DioException e, handler) {
        return handler.next(e);
      },
    ));
  }

  // funcion para metodo get
  Future<List<dynamic>> get(String servicio) async {
    try {
      final response = await _dio.get(servicio);
      // dio decodifica automaticamente la respuesta
      return response.data;
    } on DioException catch (e) {
      throw Exception("error en la consulta ${e.response?.data ?? e.message}");
    }
  }

  // funcion para metodo post
  Future<dynamic> post(String servicio, Map<String, dynamic> data) async {
    try {
      // no es necesario codificar a json manualmente
      final response = await _dio.post(servicio, data: data);
      return response.data;
    } on DioException catch (e) {
      throw Exception("error en la consulta ${e.response?.data ?? e.message}");
    }
  }

  // funcion para metodo patch
  Future<dynamic> patch(String servicio, Map<String, dynamic> data) async {
    try {
      final response = await _dio.patch(servicio, data: data);
      return response.data;
    } on DioException catch (e) {
      throw Exception("error en la consulta ${e.response?.data ?? e.message}");
    }
  }

  // funcion para metodo delete
  Future<dynamic> delete(String servicio) async {
    try {
      final response = await _dio.delete(servicio);
      return response.data ?? 1;
    } on DioException catch (e) {
      throw Exception("error en la consulta ${e.response?.data ?? e.message}");
    }
  }
}