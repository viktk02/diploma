from django.contrib.sitemaps import Sitemap
from django.urls import reverse
from reports.models import Report
from schedule.models import Event
from pages.models import Page

class ReportSitemap(Sitemap):
    changefreq = "weekly"
    priority = 0.7

    def items(self):
        return Report.objects.filter(status=Report.Status.PUBLISHED)

    def lastmod(self, obj):
        return obj.date_edited
    
    def location(self, obj):
        return f"/reports/{obj.slug}/"

class EventSitemap(Sitemap):
    changefreq = "weekly"
    priority = 0.7

    def items(self):
        return Event.objects.filter(status=Event.Status.PUBLISHED)

    def lastmod(self, obj):
        return obj.updated_at
    
    def location(self, obj):
        return f"/events/{obj.slug}/"

class PageSitemap(Sitemap):
    changefreq = "monthly"
    priority = 0.8

    def items(self):
        return Page.objects.filter(is_active=True)

    def lastmod(self, obj):
        return obj.updated_at
    
    def location(self, obj):
        return f"/{obj.slug}/"

sitemaps = {
    "pages": PageSitemap,
    "reports": ReportSitemap,
    "events": EventSitemap,
}