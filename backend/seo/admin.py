from django.utils.safestring  import mark_safe
from django.contrib import admin
from core.admin_mixins import RootOnlyMixin
from .models import Redirect

@admin.register(Redirect)
class RedirectAdmin(RootOnlyMixin, admin.ModelAdmin):
    list_display = ("from_path", "to_url", "status_code", "is_active", "created_at")
    list_filter = ("status_code", "is_active")
    search_fields = ("from_path", "to_url")
    list_editable = ("is_active",)
    ordering = ("from_path",)

    def changelist_view(self, request, extra_context=None):
        extra_context = extra_context or {}
        extra_context['warning'] = mark_safe(
            '<div style="background:var(--darkened-bg);border:1px solid var(--border-color);'
            'padding:10px 15px;margin-bottom:15px;border-radius:4px;color:var(--body-fg);">'
            '⚠️ <strong>Увага:</strong> використовуйте <strong>301</strong> тільки для '
            'постійних редиректів які ніколи не зміняться — браузер кешує їх назавжди. '
            'Для тимчасових або тестових редиректів використовуйте <strong>302</strong>.'
            '</div>'
        )
        return super().changelist_view(request, extra_context=extra_context)
