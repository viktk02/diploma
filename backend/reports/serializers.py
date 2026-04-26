from rest_framework import serializers
from .models import Report

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
    
    def validate(self, data):
        return data