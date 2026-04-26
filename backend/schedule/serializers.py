from rest_framework import serializers
from .models import Event

class EventListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = ['id', 'title', 'slug', 'date', 'image']
    
    def validate(self, data):
        return data

class EventDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = ['id', 'title', 'slug', 'description', 'date', 'location', 'image']
    
    def validate(self, data):
        return data