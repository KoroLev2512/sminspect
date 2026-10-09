# syntax=docker/dockerfile:1.4

# -----------------------------------------------------------------------------
# 1. Базовый образ: системные пакеты ставятся один раз для всех стадий
# -----------------------------------------------------------------------------
FROM node:20-alpine AS base
RUN apk add --no-cache libc6-compat dumb-init
WORKDIR /app

# -----------------------------------------------------------------------------
# 2. Стадия зависимостей (deps)
# -----------------------------------------------------------------------------
FROM base AS deps
WORKDIR /app

COPY package.json package-lock.json ./

# Максимальное ускорение npm ci:
# - BuildKit-кэш для каталога /root/.npm
# - --prefer-offline: приоритет локального кэша
# - --no-audit / --no-fund: отключение сетевых проверок уязвимостей и финансирования
# - --ignore-scripts: пропуск pre-commit хуков husky в контейнере
RUN --mount=type=cache,target=/root/.npm \
    npm ci --prefer-offline --no-audit --no-fund --ignore-scripts

# -----------------------------------------------------------------------------
# 3. Стадия сборки (builder)
# -----------------------------------------------------------------------------
FROM base AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1 \
    NODE_ENV=production

# Аргументы сборки
ARG NEXT_PUBLIC_MAPTILER_KEY
ENV NEXT_PUBLIC_MAPTILER_KEY=$NEXT_PUBLIC_MAPTILER_KEY

RUN npm run build

# -----------------------------------------------------------------------------
# 4. Финальный продакшен-образ (runner)
# -----------------------------------------------------------------------------
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME="0.0.0.0"

# Безопасность: непривилегированный пользователь
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Копируем статику и скомпилированные ассеты
COPY --from=builder /app/public ./public

# Настраиваем каталог для runtime-кэша Next.js (ISR)
RUN mkdir .next && chown nextjs:nodejs .next

# Минимальный standalone-бандл (весит ~120 МБ)
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

# Быстрый healthcheck через встроенный в alpine wget
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://127.0.0.1:3000/ || exit 1

ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "server.js"]
