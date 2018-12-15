from channels.routing import ProtocolTypeRouter, URLRouter, ChannelNameRouter
from channels.auth import AuthMiddlewareStack
import sensor.routing
from sensorWorker import testWorker

application = ProtocolTypeRouter({
    'websocket': AuthMiddlewareStack(
        URLRouter(
            sensor.routing.websocket_urlpatterns
        ),
    ),
    'channel': ChannelNameRouter({
        "test_worker": testWorker.TestWorker,
        "test_worker2": testWorker.TestWorker2,
    })

})
