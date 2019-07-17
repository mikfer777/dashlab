import redis
from asgiref.sync import async_to_sync
from channels.consumer import SyncConsumer
from multiprocessing import Process

class Sub(Process):
    _db = None

    def __init__(self):
        super().__init__()
        self._db = None

    def run(self):
        self._db = redis.Redis(host='192.168.99.100', port=6379, db=0)
        # do stuff
        print('sub:')
        pubsub = self._db.pubsub()
        pubsub.subscribe(['channel'])
        print('listen...')
        for item in pubsub.listen():
            print('%s : %s' % ('reader', item['data']))
            print(type(item['data']))
            if type(item['data']) is bytes:
                print('yes')
                s = item['data'].decode("utf-8")
                print(s)


def send_sensor_message(channel_layer, message):
    # Send message to room group
    async_to_sync(channel_layer.group_send)(
        'sensor_room',
        {
            'type': 'sensor_message',
            'message': message
        }
    )


class SensorWorkerD(SyncConsumer):

    def __init__(self, scope):
        super().__init__(scope)
        print("init")
        p = Sub()
        p.start()

    # handler definition by type of message
    def sensor_message(self, message):
        print("Message to worker sensor_message ", message)
        q.put(message['message'])
        # self.triggerWorker(message)
