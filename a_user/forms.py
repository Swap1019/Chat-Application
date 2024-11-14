from django import forms
from .models import User
from django.contrib.auth.forms import (
    UserCreationForm,
    AuthenticationForm
    )


class SignUpForm(UserCreationForm):

    class Meta:
        model = User
        fields = ['nickname','username','first_name','last_name','profile','email']
    
    def __init__(self, *args, **kwargs):
        super(SignUpForm, self).__init__(*args, **kwargs)
        for field in self.fields.values():
            field.help_text = ''
            field.label = ''

class LogInForm(AuthenticationForm):

    class Meta:
        model = User
        fields = '__all__'

    def __init__(self,*args,**kwargs):
        super(LogInForm, self).__init__(*args,**kwargs)
        for field in self.fields.values():
            field.help_text = ''
            field.label = ''