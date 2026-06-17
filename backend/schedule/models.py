from django.db import models
from core.utils import slugify

class Event(models.Model):
    class Status(models.TextChoices):
        DRAFT = "draft", "Чернетка"
        PUBLISHED = "published", "Опубліковано"

    title = models.CharField(max_length=200)
    slug = models.SlugField(max_length=200, unique=True)
    description = models.TextField()
    date = models.DateTimeField()
    location = models.CharField(max_length=200)
    image = models.ImageField(upload_to='images/events')
    status = models.CharField(
        max_length=10,
        db_index=True,
        choices=Status.choices,
        default=Status.DRAFT,
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Подія'
        verbose_name_plural = 'Події'
        ordering = ['-date']

    def save(self, *args, **kwargs):
        if not self.slug:
            base_slug = slugify(self.title) or "report"
            slug_candidate = base_slug
            counter = 2

            while Event.objects.filter(slug=slug_candidate).exclude(pk=self.pk).exists():
                slug_candidate = f"{base_slug}-{counter}"
                counter += 1

            self.slug = slug_candidate
        super().save(*args, **kwargs)