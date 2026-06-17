from django.contrib import admin
from .models import Event
from core.admin_mixins import EditorAccessMixin, ShortTitleMixin

@admin.register(Event)
class EventAdmin(EditorAccessMixin, ShortTitleMixin, admin.ModelAdmin):
    list_display = ('title', 'status', 'date', 'location')
    list_filter = ('status', 'date')
    search_fields = ('title', 'description')
    ordering = ('-date',)
    fields = ('title', 'slug', 'description', 'date', 'location', 'image', 'status')
    readonly_fields = ('slug',)
    list_editable = ('status',)
    list_per_page = 10
    list_max_show_all = 100
    list_max_show_all = 100