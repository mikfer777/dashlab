import multiprocessing
import sys
import time

import serial
from django.core.management.base import BaseCommand


def worker(num):
    """thread worker function"""
    print('Worker:', num)
    print(sys.version)  # check python version
    print(serial.__version__)  # check pyserial version
    alreadySend = False
    arduino = serial.Serial('COM5', 57600, timeout=2)
    time.sleep(1)  # give the connection a second to settle
    while True:
        data = arduino.read(1000)
        if data:
            print(data)


class Command(BaseCommand):

    # A command must define handle()
    def handle(self, *args, **options):
        jobs = []
        for i in range(1):
            p = multiprocessing.Process(target=worker, args=(i,))
            jobs.append(p)
            p.start()
