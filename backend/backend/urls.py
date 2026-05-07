from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.contrib.sitemaps.views import sitemap
from seo.sitemaps import sitemaps
from seo.views import RobotsView, RedirectMiddlewareView
from core.search import SearchView


urlpatterns = [
    path('admin/', include('accounts.urls')),
    path('admin/', admin.site.urls),
    path('auth/', include('social_django.urls', namespace='social')),

    path('robots.txt', RobotsView.as_view(), name="robots"),
    path('sitemap.xml', sitemap, {'sitemaps': sitemaps}, name="sitemap"),
    
    path('api/v1/', include('reports.urls')),
    path('api/v1/', include('schedule.urls')),
    path("api/v1/", include("pages.urls")),

    path("api/v1/search/", SearchView.as_view(), name="search"),

    path("ckeditor5/", include('django_ckeditor_5.urls')),
    path("nested_admin/", include("nested_admin.urls")),

    path('<path:path>', RedirectMiddlewareView.as_view(), name='redirect'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

urlpatterns += [
    # path("upload/", custom_upload_function, name="custom_upload_file"),
] 
