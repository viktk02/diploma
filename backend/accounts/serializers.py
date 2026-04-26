<<<<<<< HEAD
from django.contrib.auth import authenticate
from rest_framework import serializers
from .models import User


class LoginSerializer(serializers.Serializer):
    email    = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        user = authenticate(email=data["email"], password=data["password"])
        if not user:
            raise serializers.ValidationError("Невірний email або пароль.")
        if not user.is_active:
            raise serializers.ValidationError("Акаунт деактивовано.")
        data["user"] = user
        return data


class UserMeSerializer(serializers.ModelSerializer):
    class Meta:
        model  = User
        fields = ["id", "email", "name", "role"]
        read_only_fields = fields


class UserAdminSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=False)

    class Meta:
        model  = User
        fields = [
            "id", "email", "name", "role",
            "google_login_allowed", "is_active",
            "date_joined", "password",
        ]
        read_only_fields = ["id", "date_joined"]

    def create(self, validated_data):
        password = validated_data.pop("password", None)
        user = User(**validated_data)
        if password:
            user.set_password(password)
        else:
            user.set_unusable_password()
        user.is_staff = True
        user.save()
        return user

    def update(self, instance, validated_data):
        password = validated_data.pop("password", None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        if password:
            instance.set_password(password)
        instance.save()
=======
from django.contrib.auth import authenticate
from rest_framework import serializers
from .models import User


class LoginSerializer(serializers.Serializer):
    email    = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        user = authenticate(email=data["email"], password=data["password"])
        if not user:
            raise serializers.ValidationError("Невірний email або пароль.")
        if not user.is_active:
            raise serializers.ValidationError("Акаунт деактивовано.")
        data["user"] = user
        return data


class UserMeSerializer(serializers.ModelSerializer):
    """Повертається після логіну і в /api/auth/me/ — тільки безпечні поля."""
    class Meta:
        model  = User
        fields = ["id", "email", "name", "role"]
        read_only_fields = fields


class UserAdminSerializer(serializers.ModelSerializer):
    """Для Root: список і створення юзерів."""
    password = serializers.CharField(write_only=True, required=False)

    class Meta:
        model  = User
        fields = [
            "id", "email", "name", "role",
            "google_login_allowed", "is_active",
            "date_joined", "password",
        ]
        read_only_fields = ["id", "date_joined"]

    def create(self, validated_data):
        password = validated_data.pop("password", None)
        user = User(**validated_data)
        if password:
            user.set_password(password)
        else:
            user.set_unusable_password()  # юзер зможе логінитись лише через Google
        user.is_staff = True  # доступ до Django-адмінки
        user.save()
        return user

    def update(self, instance, validated_data):
        password = validated_data.pop("password", None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        if password:
            instance.set_password(password)
        instance.save()
>>>>>>> c9df572 (add user model with RBAC, update reports/events, add page builder with dynamic sections)
        return instance