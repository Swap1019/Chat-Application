# chat/routing.py
from django.urls import path
from .consumers import (
    ChatConsumer,
    ChatPreviewConsumer,
    )

websocket_urlpatterns = [
    path("ws/chat/<group_name>/", ChatConsumer.as_asgi()),
    path("ws/chat/preview/<group_name>/", ChatPreviewConsumer.as_asgi()),
]
