import json
from channels.generic.websocket import AsyncWebsocketConsumer

class IncidenteConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        # Crear un grupo llamado "incidentes_general"
        self.room_group_name = 'incidentes_general'

        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        await self.accept() # Aceptar conexión

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    # Recibir mensaje del grupo y enviarlo al React/Flutter
    async def nuevo_incidente(self, event):
        message = event['message']
        await self.send(text_data=json.dumps({
            'message': message
        }))