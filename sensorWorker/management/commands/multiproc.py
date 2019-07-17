import multiprocessing
import sys
import time

import redis
import serial
from django.core.management.base import BaseCommand



def pub(i):
    myredis = redis.StrictRedis(host='192.168.99.100', port=6379)
    for n in range(10):
        myredis.publish('channel', 'message' )
        print('publish: %s' % n)
        # time.sleep(5)


def sub(i, name):
    myredis = redis.StrictRedis(host='192.168.99.100', port=6379)
    print('sub:', name)
    pubsub = myredis.pubsub()
    pubsub.subscribe(['channel'])
    for item in pubsub.listen():
        print ('%s : %s' % (name, item['data']))


def worker(num):
    """thread worker function"""
    print('Worker:', num)
    print(sys.version)  # check python version
    print(serial.__version__)  # check pyserial version


class Command(BaseCommand):




    # A command must define handle()
    def handle(self, *args, **options):

        # multiprocessing.Process(target=pub, args=(myredis,)).start()
        # multiprocessing.Process(target=sub, args=(myredis, 'reader1')).start()
        # multiprocessing.Process(target=sub, args=(myredis, 'reader2')).start()


        jobs = []

        # for i in range(2):
        #     p = multiprocessing.Process(target=sub, args=(i,'reader' + str(i)))
        #     jobs.append(p)
        #     p.start()
        for i in range(1):
            p = multiprocessing.Process(target=pub, args=(i,))
            jobs.append(p)
            p.start()