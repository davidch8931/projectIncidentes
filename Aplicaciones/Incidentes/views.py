from django.shortcuts import render
from rest_framework import viewsets
# Importamos todos los modelos y serializers que definimos previamente
from .models import *
from .serializers import *

# --- Catálogos y Usuarios ---

class RolViewSet(viewsets.ModelViewSet):
    queryset = Rol.objects.all()
    serializer_class = RolSerializer

class UsuarioViewSet(viewsets.ModelViewSet):
    #Al crear/editar, el serializer se encarga de hashear la contraseña.
    queryset = Usuario.objects.all()
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