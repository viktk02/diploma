from rest_framework import viewsets, generics, mixins
from rest_framework.exceptions import NotFound
from django.http import Http404
from .models import Report
from .serializers import ReportListSerializer, ReportDetailSerializer

class ReportViewSet(mixins.ListModelMixin, viewsets.GenericViewSet):
    queryset = Report.objects.filter(status=Report.Status.PUBLISHED)
    serializer_class = ReportListSerializer

    def get_queryset(self):
        if self.queryset.count() == 0:
            raise Http404("Reports not found")
        return super().get_queryset()

class ReportDetailView(generics.RetrieveAPIView):
    queryset = Report.objects.filter(status=Report.Status.PUBLISHED)
    serializer_class = ReportDetailSerializer
    lookup_field = "slug"

    def get_object(self):
        try:
            return super().get_object()
        except Http404:
            raise NotFound("Report not found")
    
