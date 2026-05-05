from social_core.exceptions import AuthForbidden
ALLOWED_DOMAINS = ['gmail.com', 'mistosyly.org']

def require_allowlist(backend, user, response, social, *args, **kwargs):
    if not response.get('email_verified'):
        raise AuthForbidden(backend)
    
    email = response.get('email', '')
    domain = email.split('@')[-1] if '@' in email else ''
    if domain not in ALLOWED_DOMAINS:
        raise AuthForbidden(backend)

    if not user:
        raise AuthForbidden(backend)

    if not user.google_login_allowed:
        raise AuthForbidden(backend)

    google_sub = response.get('sub')
    if google_sub and not user.google_sub:
        user.google_sub = google_sub
        user.save(update_fields=['google_sub'])

    return {'user': user}

def set_staff_flag(backend, user, *args, **kwargs):
    if user and not user.is_staff:
        user.is_staff = True
        user.save(update_fields=['is_staff'])