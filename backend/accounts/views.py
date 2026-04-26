from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError

from .models import User
from .permissions import IsRoot
from .serializers import LoginSerializer, UserMeSerializer, UserAdminSerializer


def _get_tokens(user):
    """Повертає пару access + refresh токенів для юзера."""
    refresh = RefreshToken.for_user(user)
    return {
        "access":  str(refresh.access_token),
        "refresh": str(refresh),
    }


class LoginView(APIView):
    """
    POST /api/auth/login/
    Body: { "email": "...", "password": "..." }
    Повертає JWT токени + дані юзера.
    """
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data["user"]
        tokens = _get_tokens(user)
        return Response({
            **tokens,
            "user": UserMeSerializer(user).data,
        })


class LogoutView(APIView):
    """
    POST /api/auth/logout/
    Body: { "refresh": "..." }
    Інвалідує refresh-токен (додає в blacklist).
    """
    permission_classes = [IsAuthenticated]

    def post(self, request):
        refresh_token = request.data.get("refresh")
        if not refresh_token:
            return Response(
                {"detail": "refresh токен обов'язковий."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        try:
            token = RefreshToken(refresh_token)
            token.blacklist()
        except TokenError:
            return Response(
                {"detail": "Невалідний або вже використаний токен."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        return Response({"detail": "Вихід виконано."}, status=status.HTTP_200_OK)


class MeView(APIView):
    """
    GET /api/auth/me/
    Повертає дані поточного авторизованого юзера.
    Next.js викликає при завантаженні адмінки щоб знати роль.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response(UserMeSerializer(request.user).data)


class TokenRefreshViewCustom(APIView):
    """
    POST /api/auth/refresh/
    Body: { "refresh": "..." }
    Повертає новий access токен. Refresh ротується.
    """
    permission_classes = [AllowAny]

    def post(self, request):
        refresh_token = request.data.get("refresh")
        if not refresh_token:
            return Response(
                {"detail": "refresh токен обов'язковий."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        try:
            token = RefreshToken(refresh_token)
            return Response({
                "access":  str(token.access_token),
                "refresh": str(token),  # ротований refresh
            })
        except TokenError:
            return Response(
                {"detail": "Невалідний або прострочений токен."},
                status=status.HTTP_401_UNAUTHORIZED,
            )


# --- Управління юзерами (тільки Root) ---

class UserListCreateView(generics.ListCreateAPIView):
    """
    GET  /api/auth/users/     — список всіх юзерів (тільки Root)
    POST /api/auth/users/     — створити нового редактора (тільки Root)
    """
    queryset = User.objects.all().order_by("date_joined")
    serializer_class = UserAdminSerializer
    permission_classes = [IsRoot]


class UserDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    GET    /api/auth/users/<id>/  — деталі юзера
    PATCH  /api/auth/users/<id>/  — оновити (роль, google_login_allowed, пароль)
    DELETE /api/auth/users/<id>/  — видалити
    Тільки Root.
    """
    queryset = User.objects.all()
    serializer_class = UserAdminSerializer
    permission_classes = [IsRoot]