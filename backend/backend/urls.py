from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api-auth/', include('rest_framework.urls')),
    path('api/v1/', include('reports.urls')),
    path('api/v1/', include('schedule.urls')),
    path("api/v1/", include("pages.urls")),
    path("nested_admin/", include("nested_admin.urls")),
]

urlpatterns += [
    path("ckeditor5/", include('django_ckeditor_5.urls')),
    # path("upload/", custom_upload_function, name="custom_upload_file"),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
