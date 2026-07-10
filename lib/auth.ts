export type PlanId = "basic" | "extended" | "corporate";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  company: string;
  role: string;
  segment: string;
  plan: PlanId;
}

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
