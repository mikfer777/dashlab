import json
import multiprocessing
import sys
import time

import serial
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from django.core.management import BaseCommand
from channels.consumer import SyncConsumer

jsonBSz = 220  # json buffer size
structSz = 24  # size of structure without payload
pSz = 2  # size position
pSS = 3  # position structure start
posCSmax = pSS + jsonBSz + structSz


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
def buildProgOrder():
    msg = [0] * (posCSmax + 1)
    print("size msg= " + str(len(msg)))
    msg[0] = 0x06
    msg[1] = 0x85
    msg[2] = jsonBSz + structSz  # full size
    url = "scratch"
    for i in range(len(url)):
        msg[pSS + i] = ord(url[i])
    # hostnameTarget = 1
    # msg[pSS + 15:pSS + 16] = hostnameTarget.to_bytes(2, 'little')
    # messageId = 999
    # msg[pSS + 17:pSS + 18] = messageId.to_bytes(2, 'big')
    # msg[pSS + 19] = 0x00
    # xbeeid = 1
    # msg[pSS + 20:pSS + 21] = xbeeid.to_bytes(2, 'big')
    # xbeeNetworkId = 1
    # msg[pSS + 22:pSS + 23] = xbeeNetworkId.to_bytes(2, 'big')
    payload = json.dumps({
        "prog": {
            "ptrans": 20,
            "pchk": 600,
            "narco": 800000.25}})
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


class TestWorker(SyncConsumer):
    print('SyncConsumer:')
    #handler definition by type of message
    def sensor_message(self, message):
        print("Message to worker sensor_message ", message)


def worker(num):
    """thread worker function"""
    print('Worker:', num)
    print(sys.version)  # check python version
    print(serial.__version__)  # check pyserial version
    channel_layer = get_channel_layer()
    alreadySend = False
    arduino = serial.Serial('COM5', 57600, timeout=2)
    time.sleep(1)  # give the connection a second to settle
    while True:
        data = arduino.read(1000)
        if data:
            if checkDataIntegrity(data):
                print("good message")
                obj = json.loads(extractStruct(data))
                x = obj['payload']['vbatt']
                y = obj['messageId']
                send_sensor_message(channel_layer,{'id': str(y), 'type': 'discovery'})



# The class must be named Command, and subclass BaseCommand
class Command(BaseCommand):

    # A command must define handle()
    def handle(self, *args, **options):
        jobs = []
        p = multiprocessing.Process(target=worker, args=(1,))
        jobs.append(p)
        p.start()
        p2 = multiprocessing.Process(target=TestWorker, args=(1,))
        jobs.append(p2)
        p2.start()
