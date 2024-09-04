from django.urls import path
from .views import (
    Home,
    ChatView,
    )

app_name = 'chat'

urlpatterns = [
    path("", Home.as_view(), name="chats"),
    path("<str:chat_id>", ChatView.as_view(), name="chatview"),
]
