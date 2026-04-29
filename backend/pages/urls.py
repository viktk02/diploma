<<<<<<< HEAD
from django.urls import path
from .views import PageDetailView, ContactInfoView

urlpatterns = [
    path("pages/<slug:key>/", PageDetailView.as_view(), name="page-detail"),
    path("contacts/", ContactInfoView.as_view(), name="contact-info"),
=======
from django.urls import path
from .views import PageDetailView, ContactInfoView

urlpatterns = [
    path("pages/<slug:key>/", PageDetailView.as_view(), name="page-detail"),
    path("contacts/", ContactInfoView.as_view(), name="contact-info"),
>>>>>>> c9df572 (add user model with RBAC, update reports/events, add page builder with dynamic sections)
]