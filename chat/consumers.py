import json
from django.utils import timezone
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from asgiref.sync import sync_to_async
from django.template.loader import get_template
from django.shortcuts import get_object_or_404
from .models import Group, GroupMessage


class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.user = self.scope["user"]

        # Check if user is authenticated
        if not self.user.is_authenticated:
            await self.close()
            return
        
        self.group_name = self.scope["url_route"]["kwargs"]["group_name"]

        # Fetch group asynchronously
        self.group = await sync_to_async(get_object_or_404)(Group, group_name=self.group_name)
        self.room_group_name = f"chat_{self.group_name}"

        # Join room group
        await self.channel_layer.group_add(self.room_group_name, self.channel_name)

        # Accept WebSocket connection
        await self.accept()

    async def disconnect(self, close_code):
        # Leave room group
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

    # Receive message from WebSocket
    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        if text_data_json["body"].strip():
            body = text_data_json["body"]

            global new_message
            
            new_message = await sync_to_async(GroupMessage.objects.create)(
                body=body,
                author=self.user,
                group=self.group
            )

            await self.channel_layer.group_send(
                self.room_group_name, 
                    {
                        "type": "chat_message",
                        "message": body, 
                        "username": self.user.username,
                    }
                )
    
    async def chat_message(self,event):
        user = self.user

        context = {
            "user":user,
            "message":new_message
        }

        html = get_template("chat/partials/message.html").render(context=context)

        await self.send(text_data=json.dumps({'html': html}))



class ChatPreviewConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.user = self.scope["user"]

        # Check if user is authenticated
        if not self.user.is_authenticated:
            await self.close()
            return
        
        self.group_name = self.scope["url_route"]["kwargs"]["group_name"]

        # Fetch group asynchronously
        self.group = await sync_to_async(get_object_or_404)(Group, group_name=self.group_name)
        self.room_group_name = f"chat_{self.group_name}"

        # Join room group
        await self.channel_layer.group_add(self.room_group_name, self.channel_name)

        # Accept WebSocket connection
        await self.accept()

    async def disconnect(self, close_code):
        # Leave room group
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)
    
    async def chat_message(self,event):
        user = self.user
        new_message = await self.get_last_message()
        context = {
            "user":user,
            "last_message":new_message
        }

        html = get_template("chat/partials/chat_preview.html").render(context=context)

        await self.send(text_data=json.dumps({'html': html}))
    
    @database_sync_to_async
    def get_last_message(self):
        return GroupMessage.objects.last()