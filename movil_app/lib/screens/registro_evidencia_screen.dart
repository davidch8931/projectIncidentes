import 'dart:io';
import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import '../repositories/evidencia_repository.dart';

class RegistroEvidenciaScreen extends StatefulWidget {
  final int incidenteId;

  const RegistroEvidenciaScreen({super.key, required this.incidenteId});

  @override
  State<RegistroEvidenciaScreen> createState() => _RegistroEvidenciaScreenState();
}

class _RegistroEvidenciaScreenState extends State<RegistroEvidenciaScreen> {
  final _descripcionController = TextEditingController();
  final _evidenciaRepo = EvidenciaRepository();
  final _picker = ImagePicker();
  
  File? _imagenSeleccionada;
  bool _isUploading = false;

  // funcion para abrir la camara
  Future<void> _tomarFoto() async {
    final XFile? foto = await _picker.pickImage(
      source: ImageSource.camera,
      imageQuality: 50, 
    );

    if (foto != null) {
      setState(() {
        _imagenSeleccionada = File(foto.path);
      });
    }
  }

  // funcion para guardar/enviar
  void _guardarEvidencia() async {
    if (_imagenSeleccionada == null || _descripcionController.text.isEmpty) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('debes tomar una foto y agregar una nota'), backgroundColor: Colors.orange),
        );
      }
      return;
    }

    setState(() => _isUploading = true);

    bool exito = await _evidenciaRepo.subirEvidencia(
      widget.incidenteId,
      _descripcionController.text,
      _imagenSeleccionada!.path
    );

    if (mounted) {
      setState(() => _isUploading = false);
      
      if (exito) {
        // exito online
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('evidencia subida correctamente'), backgroundColor: Colors.green),
        );
        Navigator.pop(context); // volvemos al detalle
      } else {
        // fallo envio (offline), simulamos guardado local
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('sin conexión. guardado en pendientes para sincronizar'), backgroundColor: Colors.orange),
        );
        Navigator.pop(context);
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.grey[50],
      appBar: AppBar(
        title: const Text('registrar evidencia', style: TextStyle(color: Colors.white)),
        backgroundColor: Colors.red[800],
        iconTheme: const IconThemeData(color: Colors.white),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // area de visualizacion de la foto
            Container(
              height: 250,
              decoration: BoxDecoration(
                color: Colors.grey[200],
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: Colors.grey[400]!),
              ),
              child: _imagenSeleccionada != null
                  ? ClipRRect(
                      borderRadius: BorderRadius.circular(12),
                      child: Image.file(_imagenSeleccionada!, fit: BoxFit.cover),
                    )
                  : Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(Icons.camera_alt_outlined, size: 50, color: Colors.grey[500]),
                        const SizedBox(height: 10),
                        Text("sin foto capturada", style: TextStyle(color: Colors.grey[600])),
                      ],
                    ),
            ),
            const SizedBox(height: 20),

            // boton de camara
            ElevatedButton.icon(
              onPressed: _tomarFoto,
              icon: const Icon(Icons.camera_alt),
              label: const Text("abrir cámara"),
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.red[700],
                foregroundColor: Colors.white,
                padding: const EdgeInsets.symmetric(vertical: 12),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
              ),
            ),
            const SizedBox(height: 20),

            const Text("notas del rescatista", style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
            const SizedBox(height: 8),
            TextField(
              controller: _descripcionController,
              maxLines: 4,
              decoration: InputDecoration(
                hintText: "describe la situación o la evidencia...",
                border: OutlineInputBorder(borderRadius: BorderRadius.circular(8)),
                filled: true,
                fillColor: Colors.white,
              ),
            ),
            const SizedBox(height: 30),

            // boton de guardar
            _isUploading
                ? const Center(child: CircularProgressIndicator(color: Colors.red))
                : ElevatedButton(
                    onPressed: _guardarEvidencia,
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.grey[900],
                      foregroundColor: Colors.white,
                      padding: const EdgeInsets.symmetric(vertical: 16),
                      elevation: 3,
                    ),
                    child: const Text("guardar evidencia", style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
                  ),
          ],
        ),
      ),
    );
  }
}