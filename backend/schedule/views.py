from rest_framework import viewsets, generics, mixins
from rest_framework.exceptions import NotFound
from django.http import Http404
from .models import Event
from .serializers import EventListSerializer, EventDetailSerializer

class EventViewSet(mixins.ListModelMixin, viewsets.GenericViewSet):
    queryset = Event.objects.filter(status=Event.Status.PUBLISHED)
    serializer_class = EventListSerializer

    def get_queryset(self):
        if self.queryset.count() == 0:
            raise Http404("Events not found")
        return super().get_queryset()

class EventDetailView(generics.RetrieveAPIView):
    queryset = Event.objects.filter(status=Event.Status.PUBLISHED)
    serializer_class = EventDetailSerializer
    lookup_field = "slug"

    def get_object(self):
        try:
            return super().get_object()
        except Http404:
            raise NotFound("Event not found")