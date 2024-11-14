from django.shortcuts import render
from django.urls import reverse_lazy,reverse
from django.http import HttpResponseRedirect
from django.views.generic import CreateView
from django.contrib.auth.views import LoginView,LogoutView
from .forms import SignUpForm,LogInForm

#----------Authentication------------
class SignUp(CreateView):
    form_class = SignUpForm
    template_name = 'a_user/sign_up.html'

    def form_valid(self,form):
        user = form.save(commit=False)
        user.is_active = True
        user.save()
        return HttpResponseRedirect(reverse('a_user:log-in'))


class UserLoginView(LoginView):
    template_name = 'a_user/login.html'
    form_class = LogInForm
    redirect_authenticated_user = True
    def get_success_url(self):
        return reverse_lazy('chat:chats')
    
class UserLogoutView(LogoutView):
    
    def get_success_url(self):
        return reverse_lazy('a_user:log-in')
