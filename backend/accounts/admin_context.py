from django.contrib import admin


def admin_template_context(request, **extra):
    """Контекст адмінки (site_title тощо) для кастомних сторінок."""
    return {
        **admin.site.each_context(request),
        **extra,
    }
