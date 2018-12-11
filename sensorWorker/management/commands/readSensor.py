from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from django.core.management import BaseCommand
import time
import json






# The class must be named Command, and subclass BaseCommand
class Command(BaseCommand):

    def send_sensor_message(self, message):
        # Send message to room group
        async_to_sync(self.channel_layer.group_send)(
            'sensor_room',
            {
                'type': 'sensor_message',
                'message': message
            }
        )

    # Receive message from room group
    def sensor_message(self, event):
        message = event['message']
        # Send message to WebSocket
        self.send(text_data=json.dumps(message))


    channel_layer = get_channel_layer()
    # Show this when the user types help
    help = "Simulates reading sensor and sending over Channel."
    # room_name = 'room'
    # room_group_name = 'sensor_%s' % room_name
    #
    # # Join room group
    # async_to_sync(channel_layer.group_add)(
    #     room_group_name,
    #     channel_name
    # )

    # A command must define handle()
    def handle(self, *args, **options):
        x = 0
        while True:
            self.send_sensor_message({'id' : str(x), 'type' : 'discovery'})
 #           Group("sensor").send({'text': "Sensor reading=" + str(x)})
            time.sleep(1)
            x = x + 1
            self.stdout.write("Sensor reading..." + str(x))