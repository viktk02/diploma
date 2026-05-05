from django.contrib import admin
from django.core.exceptions import PermissionDenied


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