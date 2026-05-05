import os
import uuid
import re
from django.utils.text import slugify
from unidecode import unidecode
from datetime import datetime
import posixpath


def safe_filename(filename: str) -> str:
    name, ext = os.path.splitext(filename)
    safe = slugify(unidecode(name)) or f"file_{uuid.uuid4().hex[:8]}"
    return f"{safe}_{uuid.uuid4().hex[:8]}{ext.lower()}"


def _upload_to_generic(folder: str, instance, filename: str) -> str:
    folder = folder.strip('/')
    return posixpath.join(folder, safe_filename(filename))


def upload_to_factory(folder: str):
    def upload_to(instance, filename):
        return _upload_to_generic(folder, instance, filename)

    upload_to.__name__ = f'upload_to_{slugify(folder.replace("/", "_"))}'
    upload_to.deconstruct = lambda: (
        f'core.utils.upload_to_factory("{folder}")',
        [],
        {}
    )
    return upload_to


# def generate_nonce():
#     return base64.b64encode(os.urandom(16)).decode()
#
#
# def create_csp(nonce):
#     return (
#         "default-src 'self';"
#         f"script-src 'self' 'nonce-{nonce}' https://cdn.jsdelivr.net; "
#         "style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net https://fonts.googleapis.com; "
#         "img-src 'self' data: https:; "
#         "font-src 'self' https://fonts.gstatic.com https://cdn.jsdelivr.net data:; "
#         "media-src 'self' https://www.youtube.com https://youtube.com"
#     )


def current_year(request):
    return {'current_year': datetime.now().year}

def slugify(text):
    text = unidecode(text)
    text = text.lower()
    text = re.sub(r'[^a-z0-9\s-]', '', text)
    text = re.sub(r'\s+', '-', text)
    return text.strip('-')