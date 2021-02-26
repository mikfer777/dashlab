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



class SensorWorkerD2(SyncConsumer):


    def __init__(self, *args, **kwargs):
        super().__init__()
        print("init")


    # handler definition by type of message
    def sensor_message(self, message):
        print("Message to worker sensor_message ", message)

