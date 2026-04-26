from django.urls import path
from .views import EventViewSet, EventDetailView

event_list = EventViewSet.as_view({"get": "list"})

urlpatterns = [
    path("events/", event_list, name="event-list"),
    path("events/<slug:slug>/", EventDetailView.as_view(), name="event-detail"),
]
