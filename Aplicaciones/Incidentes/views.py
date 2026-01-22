from django.shortcuts import render
from rest_framework import viewsets
# Importamos todos los modelos y serializers que definimos previamente
from .models import *
from .serializers import *
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

# --- Catálogos y Usuarios ---

class RolViewSet(viewsets.ModelViewSet):
    queryset = Rol.objects.all()
    serializer_class = RolSerializer

class UsuarioViewSet(viewsets.ModelViewSet):
    #Al crear/editar, el serializer se encarga de hashear la contraseña.
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer


class RescatistaDisponibleViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Usuario.objects.filter(fk_rol__rol_nombre="Rescatista", usu_estado="Disponible")
    serializer_class = UsuarioSerializer

class SeveridadViewSet(viewsets.ModelViewSet):    
    queryset = Severidad.objects.all()
    serializer_class = SeveridadSerializer

class TipoIncidenteViewSet(viewsets.ModelViewSet):    
    queryset = TipoIncidente.objects.all()
    serializer_class = TipoIncidenteSerializer

class TipoRecursoViewSet(viewsets.ModelViewSet):
    queryset = TipoRecurso.objects.all()
    serializer_class = TipoRecursoSerializer

# --- Core del Negocio ---

class IncidenteViewSet(viewsets.ModelViewSet):
    queryset = Incidente.objects.all()
    serializer_class = IncidenteSerializer
    def perform_create(self, serializer):
        #guardar en la bdd
        instancia = serializer.save()

        # enviar mensaje al grupo de WebSocket
        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)(
            'incidentes_general', # mismo nombre que esta en consumers.py
            {
                'type': 'nuevo_incidente', # mismo nombre de la función en consumers.py
                'message': {
                    'accion': 'crear',
                    'id': instancia.inci_id,
                    'descripcion': instancia.inci_descripcion,
                    'latitud': float(instancia.inci_latitud), 
                    'longitud': float(instancia.inci_longitud),
                    'estado': instancia.inci_estado,
                    'tipo': instancia.fk_tipo_inci.tipo_nombre,
                    'severidad': instancia.fk_seve_id.seve_nombre,
                    'fecha': str(instancia.fecha_creacion)
                }
            }
        )

class EvidenciaViewSet(viewsets.ModelViewSet):
    queryset = Evidencia.objects.all()
    serializer_class = EvidenciaSerializer

class RecursoViewSet(viewsets.ModelViewSet):
    queryset = Recurso.objects.all()
    serializer_class = RecursoSerializer

class AsignacionViewSet(viewsets.ModelViewSet):
    queryset = Asignacion.objects.all()
    serializer_class = AsignacionSerializer

class RescatistaAsignacionViewSet(viewsets.ModelViewSet):
    queryset = RescatistaAsignacion.objects.all()
    serializer_class = RescatistaAsignacionSerializer
    
    