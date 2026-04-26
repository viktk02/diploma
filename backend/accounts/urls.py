<<<<<<< HEAD
from django.urls import path
from .views import (
    LoginView,
    LogoutView,
    MeView,
    TokenRefreshViewCustom,
    UserListCreateView,
    UserDetailView,
)

urlpatterns = [
    path("auth/login/", LoginView.as_view(), name="auth-login"),
    path("auth/logout/", LogoutView.as_view(), name="auth-logout"),
    path("auth/refresh/", TokenRefreshViewCustom.as_view(), name="auth-refresh"),
    path("auth/me/", MeView.as_view(), name="auth-me"),
    path("auth/users/", UserListCreateView.as_view(), name="user-list"),
    path("auth/users/<int:pk>/", UserDetailView.as_view(), name="user-detail"),
=======
from django.urls import path
from .views import (
    LoginView,
    LogoutView,
    MeView,
    TokenRefreshViewCustom,
    UserListCreateView,
    UserDetailView,
)

urlpatterns = [
    path("auth/login/", LoginView.as_view(), name="auth-login"),
    path("auth/logout/", LogoutView.as_view(), name="auth-logout"),
    path("auth/refresh/", TokenRefreshViewCustom.as_view(), name="auth-refresh"),
    path("auth/me/", MeView.as_view(), name="auth-me"),
    path("auth/users/", UserListCreateView.as_view(), name="user-list"),
    path("auth/users/<int:pk>/", UserDetailView.as_view(), name="user-detail"),
>>>>>>> c9df572 (add user model with RBAC, update reports/events, add page builder with dynamic sections)
]