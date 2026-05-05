from django.urls import path
from . import views

app_name = 'accounts'

urlpatterns = [
    path('profile/', views.profile_view, name='profile'),
    path('profile/2fa/', views.setup_2fa_view, name='setup-2fa'),
    path('profile/2fa/disable/', views.disable_2fa_view, name='disable-2fa'),
    path('profile/2fa/verify/', views.verify_2fa_view, name='verify-2fa'),
]