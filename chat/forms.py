from django import forms
from .models import GroupMessage


class SendMessageForm(forms.ModelForm):
    class Meta:
        model = GroupMessage
        fields = ['body']
        widgets = {
            'body': forms.Textarea(attrs={
                'rows': 1,  
                'cols': 60,
            }),
        }

    def __init__(self, *args, **kwargs):
        super(SendMessageForm, self).__init__(*args, **kwargs)
        self.fields['body'].label = ''
        
