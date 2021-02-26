import datetime
import json
import ast
import threading
import time
from multiprocessing import Process
from multiprocessing import Queue

from asgiref.sync import sync_to_async
from django.core.exceptions import ObjectDoesNotExist
import redis
from channels.consumer import SyncConsumer
import configparser, os
import django
django.setup()
from sensor.models import SensorModule

config = configparser.ConfigParser()
CONFIGFILE = 'config_sensorWorkerD.ini'


# Just a small function to write the file
def write_file(filename):
    config.write(open(filename, 'w'))







class SensorWorkerD(SyncConsumer):
    _db = None
    _sensor_process = None

    def __init__(self, *args, **kwargs):
        super().__init__()
        redis_host = None
        redis_port = None
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
        self._db = redis.StrictRedis(host=redis_host, port=redis_port)
        print("init")


    # handler definition by type of message
    def sensor_message(self, message):
        # publish to sensor channel_reply
        json_data = ast.literal_eval(str(message))
        channel_reply = "sensor_" + json_data['message']['sensor']['uid']
        message = json.dumps(json_data['message'])
        print(json.dumps(message, indent=4))
        self._db.publish(channel_reply, message )
        print("after publish")
        # objd = json.dumps({
        #     "sensor": {
        #         "type": "init",
        #         "os": "win",
        #         "uid": 1},
        #     "payload": {"channel_reply": "cr", "data": "nan"}})
        # objl = json.loads(objd)
        # main_queue.put(objl['payload'])
