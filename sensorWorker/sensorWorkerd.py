import datetime
import json
import ast
import threading
import time
from multiprocessing import Process
from multiprocessing import Queue

from django.core.exceptions import ObjectDoesNotExist

from sensor.models import SensorModule, SensorData

import redis
from channels.consumer import SyncConsumer
import configparser, os

config = configparser.ConfigParser()
CONFIGFILE = 'config_sensorWorkerD.ini'


# Just a small function to write the file
def write_file(filename):
    config.write(open(filename, 'w'))


main_queue = Queue()  # inter comm process worker and TestWorker


class Watch(Process):
    _sensor_process = None

    def __init__(self, sensor_process):
        super().__init__()
        self._sensor_process = sensor_process

    def run(self):
        while True:
            print('watch dog process list:')
            print(list(self._sensor_process.items()))
            time.sleep(5)


# class Listen(Process):
#     _db = None
#     _sid = None
#     _channel_reply = None
#     _channel_layer = None
#     _main_queue = None
#
#     def __init__(self, sid, channel_reply, main_queue):
#         super().__init__()
#         self._db = None
#         self._sid = sid
#         self._channel_reply = channel_reply
#         self._main_queue = main_queue
#
#     # def run(self):
#     #     self._db = redis.Redis(host='192.168.99.100', port=6379, db=0)
#     #     pubsub = self._db.pubsub()
#     #     pubsub.subscribe([self._channel_reply])
#     #     print('listen... ' + self._channel_reply)
#     #     for item in pubsub.listen():
#     #         # print('%s : %s' % ('reader', item['data']))
#     #         print(type(item['data']))
#     #         if type(item['data']) is bytes:
#     #             obj = json.loads(item['data'].decode("utf-8"))
#     #             # print(json.dumps(obj, indent=4))
#     #             mtype = obj['sensor']['type']
#     #             if (mtype == 'data'):
#     #                 # do something with data
#     #                 # send data
#     #                 self._main_queue.put(obj['payload'])


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
            # print('%s : %s' % ('reader', item['data']))
            # print(type(item['data']))
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
                    # check sensor process_list by sending keep_alive
                    # print(list(self._sensor_process.items()))

                    # check if SensorModule existing in database else create it
                    # SensorModule.objects.all()
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
                            "pkid": str(sm.pk)},
                        "payload": {"channel_reply": obj['payload']['channel_reply'],
                                    "channel_pub": "sensor_publish_channel", "data": "nan"}})
                    # publish to sensor channel_reply
                    # self._db.publish("init", objack)
                    self._db.publish(obj['payload']['channel_reply'], objack)
                    # publish init message to SPC channel
                    # self._db.publish(self._channel_pub_spc, obj)


class SensorWorkerD(SyncConsumer):
    _db = None
    _sensor_process = None

    def __init__(self, scope):
        super().__init__(scope)
        redis_host = None
        redis_port = None
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
        self._db = redis.StrictRedis(host=redis_host, port=redis_port)
        print("init")
        p = Sub(main_queue)
        p.start()

    # handler definition by type of message
    def sensor_message(self, message):
        print("Message to worker sensor_message ", message)
        # publish to sensor channel_reply
        json_data = ast.literal_eval(str(message))
        channel_reply = "sensor_" + json_data['message']['sensor']['uid']
        print(channel_reply)
        print(json_data['message'])
        self._db.publish(channel_reply, json_data['message'])
        # objd = json.dumps({
        #     "sensor": {
        #         "type": "init",
        #         "os": "win",
        #         "uid": 1},
        #     "payload": {"channel_reply": "cr", "data": "nan"}})
        # objl = json.loads(objd)
        # main_queue.put(objl['payload'])
