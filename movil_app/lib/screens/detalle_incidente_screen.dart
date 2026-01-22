import 'package:flutter/material.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';
import '../models/incidente_model.dart';
import '../repositories/incidente_repository.dart';
import 'registro_evidencia_screen.dart';

class DetalleIncidenteScreen extends StatefulWidget {
  final IncidenteModel incidente;

  const DetalleIncidenteScreen({super.key, required this.incidente});

  @override
  State<DetalleIncidenteScreen> createState() => _DetalleIncidenteScreenState();
}

class _DetalleIncidenteScreenState extends State<DetalleIncidenteScreen> {
  final _incidenteRepo = IncidenteRepository();
  bool _isUpdating = false;
  late String _estadoActual;

  final Set<Marker> _markers = {};

  @override
  void initState() {
    super.initState();
    _estadoActual = widget.incidente.inciEstado;
    _configurarMarcador();
  }

  void _configurarMarcador() {
    _markers.add(
      Marker(
        markerId: MarkerId(widget.incidente.inciId.toString()),
        position: LatLng(widget.incidente.inciLatitud, widget.incidente.inciLongitud),
        infoWindow: InfoWindow(title: widget.incidente.inciDescripcion),
        icon: BitmapDescriptor.defaultMarkerWithHue(BitmapDescriptor.hueRed),
      ),
    );
  }

  void _cambiarEstado(String nuevoEstado) async {
    setState(() => _isUpdating = true);

    bool exito = await _incidenteRepo.updateEstado(widget.incidente.inciId!, nuevoEstado);

    if (exito && mounted) {
      setState(() {
        _estadoActual = nuevoEstado;
      });
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('estado actualizado a: $nuevoEstado'), backgroundColor: Colors.green),
      );
    } else if (mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('no se pudo actualizar, guardado en pendientes'), backgroundColor: Colors.orange),
      );
    }

    if (mounted) setState(() => _isUpdating = false);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('detalle del incidente', style: TextStyle(color: Colors.white, fontSize: 18)),
        backgroundColor: Colors.red[800],
        iconTheme: const IconThemeData(color: Colors.white),
      ),
      body: Column(
        children: [
          Expanded(
            flex: 4,
            child: GoogleMap(
              initialCameraPosition: CameraPosition(
                target: LatLng(widget.incidente.inciLatitud, widget.incidente.inciLongitud),
                zoom: 16,
              ),
              markers: _markers,
              myLocationEnabled: true,
              zoomControlsEnabled: false,
            ),
          ),
          
          Expanded(
            flex: 5,
            child: Container(
              padding: const EdgeInsets.all(20),
              decoration: const BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.only(
                  topLeft: Radius.circular(30),
                  topRight: Radius.circular(30),
                ),
                boxShadow: [BoxShadow(color: Colors.black12, blurRadius: 10, offset: Offset(0, -5))]
              ),
              child: SingleChildScrollView(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Center(
                      child: Container(
                        width: 50,
                        height: 5,
                        decoration: BoxDecoration(color: Colors.grey[300], borderRadius: BorderRadius.circular(10)),
                      ),
                    ),
                    const SizedBox(height: 20),
                    
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text(
                          "incidente #${widget.incidente.inciId}",
                          style: TextStyle(fontSize: 14, color: Colors.grey[600], fontWeight: FontWeight.bold),
                        ),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                          decoration: BoxDecoration(
                            color: _estadoActual == 'Resuelto' ? Colors.green[100] : Colors.orange[100],
                            borderRadius: BorderRadius.circular(20),
                          ),
                          child: Text(
                            _estadoActual,
                            style: TextStyle(
                              color: _estadoActual == 'Resuelto' ? Colors.green[800] : Colors.orange[800],
                              fontWeight: FontWeight.bold
                            ),
                          ),
                        )
                      ],
                    ),
                    const SizedBox(height: 15),

                    const Text(
                      "descripción",
                      style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                    ),
                    const SizedBox(height: 5),
                    Text(
                      widget.incidente.inciDescripcion,
                      style: TextStyle(fontSize: 15, color: Colors.grey[800], height: 1.4),
                    ),
                    const SizedBox(height: 20),

                    Row(
                      children: [
                        _infoChip(Icons.category, widget.incidente.tipoInciNombre ?? "tipo ${widget.incidente.fkTipoInci}"),
                        const SizedBox(width: 10),
                        _infoChip(Icons.warning, widget.incidente.severidadNombre ?? "severidad ${widget.incidente.fkSeveId}"),
                      ],
                    ),
                    const SizedBox(height: 30),

                    const Divider(),
                    const SizedBox(height: 10),
                    const Text(
                      "acciones de respuesta",
                      style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                    ),
                    const SizedBox(height: 15),

                    _isUpdating 
                      ? const Center(child: CircularProgressIndicator(color: Colors.red))
                      : Column(
                          children: [
                            if (_estadoActual == 'Pendiente' || _estadoActual == 'Asignado')
                              SizedBox(
                                width: double.infinity,
                                child: ElevatedButton.icon(
                                  onPressed: () => _cambiarEstado('En Sitio'),
                                  icon: const Icon(Icons.location_on),
                                  label: const Text("llegué al sitio"),
                                  style: ElevatedButton.styleFrom(
                                    backgroundColor: Colors.blue[700],
                                    foregroundColor: Colors.white,
                                    padding: const EdgeInsets.symmetric(vertical: 12),
                                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10))
                                  ),
                                ),
                              ),
                            
                            const SizedBox(height: 10),

                            if (_estadoActual != 'Resuelto')
                              SizedBox(
                                width: double.infinity,
                                child: ElevatedButton.icon(
                                  onPressed: () => _cambiarEstado('Resuelto'),
                                  icon: const Icon(Icons.check_circle),
                                  label: const Text("misión cumplida"),
                                  style: ElevatedButton.styleFrom(
                                    backgroundColor: Colors.green[700],
                                    foregroundColor: Colors.white,
                                    padding: const EdgeInsets.symmetric(vertical: 12),
                                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10))
                                  ),
                                ),
                              ),
                          ],
                        )
                  ],
                ),
              ),
            ),
          ),
        ],
      ),
      floatingActionButton: FloatingActionButton(
        backgroundColor: Colors.red[800],
        onPressed: () {
          Navigator.push(
            context,
            MaterialPageRoute(
              builder: (_) => RegistroEvidenciaScreen(incidenteId: widget.incidente.inciId!)
            )
          );
        },
        child: const Icon(Icons.camera_alt, color: Colors.white),
      ),
    );
  }

  Widget _infoChip(IconData icon, String label) {
    return Expanded(
      child: Container(
        padding: const EdgeInsets.all(10),
        decoration: BoxDecoration(
          color: Colors.grey[100],
          borderRadius: BorderRadius.circular(8),
          border: Border.all(color: Colors.grey[300]!)
        ),
        child: Row(
          children: [
            Icon(icon, size: 18, color: Colors.red[800]),
            const SizedBox(width: 8),
            // expanded evita que el texto se salga si es muy largo
            Expanded(
              child: Text(
                label, 
                style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w500),
                overflow: TextOverflow.ellipsis,
              ),
            ),
          ],
        ),
      ),
    );
  }
}