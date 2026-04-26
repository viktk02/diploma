from rest_framework import generics
from rest_framework.exceptions import NotFound
from rest_framework.response import Response
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404

from .models import Page, ContactInfo
from .serializers import PageSerializer, ContactInfoSerializer


class PageDetailView(generics.RetrieveAPIView):
    """
    GET /api/pages/<key>/
    Повертає сторінку з усіма видимими секціями.
    Next.js викликає цей endpoint при SSR для кожної сторінки.

    Приклади:
        GET /api/pages/home/
        GET /api/pages/about/
        GET /api/pages/contacts/
    """

    serializer_class = PageSerializer
    lookup_field = "key"

    def get_queryset(self):
        return Page.objects.prefetch_related("sections").filter(is_active=True)

    def get_object(self):
        queryset = self.get_queryset()
        key = self.kwargs.get("key")
        try:
            page = queryset.get(key=key)
        except Page.DoesNotExist:
            raise NotFound(f"Сторінку '{key}' не знайдено або вона неактивна.")

        # Додаємо метод до об'єкта щоб серіалізатор міг отримати видимі секції
        page.get_visible_sections = lambda: page.sections.filter(is_visible=True).order_by("order")
        return page


class ContactInfoView(APIView):
    """
    GET /api/contacts/
    Повертає контактну інформацію організації.
    Використовується в footer і на сторінці контактів.
    """

    def get(self, request):
        try:
            info = ContactInfo.objects.first()
            if not info:
                raise NotFound("Контактну інформацію ще не заповнено.")
            serializer = ContactInfoSerializer(info, context={"request": request})
            return Response(serializer.data)
        except ContactInfo.DoesNotExist:
            raise NotFound("Контактну інформацію ще не заповнено.")