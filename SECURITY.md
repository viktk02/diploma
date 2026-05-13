# Політика безпеки та план реагування на інциденти

## Контакти

При виявленні вразливості або інциденту — негайно зв'язатись з Root-адміністратором.

---

## Що робити при підозрі на злам

### Крок 1 — Негайна ізоляція (перші 15 хвилин)

```bash
# 1. Заблокувати публічний доступ через Cloudflare
# Cloudflare → Security → Under Attack Mode → ON

# 2. Відкликати всі активні сесії Django
python manage.py shell
from django.contrib.sessions.models import Session
Session.objects.all().delete()
print("Всі сесії видалено")

# 3. Заблокувати всіх користувачів крім Root
from accounts.models import User
User.objects.filter(role='editor').update(is_active=False)

# 4. Відкликати Cloudflare Access сесії
# Cloudflare → Access → Applications → Revoke existing tokens
```

### Крок 2 — Аналіз (перші 30 хвилин)

```bash
# Перевірити логи безпеки
tail -200 ~/backend/logs/security.log
tail -200 ~/backend/logs/errors.log

# Перевірити підозрілі запити в django.log
grep -i "error\|warning\|forbidden\|invalid" ~/backend/logs/django.log | tail -100

# Перевірити django-axes — невдалі спроби логіну
python manage.py shell
from axes.models import AccessAttempt
print(AccessAttempt.objects.order_by('-attempt_time')[:20].values())
```

### Крок 3 — Усунення

```bash
# Змінити SECRET_KEY (інвалідує всі сесії)
# Згенерувати новий: python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
# Оновити в .env на сервері

# Змінити пароль БД
# cPanel → PostgreSQL → Change Password
# Оновити DATABASE_URL в .env

# Перегенерувати Google OAuth credentials
# console.cloud.google.com → Credentials → Delete + Create new

# Скинути всі TOTP пристрої
python manage.py shell
from django_otp.plugins.otp_totp.models import TOTPDevice
TOTPDevice.objects.all().delete()
```

### Крок 4 — Відновлення

```bash
# Відновити БД з останнього бекапу (якщо потрібно)
gunzip -c ~/backups/db/mydb_YYYY-MM-DD_HH-MM-SS.sql.gz | psql -U myuser mydb

# Перезапустити застосунки в cPanel
# Python App → Restart
# Node.js App → Restart

# Зняти режим атаки в Cloudflare після аналізу
# Cloudflare → Security → Under Attack Mode → OFF

# Активувати редакторів назад
python manage.py shell
from accounts.models import User
User.objects.filter(role='editor').update(is_active=True)
```

---

## Регламент оновлень

| Тип | Термін |
|-----|--------|
| Критичні CVE | 48 годин |
| Звичайні оновлення | Щомісяця |
| Перевірка бекапів | Щомісяця (1-го числа) |

### Щомісячне обслуговування

```bash
# 1. Оновити залежності на staging
pip-audit                    # перевірка Python
npm audit                    # перевірка Node.js

# 2. Застосувати оновлення
pip install --upgrade -r requirements.txt
pip freeze > requirements.txt
npm update && npm audit fix

# 3. Тест на staging → деплой на prod
```

---

## Де дивитись логи

| Файл | Що містить |
|------|------------|
| `logs/django.log` | Загальні події Django |
| `logs/security.log` | Логіни, CSRF помилки, django-axes |
| `logs/errors.log` | HTTP 5xx помилки |

```bash
# Останні події безпеки в реальному часі
tail -f ~/backend/logs/security.log

# Пошук за IP
grep "192.168.1.1" ~/backend/logs/security.log

# Пошук за користувачем
grep "user@email.com" ~/backend/logs/security.log
```

---

## Швидке відключення адмінки

```bash
# Тимчасово заборонити доступ до /admin/ через Cloudflare
# Cloudflare → Security → WAF → Custom Rules
# Rule: URI Path contains "/admin/" → Block

# Або через .htaccess на сервері
echo "Deny from all" >> ~/backend/.htaccess
```