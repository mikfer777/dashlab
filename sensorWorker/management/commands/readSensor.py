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


    channel_layer = get_channel_layer()
    # Show this when the user types help
    help = "Simulates reading sensor and sending over Channel."

    # A command must define handle()
    def handle(self, *args, **options):
        x = 0
        while True:
            self.send_sensor_message({'id' : str(x), 'type' : 'discovery'})
 #           Group("sensor").send({'text': "Sensor reading=" + str(x)})
            time.sleep(2)
            x = x + 1
            self.stdout.write("Sensor reading..." + str(x))