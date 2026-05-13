# =============================================================
# Скрипт резервного копіювання PostgreSQL БД
# Розташування: backend/scripts/backup.sh
# Запуск вручну: bash scripts/backup.sh
# Автоматичний запуск: додати в cron (див. нижче)
# =============================================================

# Bash не підхоплює .env сам. Не використовуємо `source` для всього файлу:
# — CRLF (Windows) лишає \r у значеннях і ламає pg_dump;
# — рядки на кшталт SECRET_KEY=...&... інтерпретуються bash як команди.
load_backup_env() {
  local env_file="$1" line key value
  [ -f "$env_file" ] || return 0
  while IFS= read -r line || [ -n "$line" ]; do
    line="${line%$'\r'}"
    [[ "$line" == $'\ufeff'* ]] && line="${line#$'\ufeff'}"
    [[ -z "$line" || "$line" =~ ^[[:space:]]*# ]] && continue
    case "$line" in
      POSTGRES_DB=*|POSTGRES_USER=*|POSTGRES_PASSWORD=*|POSTGRES_HOST=*|POSTGRES_PORT=*|BACKUP_DIR=*|VERIFY_RESTORE_AFTER_BACKUP=*)
        key="${line%%=*}"
        value="${line#*=}"
        export "$key=$value"
        ;;
    esac
  done < "$env_file"
}

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
load_backup_env "$SCRIPT_DIR/../.env"

set -euo pipefail

# --- Налаштування (береться з .env або задається тут) ---
DB_NAME="${POSTGRES_DB:-mydb}"
DB_USER="${POSTGRES_USER:-myuser}"
DB_HOST="${POSTGRES_HOST:-localhost}"
DB_PORT="${POSTGRES_PORT:-5432}"
# За замовчуванням — backend/backups/db (поруч із проєктом). Інакше задайте BACKUP_DIR у .env.
BACKUP_DIR="${BACKUP_DIR:-$SCRIPT_DIR/../backups/db}"
KEEP_DAYS=30  # скільки днів зберігати бекапи
# Перевірка відновлення: 1-го числа кожного місяця, або якщо в .env VERIFY_RESTORE_AFTER_BACKUP=1 (кожен запуск)

# --- Підготовка ---
mkdir -p "$BACKUP_DIR"
echo "[$(date)] Каталог бекапів: $BACKUP_DIR"
TIMESTAMP=$(date +"%Y-%m-%d_%H-%M-%S")
BACKUP_FILE="$BACKUP_DIR/${DB_NAME}_${TIMESTAMP}.sql.gz"

echo "[$(date)] Починаємо резервне копіювання БД: $DB_NAME"

# --- Створення бекапу ---
PGPASSWORD="$POSTGRES_PASSWORD" pg_dump \
    -h "$DB_HOST" \
    -p "$DB_PORT" \
    -U "$DB_USER" \
    -d "$DB_NAME" \
    --no-password \
    | gzip > "$BACKUP_FILE"

echo "[$(date)] Бекап створено: $BACKUP_FILE ($(du -sh "$BACKUP_FILE" | cut -f1))"

# --- Видалення старих бекапів ---
DELETED=$(find "$BACKUP_DIR" -name "*.sql.gz" -mtime +$KEEP_DAYS -print -delete | wc -l)
echo "[$(date)] Видалено старих бекапів: $DELETED"

# --- Перевірка відновлення (gzip → порожня тестова БД → drop) ---
if [ "${VERIFY_RESTORE_AFTER_BACKUP:-0}" = "1" ] || [ "$(date +%d)" = "01" ]; then
  echo "[$(date)] Перевірка відновлення (тестова БД)..."
  TEST_DB="${DB_NAME}_restore_test"
  restore_test_cleanup() {
    PGPASSWORD="$POSTGRES_PASSWORD" dropdb -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" --if-exists "$TEST_DB" 2>/dev/null || true
  }
  trap restore_test_cleanup EXIT
  PGPASSWORD="$POSTGRES_PASSWORD" dropdb -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" --if-exists "$TEST_DB" 2>/dev/null || true
  PGPASSWORD="$POSTGRES_PASSWORD" createdb -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" "$TEST_DB"
  gunzip -c "$BACKUP_FILE" | PGPASSWORD="$POSTGRES_PASSWORD" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -q -d "$TEST_DB" > /dev/null
  PGPASSWORD="$POSTGRES_PASSWORD" dropdb -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" "$TEST_DB"
  trap - EXIT
  echo "[$(date)] Перевірка відновлення успішна"
fi

echo "[$(date)] Резервне копіювання завершено"

# =============================================================
# НАЛАШТУВАННЯ CRON (виконувати щодня о 3:00)
# Додати в crontab командою: crontab -e
#
# 0 3 * * * /шлях/до/backend/scripts/backup.sh >> /home/user/backups/backup.log 2>&1
# =============================================================