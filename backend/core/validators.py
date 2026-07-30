import os
from datetime import datetime

from django.conf import settings
from django.core.exceptions import ValidationError
from django.utils.translation import gettext_lazy as _
from PIL import Image as PillowImage, UnidentifiedImageError

DEFAULT_MAX_MB = 15
DEFAULT_IMAGE_EXTS = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp', '.tiff']
DEFAULT_IMAGE_FORMATS = {'JPEG', 'PNG', 'GIF', 'WEBP', 'BMP', 'TIFF'}

def get_setting(name, default):
    return getattr(settings, name, default)

def validate_file_size(file_obj):
    max_mb = get_setting('CORE_MAX_UPLOAD_MB', DEFAULT_MAX_MB)
    if file_obj.size > max_mb * 1024 * 1024:
        raise ValidationError(_('File too large. Max size: %(mb)s MB'), params={'mb': max_mb})


def validate_image_file(file_obj):
    filename = (getattr(file_obj, 'name', '') or '').lower()
    extension = os.path.splitext(filename)[1]
    content_type = (getattr(file_obj, 'content_type', '') or '').lower()

    if extension not in DEFAULT_IMAGE_EXTS:
        raise ValidationError(_('Unsupported image format.'))

    if content_type and not content_type.startswith('image/'):
        raise ValidationError(_('Unsupported image MIME type.'))

    if extension == '.svg' or content_type == 'image/svg+xml':
        raise ValidationError(_('SVG uploads are not allowed.'))

    try:
        image = PillowImage.open(file_obj)
        image.verify()
        if image.format not in DEFAULT_IMAGE_FORMATS:
            raise ValidationError(_('Unsupported image format.'))
    except (UnidentifiedImageError, OSError, ValueError):
        raise ValidationError(_('Invalid image file.'))
    finally:
        try:
            file_obj.seek(0)
        except Exception:
            pass

def dates_validator(date1, date2):
    try:
        date_1 = datetime.strptime(str(date1), "%Y-%m-%d").date() if date1 else None
        date_2 = datetime.strptime(str(date2), "%Y-%m-%d").date() if date2 else None
    except (ValueError, TypeError):
        return False

    if date_1 is None or date_2 is None:
        return True

    return date_1 <= date_2