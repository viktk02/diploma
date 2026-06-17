from django.http import HttpResponse, HttpResponsePermanentRedirect, HttpResponseRedirect, Http404
from django.views import View
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Redirect

class RobotsView(View):
    def get(self, request):
        lines = [
            "User-agent: *",
            "Allow: /",
            "Disallow: /admin/",
            "Disallow: /auth/",
            "Disallow: /api/",
            "",
            f"Sitemap: {request.scheme}://{request.get_host()}/sitemap.xml",
        ]
        return HttpResponse(
            "\n".join(lines), 
            content_type="text/plain"
        )

class RedirectMiddlewareView(View):
    def get(self, request, path):
        candidates = [
            f"/{path}",
            f"/{path}/",
            f"{path}",
        ]
        for from_path in candidates:
            try:
                redirect = Redirect.objects.get(from_path=from_path, is_active=True)
                if redirect.status_code == 301:
                    return HttpResponsePermanentRedirect(redirect.to_url)
                return HttpResponseRedirect(redirect.to_url)
            except Redirect.DoesNotExist:
                continue
        raise Http404


class RedirectListAPIView(APIView):
    """Список активних редиректів для Next.js proxy."""

    def get(self, request):
        rows = Redirect.objects.filter(is_active=True).values(
            "from_path", "to_url", "status_code"
        )
        return Response(list(rows))
