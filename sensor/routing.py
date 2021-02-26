from django.urls import path
from . import consumers

websocket_urlpatterns = [
    path('sensor/sock/', consumers.SensorConsumer.as_asgi()),
]
