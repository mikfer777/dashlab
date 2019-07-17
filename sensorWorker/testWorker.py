import json
import multiprocessing
import sys
import time
from multiprocessing import Queue

import redis
import serial
from asgiref.sync import async_to_sync
from channels.consumer import SyncConsumer
from channels.layers import get_channel_layer

jsonBSz = 220  # json buffer size
structSz = 24  # size of structure without payload
pSz = 2  # size position
pSS = 3  # position structure start
posCSmax = pSS + jsonBSz + structSz
q = Queue()  # inter comm process worker and TestWorker


def pub(i):
    myredis = redis.StrictRedis(host='192.168.99.100', port=6379)
    for n in range(10):
        myredis.publish('channel', 'blah %d' % n)
        print('publish: %s' % n)
        # time.sleep(5)


def sub(i, name):
    myredis = redis.StrictRedis(host='192.168.99.100', port=6379)
    print('sub:', name)
    channel_layer = get_channel_layer()
    pubsub = myredis.pubsub()
    pubsub.subscribe(['channel'])
    for item in pubsub.listen():
        print('%s : %s' % (name, item['data']))
        print(type(item['data']))
        if type(item['data']) is bytes:
            s = item['data'].decode("utf-8")
            print('send message: %s' % s)
            send_sensor_message(channel_layer,{'name': name, 'data': s})


def computeChecksum(data):
    cs = data[pSz]
    for b in data[pSS:posCSmax]:
        cs ^= b
    return cs


def checkDataIntegrity(data):
    # check preambule must be x06x85
    if len(data) > pSz + 1:
        # print("0x06= " + str(data[0]))
        # print("0x85= " + str(data[1]))
        if data[0] == 0x06 and data[1] == 0x85:
            # verify Checksum
            if len(data) >= posCSmax:
                cs = data[data[pSz] + 3]
                if cs == computeChecksum(data):
                    return True
    return False


def convertBinData(data):
    s = ''
    for b in data:
        if (b == 0): break
        s += chr(b)
    return s


def extractStruct(data):
    endpointUITarget = convertBinData(data[pSS:pSS + 14])
    hostnameTarget = int.from_bytes(data[pSS + 15:pSS + 16], byteorder='little')
    messageId = int.from_bytes(data[pSS + 17:pSS + 18], byteorder='little')
    status = data[pSS + 19]
    xbeeid = int.from_bytes(data[pSS + 20:pSS + 21],
                            byteorder='little')
    xbeeNetworkId = int.from_bytes(data[pSS + 22:pSS + 23],
                                   byteorder='little')
    jpayload = json.loads(convertBinData(data[pSS + 24:pSS + 24 + jsonBSz]))

    return json.dumps({
        "endpointUITarget": endpointUITarget,
        "hostnameTarget": hostnameTarget,
        "messageId": messageId,
        "status": status,
        "xbeeid": xbeeid,
        "xbeeNetworkId": xbeeNetworkId,
        "payload": jpayload,
    })


# {"prog":{"ptrans":30, "pchk":600}}
def buildProgOrder(trans, check):
    msg = [0] * (posCSmax + 1)
    print("size msg= " + str(len(msg)))
    msg[0] = 0x06
    msg[1] = 0x85
    msg[2] = jsonBSz + structSz  # full size
    url = "scratch"
    for i in range(len(url)):
        msg[pSS + i] = ord(url[i])
    payload = json.dumps({
        "prog": {
            "ptrans": trans,
            "pchk": check}})
    for i in range(len(payload)):
        msg[pSS + 24 + i] = ord(payload[i])

    return msg


def send_sensor_message(channel_layer, message):
    # Send message to room group
    async_to_sync(channel_layer.group_send)(
        'sensor_room',
        {
            'type': 'sensor_message',
            'message': message
        }
    )


def send_arduino_message(arduino, message):
    tp = int(message['trans_period'])
    cp = int(message['check_period'])
    msg = buildProgOrder(tp, cp)
    cs = computeChecksum(msg)
    msg[msg[pSz] + 3] = cs
    obj = json.loads(extractStruct(msg))
    print(json.dumps(obj, indent=4))
    arduino.write(msg)
    arduino.flush()


def worker(num, q):
    """thread worker function"""
    print('Worker:', num)
    print(sys.version)  # check python version
    print(serial.__version__)  # check pyserial version
    channel_layer = get_channel_layer()
    alreadySend = False
    arduino = serial.Serial('COM5', 57600, timeout=2)
    time.sleep(1)  # give the connection a second to settle
    while True:
        if not q.empty():
            message = q.get()
            print(message)
            if message['type'] == 'xbeeprog':
                send_arduino_message(arduino, message)
        data = arduino.read(1000)
        if data:
            print(data)

            if checkDataIntegrity(data):
                print("good message")
                obj = json.loads(extractStruct(data))
                xid = obj['payload']['xbeeid']
                vbatt = obj['payload']['vbatt']
                ptrans = obj['payload']['period_trans']
                pcheck = obj['payload']['period_check']
                mid = obj['messageId']
                send_sensor_message(channel_layer,
                                    {'id': str(mid), 'xbeeid': str(1), 'type': 'discovery', 'vbatt': vbatt,
                                     'ptrans': ptrans, 'pcheck': pcheck})


class TestWorker(SyncConsumer):

    def __init__(self, scope):
        super().__init__(scope)
        print("init")
        myredis = redis.StrictRedis(host='192.168.99.100', port=6379)
        jobs = []
        for i in range(2):
            p = multiprocessing.Process(target=sub, args=(i, 'reader' + str(i)))
            jobs.append(p)
            p.start()

        # for i in range(1):
        #     p = multiprocessing.Process(target=worker, args=(i, q))
        #     jobs.append(p)
        #     p.start()

    def triggerWorker(self, message):
        print(self.channel_name)
        async_to_sync(self.channel_layer.group_add)("sensor_room", self.channel_name)
        async_to_sync(self.channel_layer.group_send)(
            "sensor_room",
            {
                'type': "sensor_message",
                'msg': "sent from worker",
            })

    # handler definition by type of message
    def sensor_message(self, message):
        print("Message to worker sensor_message ", message)
        q.put(message['message'])
        # self.triggerWorker(message)
