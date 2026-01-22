import 'package:dio/dio.dart';
import 'package:shared_preferences/shared_preferences.dart';

class ApiConnection {
  static final ApiConnection instance = ApiConnection.internal();
  factory ApiConnection() => instance;
  
  late Dio _dio;

  ApiConnection.internal() {
    _dio = Dio(
      BaseOptions(
        baseUrl: "http://10.198.42.125:8000/api/",
        connectTimeout: const Duration(seconds: 10),
        receiveTimeout: const Duration(seconds: 10),
        responseType: ResponseType.json,
        validateStatus: (status) => true,
      ),
    );

    _dio.interceptors.add(InterceptorsWrapper(
      onRequest: (options, handler) async {
        if (options.path.contains('token/')) {
          return handler.next(options);
        }

        final prefs = await SharedPreferences.getInstance();
        final token = prefs.getString('access_token');
        
        if (token != null) {
          options.headers['Authorization'] = 'Bearer $token';
        }
        return handler.next(options);
      },
    ));
  }
  Dio get dio => _dio;

  // funcion para metodo get
  Future<dynamic> get(String servicio) async {
    final response = await _dio.get(servicio);
    return response.data;
  }

  // funcion para metodo post
  Future<dynamic> post(String servicio, Map<String, dynamic> data) async {
    final response = await _dio.post(servicio, data: data);
    return response.data;
  }

  // funcion para metodo patch o put
  Future<dynamic> patch(String servicio, Map<String, dynamic> data) async {
    final response = await _dio.patch(servicio, data: data);
    return response.data;
  }

  // funcion para metodo delete
  Future<dynamic> delete(String servicio) async {
    final response = await _dio.delete(servicio);
    return response.data;
  }
}