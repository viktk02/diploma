from django import forms
from django.contrib import admin
from .models import Report
from django_ckeditor_5.widgets import CKEditor5Widget
from core.admin_mixins import EditorAccessMixin

class ContentAdminForm(forms.ModelForm):
    class Meta:
        model = Report
        fields = '__all__'
        widgets = {
            'content': CKEditor5Widget(config_name='extends'),
        }

@admin.register(Report)
class ReportAdmin(EditorAccessMixin, admin.ModelAdmin):
    form = ContentAdminForm
    readonly_fields = ('slug',)
    list_display = ('title', 'status','date_created','date_edited','date_published')
    list_filter = ('status',)
    list_editable = ('status',)
    search_fields = ('title', 'content', 'preview')
    ordering = ('-status','-date_published','-date_created','-date_edited')
    date_hierarchy = 'date_published'
    fields = ('title', 'slug', 'preview', 'content', 'date_published', 'image', 'status')
