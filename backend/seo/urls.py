from django.urls import path

from .views import RedirectListAPIView

urlpatterns = [
    path("redirects/", RedirectListAPIView.as_view(), name="redirects-list"),
]
