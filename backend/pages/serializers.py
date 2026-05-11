from rest_framework import serializers
from .models import Page, PageSection, SectionImage, ContactInfo


class SectionImageSerializer(serializers.ModelSerializer):
    class Meta:
        model  = SectionImage
        fields = ["id", "image", "alt", "caption", "order"]


class PageSectionSerializer(serializers.ModelSerializer):
    images = SectionImageSerializer(many=True, read_only=True)

    class Meta:
        model  = PageSection
        fields = [
            "id",
            "section_type",
            "title",
            "subtitle",
            "content",
            "image",
            "image_alt",
            "button_text",
            "button_url",
            "extra_data",
            "order",
            "images",
        ]


class PageSerializer(serializers.ModelSerializer):
    sections   = PageSectionSerializer(many=True, source="get_visible_sections")
    meta_title = serializers.SerializerMethodField()

    class Meta:
        model  = Page
        fields = [
            "key",
            "title",
            "meta_title",
            "meta_description",
            "og_image",
            "robots",
            "sections",
            "updated_at",
        ]

    def get_meta_title(self, obj):
        return obj.get_meta_title()


class ContactInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model  = ContactInfo
        fields = [
            "organization_name",
            "email",
            "phone",
            "address",
            "facebook_url",
            "instagram_url",
            "telegram_url",
            "youtube_url",
            "founding_year",
            "logo",
        ]

class PageNavSerializer(serializers.ModelSerializer):
    class Meta:
        model = Page
        fields = [
            'key',
            'title',
        ]