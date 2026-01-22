import json
from channels.generic.websocket import AsyncWebsocketConsumer

class IncidentesConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        # obtenemos el id del usuario
        query_string = self.scope['query_string'].decode()
        user_id = None
        
        if 'user_id=' in query_string:
            user_id = query_string.split('user_id=')[1]
            
        if user_id:
            self.room_group_name = f'user_{user_id}'
            # unirse al grupo privado
            await self.channel_layer.group_add(
                self.room_group_name,
                self.channel_name
            )
            await self.accept()
        else:
            # si no hay id, rechazamos la conexion
            await self.close()

    async def disconnect(self, close_code):
        if hasattr(self, 'room_group_name'):
            await self.channel_layer.group_discard(
                self.room_group_name,
                self.channel_name
            )

    async def nuevo_incidente(self, event):
        message = event['message']
        await self.send(text_data=json.dumps({
            'message': message
        }))