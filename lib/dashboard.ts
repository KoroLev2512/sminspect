// Mock data layer for the SmartInspect dashboard (личный кабинет).
// All values are static so the UI renders deterministically without a backend.

export type ObjectType = "road" | "bridge";
export type Severity = "low" | "medium" | "critical";
export type ObjectStatus = "good" | "warning" | "critical";
export type DefectStatus = "new" | "in_progress" | "resolved";
export type InspectionSource = "drone" | "mobile" | "sensor";

export interface InfraObject {
  id: string;
  name: string;
  type: ObjectType;
  region: string;
  /** Географические координаты объекта (в пределах РФ) */
  lat: number;
  lng: number;
  /** Условный индекс состояния, 0–100 (выше — лучше) */
  condition: number;
  status: ObjectStatus;
  length: string;
  lastInspection: string;
  defects: number;
  criticalDefects: number;
  /** Прогноз: месяцев до рекомендованного ремонта */
  forecastMonths: number;
  image: string;
}

export interface Defect {
  id: string;
  objectId: string;
  type: string;
  severity: Severity;
  status: DefectStatus;
  detectedAt: string;
  location: string;
  /** Уверенность ИИ-классификатора, % */
  confidence: number;
  source: InspectionSource;
  recommendation: string;
  image: string;
}

export interface Inspection {
  id: string;
  objectId: string;
  date: string;
  source: InspectionSource;
  coverage: string;
  defectsFound: number;
  operator: string;
}

export interface Alert {
  id: string;
  objectId: string;
  defectId: string;
  message: string;
  severity: Severity;
  createdAt: string;
  read: boolean;
}

export interface ReportItem {
  id: string;
  title: string;
  objectId: string | null;
  period: string;
  type: "Состояние" | "Прогноз износа" | "Сводный" | "Инспекция";
  createdAt: string;
  status: "ready" | "generating";
  size: string;
}

export const severityLabels: Record<Severity, string> = {
  low: "Низкая",
  medium: "Средняя",
  critical: "Критическая",
};

export const statusLabels: Record<ObjectStatus, string> = {
  good: "В норме",
  warning: "Требует внимания",
  critical: "Критическое",
};

export const defectStatusLabels: Record<DefectStatus, string> = {
  new: "Новый",
  in_progress: "В работе",
  resolved: "Устранён",
};

export const sourceLabels: Record<InspectionSource, string> = {
  drone: "Дрон",
  mobile: "Мобильная камера",
  sensor: "Стационарный сенсор",
};

export const typeLabels: Record<ObjectType, string> = {
  road: "Дорога",
  bridge: "Мост / путепровод",
};

export const objects: InfraObject[] = [
  {
    id: "obj-1",
    name: "Мост через р. Волга, М-7 «Волга»",
    type: "bridge",
    region: "Нижегородская обл.",
    lat: 56.3,
    lng: 44.0,
    condition: 41,
    status: "critical",
    length: "1 240 м",
    lastInspection: "2026-07-08",
    defects: 14,
    criticalDefects: 3,
    forecastMonths: 2,
    image: "/images/dashboard-obj-1.jpg",
  },
  {
    id: "obj-2",
    name: "Автодорога М-4 «Дон», км 320–360",
    type: "road",
    region: "Воронежская обл.",
    lat: 51.66,
    lng: 39.2,
    condition: 63,
    status: "warning",
    length: "40 км",
    lastInspection: "2026-07-05",
    defects: 22,
    criticalDefects: 1,
    forecastMonths: 7,
    image: "/images/dashboard-obj-2.jpg",
  },
  {
    id: "obj-3",
    name: "Путепровод на ул. Профсоюзная",
    type: "bridge",
    region: "Москва",
    lat: 55.65,
    lng: 37.55,
    condition: 78,
    status: "good",
    length: "320 м",
    lastInspection: "2026-06-28",
    defects: 6,
    criticalDefects: 0,
    forecastMonths: 16,
    image: "/images/dashboard-obj-3.jpg",
  },
  {
    id: "obj-4",
    name: "Западный скоростной диаметр (ЗСД)",
    type: "road",
    region: "Санкт-Петербург",
    lat: 59.95,
    lng: 30.23,
    condition: 71,
    status: "warning",
    length: "46,6 км",
    lastInspection: "2026-07-02",
    defects: 18,
    criticalDefects: 1,
    forecastMonths: 9,
    image: "/images/dashboard-obj-4.jpg",
  },
  {
    id: "obj-5",
    name: "Мост через р. Кама, трасса Р-239",
    type: "bridge",
    region: "Респ. Татарстан",
    lat: 55.74,
    lng: 52.4,
    condition: 52,
    status: "warning",
    length: "980 м",
    lastInspection: "2026-07-06",
    defects: 11,
    criticalDefects: 2,
    forecastMonths: 4,
    image: "/images/dashboard-obj-5.jpg",
  },
  {
    id: "obj-6",
    name: "Автодорога А-121 «Сортавала»",
    type: "road",
    region: "Ленинградская обл.",
    lat: 60.7,
    lng: 30.6,
    condition: 84,
    status: "good",
    length: "62 км",
    lastInspection: "2026-06-24",
    defects: 4,
    criticalDefects: 0,
    forecastMonths: 21,
    image: "/images/dashboard-obj-6.jpg",
  },
  {
    id: "obj-7",
    name: "Эстакада «Южный обход»",
    type: "bridge",
    region: "Краснодарский край",
    lat: 45.04,
    lng: 38.98,
    condition: 58,
    status: "warning",
    length: "540 м",
    lastInspection: "2026-07-01",
    defects: 9,
    criticalDefects: 1,
    forecastMonths: 6,
    image: "/images/dashboard-obj-7.jpg",
  },
  {
    id: "obj-8",
    name: "Городская магистраль, пр. Ленина",
    type: "road",
    region: "Екатеринбург",
    lat: 56.84,
    lng: 60.61,
    condition: 88,
    status: "good",
    length: "12 км",
    lastInspection: "2026-06-30",
    defects: 3,
    criticalDefects: 0,
    forecastMonths: 24,
    image: "/images/dashboard-obj-8.jpg",
  },
];

const defectImage = "/images/defect-default.jpg";

export const defects: Defect[] = [
  {
    id: "def-1",
    objectId: "obj-1",
    type: "Коррозия арматуры",
    severity: "critical",
    status: "new",
    detectedAt: "2026-07-08",
    location: "Опора №4, нижний пояс",
    confidence: 96,
    source: "drone",
    recommendation: "Немедленное обследование опоры, ограничение нагрузки.",
    image: defectImage,
  },
  {
    id: "def-2",
    objectId: "obj-1",
    type: "Трещина в пролётном строении",
    severity: "critical",
    status: "in_progress",
    detectedAt: "2026-07-08",
    location: "Пролёт 7, балка Б-2",
    confidence: 92,
    source: "drone",
    recommendation: "Установка маяков, мониторинг раскрытия, ремонт в течение 30 дней.",
    image: defectImage,
  },
  {
    id: "def-3",
    objectId: "obj-1",
    type: "Разрушение деформационного шва",
    severity: "medium",
    status: "new",
    detectedAt: "2026-07-08",
    location: "Пролёт 3",
    confidence: 88,
    source: "sensor",
    recommendation: "Плановая замена шва при ближайшем ремонте.",
    image: defectImage,
  },
  {
    id: "def-4",
    objectId: "obj-2",
    type: "Выбоина",
    severity: "critical",
    status: "new",
    detectedAt: "2026-07-05",
    location: "км 334, правая полоса",
    confidence: 94,
    source: "mobile",
    recommendation: "Аварийная заделка, риск повреждения ТС.",
    image: defectImage,
  },
  {
    id: "def-5",
    objectId: "obj-2",
    type: "Колейность",
    severity: "medium",
    status: "in_progress",
    detectedAt: "2026-07-05",
    location: "км 341–345",
    confidence: 90,
    source: "mobile",
    recommendation: "Фрезерование и укладка нового слоя износа.",
    image: defectImage,
  },
  {
    id: "def-6",
    objectId: "obj-2",
    type: "Сетка трещин",
    severity: "low",
    status: "new",
    detectedAt: "2026-07-05",
    location: "км 350, обочина",
    confidence: 83,
    source: "mobile",
    recommendation: "Поверхностная обработка, наблюдение.",
    image: defectImage,
  },
  {
    id: "def-7",
    objectId: "obj-4",
    type: "Выбоина",
    severity: "critical",
    status: "new",
    detectedAt: "2026-07-02",
    location: "км 18, съезд",
    confidence: 91,
    source: "drone",
    recommendation: "Аварийная заделка в течение 48 часов.",
    image: defectImage,
  },
  {
    id: "def-8",
    objectId: "obj-4",
    type: "Продольная трещина",
    severity: "medium",
    status: "resolved",
    detectedAt: "2026-06-14",
    location: "км 22",
    confidence: 87,
    source: "mobile",
    recommendation: "Устранено: герметизация трещины.",
    image: defectImage,
  },
  {
    id: "def-9",
    objectId: "obj-5",
    type: "Коррозия арматуры",
    severity: "critical",
    status: "new",
    detectedAt: "2026-07-06",
    location: "Опора №2",
    confidence: 95,
    source: "drone",
    recommendation: "Дефектоскопия опоры, оценка несущей способности.",
    image: defectImage,
  },
  {
    id: "def-10",
    objectId: "obj-5",
    type: "Деформация пролёта",
    severity: "critical",
    status: "in_progress",
    detectedAt: "2026-07-06",
    location: "Пролёт 5",
    confidence: 89,
    source: "sensor",
    recommendation: "Геодезический мониторинг, ограничение движения большегрузов.",
    image: defectImage,
  },
  {
    id: "def-11",
    objectId: "obj-5",
    type: "Выкрашивание бетона",
    severity: "medium",
    status: "new",
    detectedAt: "2026-07-06",
    location: "Опора №6",
    confidence: 85,
    source: "drone",
    recommendation: "Ремонт защитного слоя бетона.",
    image: defectImage,
  },
  {
    id: "def-12",
    objectId: "obj-7",
    type: "Просадка опоры",
    severity: "critical",
    status: "new",
    detectedAt: "2026-07-01",
    location: "Опора №3",
    confidence: 90,
    source: "sensor",
    recommendation: "Инструментальное обследование фундамента.",
    image: defectImage,
  },
  {
    id: "def-13",
    objectId: "obj-7",
    type: "Трещина",
    severity: "medium",
    status: "in_progress",
    detectedAt: "2026-07-01",
    location: "Пролёт 2",
    confidence: 86,
    source: "drone",
    recommendation: "Мониторинг, ремонт при плановом обслуживании.",
    image: defectImage,
  },
  {
    id: "def-14",
    objectId: "obj-3",
    type: "Выкрашивание бетона",
    severity: "low",
    status: "new",
    detectedAt: "2026-06-28",
    location: "Пролёт 1",
    confidence: 82,
    source: "drone",
    recommendation: "Косметический ремонт.",
    image: defectImage,
  },
  {
    id: "def-15",
    objectId: "obj-3",
    type: "Загрязнение водоотвода",
    severity: "low",
    status: "resolved",
    detectedAt: "2026-06-10",
    location: "Пролёт 2",
    confidence: 79,
    source: "mobile",
    recommendation: "Устранено: очистка системы водоотвода.",
    image: defectImage,
  },
  {
    id: "def-16",
    objectId: "obj-6",
    type: "Сетка трещин",
    severity: "low",
    status: "new",
    detectedAt: "2026-06-24",
    location: "км 40",
    confidence: 80,
    source: "mobile",
    recommendation: "Наблюдение, поверхностная обработка.",
    image: defectImage,
  },
  {
    id: "def-17",
    objectId: "obj-8",
    type: "Выбоина",
    severity: "medium",
    status: "in_progress",
    detectedAt: "2026-06-30",
    location: "пр. Ленина, 45",
    confidence: 84,
    source: "mobile",
    recommendation: "Локальный ремонт покрытия.",
    image: defectImage,
  },
  {
    id: "def-18",
    objectId: "obj-8",
    type: "Износ разметки",
    severity: "low",
    status: "resolved",
    detectedAt: "2026-06-05",
    location: "пр. Ленина, перекрёсток",
    confidence: 77,
    source: "mobile",
    recommendation: "Устранено: нанесение разметки.",
    image: defectImage,
  },
];

export const inspections: Inspection[] = [
  {
    id: "insp-1",
    objectId: "obj-1",
    date: "2026-07-08",
    source: "drone",
    coverage: "100% пролётов",
    defectsFound: 14,
    operator: "БПЛА-бригада №2",
  },
  {
    id: "insp-2",
    objectId: "obj-2",
    date: "2026-07-05",
    source: "mobile",
    coverage: "40 км",
    defectsFound: 22,
    operator: "Мобильный комплекс А-1",
  },
  {
    id: "insp-3",
    objectId: "obj-4",
    date: "2026-07-02",
    source: "drone",
    coverage: "46,6 км",
    defectsFound: 18,
    operator: "БПЛА-бригада №1",
  },
  {
    id: "insp-4",
    objectId: "obj-7",
    date: "2026-07-01",
    source: "sensor",
    coverage: "непрерывный мониторинг",
    defectsFound: 9,
    operator: "Сеть сенсоров SI-540",
  },
  {
    id: "insp-5",
    objectId: "obj-5",
    date: "2026-07-06",
    source: "drone",
    coverage: "100% пролётов",
    defectsFound: 11,
    operator: "БПЛА-бригада №2",
  },
  {
    id: "insp-6",
    objectId: "obj-8",
    date: "2026-06-30",
    source: "mobile",
    coverage: "12 км",
    defectsFound: 3,
    operator: "Мобильный комплекс А-2",
  },
  {
    id: "insp-7",
    objectId: "obj-3",
    date: "2026-06-28",
    source: "drone",
    coverage: "320 м",
    defectsFound: 6,
    operator: "БПЛА-бригада №1",
  },
  {
    id: "insp-8",
    objectId: "obj-6",
    date: "2026-06-24",
    source: "mobile",
    coverage: "62 км",
    defectsFound: 4,
    operator: "Мобильный комплекс А-1",
  },
];

export const alerts: Alert[] = [
  {
    id: "al-1",
    objectId: "obj-1",
    defectId: "def-1",
    message: "Критическая коррозия арматуры на опоре №4 моста через р. Волга",
    severity: "critical",
    createdAt: "2026-07-08T09:14:00",
    read: false,
  },
  {
    id: "al-2",
    objectId: "obj-5",
    defectId: "def-9",
    message: "Обнаружена коррозия арматуры на опоре №2 моста через р. Кама",
    severity: "critical",
    createdAt: "2026-07-06T14:32:00",
    read: false,
  },
  {
    id: "al-3",
    objectId: "obj-2",
    defectId: "def-4",
    message: "Опасная выбоина на М-4 «Дон», км 334, правая полоса",
    severity: "critical",
    createdAt: "2026-07-05T11:05:00",
    read: false,
  },
  {
    id: "al-4",
    objectId: "obj-7",
    defectId: "def-12",
    message: "Зафиксирована просадка опоры №3 эстакады «Южный обход»",
    severity: "critical",
    createdAt: "2026-07-01T08:41:00",
    read: true,
  },
  {
    id: "al-5",
    objectId: "obj-4",
    defectId: "def-7",
    message: "Выбоина на съезде ЗСД, км 18 — риск для транспорта",
    severity: "critical",
    createdAt: "2026-07-02T16:20:00",
    read: true,
  },
  {
    id: "al-6",
    objectId: "obj-1",
    defectId: "def-2",
    message: "Развитие трещины в пролётном строении моста через р. Волга",
    severity: "medium",
    createdAt: "2026-07-08T09:15:00",
    read: true,
  },
];

export const reports: ReportItem[] = [
  {
    id: "rep-1",
    title: "Состояние моста через р. Волга — июль 2026",
    objectId: "obj-1",
    period: "Июль 2026",
    type: "Состояние",
    createdAt: "2026-07-08",
    status: "ready",
    size: "3,4 МБ",
  },
  {
    id: "rep-2",
    title: "Прогноз износа по мостовым сооружениям",
    objectId: null,
    period: "II полугодие 2026",
    type: "Прогноз износа",
    createdAt: "2026-07-04",
    status: "ready",
    size: "1,9 МБ",
  },
  {
    id: "rep-3",
    title: "Сводный отчёт по всем объектам",
    objectId: null,
    period: "Июнь 2026",
    type: "Сводный",
    createdAt: "2026-07-01",
    status: "ready",
    size: "5,1 МБ",
  },
  {
    id: "rep-4",
    title: "Инспекция М-4 «Дон», км 320–360",
    objectId: "obj-2",
    period: "05.07.2026",
    type: "Инспекция",
    createdAt: "2026-07-05",
    status: "ready",
    size: "2,2 МБ",
  },
  {
    id: "rep-5",
    title: "Состояние ЗСД — июль 2026",
    objectId: "obj-4",
    period: "Июль 2026",
    type: "Состояние",
    createdAt: "2026-07-02",
    status: "ready",
    size: "2,8 МБ",
  },
];

/** Средний индекс состояния по месяцам (для графика тренда). */
export const conditionTrend = [
  { month: "Дек", value: 74 },
  { month: "Янв", value: 73 },
  { month: "Фев", value: 71 },
  { month: "Мар", value: 72 },
  { month: "Апр", value: 69 },
  { month: "Май", value: 68 },
  { month: "Июн", value: 67 },
  { month: "Июл", value: 67 },
];

/** Распределение дефектов по типам (для диаграммы). */
export const defectDistribution = [
  { label: "Трещины", value: 34, color: "#006aed" },
  { label: "Выбоины", value: 27, color: "#18dcdc" },
  { label: "Коррозия", value: 18, color: "#f5a623" },
  { label: "Деформации", value: 12, color: "#c0392b" },
  { label: "Прочее", value: 9, color: "#68748d" },
];

/** Динамика найденных дефектов по месяцам (для гистограммы). */
export const defectsByMonth = [
  { month: "Фев", value: 42 },
  { month: "Мар", value: 55 },
  { month: "Апр", value: 61 },
  { month: "Май", value: 74 },
  { month: "Июн", value: 68 },
  { month: "Июл", value: 87 },
];

// ---- Selectors & aggregates -------------------------------------------------

export function getObject(id: string) {
  return objects.find((o) => o.id === id) ?? null;
}

export function getObjectName(id: string | null) {
  if (!id) return "Все объекты";
  return getObject(id)?.name ?? "Неизвестный объект";
}

export function defectsForObject(id: string) {
  return defects.filter((d) => d.objectId === id);
}

export function inspectionsForObject(id: string) {
  return inspections.filter((i) => i.objectId === id);
}

export function dashboardStats() {
  const criticalDefects = defects.filter(
    (d) => d.severity === "critical" && d.status !== "resolved",
  ).length;
  const avgCondition = Math.round(
    objects.reduce((sum, o) => sum + o.condition, 0) / objects.length,
  );
  return {
    objects: objects.length,
    criticalObjects: objects.filter((o) => o.status === "critical").length,
    criticalDefects,
    openDefects: defects.filter((d) => d.status !== "resolved").length,
    inspections: inspections.length,
    avgCondition,
    unreadAlerts: alerts.filter((a) => !a.read).length,
  };
}

const monthNames = [
  "января",
  "февраля",
  "марта",
  "апреля",
  "мая",
  "июня",
  "июля",
  "августа",
  "сентября",
  "октября",
  "ноября",
  "декабря",
];

/** Форматирует ISO-дату (YYYY-MM-DD) в «8 июля 2026». */
export function formatDate(iso: string) {
  const [y, m, d] = iso.slice(0, 10).split("-").map(Number);
  if (!y || !m || !d) return iso;
  return `${d} ${monthNames[m - 1]} ${y}`;
}

/** Форматирует ISO-дату-время в «8 июля, 09:14». */
export function formatDateTime(iso: string) {
  const [datePart, timePart = ""] = iso.split("T");
  const [y, m, d] = datePart.split("-").map(Number);
  const time = timePart.slice(0, 5);
  if (!y || !m || !d) return iso;
  return `${d} ${monthNames[m - 1]}${time ? `, ${time}` : ""}`;
}
