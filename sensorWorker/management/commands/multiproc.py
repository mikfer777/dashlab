import multiprocessing
import sys
import redis
import serial
from django.core.management.base import BaseCommand
import json
import uuid, time


class Worker(multiprocessing.Process):
    _channel_reply = None
    _db = None
    _sid = None

    def __init__(self, sid, channel_reply):
        super().__init__()
        self._db = None
        self._channel_reply = channel_reply
        self.sid = sid

    def run(self):
        self._db = redis.Redis(host='192.168.99.100', port=6379, db=0)
        print('Worker starting...')
        print(sys.version)  # check python version
        objd = json.dumps({
            "sensor": {
                "type": "data",
                "os": "win",
                "uid": self.sid},
            "payload": {
                "id": 1, "xbeeid": "1", "type": "discovery", "vbatt": 4.32,
                "ptrans": 30, "pcheck": 90}})
        while True:
            self._db.publish(self._channel_reply, objd)
            time.sleep(1)


class Command(BaseCommand):

    # A command must define handle()
    def handle(self, *args, **options):
        myredis = redis.StrictRedis(host='192.168.99.100', port=6379)
        sid = str(uuid.uuid4())
        channel_reply = "sensor_" + sid
        objd = json.dumps({
            "sensor": {
                "type": "init",
                "os": "win",
                "uid": sid},
            "payload": {"channel_reply": channel_reply, "data": "nan"}})
        objl = json.loads(objd)
        # publish sensor subscribe
        print('publish to sensor_worker: ' + objl['sensor']['uid'])
        myredis.publish('subsensor', objd)

        # wait for response on channel_reply
        print('subscribe to channel: ' + objl['payload']['channel_reply'])
        pubsub = myredis.pubsub()
        pubsub.subscribe([objl['payload']['channel_reply']])
        for item in pubsub.listen():
            # print('receive : %s' % (item['data']))
            if type(item['data']) is bytes:
                obj = json.loads(item['data'].decode("utf-8"))
                # print(json.dumps(obj, indent=4))
                mtype = obj['sensor']['type']
                if (mtype == 'ack'):
                    # start worker process
                    p = Worker(sid, objl['payload']['channel_reply'])
                    p.start()

        # jobs = []
        # for i in range(2):
        #     p = multiprocessing.Process(target=sub, args=(i,'reader' + str(i)))
        #     jobs.append(p)
        #     p.start()
