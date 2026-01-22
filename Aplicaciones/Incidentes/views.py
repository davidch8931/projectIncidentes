from django.shortcuts import render
from rest_framework import viewsets
# Importamos todos los modelos y serializers que definimos previamente
from .models import *
from .serializers import *
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from rest_framework.response import Response
from django.db import transaction
from rest_framework.exceptions import ValidationError
from rest_framework import viewsets, status
 
# --- Catálogos y Usuarios ---

class RolViewSet(viewsets.ModelViewSet):
    queryset = Rol.objects.all()
    serializer_class = RolSerializer

class UsuarioViewSet(viewsets.ModelViewSet):
    #Al crear/editar, el serializer se encarga de hashear la contraseña.
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer
 
class RescatistaDisponibleViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = UsuarioSerializer

    def get_queryset(self):
        return Usuario.objects.filter(
            fk_rol__rol_nombre__iexact="rescatista",
            usu_estado__iexact="disponible"
        ).exclude(id=self.request.user.id)


class AsignacionViewSet(viewsets.ModelViewSet):
    queryset = Asignacion.objects.all()
    serializer_class = AsignacionSerializer

    def create(self, request, *args, **kwargs):
        data = request.data

        with transaction.atomic():
  
            asignacion = Asignacion.objects.create(
                fk_inci_id_id=data["fk_inci_id"],
                fk_recur_id_id=data["fk_recur_id"],
                asig_estado="Asignado"
            )
        
  
            rescatista_ids = data.get("rescatistas", [])
            
            rescatistas = Usuario.objects.filter(
                id__in=rescatista_ids,
                usu_estado="Disponible"
            )



            print("RESCATISTAS IDS RECIBIDOS:", rescatista_ids)
            print("RESCATISTAS ENCONTRADOS:", list(rescatistas.values("id", "username", "usu_estado")))
            print("COUNT:", rescatistas.count())

             
            if not rescatistas.exists():
                raise ValueError("No se encontraron rescatistas disponibles con los IDs proporcionados")

             
            usados = RescatistaAsignacion.objects.filter(
                fk_asig_id__fk_recur_id=asignacion.fk_recur_id,
                fk_asig_id__asig_estado="Asignado"   
            ).count()

 
            for r in rescatistas:
                RescatistaAsignacion.objects.create(
                    fk_asig_id=asignacion,
                    fk_rescatista_id=r
                )
                r.usu_estado = "Disponible"
                r.save()
 
           
            recurso = asignacion.fk_recur_id
            recurso.recur_estado = (
                "Ocupado"
                if usados + rescatistas.count() >= recurso.recur_capacidad
                else "Disponible"
            )
            recurso.save()

         
            incidente = asignacion.fk_inci_id
            incidente.inci_estado = "Asignado"
            incidente.save()

            return Response(
                {
                    "message": "Asignación creada correctamente",
                    "asignacion_id": asignacion.asig_id,
                    "rescatistas_asignados": rescatistas.count()
                },
                status=status.HTTP_201_CREATED
            )

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
            'incidentes_general',
            {
                'type': 'nuevo_incidente', 
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
    
    