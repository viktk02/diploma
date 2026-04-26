<<<<<<< HEAD
from rest_framework.permissions import BasePermission


class IsRoot(BasePermission):
    message = "Доступ лише для Root-адміністратора."

    def has_permission(self, request, view):
        return bool(
            request.user
            and request.user.is_authenticated
            and request.user.is_root
        )


class IsEditor(BasePermission):
    message = "Доступ лише для авторизованих редакторів."

    def has_permission(self, request, view):
        return bool(
            request.user
            and request.user.is_authenticated
            and request.user.is_editor
=======
from rest_framework.permissions import BasePermission


class IsRoot(BasePermission):
    """Тільки Root може виконувати цю дію."""
    message = "Доступ лише для Root-адміністратора."

    def has_permission(self, request, view):
        return bool(
            request.user
            and request.user.is_authenticated
            and request.user.is_root
        )


class IsEditor(BasePermission):
    """Root і Editor можуть виконувати цю дію."""
    message = "Доступ лише для авторизованих редакторів."

    def has_permission(self, request, view):
        return bool(
            request.user
            and request.user.is_authenticated
            and request.user.is_editor
>>>>>>> c9df572 (add user model with RBAC, update reports/events, add page builder with dynamic sections)
        )