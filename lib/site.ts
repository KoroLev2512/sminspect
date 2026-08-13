export const siteConfig = {
  name: "SmartInspect",
  url: "https://sminspect.ru",
  domain: "sminspect.ru",
  email: "demo@sminspect.ru",
  privacyEmail: "info@sminspect.ru",
  operator: 'ООО "ФЕРРАН"',
  operatorDetails: {
    fullName: 'Общество с ограниченной ответственностью «ФЕРРАН»',
    shortName: 'ООО «ФЕРРАН»',
    inn: "7812345678",
    kpp: "781201001",
    ogrn: "1237800123456",
    legalAddress: "197101, г. Санкт-Петербург, ул. Кронверкская, д. 49, лит. А",
    postalAddress: "197101, г. Санкт-Петербург, ул. Кронверкская, д. 49, лит. А",
    phone: "+7 (812) 000-00-00",
    email: "info@sminspect.ru",
  },
  locale: "ru_RU",
  description:
    "Облачная платформа для выявления дефектов инфраструктуры с помощью компьютерного зрения и ИИ. Прогнозирование износа, интерактивная карта, отчёты в реальном времени.",
  keywords: [
    "диагностика дорог",
    "инспекция мостов",
    "компьютерное зрение",
    "дефекты дорожного покрытия",
    "мониторинг инфраструктуры",
    "SmartInspect",
    "ИИ для дорог",
    "предиктивная аналитика",
  ],
} as const;

export function absoluteUrl(path = "/") {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${siteConfig.url}${normalized}`;
}
