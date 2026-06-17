from django.contrib import admin
from django.core.exceptions import PermissionDenied


class ShortTitleMixin:
    """Короткі заголовки вкладок замість «Виберіть X щоб змінити»."""

    admin_list_title: str | None = None
    admin_add_title: str | None = None

    def _list_title(self) -> str:
        if self.admin_list_title:
            return self.admin_list_title
        opts = self.model._meta
        return str(opts.verbose_name_plural or opts.verbose_name)

    def _add_title(self) -> str:
        if self.admin_add_title:
            return self.admin_add_title
        return f'Додати {self.model._meta.verbose_name}'

    def changelist_view(self, request, extra_context=None):
        extra_context = extra_context or {}
        extra_context.setdefault('title', self._list_title())
        return super().changelist_view(request, extra_context=extra_context)

    def add_view(self, request, form_url='', extra_context=None):
        extra_context = extra_context or {}
        extra_context.setdefault('title', self._add_title())
        return super().add_view(request, form_url, extra_context=extra_context)

    def change_view(self, request, object_id, form_url='', extra_context=None):
        extra_context = extra_context or {}
        obj = self.get_object(request, object_id)
        if obj is not None:
            extra_context.setdefault('title', str(obj))
        return super().change_view(request, object_id, form_url, extra_context=extra_context)


class EditorAccessMixin:
    def has_module_perms(self, request, app_label):
        return request.user.is_active and request.user.is_editor

    def has_view_permission(self, request, obj=None):
        return request.user.is_active and request.user.is_editor

    def has_add_permission(self, request):
        return request.user.is_active and request.user.is_editor

    def has_change_permission(self, request, obj=None):
        return request.user.is_active and request.user.is_editor

    def has_delete_permission(self, request, obj=None):
        return request.user.is_active and request.user.is_editor


class RootOnlyMixin:
    def has_module_perms(self, request, app_label):
        return request.user.is_active and request.user.is_root

    def has_view_permission(self, request, obj=None):
        return request.user.is_active and request.user.is_root

    def has_add_permission(self, request):
        return request.user.is_active and request.user.is_root

    def has_change_permission(self, request, obj=None):
        return request.user.is_active and request.user.is_root

    def has_delete_permission(self, request, obj=None):
        return request.user.is_active and request.user.is_root