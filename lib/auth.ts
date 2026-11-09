export type PlanId = "basic" | "extended" | "corporate";

export type NotificationId = "critical" | "weekly" | "forecast";

export type NotificationPrefs = Record<NotificationId, boolean>;

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  /** Телефон в формате +7 (XXX) XXX-XX-XX, пустая строка — не указан */
  phone?: string;
  company: string;
  role: string;
  segment: string;
  plan: PlanId;
  /** Фото профиля как data URL (уменьшено до 256×256), отсутствует — инициалы */
  avatar?: string;
  notifications?: NotificationPrefs;
}

export const defaultNotifications: NotificationPrefs = {
  critical: true,
  weekly: true,
  forecast: false,
};

export const notificationOptions: { id: NotificationId; label: string; desc: string }[] = [
  { id: "critical", label: "Критические дефекты", desc: "Мгновенные оповещения" },
  { id: "weekly", label: "Еженедельная сводка", desc: "Отчёт по состоянию объектов" },
  { id: "forecast", label: "Прогноз ремонтов", desc: "Уведомления о приближении сроков" },
];

/** Persisted account record (mock — password stored in localStorage only). */
export interface StoredAccount {
  user: AuthUser;
  password: string;
}

export const AUTH_STORAGE_KEY = "smartinspect.session";
export const USERS_STORAGE_KEY = "smartinspect.accounts";

/** Ready-to-use demo login shown on the sign-in screen. */
export const DEMO_CREDENTIALS = {
  email: "demo@sminspect.ru",
  password: "demo1234",
};

export const demoUser: AuthUser = {
  id: "u-demo",
  name: "Анна Смирнова",
  email: DEMO_CREDENTIALS.email,
  company: 'ГБУ «Дорожное хозяйство»',
  role: "Главный инженер по мониторингу",
  segment: "Муниципалитет / госорган",
  plan: "corporate",
};

export const segments = [
  "Муниципалитет / госорган",
  "Дорожно-строительная компания",
  "Логистика / транспорт",
  "Страхование",
  "Другое",
];

export const planLabels: Record<PlanId, string> = {
  basic: "Базовая",
  extended: "Расширенная аналитика",
  corporate: "Корпоративный пакет",
};

export const planPrices: Record<PlanId, string> = {
  basic: "от 15 000 ₽ / мес",
  extended: "от 32 000 ₽ / мес",
  corporate: "индивидуально",
};

export function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export const MIN_PASSWORD_LENGTH = 6;

/**
 * Formats Russian phone input as "+7 (XXX) XXX-XX-XX" while typing.
 * A leading 8 or 7 is treated as the country code.
 */
export function formatPhone(input: string) {
  let digits = input.replace(/\D/g, "");
  if (!digits) return "";
  if (digits[0] === "8" || digits[0] === "7") digits = digits.slice(1);
  digits = digits.slice(0, 10);

  let out = "+7";
  if (digits.length > 0) out += ` (${digits.slice(0, 3)}`;
  if (digits.length >= 3) out += ")";
  if (digits.length > 3) out += ` ${digits.slice(3, 6)}`;
  if (digits.length > 6) out += `-${digits.slice(6, 8)}`;
  if (digits.length > 8) out += `-${digits.slice(8, 10)}`;
  return out;
}

/** Empty is allowed (phone is optional); otherwise 10 digits after +7. */
export function isValidPhone(phone: string) {
  if (!phone) return true;
  return phone.replace(/\D/g, "").length === 11;
}
