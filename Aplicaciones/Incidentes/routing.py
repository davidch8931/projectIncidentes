from django.urls import re_path
from . import consumers

websocket_urlpatterns = [
    # Esta es la ruta: ws://localhost:8000/ws/incidentes/
    re_path(r'ws/incidentes/$', consumers.IncidentesConsumer.as_asgi()),
]