from django.conf import settings
from django.core.files.storage import FileSystemStorage
from urllib.parse import urljoin
import os

class CustomStorage(FileSystemStorage):
    location = os.path.join(settings.MEDIA_ROOT, "ckeditor_uploads")
    base_url = urljoin(settings.MEDIA_URL, "ckeditor_uploads/")