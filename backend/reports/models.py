from django.db import models
from django_ckeditor_5.fields import CKEditor5Field
from core.validators import validate_file_size
from core.utils import upload_to_factory, slugify
from django.utils import timezone

class Report(models.Model):
    class Status(models.TextChoices):
        DRAFT = "draft", "Чернетка"
        PUBLISHED = "published", "Опубліковано"
        HIDDEN = "hidden", "Скрито"

    title = models.CharField(max_length=200)
    slug = models.SlugField(max_length=200, unique=True)
    preview = models.TextField(max_length=200)
    content = CKEditor5Field('Content', config_name='extends')

    date_created = models.DateTimeField(auto_now_add=True)
    date_edited = models.DateTimeField(auto_now=True)
    date_published = models.DateTimeField(null=True, blank=True)

    status = models.CharField(
        max_length=10,
        db_index=True,
        choices=Status.choices,
        default=Status.DRAFT,
    )

    image = models.ImageField(
        upload_to=upload_to_factory('images/posts'),
        validators=[validate_file_size],
        blank=True,
    )

    class Meta:
        verbose_name = 'Звіт'
        verbose_name_plural = 'Звіти'
        ordering = ['-date_published']

    def save(self, *args, **kwargs):
        if not self.slug:
            base_slug = slugify(self.title) or "report"
            slug_candidate = base_slug
            counter = 2

            while Report.objects.filter(slug=slug_candidate).exclude(pk=self.pk).exists():
                slug_candidate = f"{base_slug}-{counter}"
                counter += 1

            self.slug = slug_candidate
        if self.status == self.Status.PUBLISHED and not self.date_published:
            self.date_published = timezone.now()
        super().save(*args, **kwargs)