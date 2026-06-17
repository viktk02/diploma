import io
import base64
import qrcode

from django.contrib.admin.views.decorators import staff_member_required
from django.contrib.auth import logout
from django.shortcuts import render, redirect
from django.contrib import messages
from django_otp.plugins.otp_totp.models import TOTPDevice

from .admin_context import admin_template_context
from .forms import ProfileForm, ChangePasswordForm


@staff_member_required
def profile_view(request):
    profile_form  = ProfileForm(instance=request.user)
    password_form = ChangePasswordForm(user=request.user)

    if request.method == "POST":
        if "save_profile" in request.POST:
            profile_form = ProfileForm(request.POST, instance=request.user)
            if profile_form.is_valid():
                profile_form.save()
                messages.success(request, "Профіль оновлено.")
                return redirect("accounts:profile")

        elif "change_password" in request.POST:
            password_form = ChangePasswordForm(user=request.user, data=request.POST)
            if password_form.is_valid():
                password_form.save()
                messages.success(request, "Пароль змінено. Увійдіть знову.")
                return redirect("admin:login")

    totp_device = TOTPDevice.objects.filter(user=request.user, confirmed=True).first()

    return render(request, "admin/profile.html", admin_template_context(
        request,
        title="Мій профіль",
        profile_form=profile_form,
        password_form=password_form,
        totp_enabled=totp_device is not None,
        has_permission=True,
    ))


def _render_2fa_setup(request, device, extra=None):
    img = qrcode.make(device.config_url)
    buf = io.BytesIO()
    img.save(buf, format="PNG")
    qr_b64 = base64.b64encode(buf.getvalue()).decode("utf-8")
    ctx = admin_template_context(
        request,
        title="Налаштування 2FA",
        qr_b64=qr_b64,
        secret_key=device.bin_key.hex(),
        has_permission=True,
    )
    if extra:
        ctx.update(extra)
    return render(request, "admin/setup_2fa.html", ctx)


@staff_member_required
def setup_2fa_view(request):
    if request.method == "POST":
        code   = request.POST.get("code", "").strip()
        device = TOTPDevice.objects.filter(user=request.user, confirmed=False).first()

        if not device:
            device = TOTPDevice.objects.create(
                user=request.user,
                name=f"{request.user.email} TOTP",
                confirmed=False,
            )
            return _render_2fa_setup(request, device)

        if device.verify_token(code):
            device.confirmed = True
            device.save()
            messages.success(request, "2FA успішно налаштовано!")
            return redirect("accounts:profile")

        return _render_2fa_setup(request, device, {"error": "Невірний код. Спробуйте ще раз."})

    TOTPDevice.objects.filter(user=request.user, confirmed=False).delete()
    device = TOTPDevice.objects.create(
        user=request.user,
        name=f"{request.user.email} TOTP",
        confirmed=False,
    )
    return _render_2fa_setup(request, device)


@staff_member_required
def disable_2fa_view(request):
    if request.method == "POST":
        TOTPDevice.objects.filter(user=request.user).delete()
        messages.success(request, "2FA вимкнено.")
    return redirect("accounts:profile")


def verify_2fa_view(request):
    if not request.user.is_authenticated:
        return redirect("admin:login")

    if request.user.is_verified():
        return redirect("admin:index")

    has_device = TOTPDevice.objects.filter(
        user=request.user, confirmed=True
    ).exists()
    if not has_device:
        return redirect("admin:index")

    error = None
    if request.method == "POST":
        code = request.POST.get("code", "").strip()
        device = TOTPDevice.objects.filter(
            user=request.user, confirmed=True
        ).first()

        if device and device.verify_token(code):
            device.persistent_id
            request.user.otp_device = device
            from django_otp import login as otp_login
            otp_login(request, device)
            next_url = request.GET.get("next", "/admin/")
            return redirect(next_url)

        error = "Невірний код. Спробуйте ще раз."

    return render(request, "admin/verify_2fa.html", admin_template_context(
        request,
        title="Підтвердження входу",
        error=error,
        has_permission=False,
    ))