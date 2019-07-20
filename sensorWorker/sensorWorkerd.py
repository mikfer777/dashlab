import json
import multiprocessing
import sys
import datetime, threading
import redis
from asgiref.sync import async_to_sync
from channels.consumer import SyncConsumer, AsyncConsumer
from multiprocessing import Process
from multiprocessing import Queue
from channels.layers import get_channel_layer
import time

main_queue = Queue()  # inter comm process worker and TestWorker


def send_sensor_message(channel_layer, message):
    # Send message to room group
    async_to_sync(channel_layer.group_send)(
        'sensor_room',
        {
            'type': 'sensor_message',
            'message': message
        }
    )

def worker(main_queue):
    print("worker:")
    channel_layer = get_channel_layer()
    while True:
        if not main_queue.empty():
            message = main_queue.get()
            print(message)
            send_sensor_message(channel_layer, message)



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


class Listen(Process):
    _db = None
    _sid = None
    _channel_reply = None
    _channel_layer = None
    _main_queue = None

    def __init__(self, sid, channel_reply, main_queue):
        super().__init__()
        self._db = None
        self._sid = sid
        self._channel_reply = channel_reply
        self._main_queue = main_queue

    def run(self):
        self._db = redis.Redis(host='192.168.99.100', port=6379, db=0)
        pubsub = self._db.pubsub()
        pubsub.subscribe([self._channel_reply])
        print('listen... ' + self._channel_reply)
        for item in pubsub.listen():
            # print('%s : %s' % ('reader', item['data']))
            print(type(item['data']))
            if type(item['data']) is bytes:
                obj = json.loads(item['data'].decode("utf-8"))
                # print(json.dumps(obj, indent=4))
                mtype = obj['sensor']['type']
                if (mtype == 'data'):
                    self._main_queue.put(obj['payload'])


class Sub(Process):
    _db = None
    _sensor_process = {}
    _main_queue = None

    def __init__(self, main_queue):
        super().__init__()
        self._db = None
        self._main_queue = main_queue
        # self.foo()

    def foo(self):
        print(datetime.datetime.now())
        threading.Timer(1, self.foo).start()

    def run(self):
        self._db = redis.Redis(host='192.168.99.100', port=6379, db=0)
        # do stuff
        print('sub:')
        pubsub = self._db.pubsub()
        pubsub.subscribe(['subsensor'])
        print('listen...')
        for item in pubsub.listen():
            # print('%s : %s' % ('reader', item['data']))
            # print(type(item['data']))
            if type(item['data']) is bytes:
                obj = json.loads(item['data'].decode("utf-8"))
                # print(json.dumps(obj, indent=4))
                mtype = obj['sensor']['type']
                if (mtype == 'init'):
                    print("sensor init")
                    p = Listen(obj['sensor']['uid'], obj['payload']['channel_reply'], self._main_queue)
                    p.start()
                    print(p.pid)
                    self._sensor_process[obj['sensor']['uid']] = p
                    # check sensor process_list by sending keep_alive
                    print(list(self._sensor_process.items()))
                    # send ack to sensor process
                    objack = json.dumps({
                        "sensor": {
                            "type": "ack",
                            "uid": "FFFF"},
                        "payload": {"channel_reply": obj['payload']['channel_reply'], "data": "nan"}})
                    # publish to sensor channel_reply
                    self._db.publish(obj['payload']['channel_reply'], objack)


class SensorWorkerD(SyncConsumer):
    _db = None
    _sensor_process = None

    def __init__(self, scope):
        super().__init__(scope)
        print("init")
        p = Sub(main_queue)
        p.start()
        print("after start")
        self.channel_layer = get_channel_layer()
        w = multiprocessing.Process(target=worker, args=(main_queue,))
        w.start()


    # handler definition by type of message
    def sensor_message(self, message):
        print("Message to worker sensor_message ", message)
        objd = json.dumps({
            "sensor": {
                "type": "init",
                "os": "win",
                "uid": 1},
            "payload": {"channel_reply": "cr", "data": "nan"}})
        objl = json.loads(objd)
        main_queue.put(objl['payload'])
