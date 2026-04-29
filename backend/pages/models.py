from django.db import models
from django_ckeditor_5.fields import CKEditor5Field
from core.validators import validate_file_size
from core.utils import upload_to_factory


class Page(models.Model):
    key = models.SlugField(
        max_length=50,
        unique=True,
        help_text="Унікальний ідентифікатор сторінки (латиниця). Наприклад: home, about, contacts.",
    )
    title = models.CharField(max_length=200, verbose_name="Заголовок сторінки")
    is_active = models.BooleanField(default=True, verbose_name="Активна")

    meta_title = models.CharField(max_length=70, blank=True, verbose_name="Meta title")
    meta_description = models.CharField(max_length=160, blank=True, verbose_name="Meta description")
    og_image = models.ImageField(
        upload_to=upload_to_factory("images/og"),
        blank=True,
        validators=[validate_file_size],
        verbose_name="OG-зображення",
    )
    robots = models.CharField(max_length=50, default="index,follow", verbose_name="Robots meta")
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Сторінка"
        verbose_name_plural = "Сторінки"
        ordering = ["key"]

    def __str__(self):
        return f"{self.title} ({self.key})"

    def get_meta_title(self):
        return self.meta_title or self.title


class PageSection(models.Model):
    SECTION_TYPES = [
        ("text",     "Текстовий блок"),
        ("hero",     "Головний банер (hero)"),
        ("contacts", "Контакти"),
        ("cta",      "Заклик до дії (CTA)"),
        ("gallery",  "Галерея / Карусель"),
        ("custom",   "Довільний JSON"),
    ]

    page = models.ForeignKey(
        Page,
        on_delete=models.CASCADE,
        related_name="sections",
        verbose_name="Сторінка",
    )
    section_type = models.CharField(
        max_length=20,
        choices=SECTION_TYPES,
        default="text",
        verbose_name="Тип секції",
    )
    title    = models.CharField(max_length=200, blank=True, verbose_name="Заголовок")
    subtitle = models.CharField(max_length=300, blank=True, verbose_name="Підзаголовок")
    content  = CKEditor5Field("Контент", config_name="extends", blank=True)
    image    = models.ImageField(
        upload_to=upload_to_factory("images/sections"),
        blank=True,
        validators=[validate_file_size],
        verbose_name="Зображення",
    )
    image_alt    = models.CharField(max_length=200, blank=True, verbose_name="Alt-текст зображення")
    button_text  = models.CharField(max_length=100, blank=True, verbose_name="Текст кнопки")
    button_url   = models.CharField(max_length=500, blank=True, verbose_name="URL кнопки")
    extra_data   = models.JSONField(blank=True, null=True, verbose_name="Додаткові дані (JSON)")
    order        = models.PositiveSmallIntegerField(default=0, verbose_name="Порядок")
    is_visible   = models.BooleanField(default=True, verbose_name="Відображати")

    class Meta:
        verbose_name = "Секція"
        verbose_name_plural = "Секції"
        ordering = ["order"]

    def __str__(self):
        return f"{self.page.key} / {self.section_type} ({self.order})"


class SectionImage(models.Model):
    section = models.ForeignKey(
        PageSection,
        on_delete=models.CASCADE,
        related_name="images",
        verbose_name="Секція",
    )
    image   = models.ImageField(
        upload_to=upload_to_factory("images/carousel"),
        validators=[validate_file_size],
        verbose_name="Фото",
    )
    alt     = models.CharField(max_length=200, blank=True, verbose_name="Alt-текст")
    caption = models.CharField(max_length=300, blank=True, verbose_name="Підпис")
    order   = models.PositiveSmallIntegerField(default=0, verbose_name="Порядок")

    class Meta:
        verbose_name = "Фото каруселі"
        verbose_name_plural = "Фото каруселі"
        ordering = ["order"]

    def __str__(self):
        return f"{self.section} / фото {self.order}"


class ContactInfo(models.Model):
    organization_name = models.CharField(max_length=200, verbose_name="Назва організації")
    email       = models.EmailField(blank=True, verbose_name="Email")
    phone       = models.CharField(max_length=30, blank=True, verbose_name="Телефон")
    address     = models.TextField(blank=True, verbose_name="Адреса")
    facebook_url  = models.URLField(blank=True, verbose_name="Facebook")
    instagram_url = models.URLField(blank=True, verbose_name="Instagram")
    telegram_url  = models.URLField(blank=True, verbose_name="Telegram")
    youtube_url   = models.URLField(blank=True, verbose_name="YouTube")
    founding_year = models.PositiveSmallIntegerField(null=True, blank=True, verbose_name="Рік заснування")
    logo = models.ImageField(
        upload_to=upload_to_factory("images/org"),
        blank=True,
        validators=[validate_file_size],
        verbose_name="Логотип",
    )

    class Meta:
        verbose_name = "Контактна інформація"
        verbose_name_plural = "Контактна інформація"

    def __str__(self):
        return self.organization_name

    def save(self, *args, **kwargs):
        if not self.pk and ContactInfo.objects.exists():
            raise ValueError("Може існувати лише один запис ContactInfo.")
        super().save(*args, **kwargs)