# Місто Сили — Інформаційна вебсистема

Вебсайт громадської організації «Місто Сили» з адміністративними та соціальними сервісами.

## Стек технологій

| Компонент | Технологія |
|-----------|------------|
| Бекенд | Python 3.12, Django 5, DRF |
| Фронтенд | Next.js 15, TypeScript |
| БД | PostgreSQL |
| CMS | Django Admin + CKEditor 5 |
| Хостинг | cPanel |
| CDN / Security | Cloudflare |

## Структура проекту

```
diploma/
  backend/          ← Django + DRF
    accounts/       ← користувачі, авторизація
    core/           ← утиліти, middleware
    pages/          ← конструктор сторінок
    reports/        ← звіти
    schedule/       ← події
    seo/            ← sitemap, robots, redirects
    scripts/        ← backup.sh
  frontend/         ← Next.js
    src/
      app/          ← сторінки (App Router)
      components/   ← компоненти
      lib/          ← утиліти
```

## Швидкий старт (локально)

### Бекенд

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
python manage.py migrate
python manage.py createsuperuser
python manage.py seed_pages
python manage.py runserver
```

### Фронтенд

```bash
cd frontend
npm install
cp .env.local.example .env.local  # заповнити значення
npm run dev
```

Сайт: http://localhost:3000  
Адмінка: http://localhost:8000/admin/

## Змінні середовища

### Backend `.env`

```
SECRET_KEY=
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
DATABASE_URL=postgresql://user:password@localhost:5432/dbname
POSTGRES_DB=
POSTGRES_USER=
POSTGRES_PASSWORD=
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
BACKUP_DIR=/home/user/backups/db
```

### Frontend `.env.local`

```
API_URL=http://127.0.0.1:8000
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```
