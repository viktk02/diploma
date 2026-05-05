from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models


class UserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError("Email обов'язковий")
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault("role", "root")
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        return self.create_user(email, password, **extra_fields)


class User(AbstractBaseUser, PermissionsMixin):
    class Role(models.TextChoices):
        ROOT = "root",   "Root (повний доступ)"
        EDITOR = "editor", "Редактор"

    EDITOR_APPS = {"reports", "schedule", "pages"}

    email = models.EmailField(unique=True, verbose_name="Email")
    name = models.CharField(max_length=100, verbose_name="Ім'я")
    role = models.CharField(
        max_length=10,
        choices=Role.choices,
        default=Role.EDITOR,
        verbose_name="Роль",
    )

    google_sub = models.CharField(
        max_length=200, blank=True, null=True, unique=True,
        verbose_name="Google UID (sub)",
        help_text="Заповнюється автоматично при першому вході через Google.",
    )
    google_login_allowed = models.BooleanField(
        default=False,
        verbose_name="Дозволити вхід через Google",
        help_text="Root вручну дозволяє конкретному юзеру логінитись через Google.",
    )

    is_active = models.BooleanField(default=True,  verbose_name="Активний")
    is_staff = models.BooleanField(default=False, verbose_name="Доступ до адмінки Django")

    date_joined = models.DateTimeField(auto_now_add=True, verbose_name="Дата реєстрації")

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["name"]

    objects = UserManager()

    class Meta:
        verbose_name = "Користувач"
        verbose_name_plural = "Користувачі"

    def __str__(self):
        return f"{self.name} <{self.email}> [{self.get_role_display()}]"

    @property
    def is_root(self):
        return self.role == self.Role.ROOT

    @property
    def is_editor(self):
        return self.role in (self.Role.ROOT, self.Role.EDITOR)

    def has_perm(self, perm, obj=None):
        if not self.is_active:
            return False
        if self.is_superuser or self.is_root:
            return True
        if self.is_editor:
            app_label = perm.split(".")[0] if "." in perm else perm
            return app_label in self.EDITOR_APPS
        return False

    def has_module_perms(self, app_label):
        if not self.is_active:
            return False
        if self.is_superuser or self.is_root:
            return True
        if self.is_editor:
            return app_label in self.EDITOR_APPS
        return False

    def save(self, *args, **kwargs):
        if self.role in (self.Role.ROOT, self.Role.EDITOR):
            self.is_staff = True
        if self.role == self.Role.ROOT:
            self.is_superuser = True
        super().save(*args, **kwargs)