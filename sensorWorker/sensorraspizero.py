import multiprocessing
import sys
import redis
import json
import ast
import uuid, time
import configparser, os

config = configparser.ConfigParser()
CONFIGFILE = 'config_sensorraspizero.ini'


# Just a small function to write the file
def write_file(filename):
    config.write(open(filename, 'w'))


class Worker(multiprocessing.Process):
    _channel_pub = None
    _db = None
    _sid = None

    def __init__(self, uuid, pkid, channel_pub):
        super().__init__()
        self._db = None
        self._channel_pub = channel_pub
        self.uuid = uuid
        self.pkid = pkid

    def run(self):
        config.read(CONFIGFILE)
        self._db = redis.StrictRedis(host=config.get('redis', 'host'), port=config.get('redis', 'port'))
        print('Worker starting...')
        print(sys.version)  # check python version
        objd = json.dumps({
            "sensor": {
                "type": "data",
                "os": "win",
                "uuid": self.uuid,
                "pkid": str(self.pkid)},
            "payload": {
                "id": 1, "xbeeid": "1", "type": "discovery", "vbatt": 4.32,
                "ptrans": 30, "pcheck": 90}})
        while True:
            self._db.publish(self._channel_pub, objd)
            time.sleep(2)


if __name__ == '__main__':
    redis_host = None
    redis_port = None
    sensor_uuid = None
    if not os.path.exists(CONFIGFILE):
        config['redis'] = {'host': '192.168.1.70', 'port': '6379'}
        suuid = str(uuid.uuid4())
        config['sensor'] = {'uuid': suuid, 'type': 'standard'}
        write_file(CONFIGFILE)
        config.read(CONFIGFILE)
        redis_host = config.get('redis', 'host')
        redis_port = config.get('redis', 'port')
        sensor_uuid = config.get('sensor', 'uuid')
    else:
        config.read(CONFIGFILE)
        redis_host = config.get('redis', 'host')
        redis_port = config.get('redis', 'port')
        sensor_uuid = config.get('sensor', 'uuid')
        # Check if file has section
        try:
            config.get('testing', 'test3')
        # If it doesn't i.e. An exception was raised
        except configparser.NoSectionError:
            print("NO OPTION CALLED TEST 3")
            # Delete this section, you can also use config.remove_option
            # config.remove_section('testing')
            # config.remove_option('testing', 'test2')
            # write_file(CONFIGFILE)

    myredis = redis.StrictRedis(host=redis_host, port=redis_port)
    channel_reply = "sensor_" + sensor_uuid
    objd = json.dumps({
        "sensor": {
            "type": "init",
            "os": "rasppizero",
            "uuid": sensor_uuid},
        "payload": {"channel_reply": channel_reply, "data": "nan"}})
    objl = json.loads(objd)
    ack = False
    while True:
        timeout = 10  # [seconds]
        timeout_start = time.time()
        # wait for response on channel_reply
        print('subscribe to channel: ' + objl['payload']['channel_reply'])
        pubsub = myredis.pubsub()
        pubsub.subscribe([objl['payload']['channel_reply']])
        # publish sensor subscribe
        print('publish to sensor_worker: ' + objl['sensor']['uuid'])
        myredis.publish('subsensor', objd)
        while time.time() < timeout_start + timeout:
            item = pubsub.get_message()
            if item:
                print('receive : %s' % (item['data']))
                if type(item['data']) is bytes:
                    obj = json.loads(item['data'].decode("utf-8"))
                    # print(json.dumps(obj, indent=4))
                    mtype = obj['sensor']['type']
                    if (mtype == 'ack'):
                        # start worker process
                        p = Worker(sensor_uuid, obj['sensor']['pkid'], obj['payload']['channel_pub'])
                        p.start()
                        ack = True
                        break
            # do something with the message
            time.sleep(0.001)  # be nice to the system :)
        if ack:
            break

    # wait for channel message
    print("exit first loop")
    pubsub = myredis.pubsub()
    pubsub.subscribe([objl['payload']['channel_reply']])
    for item in pubsub.listen():
        print('receive : %s' % (item['data']))
        if type(item['data']) is bytes:
            json_data = ast.literal_eval(item['data'].decode("utf-8"))
            print(json.dumps(obj, indent=4))
            mtype = obj['sensor']['type']

    # jobs = []
    # for i in range(2):
    #     p = multiprocessing.Process(target=sub, args=(i,'reader' + str(i)))
    #     jobs.append(p)
    #     p.start()
