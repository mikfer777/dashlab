

from channels.generic.websocket import AsyncWebsocketConsumer
import json
from.models import Sensor

class SensorConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_name = 'room'
        self.room_group_name = 'sensor_%s' % self.room_name
        print ('channel_name=' + self.channel_name)
        # Join room group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        await self.accept()
        print('connected')

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )
        print('disconnected')

    async def receive(self, text_data):
        print ('received=' + text_data)
        message = json.loads(text_data)
        # message = text_data_json['message']
        # Send message to room group
        await self.channel_layer.send (
            'sensor_worker',
            {
                'type': 'sensor_message',
                'message': message
            }
        )



    async def send_sensor_message(self, message):
        # Send message to room group
        await self.channel_layer.group_send (
            self.room_group_name,
            {
                'type': 'sensor_message',
                'message': message
            }
        )

    # Receive message from room group
    async def sensor_message(self, event):
        message = event['message']
        # traiter le message venant du xbee ici...
        # ajouter un Sensor
        # gerer les sequences
        # https://stackoverflow.com/questions/44444385/postgres-sequences-as-default-value-for-django-model-field

        # s = Sensor(id=
        # s.save()

        # rediriger sur websocket (notification connexion d'un xbee...par exemple
        # Send message to WebSocket
        print('send=' + json.dumps(message))
        await self.send(text_data=json.dumps(message))
