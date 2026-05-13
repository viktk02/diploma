from django.urls import path
from .views import PageDetailView, ContactInfoView, AllPagesView

urlpatterns = [
    path("pages/", AllPagesView.as_view(), name="pages-list"),
    path("pages/<slug:key>/", PageDetailView.as_view(), name="page-detail"),
    path("contacts/", ContactInfoView.as_view(), name="contact-info"),
]