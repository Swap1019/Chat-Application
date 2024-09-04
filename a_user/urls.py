from django.urls import path
from .views import (
    SignUp,
    UserLoginView,
    UserLogoutView,
    )

app_name = 'a_user'

urlpatterns = [
    path("signup", SignUp.as_view(), name="sign-up"),
    path("login", UserLoginView.as_view(), name="log-in"),
    path("logout", UserLogoutView.as_view(), name="log-out"),
]