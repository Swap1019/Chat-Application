from django.contrib import admin
from .models import (
    Group,
    GroupMessage
)
# Register your models here.
class GroupAdmin(admin.ModelAdmin):
    list_display = ['group_name','groupchat_name','admin','is_private','pk']
    list_filter = ['group_name','groupchat_name','admin','is_private']

class GroupMessageAdmin(admin.ModelAdmin):
    list_display = ['group','author','created','pk']
    list_filter = ['group','author','created']


admin.site.register(Group,GroupAdmin)
admin.site.register(GroupMessage,GroupMessageAdmin)