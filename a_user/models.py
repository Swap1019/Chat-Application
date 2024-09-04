from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    nickname = models.CharField(max_length=50,verbose_name="Nick Name",default='User')
    profile = models.ImageField(upload_to="user_profile",blank=True,null=True)
