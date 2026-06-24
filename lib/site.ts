export const siteConfig = {
  name: "SmartInspect",
  url: "https://sminspect.ru",
  domain: "sminspect.ru",
  email: "demo@sminspect.ru",
  privacyEmail: "info@sminspect.ru",
  operator: 'ООО "ФЕРРАН"',
  locale: "ru_RU",
  description:
    "Облачная платформа для выявления дефектов инфраструктуры с помощью компьютерного зрения и ИИ. Прогнозирование износа, интерактивная карта, отчёты в реальном времени.",
} as const;

export function absoluteUrl(path = "/") {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${siteConfig.url}${normalized}`;
}
