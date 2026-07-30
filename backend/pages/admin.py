import nested_admin
from django import forms
from django.contrib import admin
from django.utils.html import format_html
from django_ckeditor_5.widgets import CKEditor5Widget

from core.admin_mixins import EditorAccessMixin, ShortTitleMixin
from .models import Page, PageSection, SectionImage, ContactInfo


class PageSectionForm(forms.ModelForm):
    class Media:
        js = ("admin/js/section_admin.js",)

    class Meta:
        model = PageSection
        fields = "__all__"
        widgets = {
            "content": CKEditor5Widget(config_name="extends"),
        }

    def clean(self):
        cleaned_data = super().clean()
        image = cleaned_data.get("image")
        image_alt = (cleaned_data.get("image_alt") or "").strip()
        if image and not image_alt and (not self.instance.pk or "image" in self.changed_data):
            self.add_error("image_alt", "Alt-текст обов'язковий, якщо секція містить зображення.")
        return cleaned_data


class SectionImageForm(forms.ModelForm):
    class Meta:
        model = SectionImage
        fields = "__all__"

    def clean(self):
        cleaned_data = super().clean()
        image = cleaned_data.get("image")
        alt = (cleaned_data.get("alt") or "").strip()
        if image and not alt and (not self.instance.pk or "image" in self.changed_data):
            self.add_error("alt", "Alt-текст обов'язковий, якщо фото додається до галереї.")
        return cleaned_data


class SectionImageInline(nested_admin.NestedTabularInline):
    model    = SectionImage
    form     = SectionImageForm
    extra    = 0
    fields   = ("image", "alt", "caption", "order")
    ordering = ("order",)


class PageSectionInline(nested_admin.NestedStackedInline):
    model    = PageSection
    form     = PageSectionForm
    extra    = 0
    ordering = ["order"]
    inlines  = [SectionImageInline]
    fields   = (
        "section_type",
        "order",
        "is_visible",
        "title",
        "subtitle",
        "content",
        "image",
        "image_alt",
        "button_text",
        "button_url",
        "extra_data",
    )


@admin.register(Page)
class PageAdmin(EditorAccessMixin, ShortTitleMixin, nested_admin.NestedModelAdmin):
    inlines       = [PageSectionInline]
    list_display  = ("title", "key", "is_active", "sections_count", "updated_at")
    list_filter   = ("is_active",)
    search_fields = ("title", "key", "meta_title", "meta_description")
    ordering      = ("key",)

    fieldsets = (
        ("Основне", {
            "fields": ("key", "title", "is_active"),
        }),
        ("SEO", {
            "fields": ("meta_title", "meta_description", "og_image", "robots"),
            "classes": ("collapse",),
        }),
    )

    def get_readonly_fields(self, request, obj=None):
        if obj:
            return ("key",)
        return ()

    @admin.display(description="Секцій")
    def sections_count(self, obj):
        count   = obj.sections.count()
        visible = obj.sections.filter(is_visible=True).count()
        return format_html('<span title="Всього: {}">{} видимих</span>', count, visible)


@admin.register(ContactInfo)
class ContactInfoAdmin(EditorAccessMixin, ShortTitleMixin, admin.ModelAdmin):
    fieldsets = (
        ("Основне", {
            "fields": ("organization_name", "logo", "email", "phone", "address"),
        }),
        ("Соцмережі", {
            "fields": ("facebook_url", "instagram_url", "telegram_url", "youtube_url"),
        }),
        ("Додатково", {
            "fields": ("founding_year",),
            "classes": ("collapse",),
        }),
    )

    def has_add_permission(self, request):
        return not ContactInfo.objects.exists()

    def has_delete_permission(self, request, obj=None):
        return False