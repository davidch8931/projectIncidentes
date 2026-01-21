from django.urls import path, include
from rest_framework.routers import DefaultRouter
# Importamos todas las vistas que definimos en views.py
from .views import *

# Creamos el router
router = DefaultRouter()

# --- Registro de Rutas

# catalogos
router.register(r'roles', RolViewSet)
router.register(r'severidades', SeveridadViewSet)
router.register(r'tipos-incidentes', TipoIncidenteViewSet)
router.register(r'tipos-recursos', TipoRecursoViewSet)

# usuarios
router.register(r'usuarios', UsuarioViewSet)


router.register(r'incidentes', IncidenteViewSet)
router.register(r'evidencias', EvidenciaViewSet)
router.register(r'recursos', RecursoViewSet)
router.register(r'asignaciones', AsignacionViewSet)
router.register(r'rescatistas-asignaciones', RescatistaAsignacionViewSet)

urlpatterns = [
    # incluimos las URLs generadas por el router
    path('', include(router.urls)),
]