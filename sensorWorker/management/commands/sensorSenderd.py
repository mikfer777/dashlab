import sys
import datetime
import json
import ast
import threading
import time
from multiprocessing import Process
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

class Sub(Process):
    _db = None
    _sensor_process = {}
    _main_queue = None
    _channel_pub_spc = "sensor_publish_channel"

    def __init__(self, main_queue):
        super().__init__()
        self._db = None
        self._main_queue = main_queue
        # self.foo()


    def foo(self):
        print(datetime.datetime.now())
        threading.Timer(1, self.foo).start()

    def run(self):
        config.read(CONFIGFILE)
        self._db = redis.StrictRedis(host=config.get('redis', 'host'), port=config.get('redis', 'port'))
        # do stuff
        print('sub:')
        pubsub = self._db.pubsub()
        pubsub.subscribe(['subsensor'])
        print('listen...')
        for item in pubsub.listen():
            print('%s : %s' % ('reader', item['data']))
            print(type(item['data']))
            if type(item['data']) is bytes:
                obj = ast.literal_eval(item['data'].decode("utf-8"))
                print(json.dumps(obj, indent=4))
                mtype = obj['sensor']['type']
                if (mtype == 'init'):
                    print("sensor init")

                    # p = Listen(obj['sensor']['uid'], obj['payload']['channel_reply'], self._main_queue)
                    # p.start()
                    # print(p.pid)
                    # self._sensor_process[obj['sensor']['uid']] = p
                    # #check sensor process_list by sending keep_alive
                    # print(list(self._sensor_process.items()))

                    #check if SensorModule existing in database else create it
                    SensorModule.objects.all()
                    sm = None
                    try:
                        sm = SensorModule.objects.get(sensor_uuid=obj['sensor']['uuid'])
                    except ObjectDoesNotExist:
                        SensorModule.objects.create(sensor_uuid=obj['sensor']['uuid'],
                                                    name=obj['sensor']['os'],
                                                    type=obj['sensor']['os'],
                                                    description=obj['sensor']['os'],
                                                    techdata=obj['sensor']['os']).save()
                        sm = SensorModule.objects.get(sensor_uuid=obj['sensor']['uuid'])

                    print('sm pk=' + str(sm.pk))

                    # send ack to sensor process
                    objack = json.dumps({
                        "sensor": {
                            "type": "ack",
                            "uuid": "FFFF",
                            "pkid":  str(sm.pk)},
                        "payload": {"channel_reply": obj['payload']['channel_reply'],
                                    "channel_pub": "sensor_publish_channel", "data": "nan"}})
                    # publish to sensor channel_reply
                    # self._db.publish("init", objack)
                    print(json.dumps(objack, indent=4))
                    self._db.publish(obj['payload']['channel_reply'], objack)
                    print(obj['payload']['channel_reply'])
                    # publish init message to SPC channel
                    # self._db.publish(self._channel_pub_spc, obj)


class Pub(Process):
    _db = None
    _sensor_process = {}
    _main_queue = None
    _channel_pub = "sensor_publish_channel"
    channel_layer = get_channel_layer()

    def __init__(self, main_queue):
        super().__init__()
        self._db = None
        self._main_queue = main_queue
        # self.foo()

    def send_sensor_message(self, message):
        # Send message to room group
        async_to_sync(self.channel_layer.group_send)(
            'sensor_room',
            {
                'type': 'sensor_message',
                'message': message
            }
        )


    def run(self):
        config.read(CONFIGFILE)
        self._db = redis.StrictRedis(host=config.get('redis', 'host'), port=config.get('redis', 'port'))

        pubsub = self._db.pubsub()
        pubsub.subscribe(self._channel_pub)
        for item in pubsub.listen():
            print('receive : %s' % (item['data']))
            if type(item['data']) is bytes:
                obj = ast.literal_eval(item['data'].decode("utf-8"))
                # write SensorData model
                SensorModule.objects.all()
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



# The class must be named Command, and subclass BaseCommand
class Command(BaseCommand):
    _channel_pub = "sensor_publish_channel"


    def __init__(self):
        super().__init__()
        print("init")





    # A command must define handle()
    def handle(self, *args, **options):
        redis_host = None
        redis_port = None
        sensor_uuid = None
        if not os.path.exists(CONFIGFILE):
            config['redis'] = {'host': '127.0.0.1', 'port': '6379'}
            write_file(CONFIGFILE)
            config.read(CONFIGFILE)
            redis_host = config.get('redis', 'host')
            redis_port = config.get('redis', 'port')
        else:
            config.read(CONFIGFILE)
            redis_host = config.get('redis', 'host')
            redis_port = config.get('redis', 'port')
        print("handle start")
        psub = Sub(main_queue)
        psub.start()
        ppub = Pub(main_queue)
        ppub.start()
