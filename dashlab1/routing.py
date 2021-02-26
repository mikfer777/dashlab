from channels.routing import ProtocolTypeRouter, URLRouter, ChannelNameRouter
from channels.auth import AuthMiddlewareStack
import sensor.routing
from sensorWorker import  sensorWorkerd
from sensorWorker.sensorWorkerd import SensorWorkerD
#
# application = ProtocolTypeRouter({
#     'websocket': AuthMiddlewareStack(
#         URLRouter(
#             sensor.routing.websocket_urlpatterns
#         ),
#     ),
#     'channel': ChannelNameRouter({
#         "sensor_worker": SensorWorkerD,
#     })
#
# })
