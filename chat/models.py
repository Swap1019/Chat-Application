from django.db import models
from a_user.models import User
import shortuuid


class Group(models.Model):
    group_name = models.CharField(max_length=128,unique=True,default=shortuuid.uuid)
    groupchat_name = models.CharField(max_length=128,null=True,blank=True)
    group_profile = models.ImageField(upload_to='group_profiles',null=True,blank=True)
    admin = models.ForeignKey(User,related_name='groupchats',blank=True,null=True,on_delete=models.SET_NULL)
    users_online = models.ManyToManyField(User, related_name='online_in_groups',blank=True)
    members = models.ManyToManyField(User, related_name='chat_groups',blank=True)
    last_message = models.ForeignKey('GroupMessage',to_field='created',on_delete=models.SET_NULL,null=True,blank=True,related_name='chatgroup_lastmessage')
    is_private = models.BooleanField(default=False)

    def __str__(self):
        return self.group_name
    
    
class GroupMessage(models.Model):
    group = models.ForeignKey(Group,related_name='chat_messages',on_delete=models.CASCADE)
    author = models.ForeignKey(User,on_delete=models.CASCADE)
    body = models.TextField(blank=True,null=True)
    created = models.DateTimeField(auto_now_add=True,unique=True)

    def __str__(self):
        return f'{self.author.username}:{self.body}'

    class Meta:
        ordering = ['created']
        get_latest_by = ['created']


