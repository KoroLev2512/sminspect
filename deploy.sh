#!/usr/bin/env bash
# ==============================================================================
# deploy.sh — Скрипт экстренного ручного деплоя SmartInspect с Mac на FirstVDS
#
# Сборка происходит ЛОКАЛЬНО на Mac под архитектуру linux/amd64.
# На сервер передаётся уже готовый скомпилированный образ.
# На сервере НЕ запускаются никакие ресурсоемкие операции сборки!
# ==============================================================================

set -euo pipefail

# Конфигурация по умолчанию (можно переопределить через переменные окружения)
SERVER_HOST="${SERVER_HOST:-149.154.67.173}"
SERVER_USER="${SERVER_USER:-root}"
SERVER_PORT="${SERVER_PORT:-22}"
SERVER_DIR="${SERVER_DIR:-/var/www/smart-inspect}"
IMAGE_NAME="smart-inspect:latest"
TAR_FILE="/tmp/smart-inspect-build.tar.gz"

echo "=========================================================="
echo "🚀 Начало экстренного деплоя SmartInspect на $SERVER_USER@$SERVER_HOST"
echo "=========================================================="

# 1. Извлекаем переменные сборки из .env (если файл существует)
MAPTILER_KEY=""
if [ -f .env ]; then
  MAPTILER_KEY=$(grep -E '^NEXT_PUBLIC_MAPTILER_KEY=' .env | cut -d '=' -f2- | tr -d '"' | tr -d "'" || true)
fi
if [ -z "$MAPTILER_KEY" ]; then
  MAPTILER_KEY="RUNxFy5DYh1RYPQHDzWi"
fi

# 2. Локальная сборка Docker-образа под архитектуру сервера (linux/amd64)
echo "📦 [1/5] Сборка Docker-образа под linux/amd64 на локальной машине..."
docker buildx build \
  --platform linux/amd64 \
  --build-arg NEXT_PUBLIC_MAPTILER_KEY="$MAPTILER_KEY" \
  -t "$IMAGE_NAME" \
  --load .

# 3. Упаковка образа в сжатый архив
echo "🗜️  [2/5] Экспорт и сжатие образа..."
docker save "$IMAGE_NAME" | gzip > "$TAR_FILE"
ARCHIVE_SIZE=$(du -h "$TAR_FILE" | cut -f1)
echo "    Размер архива: $ARCHIVE_SIZE"

# 4. Передача файлов на сервер
echo "🚚 [3/5] Передача архива и docker-compose.yml на сервер ($SERVER_DIR)..."
ssh -p "$SERVER_PORT" "$SERVER_USER@$SERVER_HOST" "mkdir -p $SERVER_DIR /tmp"
scp -P "$SERVER_PORT" "$TAR_FILE" "$SERVER_USER@$SERVER_HOST:/tmp/smart-inspect.tar.gz"
scp -P "$SERVER_PORT" docker-compose.yml "$SERVER_USER@$SERVER_HOST:$SERVER_DIR/docker-compose.yml"

# Копируем .env если его еще нет на сервере
if [ -f .env ]; then
  ssh -p "$SERVER_PORT" "$SERVER_USER@$SERVER_HOST" "[ -f $SERVER_DIR/.env ] || true"
  scp -P "$SERVER_PORT" .env "$SERVER_USER@$SERVER_HOST:$SERVER_DIR/.env" || true
fi

# 5. Загрузка образа и перезапуск контейнера на сервере
echo "🔄 [4/5] Загрузка образа на сервере и перезапуск контейнера..."
ssh -p "$SERVER_PORT" "$SERVER_USER@$SERVER_HOST" "
  set -e
  echo 'Loading docker image...'
  gunzip -c /tmp/smart-inspect.tar.gz | docker load
  rm -f /tmp/smart-inspect.tar.gz

  cd $SERVER_DIR
  if [ ! -f .env ]; then
    if [ -f /root/sminspect/.env ]; then
      cp /root/sminspect/.env .env
    else
      touch .env
    fi
  fi

  echo 'Starting container...'
  docker compose up -d --remove-orphans

  echo 'Pruning dangling images...'
  docker image prune -f
"

# 6. Проверка работоспособности
echo "🩺 [5/5] Проверка статуса контейнера..."
ssh -p "$SERVER_PORT" "$SERVER_USER@$SERVER_HOST" "
  cd $SERVER_DIR
  docker compose ps
  echo ''
  echo 'Потребление памяти:'
  docker stats --no-stream --format 'table {{.Name}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.NetIO}}' | grep smart-inspect || true
"

# Очистка локального временного архива
rm -f "$TAR_FILE"

echo "=========================================================="
echo "🎉 Деплой успешно завершен! Сайт доступен на http://127.0.0.1:3003"
echo "=========================================================="
