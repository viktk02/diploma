from django.db.models import Q
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import serializers
from rest_framework.throttling import AnonRateThrottle
from reports.models import Report
from schedule.models import Event   
from pages.models import Page            

class SearchRateThrottle(AnonRateThrottle):
    scope = 'search'

class ReportSearchSerializer(serializers.Serializer):
    type = serializers.SerializerMethodField()
    id = serializers.IntegerField()
    title = serializers.CharField()
    slug = serializers.CharField()
    preview = serializers.CharField()
    date_published = serializers.DateTimeField()
    image = serializers.ImageField()

    def get_type(self, obj):
        return "report"


class EventSearchSerializer(serializers.Serializer):
    type = serializers.SerializerMethodField()
    id = serializers.IntegerField()
    title = serializers.CharField()
    slug = serializers.CharField()
    description = serializers.CharField()
    date = serializers.DateTimeField()
    image = serializers.ImageField()

    def get_type(self, obj):
        return "event"


class PageSearchSerializer(serializers.Serializer):
    type = serializers.SerializerMethodField()
    id = serializers.IntegerField()
    title = serializers.CharField()
    key = serializers.CharField()
    meta_description = serializers.CharField()

    def get_type(self, obj):
        return "page"

class SearchView(APIView):
    throttle_classes = [SearchRateThrottle]

    def get(self, request):
        query = request.GET.get("q", "").strip()
        filter_type = request.GET.get("type", "")

        if len(query) < 2:
            return Response({
                "query": query,
                "results": [],
                "total": 0,
                "error": "Запит має містити мінімум 2 символи.",
            })

        results = []

        if not filter_type or filter_type == "report":
            reports = Report.objects.filter(
                status=Report.Status.PUBLISHED
            ).filter(
                Q(title__icontains=query) |
                Q(preview__icontains=query) |
                Q(content__icontains=query) |
                Q(slug__icontains=query)
            ).distinct()[:10]
            results += ReportSearchSerializer(
                reports, many=True, context={"request": request}
            ).data

        if not filter_type or filter_type == "event":
            events = Event.objects.filter(
                status=Event.Status.PUBLISHED
            ).filter(
                Q(title__icontains=query) |
                Q(description__icontains=query) |
                Q(location__icontains=query) |
                Q(slug__icontains=query)
            ).distinct()[:10]
            results += EventSearchSerializer(
                events, many=True, context={"request": request}
            ).data

        if not filter_type or filter_type == "page":
            pages = Page.objects.filter(
                is_active=True
            ).filter(
                Q(title__icontains=query) |
                Q(meta_title__icontains=query) |
                Q(meta_description__icontains=query) |
                Q(sections__title__icontains=query) |
                Q(sections__subtitle__icontains=query) |
                Q(sections__content__icontains=query)
            ).distinct()[:5]
            results += PageSearchSerializer(
                pages, many=True, context={"request": request}
            ).data

        return Response({
            "query": query,
            "results": results,
            "total": len(results),
        })