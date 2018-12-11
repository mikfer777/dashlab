from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer
import json

class SensorConsumer(WebsocketConsumer):
    def connect(self):
        self.room_name = 'room'
        self.room_group_name = 'sensor_%s' % self.room_name

        # Join room group
        async_to_sync(self.channel_layer.group_add)(
            self.room_group_name,
            self.channel_name
        )
        self.accept()
        print('connected')

    def disconnect(self, close_code):
        async_to_sync(self.channel_layer.group_discard)(
            self.room_group_name,
            self.channel_name
        )
        print('disconnected')

    def receive(self, text_data):
        print ('received=' + text_data)
        # text_data_json = json.loads(text_data)
        # message = text_data_json['message']

        self.send_sensor_message('ping')

    def send_sensor_message(self, message):
        # Send message to room group
        async_to_sync(self.channel_layer.group_send)(
            self.room_group_name,
            {
                'type': 'sensor_message',
                'message': message
            }
        )

    # Receive message from room group
    def sensor_message(self, event):
        message = event['message']
        # Send message to WebSocket
        print('send=' + json.dumps(message))
        self.send(text_data=json.dumps(message))