# SmartInspect

Маркетинговый сайт облачной платформы **SmartInspect** — решения для автоматизированной диагностики дорог, мостов и дорожной инфраструктуры с применением компьютерного зрения и искусственного интеллекта.

**Продакшен:** [sminspect.ru](https://sminspect.ru)  
**Оператор:** ООО «ФЕРРАН»

---

## Содержание

- [О проекте](#о-проекте)
- [Возможности сайта](#возможности-сайта)
- [Стек технологий](#стек-технологий)
- [Быстрый старт](#быстрый-старт)
- [Скрипты](#скрипты)
- [Структура проекта](#структура-проекта)
- [Страницы и маршруты](#страницы-и-маршруты)
- [Компоненты](#компоненты)
- [Слой данных (`lib/`)](#слой-данных-lib)
- [Дизайн-система](#дизайн-система)
- [Анимации и UX](#анимации-и-ux)
- [SEO и индексация](#seo-и-индексация)
- [API](#api)
- [Качество кода](#качество-кода)
- [Деплой](#деплой)
- [Дальнейшее развитие](#дальнейшее-развитие)
- [Лицензия](#лицензия)

---

## О проекте

SmartInspect — это B2B-платформа для дорожных служб, муниципалитетов, подрядчиков и страховых компаний. Сайт представляет продукт, его модули, отраслевые решения и новости компании.

Платформа помогает:

- автоматически выявлять дефекты дорожного покрытия и мостовых конструкций;
- строить интерактивную карту инфраструктуры;
- прогнозировать износ и приоритизировать ремонты;
- получать оповещения о критических дефектах;
- сокращать затраты на ручные обследования.

Сайт полностью на **русском языке**, ориентирован на российский рынок и соответствует требованиям 152-ФЗ в части обработки персональных данных (страница политики конфиденциальности).

---

## Возможности сайта

### Маркетинговые страницы

- **Главная** — hero с фото инфраструктуры, блоки о продукте, сравнение с ручным осмотром, сценарии использования, интеграции, новости и финальный CTA.
- **Платформа** — описание четырёх модулей: «Зрение ИИ», «Прогноз», «Карта», «Оповещения».
- **Решения** — отраслевые сценарии для муниципалитетов, дорожных компаний, логистики и страхования.
- **Новости** — лента статей о пилотах, исследованиях и развитии продукта.
- **Демо** — форма запроса демонстрации платформы.
- **Юридические страницы** — политика конфиденциальности и условия использования.

### Адаптивность

- Полностью responsive-вёрстка с брейкпоинтами **1024px** (планшет) и **768px** (мобильный).
- Мобильное меню с выезжающей панелью, кнопкой закрытия и блокировкой скролла.
- Safe-area insets для устройств с вырезом экрана.
- Оптимизированный hero на мобильных: центрированный контент, CTA-кнопка вместо карточки, полноэкранный фон.

### Анимации

- Плавные переходы между страницами (`PageTransition`).
- Scroll-reveal анимации (`Reveal`, `Stagger`).
- Пошаговое появление текста (`TextReveal`).
- Анимация hero при загрузке (масштабирование фото, появление текста и карточки).

### SEO

- Метаданные Open Graph и Twitter Cards на всех страницах.
- JSON-LD: Organization, WebSite, Article, BreadcrumbList, SoftwareApplication.
- Динамический `sitemap.xml` и `robots.txt`.
- OG-изображение 1200×630, генерируемое через `next/og`.
- Web App Manifest, кастомная 404, canonical URLs, ISO-даты публикации новостей.

---

## Стек технологий

| Категория | Технология |
|-----------|------------|
| Фреймворк | [Next.js 15](https://nextjs.org/) (App Router) |
| UI | [React 19](https://react.dev/) |
| Язык | [TypeScript 5](https://www.typescriptlang.org/) |
| Стили | CSS Modules + CSS Custom Properties |
| Шрифт | [Inter](https://fonts.google.com/specimen/Inter) (Google Fonts) |
| Линтер | [ESLint 9](https://eslint.org/) + `eslint-config-next` |
| Git hooks | [Husky](https://typicode.github.io/husky/) (pre-push) |
| Изображения | `next/image` с оптимизацией |
| OG-изображения | `next/og` (`ImageResponse`) |

Зависимости минимальны — без UI-библиотек, без CSS-фреймворков, без state-менеджеров. Весь интерфейс построен на нативных React-компонентах и CSS Modules.

---

## Быстрый старт

### Требования

- **Node.js** 18.18+ (рекомендуется 20 LTS)
- **npm** 9+

### Установка и запуск

```bash
# Клонировать репозиторий
git clone <repository-url>
cd smart-inspect

# Установить зависимости
npm install

# Запустить dev-сервер
npm run dev
```

Сайт будет доступен по адресу [http://localhost:3000](http://localhost:3000).

### Продакшен-сборка

```bash
npm run build
npm start
```

### Полная проверка перед деплоем

```bash
npm run check
```

Команда последовательно запускает ESLint и production-сборку — то же самое, что выполняет pre-push hook.

---

## Скрипты

| Команда | Описание |
|---------|----------|
| `npm run dev` | Dev-сервер с hot reload |
| `npm run build` | Production-сборка |
| `npm start` | Запуск production-сервера |
| `npm run lint` | Проверка ESLint |
| `npm run lint:fix` | Автоисправление ESLint |
| `npm run check` | Lint + build (полная проверка) |

---

## Структура проекта

```
smart-inspect/
├── app/                        # Next.js App Router
│   ├── layout.tsx              # Корневой layout (Nav, Footer, JSON-LD)
│   ├── template.tsx            # PageTransition wrapper
│   ├── page.tsx                # Главная страница
│   ├── globals.css             # Глобальные стили и CSS-токены
│   ├── platform/               # Страница платформы
│   ├── solutions/              # Каталог и детальные страницы решений
│   ├── news/                   # Лента и статьи новостей
│   ├── demo/                   # Форма запроса демо
│   ├── privacy/                # Политика конфиденциальности
│   ├── terms/                  # Условия использования
│   ├── api/demo/               # API-эндпоинт формы демо
│   ├── robots.ts               # robots.txt
│   ├── sitemap.ts              # sitemap.xml
│   ├── manifest.ts             # Web App Manifest
│   ├── opengraph-image.tsx     # OG-изображение 1200×630
│   ├── not-found.tsx           # Страница 404
│   ├── icon.png                # Favicon
│   └── apple-icon.png          # Apple Touch Icon
│
├── components/                 # React-компоненты
│   ├── Hero.tsx                # Hero-секция главной
│   ├── Nav.tsx                 # Навигация (desktop + mobile drawer)
│   ├── Footer.tsx              # Подвал сайта
│   ├── Logo.tsx                # Логотип SmartInspect
│   ├── PageHero.tsx            # Hero для внутренних страниц
│   ├── PageTransition.tsx      # Анимация перехода между страницами
│   ├── Reveal.tsx              # Scroll-reveal анимация
│   ├── Stagger.tsx             # Каскадное появление элементов
│   ├── TextReveal.tsx          # Пошаговое раскрытие текста
│   ├── Capabilities.tsx        # Блок возможностей
│   ├── Comparison.tsx          # Сравнение с ручным осмотром
│   ├── UseCases.tsx            # Сценарии использования
│   ├── Integration.tsx         # Блок интеграций
│   ├── MeetProduct.tsx         # Знакомство с продуктом
│   ├── News.tsx                # Секция новостей на главной
│   ├── FinalCTA.tsx            # Финальный призыв к действию
│   ├── DemoForm.tsx            # Форма запроса демо
│   └── JsonLd.tsx              # JSON-LD structured data
│
├── lib/                        # Данные и утилиты
│   ├── site.ts                 # Конфигурация сайта (URL, email, оператор)
│   ├── metadata.ts             # Генерация SEO-метаданных
│   ├── schema.ts               # JSON-LD схемы (Organization, Article, …)
│   ├── news.ts                 # Статьи новостей
│   ├── solutions.ts            # Отраслевые решения
│   ├── platform.ts             # Модули платформы
│   ├── privacy-policy.ts       # Текст политики конфиденциальности
│   └── terms.ts                # Текст условий использования
│
├── public/                     # Статические файлы
│   └── logo.png                # Логотип
│
├── scripts/                    # Вспомогательные скрипты
│   └── remove-logo-bg.py       # Удаление белого фона у PNG-логотипа
│
├── .husky/                     # Git hooks
│   └── pre-push                # Lint + build перед push
│
├── design-tokens.json          # Дизайн-токены (источник для CSS)
├── DESIGN.md                   # Подробное описание дизайн-системы
├── eslint.config.mjs           # Конфигурация ESLint (flat config)
├── next.config.ts              # Конфигурация Next.js
├── tsconfig.json               # Конфигурация TypeScript
└── package.json
```

---

## Страницы и маршруты

| Маршрут | Тип | Описание |
|---------|-----|----------|
| `/` | Static | Главная страница |
| `/platform` | Static | Описание модулей платформы |
| `/solutions` | Static | Каталог отраслевых решений |
| `/solutions/[slug]` | SSG | Детальная страница решения |
| `/news` | Static | Лента новостей |
| `/news/[slug]` | SSG | Статья новости |
| `/demo` | Static | Форма запроса демо |
| `/privacy` | Static | Политика конфиденциальности |
| `/terms` | Static | Условия использования |
| `/api/demo` | API | POST-эндпоинт формы демо |
| `/robots.txt` | Generated | Правила для краулеров |
| `/sitemap.xml` | Generated | Карта сайта |
| `/manifest.webmanifest` | Generated | Web App Manifest |
| `/opengraph-image` | Generated | OG-изображение для соцсетей |

Динамические страницы (`/solutions/[slug]`, `/news/[slug]`) генерируются статически через `generateStaticParams` на этапе сборки.

### Якорные секции на главной

| Якорь | Секция |
|-------|--------|
| `#safety` | Блок сравнения (Comparison) |
| `#company` | Подвал (Footer) |
| `#news` | Секция новостей |
| `#platform` | Блок возможностей |

---

## Компоненты

### Layout-компоненты

- **`Nav`** — фиксированная шапка с логотипом, навигацией и CTA «Запросить демо». На экранах ≤1024px — hamburger-меню с выезжающей панелью справа, overlay и кнопкой закрытия.
- **`Footer`** — подвал с навигацией, контактами и юридическими ссылками.
- **`PageTransition`** — обёртка для анимации перехода между страницами (progress bar + fade-in контента).
- **`PageHero`** — универсальный hero-блок для внутренних страниц (eyebrow, заголовок, описание).

### Секции главной страницы

- **`Hero`** — полноэкранный hero с фото инфраструктуры, заголовком, подзаголовком, карточкой (desktop) или CTA-кнопкой (mobile) и полосой статистики.
- **`TextReveal`** — анимированное появление текста при скролле.
- **`MeetProduct`** — знакомство с продуктом и его ключевыми преимуществами.
- **`Capabilities`** — четыре ключевые возможности платформы.
- **`Comparison`** — сравнение ручного осмотра и SmartInspect.
- **`UseCases`** — сценарии использования по отраслям.
- **`Integration`** — интеграции с внешними системами.
- **`News`** — превью последних новостей с ссылкой на полный каталог.
- **`FinalCTA`** — финальный призыв к действию.

### Утилитарные компоненты

- **`Reveal`** — scroll-triggered fade-in анимация с настраиваемой задержкой.
- **`Stagger`** — каскадное появление дочерних элементов.
- **`JsonLd`** — рендер JSON-LD structured data.
- **`DemoForm`** — клиентская форма запроса демо с валидацией.
- **`Logo`** — логотип SmartInspect с настраиваемым размером.

---

## Слой данных (`lib/`)

Все контентные данные вынесены в `lib/` и импортируются в страницы и компоненты. Это позволяет обновлять контент без изменения UI-кода.

| Файл | Содержимое |
|------|------------|
| `site.ts` | URL, email, оператор, locale, keywords |
| `metadata.ts` | `createPageMetadata()` — генерация title, description, OG, Twitter, canonical |
| `schema.ts` | JSON-LD: Organization, WebSite, Article, BreadcrumbList, SoftwareApplication |
| `news.ts` | Массив статей с slug, датой (`publishedAt`), тегом, заголовком, excerpt и параграфами |
| `solutions.ts` | Отраслевые решения: segment, title, pain, solution, benefits, quote |
| `platform.ts` | Модули платформы: name, title, description, features, image |
| `privacy-policy.ts` | Полный текст политики конфиденциальности (152-ФЗ) |
| `terms.ts` | Текст условий использования |

### Добавление новости

```typescript
// lib/news.ts
{
  slug: "my-new-article",
  tag: "Прогресс",
  publishedAt: "2026-04-01",
  title: "Заголовок статьи",
  excerpt: "Краткое описание для SEO и превью.",
  paragraphs: [
    "Первый абзац статьи.",
    "Второй абзац статьи.",
  ],
}
```

Страница `/news/my-new-article` будет сгенерирована автоматически при следующей сборке.

### Добавление решения

```typescript
// lib/solutions.ts
{
  slug: "my-segment",
  segment: "Короткое название",
  title: "Полный заголовок для SEO",
  pain: "Описание проблемы клиента.",
  solution: "Как SmartInspect решает проблему.",
  benefits: ["Преимущество 1", "Преимущество 2"],
  quote: "Цитата клиента.",
  author: "Должность",
  org: "Организация",
}
```

---

## Дизайн-система

Визуальный язык описан в [`DESIGN.md`](DESIGN.md) — «autonomous horizon at dawn»: белый canvas, глубокий navy-текст, один electric blue акцент.

### Ключевые принципы

- **Светлая тема** — белый фон, без теней, без декоративных элементов.
- **Inter** — единственный шрифт (400, 500, 600).
- **Rectilinear** — скругления 8px, без elevation.
- **Gradient accent** — cyan-to-cobalt градиент только для брендовых моментов.

### CSS-токены

Все токены определены в `app/globals.css` как CSS Custom Properties:

```css
/* Цвета */
--color-horizon-navy: #001733;
--color-signal-blue: #006aed;
--color-paper-white: #ffffff;
--color-hailstone: #f3f4f8;

/* Типографика */
--text-hero: 90px;
--text-heading-lg: 52px;
--text-body: 16px;

/* Отступы */
--spacing-24: 24px;
--section-gap: 96px;
--nav-height: 72px;

/* Анимации */
--ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);
--motion-hero: 900ms;
```

Токены адаптируются на мобильных (≤768px): уменьшаются размеры шрифтов, `--nav-height` становится 64px, `--section-gap` — 56px.

### Утилитарные CSS-классы

Глобальные классы в `globals.css`:

| Класс | Назначение |
|-------|------------|
| `.container` | Центрированный контейнер (max-width 1280px) |
| `.section` | Секция с вертикальными отступами |
| `.eyebrow` | Метка-надпись (uppercase, caption) |
| `.headingLg` / `.headingSm` | Заголовки секций |
| `.bodyMuted` | Приглушённый текст |
| `.btnPrimary` | Основная кнопка (Signal Blue) |
| `.btnGhost` | Текстовая ссылка-кнопка |
| `.btnCircle` | Круглая иконка-кнопка |
| `.gradientAccent` | Градиентная полоска-акцент |

---

## Анимации и UX

### PageTransition

При навигации между страницами:
1. Progress bar анимированно заполняется сверху.
2. Контент новой страницы появляется с fade-in + translateY.

Реализовано через `app/template.tsx` — Next.js remounts template при смене маршрута.

### Scroll Reveal

Компоненты `Reveal` и `Stagger` используют `IntersectionObserver` для запуска CSS-анимаций при появлении элемента в viewport. Поддерживают:
- настраиваемую задержку (`delay`);
- `prefers-reduced-motion` — анимации отключаются.

### Мобильная навигация

- Hamburger-кнопка в шапке (≤1024px).
- Slide-out drawer справа с overlay.
- Кнопка закрытия (×) внутри панели.
- Закрытие по Escape, клику на overlay или переходу по ссылке.
- Блокировка скролла body при открытом меню.

---

## SEO и индексация

### Метаданные

Каждая страница получает через `createPageMetadata()`:

- `<title>` с шаблоном `%s — SmartInspect`
- `<meta name="description">`
- `<meta name="keywords">`
- `<link rel="canonical">`
- Open Graph (title, description, url, image, locale, type)
- Twitter Card (`summary_large_image`)

### Structured Data (JSON-LD)

| Схема | Где используется |
|-------|------------------|
| `Organization` | Все страницы (layout) |
| `WebSite` | Все страницы (layout) |
| `Article` | Страницы новостей |
| `BreadcrumbList` | Новости, решения |
| `SoftwareApplication` | Страница платформы |

### Файлы для краулеров

- **`/robots.txt`** — allow `/`, disallow `/api/`, sitemap и host.
- **`/sitemap.xml`** — все статические и динамические маршруты с приоритетами и `lastModified` для новостей.
- **`/manifest.webmanifest`** — name, icons, theme_color, lang.
- **`/opengraph-image`** — динамическое OG-изображение 1200×630.

### Рекомендации после деплоя

1. Добавить сайт в [Google Search Console](https://search.google.com/search-console) и [Яндекс Вебмастер](https://webmaster.yandex.ru/).
2. Подключить [Яндекс.Метрику](https://metrika.yandex.ru/) и/или Google Analytics 4.
3. Проверить OG-превью через [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/).

---

## API

### `POST /api/demo`

Принимает JSON с полями формы запроса демо:

```json
{
  "name": "Иван Иванов",
  "email": "ivan@company.ru",
  "company": "ООО ДорСтрой",
  "role": "Начальник участка",
  "segment": "Дорожные компании",
  "message": "Интересует пилот на 10 км дорог"
}
```

**Обязательные поля:** `name`, `email`, `company`, `segment`.

**Ответы:**

| Статус | Тело | Условие |
|--------|------|---------|
| 200 | `{ "ok": true }` | Успешная отправка |
| 400 | `{ "error": "..." }` | Невалидные или неполные данные |

> **TODO:** интеграция с CRM или email-уведомлениями. Сейчас заявки логируются в stdout сервера.

---

## Качество кода

### ESLint

Flat config (`eslint.config.mjs`) на базе `eslint-config-next`. Проверяет TypeScript, React и Next.js best practices.

```bash
npm run lint        # проверка
npm run lint:fix    # автоисправление
```

### Husky pre-push

Перед каждым `git push` автоматически выполняются:

```bash
npm run lint
npm run build
```

Hook настроен в `.husky/pre-push`. Husky активируется через `npm install` (скрипт `prepare`).

### TypeScript

Strict mode включён. Все компоненты и утилиты типизированы. Динамические маршруты используют `generateStaticParams` для статической генерации.

---

## Деплой

Проект оптимизирован для деплоя на [Vercel](https://vercel.com/) или любой платформе с поддержкой Next.js 15.

### Vercel (рекомендуется)

```bash
# Установить Vercel CLI
npm i -g vercel

# Деплой
vercel
```

Или подключить репозиторий через [Vercel Dashboard](https://vercel.com/new) — деплой будет автоматическим при push в main/master.

### Переменные окружения

На данный момент проект не требует переменных окружения для базовой работы. При интеграции CRM/email для формы дemo потребуются:

| Переменная | Описание |
|------------|----------|
| `CRM_API_KEY` | API-ключ CRM-системы |
| `NOTIFICATION_EMAIL` | Email для уведомлений о заявках |

### Домен

Production-домен: **sminspect.ru** (настроен в `lib/site.ts` как `metadataBase`).

---

## Дальнейшее развитие

- [ ] Интеграция формы дemo с CRM / email-уведомлениями
- [ ] Подключение Яндекс.Метрики и Google Analytics
- [ ] Верификация в Google Search Console и Яндекс Вебмастер
- [x] Self-hosted изображения вместо Unsplash
- [ ] RSS-лента для `/news`
- [ ] Мультиязычность (hreflang)
- [ ] Блог / CMS-интеграция для новостей
- [ ] A/B-тестирование CTA-блоков

---

## Лицензия

Проприетарное программное обеспечение. Все права принадлежат ООО «ФЕРРАН».

---

<p align="center">
  <strong>SmartInspect</strong> — инфраструктура под постоянным контролем.<br>
  <a href="https://sminspect.ru">sminspect.ru</a> · <a href="mailto:demo@sminspect.ru">demo@sminspect.ru</a>
</p>
