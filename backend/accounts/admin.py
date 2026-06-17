from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User
from core.admin_mixins import RootOnlyMixin, ShortTitleMixin


@admin.register(User)
class UserAdmin(RootOnlyMixin, ShortTitleMixin, BaseUserAdmin):
    list_display = ("email", "name", "role", "is_active", "google_login_allowed", "date_joined")
    list_filter = ("role", "is_active", "google_login_allowed")
    search_fields = ("email", "name")
    ordering = ("-date_joined",)
    readonly_fields = ("date_joined", "last_login", "google_sub")

    fieldsets = (
        ("Основне", {
            "fields": ("email", "name", "password"),
        }),
        ("Роль і доступ", {
            "fields": ("role", "is_active", "is_staff", "is_superuser"),
        }),
        ("Google OAuth", {
            "fields": ("google_login_allowed", "google_sub"),
            "classes": ("collapse",),
            "description": (
                "Щоб дозволити юзеру логінитись через Google — поставте галочку "
                "'Дозволити вхід через Google'. Google UID заповнюється автоматично."
            ),
        }),
        ("Дати", {
            "fields": ("date_joined", "last_login"),
            "classes": ("collapse",),
        }),
    )

    add_fieldsets = (
        (None, {
            "classes": ("wide",),
            "fields": ("email", "name", "role", "password1", "password2", "is_staff"),
        }),
    )

    class Media:
        js = ('admin/js/user_admin.js',)