import sys
from multiprocessing import Queue

from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from django.core.exceptions import ObjectDoesNotExist
from django.core.management import BaseCommand
import time
import json
import ast
import redis
from sensor.models import SensorModule, SensorData
import configparser, os

config = configparser.ConfigParser()
CONFIGFILE = 'config_sensorSenderD.ini'


# Just a small function to write the file
def write_file(filename):
    config.write(open(filename, 'w'))


main_queue = Queue()  # inter comm process worker and TestWorker


# The class must be named Command, and subclass BaseCommand
class Command(BaseCommand):
    _channel_pub = "sensor_publish_channel"

    def __init__(self):
        super().__init__()
        print("init")

    "sensor_publish_channel"

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

    # A command must define handle()
    def handle(self, *args, **options):
        redis_host = None
        redis_port = None
        sensor_uuid = None
        if not os.path.exists(CONFIGFILE):
            config['redis'] = {'host': '192.168.99.100', 'port': '6379'}
            write_file(CONFIGFILE)
            config.read(CONFIGFILE)
            redis_host = config.get('redis', 'host')
            redis_port = config.get('redis', 'port')
        else:
            config.read(CONFIGFILE)
            redis_host = config.get('redis', 'host')
            redis_port = config.get('redis', 'port')
        print("handle start")
        myredis = redis.StrictRedis(host=redis_host, port=redis_port)
        pubsub = myredis.pubsub()
        pubsub.subscribe(self._channel_pub)
        for item in pubsub.listen():
            print('receive : %s' % (item['data']))
            if type(item['data']) is bytes:
                obj = ast.literal_eval(item['data'].decode("utf-8"))
                # write SensorData model
                try:
                    sm = SensorModule.objects.get(pk=obj['sensor']['pkid'])
                    smdata = SensorData.objects.create(sensorId=sm,
                                                       data=obj['payload']).save
                except ObjectDoesNotExist:
                    print("Unexpected error:", sys.exc_info()[0])
                    raise
                # send to channel websocket
                self.send_sensor_message(obj)

#        while True:
#            self.send_sensor_message({'id' : str(x), 'type' : 'discovery'})
#
# #           Group("sensor").send({'text': "Sensor reading=" + str(x)})
#            time.sleep(1)
#            x = x + 1
#            self.stdout.write("Sensor reading..." + str(x))
