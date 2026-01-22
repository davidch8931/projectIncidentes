import 'package:flutter/material.dart';
import 'package:movil_app/screens/detalle_incidente_screen.dart';
import '../repositories/incidente_repository.dart';
import '../repositories/auth_repository.dart';
import '../models/incidente_model.dart';
import '../services/websocket_service.dart';
import 'login_screen.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  final _incidenteRepo = IncidenteRepository();
  List<IncidenteModel> _asignaciones = [];
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _cargarDatos();
  }

  Future<void> _cargarDatos() async {
    if (!mounted) return;
    setState(() => _isLoading = true);

    final lista = await _incidenteRepo.getMisAsignaciones();

    if (mounted) {
      setState(() {
        _asignaciones = lista;
        _isLoading = false;
      });
    }
  }

  // funcion para cerrar sesion y volver al login
  void _cerrarSesion() {
    WebSocketService.instance.disconnect();
    AuthRepository().logout();
    Navigator.pushReplacement(
      context, 
      MaterialPageRoute(builder: (_) => const LoginScreen())
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.grey[100],
      appBar: AppBar(
        title: const Text(
          'mis asignaciones',
          style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
        ),
        backgroundColor: Colors.red[800],
        elevation: 0,
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh, color: Colors.white),
            onPressed: _cargarDatos,
          ),
          IconButton(
            icon: const Icon(Icons.logout, color: Colors.white),
            onPressed: _cerrarSesion,
          ),
        ],
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator(color: Colors.red))
          : _construirLista(),
    );
  }

  // widget que construye la lista o el mensaje de vacio
  Widget _construirLista() {
    if (_asignaciones.isEmpty) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(Icons.assignment_turned_in_outlined, size: 80, color: Colors.black),
            const SizedBox(height: 10),
            const Text(
              "no tienes incidentes asignados",
              style: TextStyle(fontSize: 18, color: Colors.grey),
            ),
          ],
        ),
      );
    }

    return RefreshIndicator(
      onRefresh: _cargarDatos,
      color: Colors.red,
      child: ListView.builder(
        padding: const EdgeInsets.all(12),
        itemCount: _asignaciones.length,
        itemBuilder: (context, index) {
          return _tarjetaIncidente(_asignaciones[index]);
        },
      ),
    );
  }

  // diseño de cada tarjeta individual
  Widget _tarjetaIncidente(IncidenteModel incidente) {
    return GestureDetector(
      onTap: () {
        // navegar al detalle
        Navigator.push(
          context,
          MaterialPageRoute(
            builder: (_) => DetalleIncidenteScreen(incidente: incidente)
          )
        );
      },
      child: Card(
        color: Colors.grey[200],
        elevation: 4,
        shadowColor: Colors.grey,
        margin: const EdgeInsets.only(bottom: 16),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(20)
                    ),
                    child: Text(
                      "id #${incidente.inciId}",
                      style: TextStyle(color: Colors.red[800], fontWeight: FontWeight.bold),
                    ),
                  ),
                  Text(
                    incidente.fechaCreacion?.substring(0, 10) ?? '',
                    style: const TextStyle(color: Colors.grey, fontSize: 12),
                  ),
                ],
              ),
              const SizedBox(height: 12),
              Text(
                incidente.inciDescripcion,
                style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w600),
                maxLines: 2,
                overflow: TextOverflow.ellipsis,
              ),
              const SizedBox(height: 12),
              Row(
                children: [
                  const Icon(Icons.location_on, size: 16, color: Colors.grey),
                  const SizedBox(width: 4),
                  Expanded(
                    child: Text(
                      "${incidente.inciLatitud}, ${incidente.inciLongitud}",
                      style: const TextStyle(color: Colors.grey, fontSize: 13),
                    ),
                  ),
                  _chipEstado(incidente.inciEstado),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }

  // widget pequeño para mostrar el estado con color
  Widget _chipEstado(String estado) {
    Color colorFondo = Colors.orange[100]!;
    Color colorTexto = Colors.orange[900]!;

    if (estado == 'Resuelto') {
      colorFondo = Colors.green[100]!;
      colorTexto = Colors.green[900]!;
    }

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
      decoration: BoxDecoration(
        color: colorFondo,
        borderRadius: BorderRadius.circular(4),
      ),
      child: Text(
        estado,
        style: TextStyle(color: colorTexto, fontSize: 12, fontWeight: FontWeight.bold),
      ),
    );
  }
}