"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useDemoData } from "@/components/DemoDataProvider";
import { MapView, type MapObject } from "@/components/MapView";
import { Icon } from "@/components/dash-icons";
import { ConditionMeter, ObjectStatusBadge } from "@/components/dash-ui";
import {
  formatDate,
  objectMetrics,
  statusLabels,
  typeLabels,
  type ObjectStatus,
} from "@/lib/dashboard";
import styles from "@/components/Dashboard.module.css";

const filters: { id: ObjectStatus | "all"; label: string }[] = [
  { id: "all", label: "Все" },
  { id: "critical", label: "Критические" },
  { id: "warning", label: "Требуют внимания" },
  { id: "good", label: "В норме" },
];

const dotClass: Record<ObjectStatus, string> = {
  good: styles.dotGood,
  warning: styles.dotWarning,
  critical: styles.dotCritical,
};

export default function MapPage() {
  const { state } = useDemoData();
  const enriched = useMemo(
    () =>
      state.objects.map((o) => {
        const m = objectMetrics(state, o.id);
        return { ...o, status: m.status, metrics: m } as MapObject & { metrics: typeof m };
      }),
    [state],
  );
  const objects = enriched;
  const [filter, setFilter] = useState<ObjectStatus | "all">("all");
  const [activeId, setActiveId] = useState<string | null>(state.objects[0]?.id ?? null);

  const visible = useMemo(
    () => objects.filter((o) => filter === "all" || o.status === filter),
    [objects, filter],
  );

  const active = objects.find((o) => o.id === activeId) ?? null;

  return (
    <div className={styles.page}>
      <div className={styles.pageHead}>
        <h2 className={styles.pageTitle}>Карта инфраструктуры</h2>
        <p className={styles.pageSubtitle}>
          Состояние дорог и мостовых сооружений на единой карте. Выберите объект на карте или в
          списке — карта приблизит его. Метки ставятся по условной точке объекта (условные координаты,
          не геодезическая привязка); протяжённые дороги показаны одной точкой.
        </p>
      </div>

      <div className={styles.toolbar}>
        <div className={styles.chips} style={{ flex: 1 }}>
          {filters.map((f) => (
            <button
              key={f.id}
              type="button"
              className={`${styles.chip} ${filter === f.id ? styles.chipActive : ""}`}
              onClick={() => setFilter(f.id)}
            >
              {f.label}
            </button>
          ))}
        </div>
        <span className={styles.pill}>Показано объектов: {visible.length}</span>
      </div>

      <div className={styles.mapLayout}>
        <div className={styles.mapWrap}>
          <MapView objects={visible} activeId={activeId} onSelect={setActiveId} />
          <div className={styles.mapLegendCard}>
            <span className={styles.mapLegendRow}>
              <span className={`${styles.dot} ${styles.dotCritical}`} /> Критическое
            </span>
            <span className={styles.mapLegendRow}>
              <span className={`${styles.dot} ${styles.dotWarning}`} /> Требует внимания
            </span>
            <span className={styles.mapLegendRow}>
              <span className={`${styles.dot} ${styles.dotGood}`} /> В норме
            </span>
            <span className={styles.mapLegendNote}>
              Индекс: &lt;50 — критическое, &lt;75 — внимание. Точки условные.
            </span>
          </div>
        </div>

        <div className={styles.mapPanel}>
          {active && (
            <div className={styles.mapDetail}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                <span className={styles.pill}>
                  <Icon name={active.type === "bridge" ? "bridge" : "road"} size={16} />
                  {typeLabels[active.type]}
                </span>
                <ObjectStatusBadge status={active.status} />
              </div>
              <h3 className={styles.objectName}>{active.name}</h3>
              <ConditionMeter value={active.metrics.condition} />
              <dl className={styles.defList}>
                <div>
                  <dt>Регион</dt>
                  <dd>{active.region}</dd>
                </div>
                <div>
                  <dt>Протяжённость</dt>
                  <dd>{active.length}</dd>
                </div>
                <div>
                  <dt>Открытых дефектов</dt>
                  <dd>
                    {active.metrics.open}
                    {active.metrics.critical > 0 ? ` (крит. ${active.metrics.critical})` : ""}
                  </dd>
                </div>
                <div>
                  <dt>Ремонт через (оценка)</dt>
                  <dd>{active.forecastMonths} мес.</dd>
                </div>
              </dl>
              <p className={styles.statMeta}>
                {active.metrics.lastInspection
                  ? `Последняя инспекция: ${formatDate(active.metrics.lastInspection.date)}`
                  : "Инспекций нет"}
              </p>
              <Link href={`/dashboard/objects/${active.id}`} className="btnPrimary">
                Открыть объект
              </Link>
            </div>
          )}

          <div className={styles.mapListHead}>
            Объекты <span>{visible.length}</span>
          </div>

          {visible.map((o) => (
            <button
              key={o.id}
              type="button"
              onClick={() => setActiveId(o.id)}
              className={`${styles.mapObjectCard} ${o.id === activeId ? styles.mapObjectActive : ""}`}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span className={`${styles.dot} ${dotClass[o.status]}`} />
                <span className={styles.cellStrong} style={{ flex: 1 }}>
                  {o.name}
                </span>
              </div>
              <span className={styles.cellMuted} style={{ fontSize: "var(--text-caption)" }}>
                {o.region} · {statusLabels[o.status]}
              </span>
              <ConditionMeter value={o.metrics.condition} />
            </button>
          ))}

          {visible.length === 0 && (
            <p className={styles.empty}>Нет объектов по выбранному фильтру</p>
          )}
        </div>
      </div>
    </div>
  );
}
