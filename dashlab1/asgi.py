"""
ASGI config for mysite project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/3.1/howto/deployment/asgi/
"""

# mysite/asgi.py
import os

from channels.auth import AuthMiddlewareStack
from channels.routing import ProtocolTypeRouter, URLRouter, ChannelNameRouter
from django.core.asgi import get_asgi_application
import sensor.routing
from sensor.consumers import SensorConsumer
from sensorWorker.sensorWorkerd import SensorWorkerD

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "dashlab1.settings")

application = ProtocolTypeRouter({
    "http": get_asgi_application(),
    "websocket": AuthMiddlewareStack(
        URLRouter(
            sensor.routing.websocket_urlpatterns
        ),

    ),
    'channel': ChannelNameRouter({
        "sensor_worker": SensorWorkerD.as_asgi(),
    })

})
