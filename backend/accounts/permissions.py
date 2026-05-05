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
        )