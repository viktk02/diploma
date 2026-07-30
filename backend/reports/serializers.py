from rest_framework import serializers
from .models import Report
from core.sanitizer import sanitize_html

class ReportListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Report
        fields = ['id', 'title', 'slug', 'preview','date_published', 'image']
    
    def validate(self, data):
        return data

class ReportDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = Report
        fields = ['id', 'title', 'slug', 'content', 'date_published', 'image']

    def to_representation(self, instance):
        data = super().to_representation(instance)
        data['content'] = sanitize_html(data.get('content'))
        return data
    
    def validate(self, data):
        return data