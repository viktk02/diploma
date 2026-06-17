from django.apps import AppConfig


class CoreConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'core'

    def ready(self):
        from django.contrib import admin

        admin.site.site_header = 'Місто Сили — адміністрування'
        admin.site.site_title = 'Місто Сили'
        admin.site.index_title = 'Панель керування'
