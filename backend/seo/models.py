from email.policy import default
from random import choices
from tabnanny import verbose
from django.db import models

class Redirect(models.Model):
    from_path = models.CharField(
        max_length=500,
        unique=True,
        verbose_name="Зі шляху",
        help_text="Наприклад: /old-page/ або /news/old-slug/",
    )
    to_url = models.CharField(
        max_length=500,
        verbose_name="На URL",
        help_text="Наприклад: /new-page/ або https://example.com/page/",
    )
    status_code = models.IntegerField(
        default=301,
        choices=[(301, "301 — Постійний"), (302, "302 — Тимчасовий")],
        verbose_name="Код редиректу",
    )
    is_active = models.BooleanField(
        default=True,
        verbose_name="Активний",
    )
    created_at = models.DateTimeField(
        auto_now_add=True,
    )

    class Meta:
        verbose_name = "Редирект"
        verbose_name_plural = "Редиректи"
        ordering = ["from_path"]

    def __str__(self):
        return f"{self.from_path} → {self.to_url} [{self.status_code}]"
