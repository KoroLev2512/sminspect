// Domain model of the SmartInspect dashboard (личный кабинет): types, labels,
// formatters and pure selectors. The data itself lives in lib/demo/seed.ts and
// is held at runtime by components/DemoDataProvider.tsx. Every figure shown in
// the UI is derived here from that single state, so sections cannot disagree.

export type ObjectType = "road" | "bridge";
export type Severity = "low" | "medium" | "critical";
export type ObjectStatus = "good" | "warning" | "critical";
export type DefectStatus = "new" | "in_progress" | "resolved";
export type InspectionSource = "drone" | "mobile" | "sensor";
export type InspectionStatus = "created" | "queued" | "processing" | "completed" | "failed";
export type ReportType = "Состояние" | "Прогноз износа" | "Сводный" | "Инспекция";

/** Конец демонстрационного периода: «срез» данных, к которому привязаны KPI. */
export const DEMO_AS_OF = "2026-11-01";

export interface InfraObject {
  id: string;
  name: string;
  type: ObjectType;
  region: string;
  /** Условные координаты точки объекта (демо, не геодезическая привязка) */
  lat: number;
  lng: number;
  length: string;
  image: string;
  /**
   * Базовая оценка конструктива 0–100 по последнему обследованию (демо).
   * Индекс состояния = baseScore − штрафы за открытые дефекты.
   */
  baseScore: number;
  /** Индекс состояния на конец прошлых месяцев (YYYY-MM), демо-история */
  conditionHistory: { month: string; value: number }[];
  /** Оценка: месяцев до рекомендованного ремонта (демо, без верифицированной модели) */
  forecastMonths: number;
}

/** Прямоугольник разметки: координаты и размеры в % от кадра */
export interface BBox {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface StatusChange {
  status: DefectStatus;
  at: string;
}

export interface Defect {
  id: string;
  objectId: string;
  /** Инспекция, в ходе которой дефект выявлен */
  inspectionId: string;
  type: string;
  severity: Severity;
  status: DefectStatus;
  detectedAt: string;
  location: string;
  /** Демонстрационная оценка уверенности разметки, % (не метрика реальной модели) */
  confidence: number;
  source: InspectionSource;
  /** Рекомендация системы; требует подтверждения инженером */
  recommendation: string;
  /** Кадр, на котором размечен дефект */
  image: string;
  bbox: BBox;
  history: StatusChange[];
}

/** Одна область на снимке, найденная модулем анализа. */
export interface Detection {
  type: string;
  severity: Severity;
  bbox: BBox;
  confidence: number;
  location: string;
  recommendation: string;
}

export interface MaterialAnalysis {
  /** matched — есть демо-разметка; unsupported — снимок не из демо-набора; error — сбой */
  state: "matched" | "unsupported" | "error";
  engine: string;
  detections: Detection[];
  message?: string;
}

export interface InspectionMaterial {
  id: string;
  name: string;
  /** Публичный URL или data URL уменьшенной копии */
  url: string;
  sizeBytes?: number;
  analysis?: MaterialAnalysis;
}

export interface Inspection {
  id: string;
  title: string;
  objectId: string;
  date: string;
  source: InspectionSource;
  operator: string;
  coverage: string;
  description: string;
  status: InspectionStatus;
  createdAt: string;
  statusLog: { status: InspectionStatus; at: string }[];
  materials: InspectionMaterial[];
  /** Дефекты реестра, сохранённые по результатам этой инспекции */
  savedDefectIds: string[];
  /** Причина ошибки обработки (status === "failed") */
  failureReason?: string;
}

export interface Alert {
  id: string;
  objectId: string;
  defectId: string | null;
  message: string;
  severity: Severity;
  createdAt: string;
  read: boolean;
}

export interface ReportItem {
  id: string;
  number: string;
  title: string;
  objectId: string | null;
  inspectionId?: string | null;
  type: ReportType;
  period: string;
  createdAt: string;
  /** Фактический размер последнего сформированного PDF */
  sizeBytes?: number;
}

export interface DemoState {
  version: number;
  objects: InfraObject[];
  inspections: Inspection[];
  defects: Defect[];
  alerts: Alert[];
  reports: ReportItem[];
}

// ---- Labels -----------------------------------------------------------------

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

export const inspectionStatusLabels: Record<InspectionStatus, string> = {
  created: "Создана",
  queued: "Ожидает обработки",
  processing: "Обрабатывается",
  completed: "Завершена",
  failed: "Ошибка обработки",
};

export const reportTypes: ReportType[] = ["Состояние", "Инспекция", "Прогноз износа", "Сводный"];

// ---- Condition index methodology ---------------------------------------------

/** Штраф к индексу за каждый открытый (не устранённый) дефект. */
export const SEVERITY_PENALTY: Record<Severity, number> = {
  critical: 16,
  medium: 7,
  low: 2,
};

/** Пороги статуса объекта по индексу состояния. */
export const STATUS_THRESHOLDS = { critical: 50, warning: 75 } as const;

export function statusFromIndex(index: number): ObjectStatus {
  if (index < STATUS_THRESHOLDS.critical) return "critical";
  if (index < STATUS_THRESHOLDS.warning) return "warning";
  return "good";
}

export const isOpen = (d: Defect) => d.status !== "resolved";

export function conditionIndex(object: InfraObject, defects: Defect[]) {
  const penalty = defects
    .filter((d) => d.objectId === object.id && isOpen(d))
    .reduce((sum, d) => sum + SEVERITY_PENALTY[d.severity], 0);
  return Math.max(0, Math.min(100, object.baseScore - penalty));
}

export interface ObjectMetrics {
  condition: number;
  status: ObjectStatus;
  /** Все дефекты объекта в реестре */
  defects: number;
  /** Открытые (новые + в работе) */
  open: number;
  /** Открытые критические */
  critical: number;
  lastInspection: Inspection | null;
}

export function objectMetrics(state: DemoState, objectId: string): ObjectMetrics {
  const object = getObject(state, objectId);
  const own = state.defects.filter((d) => d.objectId === objectId);
  const condition = object ? conditionIndex(object, state.defects) : 0;
  const lastInspection =
    state.inspections
      .filter((i) => i.objectId === objectId && i.status === "completed")
      .sort((a, b) => b.date.localeCompare(a.date))[0] ?? null;
  return {
    condition,
    status: statusFromIndex(condition),
    defects: own.length,
    open: own.filter(isOpen).length,
    critical: own.filter((d) => isOpen(d) && d.severity === "critical").length,
    lastInspection,
  };
}

// ---- Lookups ----------------------------------------------------------------

export function getObject(state: DemoState, id: string) {
  return state.objects.find((o) => o.id === id) ?? null;
}

export function getObjectName(state: DemoState, id: string | null) {
  if (!id) return "Все объекты";
  return getObject(state, id)?.name ?? "Неизвестный объект";
}

export function getInspection(state: DemoState, id: string) {
  return state.inspections.find((i) => i.id === id) ?? null;
}

export function defectsForObject(state: DemoState, id: string) {
  return state.defects.filter((d) => d.objectId === id);
}

export function defectsForInspection(state: DemoState, id: string) {
  return state.defects.filter((d) => d.inspectionId === id);
}

export function inspectionsForObject(state: DemoState, id: string) {
  return state.inspections
    .filter((i) => i.objectId === id)
    .sort((a, b) => b.date.localeCompare(a.date));
}

// ---- Periods & aggregates ---------------------------------------------------

export type Period = "30d" | "90d" | "all";

export const periodLabels: Record<Period, string> = {
  "30d": "30 дней",
  "90d": "90 дней",
  all: "Весь период",
};

/**
 * Дата, относительно которой считаются периоды: срез демо-данных или более
 * поздняя инспекция, созданная пользователем.
 */
export function referenceDate(state: DemoState) {
  const latest = state.inspections.reduce((max, i) => (i.date > max ? i.date : max), DEMO_AS_OF);
  return latest;
}

export function periodStart(state: DemoState, period: Period) {
  if (period === "all") return "0000-01-01";
  const days = period === "30d" ? 30 : 90;
  const d = new Date(`${referenceDate(state)}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() - days + 1);
  return d.toISOString().slice(0, 10);
}

export function dashboardStats(state: DemoState, period: Period = "all") {
  const since = periodStart(state, period);
  const metrics = state.objects.map((o) => objectMetrics(state, o.id));
  const openDefects = state.defects.filter(isOpen);
  return {
    objects: state.objects.length,
    criticalObjects: metrics.filter((m) => m.status === "critical").length,
    warningObjects: metrics.filter((m) => m.status === "warning").length,
    newDefects: state.defects.filter((d) => d.status === "new").length,
    inProgressDefects: state.defects.filter((d) => d.status === "in_progress").length,
    openDefects: openDefects.length,
    criticalDefects: openDefects.filter((d) => d.severity === "critical").length,
    inspections: state.inspections.filter((i) => i.status === "completed" && i.date >= since)
      .length,
    defectsInPeriod: state.defects.filter((d) => d.detectedAt >= since).length,
    avgCondition: Math.round(metrics.reduce((s, m) => s + m.condition, 0) / metrics.length),
    unreadAlerts: state.alerts.filter((a) => !a.read).length,
    analyzedImages: state.inspections.reduce(
      (s, i) => s + i.materials.filter((m) => m.analysis?.state === "matched").length,
      0,
    ),
  };
}

const shortMonths = ["Янв", "Фев", "Мар", "Апр", "Май", "Июн", "Июл", "Авг", "Сен", "Окт", "Ноя", "Дек"];

function monthLabel(ym: string) {
  return shortMonths[Number(ym.slice(5, 7)) - 1] ?? ym;
}

/** Последние `count` месяцев (YYYY-MM), заканчивая месяцем перед срезом. */
function recentMonths(state: DemoState, count: number) {
  const ref = referenceDate(state);
  const end = new Date(`${ref.slice(0, 7)}-01T00:00:00Z`);
  // Месяц среза (1 ноября) ещё не начался: последний полный месяц — предыдущий.
  if (ref.slice(8, 10) === "01") end.setUTCMonth(end.getUTCMonth() - 1);
  const out: string[] = [];
  for (let k = count - 1; k >= 0; k--) {
    const d = new Date(end);
    d.setUTCMonth(d.getUTCMonth() - k);
    out.push(d.toISOString().slice(0, 7));
  }
  return out;
}

/**
 * Средний индекс состояния по месяцам: прошлые месяцы — из демо-истории
 * объектов, последний — текущий расчёт по реестру дефектов.
 */
export function conditionTrend(state: DemoState) {
  const months = recentMonths(state, 6);
  const current = dashboardStats(state).avgCondition;
  return months.map((m, idx) => {
    if (idx === months.length - 1) return { month: monthLabel(m), value: current };
    const values = state.objects
      .map((o) => o.conditionHistory.find((h) => h.month === m)?.value)
      .filter((v): v is number => typeof v === "number");
    const value = values.length
      ? Math.round(values.reduce((s, v) => s + v, 0) / values.length)
      : current;
    return { month: monthLabel(m), value };
  });
}

export function inspectionsByMonth(state: DemoState) {
  return recentMonths(state, 6).map((m) => ({
    month: monthLabel(m),
    value: state.inspections.filter((i) => i.status === "completed" && i.date.startsWith(m))
      .length,
  }));
}

export function defectsByMonth(state: DemoState) {
  return recentMonths(state, 6).map((m) => ({
    month: monthLabel(m),
    value: state.defects.filter((d) => d.detectedAt.startsWith(m)).length,
  }));
}

const typeGroups: { label: string; color: string; match: RegExp }[] = [
  { label: "Трещины", color: "#006aed", match: /трещин/i },
  { label: "Выбоины и покрытие", color: "#18dcdc", match: /выбоин|асфальтобетон|разметк/i },
  { label: "Коррозия", color: "#f5a623", match: /коррози/i },
  { label: "Бетон и швы", color: "#68748d", match: /бетон|шв/i },
  { label: "Деформации", color: "#c0392b", match: /деформац|просадк/i },
];

/** Распределение дефектов реестра по группам типов. */
export function defectsByType(state: DemoState) {
  const counts = typeGroups.map((g) => ({ label: g.label, color: g.color, value: 0 }));
  const other = { label: "Прочее", color: "#d1d6e0", value: 0 };
  for (const d of state.defects) {
    const idx = typeGroups.findIndex((g) => g.match.test(d.type));
    if (idx >= 0) counts[idx].value += 1;
    else other.value += 1;
  }
  return [...counts, other].filter((c) => c.value > 0);
}

// ---- Formatting -------------------------------------------------------------

/** Склонение: plural(3, ["объект", "объекта", "объектов"]) → «объекта». */
export function plural(n: number, forms: [string, string, string]) {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return forms[0];
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return forms[1];
  return forms[2];
}

export function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} Б`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} КБ`;
  return `${(bytes / 1024 / 1024).toFixed(1).replace(".", ",")} МБ`;
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
