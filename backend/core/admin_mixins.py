<<<<<<< HEAD
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
=======
from django.contrib import admin
from django.core.exceptions import PermissionDenied


class EditorAccessMixin:
    """
    Дає Editor і Root повний доступ до моделі в адмінці:
    перегляд, створення, редагування, видалення.
    """

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
    """
    Тільки Root має доступ до цієї моделі в адмінці.
    Editor бачить розділ але отримує 403 при спробі зайти.
    """

    def has_module_perms(self, request, app_label):
        return request.user.is_active and request.user.is_root

    def has_view_permission(self, request, obj=None):
        return request.user.is_active and request.user.is_root

    def has_add_permission(self, request):
        return request.user.is_active and request.user.is_root

    def has_change_permission(self, request, obj=None):
        return request.user.is_active and request.user.is_root

    def has_delete_permission(self, request, obj=None):
>>>>>>> c9df572 (add user model with RBAC, update reports/events, add page builder with dynamic sections)
        return request.user.is_active and request.user.is_root