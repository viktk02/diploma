# Changelog

Всі значущі зміни проекту документуються в цьому файлі.
Формат: [Semantic Versioning](https://semver.org/)

---

## [1.0.0] — 2026-05-11

### Додано
- Кастомна модель User з ролями Root/Editor
- RBAC — розмежування доступу в Django Admin
- Google OAuth авторизація з allowlist домену `mistosyly.org`
- 2FA TOTP через профіль користувача
- Захист від брут форсу (django-axes)
- Session timeout middleware
- Security headers middleware
- CMS конструктор сторінок з секціями (hero, text, gallery, cta, contacts)
- Підтримка каруселі фотографій в секціях
- Динамічна навігація через адмінку
- Модель Reports (звіти) з CKEditor
- Модель Events (події)
- Модель ContactInfo (контакти організації)
- Redirects (301/302) через адмінку
- sitemap.xml автогенерація
- robots.txt
- Пошук по сайту (reports + events + pages)
- Rate limiting на API endpoints
- Next.js SSR фронтенд з App Router
- Сторінки: головна, звіти, події, контакти, пошук, 404
- Динамічні сторінки через конструктор (`/[key]`)
- schema.org (NGO, WebSite, SearchAction)
- Адаптивний дизайн (mobile-first)
- Брендові кольори і шрифт Alumni Sans
- Header з dropdown навігацією і пошуком
- Footer з контактами і соцмережами
- PageRenderer — рендер секцій CMS на фронтенді