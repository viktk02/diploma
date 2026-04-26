from django.urls import path
from .views import ReportViewSet, ReportDetailView

report_list = ReportViewSet.as_view({"get": "list"})

urlpatterns = [
    path("reports/", report_list, name="report-list"),
    path("reports/<slug:slug>/", ReportDetailView.as_view(), name="report-detail"),
]
