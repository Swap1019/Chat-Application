from typing import Any
from django.db.models.query import QuerySet
from django.shortcuts import render,get_object_or_404
from django.views.generic import TemplateView,ListView
from django.views.generic.edit import FormMixin
from django.contrib.auth.mixins import LoginRequiredMixin
from .forms import SendMessageForm
from a_user.models import (
    User,
)
from .models import (
    GroupMessage,
    Group,
    )

class Home(LoginRequiredMixin,ListView):
    template_name = 'chat/index.html'
    context_object_name = 'chats'
    
    def get_queryset(self):
        user = get_object_or_404(User,id=self.request.user.id)
        return user.chat_groups.all



class ChatView(LoginRequiredMixin,FormMixin,ListView):
    template_name = 'chat/index.html'
    context_object_name = 'chat'
    model = Group
    form_class = SendMessageForm

    def get_queryset(self):
        global chat
        chat = Group.objects.get(group_name=self.kwargs.get('chat_id'))
        return chat

    def get_context_data(self, **kwargs: Any):
        context = super().get_context_data(**kwargs)
        user = get_object_or_404(User,id=self.request.user.id)
        context['chats'] = user.chat_groups.all
        context['messages'] = chat.chat_messages.all()
        return context
