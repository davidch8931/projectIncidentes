import 'package:sqflite/sqflite.dart';
import 'package:path/path.dart';
import '../models/incidente_model.dart';

class DatabaseConnection {
  //generando un constructor para el llamado
  static final DatabaseConnection instance = DatabaseConnection.internal();
  factory DatabaseConnection() => instance;

  //referencias internas
  DatabaseConnection.internal();

  //llamado a sqflite
  static Database? _database;

  //funcion para crear la conección
  Future<Database> get db async {
    if (_database != null) return _database!;
    _database = await inicializarDb(); // inicializa la conexion en la funcion
    return _database!; 
  }

  Future<Database> inicializarDb() async {
    final rutaDb = await getDatabasesPath();
    final rutaFinal = join(rutaDb, 'modulo_offline.db');

    return await openDatabase(
      rutaFinal,
      version: 1,
      onCreate: (Database db, int version) async {
        // crear tabla espejo para incidentes (lectura offline)
        await db.execute(
          ''' CREATE TABLE incidentes (
          inci_id INTEGER PRIMARY KEY,
          inci_descripcion TEXT,
          inci_latitud REAL,
          inci_longitud REAL,
          inci_estado TEXT,
          fk_tipo_inci INTEGER,
          fk_seve_id INTEGER,
          fecha_creacion TEXT,
          tipo_inci_nombre TEXT,
          severidad_nombre TEXT
          )''',
        );

        // crear tabla cola de pendientes (escritura offline)
        await db.execute(
          ''' CREATE TABLE cola_pendientes (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          url TEXT NOT NULL,
          metodo TEXT NOT NULL,
          body TEXT,
          file_path TEXT
          )''',
        );
      },
    );
  }

  // --- metodos crud para la logica del negocio ---

  // guardar lista completa de incidentes (sincronizacion de bajada)
  Future<void> guardarIncidentesOffline(List<IncidenteModel> incidentes) async {
    final database = await db;
    await database.transaction((txn) async {
      await txn.delete('incidentes');
      for (var item in incidentes) {
        await txn.insert('incidentes', item.toMap());
      }
    });
  }

  // obtener incidentes locales
  Future<List<IncidenteModel>> getIncidentesLocales() async {
    final database = await db;
    final result = await database.query('incidentes');
    return result.map((json) => IncidenteModel.fromMap(json)).toList();
  }

  // agregar tarea a la cola (cuando no hay internet)
  Future<void> agregarPendiente(String url, String metodo, {String? body, String? filePath}) async {
    final database = await db;
    await database.insert('cola_pendientes', {
      'url': url,
      'metodo': metodo,
      'body': body,
      'file_path': filePath
    });
  }

  // leer toda la cola
  Future<List<Map<String, dynamic>>> getPendientes() async {
    final database = await db;
    return await database.query('cola_pendientes');
  }

  // eliminar tarea procesada
  Future<void> eliminarPendiente(int id) async {
    final database = await db;
    await database.delete('cola_pendientes', where: 'id = ?', whereArgs: [id]);
  }
}