from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
import sensor.routing



application = ProtocolTypeRouter({
    'websocket': AuthMiddlewareStack(
        URLRouter(
            sensor.routing.websocket_urlpatterns
        )
    ),
})
