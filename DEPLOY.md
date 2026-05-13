# Інструкція з деплою

## Вимоги до сервера

- cPanel хостинг з підтримкою Python 3.12+ і Node.js 20+
- PostgreSQL (через cPanel або окремий сервер)
- Cloudflare (DNS + WAF + Access)

## Підготовка Cloudflare

1. Перенести DNS домену на Cloudflare
2. Увімкнути проксі (помаранчева хмара) для `app.domain` і `api.domain`
3. SSL/TLS → Full (strict)
4. Edge Certificates → Always Use HTTPS → ON
5. Створити Cloudflare Access Application:
   - Path: `api.domain/admin/*`
   - Policy: email domain = `mistosyly.org` + TOTP

## Деплой бекенду (cPanel)

### 1. Python App

- cPanel → Setup Python App
- Python version: 3.12
- Application root: `backend/`
- Application URL: `api.domain`
- Application startup file: `passenger_wsgi.py`

### 2. Файли

```bash
git clone <repo> ~/backend
cd ~/backend
pip install -r requirements.txt
```

### 3. Змінні середовища

В cPanel → Python App → Environment variables додати всі з `.env`.  
Або створити `.env` файл на сервері (не в репозиторії).

### 4. Міграції і початкові дані

```bash
python manage.py migrate
python manage.py createsuperuser
python manage.py seed_pages
python manage.py collectstatic --no-input
```

### 5. passenger_wsgi.py

```python
import os
import sys

sys.path.insert(0, os.path.dirname(__file__))
os.environ['DJANGO_SETTINGS_MODULE'] = 'backend.settings.prod'

from django.core.wsgi import get_wsgi_application
application = get_wsgi_application()
```

## Деплой фронтенду (cPanel)

### 1. Node.js App

- cPanel → Setup Node.js App
- Node.js version: 20
- Application root: `frontend/`
- Application URL: `app.domain`
- Application startup file: `server.js`

### 2. Збірка

```bash
cd ~/frontend
npm install
npm run build
```

### 3. server.js

```javascript
const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');

const app = next({ dev: false });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  }).listen(process.env.PORT || 3000);
});
```

## Prod налаштування Django

У `backend/settings/prod.py`:

```python
from .base import *

DEBUG = False
ALLOWED_HOSTS = ['api.mistosyly.org']

SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
SECURE_HSTS_SECONDS = 31536000
SECURE_HSTS_INCLUDE_SUBDOMAINS = True

SOCIAL_AUTH_GOOGLE_OAUTH2_WHITELISTED_DOMAINS = ['mistosyly.org']
```

## Резервне копіювання

```bash
# Налаштувати cron (cPanel → Cron Jobs):
# Щодня о 3:00
0 3 * * * /home/user/backend/scripts/backup.sh >> /home/user/backups/backup.log 2>&1
```

## Оновлення залежностей

```bash
# Перевірка вразливостей
pip-audit
npm audit

# Оновлення (staging → тест → prod)
pip install --upgrade -r requirements.txt
pip freeze > requirements.txt

npm update
npm audit fix
```