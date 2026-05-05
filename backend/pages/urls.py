from django.urls import path
from .views import PageDetailView, ContactInfoView

urlpatterns = [
    path("pages/<slug:key>/", PageDetailView.as_view(), name="page-detail"),
    path("contacts/", ContactInfoView.as_view(), name="contact-info"),
]