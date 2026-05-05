from django.shortcuts import redirect
from django_otp.plugins.otp_totp.models import TOTPDevice

class Require2FAMiddleware:
    EXEMPT_URLS = (
        '/admin/login/',
        '/admin/logout/',
        '/admin/profile/2fa/verify/',
        '/auth/',
    )

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        if (
            request.path.startswith('/admin/')
            and not any(request.path.startswith(u) for u in self.EXEMPT_URLS)
            and hasattr(request, 'user')
            and request.user.is_authenticated
            and request.user.is_staff
        ):

            has_device = TOTPDevice.objects.filter(
                user=request.user, confirmed=True
            ).exists()

            if has_device and not request.user.is_verified():
                return redirect(
                    f'/admin/profile/2fa/verify/?next={request.path}'
                )

        return self.get_response(request)