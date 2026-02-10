from django.conf import settings
from django.core.exceptions import ValidationError
from django.utils.translation import gettext_lazy as _
from datetime import datetime

DEFAULT_MAX_MB = 15
DEFAULT_IMAGE_EXTS = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp', '.tiff', '.svg']

def get_setting(name, default):
    return getattr(settings, name, default)

def validate_file_size(file_obj):
    max_mb = get_setting('CORE_MAX_UPLOAD_MB', DEFAULT_MAX_MB)
    if file_obj.size > max_mb * 1024 * 1024:
        raise ValidationError(_('File too large. Max size: %(mb)s MB'), params={'mb': max_mb})

def dates_validator(date1, date2):
    try:
        date_1 = datetime.strptime(str(date1), "%Y-%m-%d").date() if date1 else None
        date_2 = datetime.strptime(str(date2), "%Y-%m-%d").date() if date2 else None
    except (ValueError, TypeError):
        return False

    if date_1 is None or date_2 is None:
        return True

    return date_1 <= date_2