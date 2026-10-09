# syntax=docker/dockerfile:1.4

# -----------------------------------------------------------------------------
# Базовый образ
# -----------------------------------------------------------------------------
FROM node:20-alpine AS base
RUN apk add --no-cache libc6-compat
WORKDIR /app

# -----------------------------------------------------------------------------
# 1. Зависимости (deps)
# -----------------------------------------------------------------------------
FROM base AS deps
WORKDIR /app

COPY package.json package-lock.json ./
# Используем BuildKit-кэш для npm и отключаем prepare-скрипты (husky) для ускорения
RUN --mount=type=cache,target=/root/.npm \
    npm ci --ignore-scripts

# -----------------------------------------------------------------------------
# 2. Сборка проекта (builder)
# -----------------------------------------------------------------------------
FROM base AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

# Аргументы сборки (клиентские переменные Next.js)
ARG NEXT_PUBLIC_MAPTILER_KEY
ENV NEXT_PUBLIC_MAPTILER_KEY=$NEXT_PUBLIC_MAPTILER_KEY

# BuildKit-кэш для .next/cache ускоряет повторные билды в разы
RUN --mount=type=cache,target=/app/.next/cache \
    npm run build

# -----------------------------------------------------------------------------
# 3. Финальный легковесный продакшен-образ (runner)
# -----------------------------------------------------------------------------
FROM node:20-alpine AS runner
WORKDIR /app

# dumb-init для мгновенного и корректного завершения процессов при перезапуске (SIGTERM)
RUN apk add --no-cache dumb-init

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Безопасность: работа под непривилегированным пользователем без root-прав
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Копируем публичные статические файлы
COPY --from=builder /app/public ./public

# Создаем каталог для кэша с правильными правами (для ISR/кэша Next.js)
RUN mkdir .next && chown nextjs:nodejs .next

# Копируем только standalone-бандл и скомпилированную статику
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

# Встроенная проверка здоровья контейнера (Healthcheck)
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://127.0.0.1:3000/ || exit 1

ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "server.js"]
