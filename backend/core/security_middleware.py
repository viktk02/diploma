class SecurityHeadersMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        response = self.get_response(request)

        response['X-Content-Type-Options'] = 'nosniff'

        response['X-Frame-Options'] = 'DENY'

        response['Referrer-Policy'] = 'strict-origin-when-cross-origin'

        response['Permissions-Policy'] = (
            'geolocation=(), camera=(), microphone=(), '
            'payment=(), usb=(), magnetometer=()'
        )

        csp = (
            "default-src 'self'; "
            "script-src 'self' 'unsafe-inline'; "
            "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; "
            "font-src 'self' https://fonts.gstatic.com; "
            "img-src 'self' data: blob: http://127.0.0.1:8000 https:; "
            "connect-src 'self'; "
            "frame-ancestors 'none';"
        )
        response['Content-Security-Policy'] = csp

        return response