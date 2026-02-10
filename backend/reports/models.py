from django.db import models
from django_ckeditor_5.fields import CKEditor5Field
from core.validators import validate_file_size
from core.utils import upload_to_factory


class Report(models.Model):
    class Status(models.TextChoices):
        DRAFT = "draft", "Чернетка"
        PUBLISHED = "published", "Опубліковано"
        HIDDEN = "hidden", "Скрито"

    title = models.CharField(max_length=200)
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