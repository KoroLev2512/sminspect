"use client";

import Link from "next/link";
import { useState } from "react";
import { ConditionMeter, ObjectStatusBadge } from "@/components/dash-ui";
import {
  formatDate,
  objects,
  typeLabels,
  type ObjectStatus,
} from "@/lib/dashboard";
import styles from "@/components/Dashboard.module.css";

const markerClass: Record<ObjectStatus, string> = {
  good: styles.mapMarkerGood,
  warning: styles.mapMarkerWarning,
  critical: styles.mapMarkerCritical,
};

const filters: { id: ObjectStatus | "all"; label: string }[] = [
  { id: "all", label: "Все" },
  { id: "critical", label: "Критические" },
  { id: "warning", label: "Требуют внимания" },
  { id: "good", label: "В норме" },
];

export default function MapPage() {
  const [filter, setFilter] = useState<ObjectStatus | "all">("all");
  const [activeId, setActiveId] = useState<string>(objects[0].id);

  const visible = objects.filter((o) => filter === "all" || o.status === filter);
  const active = objects.find((o) => o.id === activeId) ?? null;

  return (
    <div className={styles.page}>
      <div className={styles.pageHead}>
        <h2 className={styles.pageTitle}>Карта инфраструктуры</h2>
        <p className={styles.pageSubtitle}>
          Единая карта состояния объектов с фильтрацией по критичности. Выберите
          маркер, чтобы посмотреть детали.
        </p>
      </div>

      <div className={styles.chips} style={{ marginBottom: 20 }}>
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

      <div className={styles.split}>
        <div className={styles.map}>
          <div className={styles.mapGrid} aria-hidden />
          {visible.map((o) => (
            <button
              key={o.id}
              type="button"
              className={`${styles.mapMarker} ${markerClass[o.status]} ${
                o.id === activeId ? styles.mapMarkerActive : ""
              }`}
              style={{ left: `${o.x}%`, top: `${o.y}%` }}
              onClick={() => setActiveId(o.id)}
              aria-label={o.name}
              title={o.name}
            />
          ))}
          <div className={styles.mapLegend}>
            <span className={styles.mapLegendRow}>
              <span className={`${styles.dot} ${styles.dotCritical}`} /> Критическое
            </span>
            <span className={styles.mapLegendRow}>
              <span className={`${styles.dot} ${styles.dotWarning}`} /> Требует внимания
            </span>
            <span className={styles.mapLegendRow}>
              <span className={`${styles.dot} ${styles.dotGood}`} /> В норме
            </span>
          </div>
        </div>

        <div className={styles.card}>
          {active ? (
            <>
              <div className={styles.cardHead}>
                <h3 className={styles.cardTitle}>{typeLabels[active.type]}</h3>
                <ObjectStatusBadge status={active.status} />
              </div>
              <h4 className={styles.objectName} style={{ marginBottom: 16 }}>
                {active.name}
              </h4>
              <dl className={styles.defList} style={{ marginBottom: 20 }}>
                <div>
                  <dt>Регион</dt>
                  <dd>{active.region}</dd>
                </div>
                <div>
                  <dt>Протяжённость</dt>
                  <dd>{active.length}</dd>
                </div>
                <div>
                  <dt>Дефектов</dt>
                  <dd>{active.defects}</dd>
                </div>
                <div>
                  <dt>Критических</dt>
                  <dd>{active.criticalDefects}</dd>
                </div>
                <div>
                  <dt>Инспекция</dt>
                  <dd>{formatDate(active.lastInspection)}</dd>
                </div>
                <div>
                  <dt>Прогноз ремонта</dt>
                  <dd>через {active.forecastMonths} мес.</dd>
                </div>
              </dl>
              <div style={{ marginBottom: 20 }}>
                <span className={styles.statLabel}>Индекс состояния</span>
                <div style={{ marginTop: 8 }}>
                  <ConditionMeter value={active.condition} />
                </div>
              </div>
              <Link href={`/dashboard/objects/${active.id}`} className="btnPrimary">
                Открыть объект
              </Link>
            </>
          ) : (
            <p className={styles.empty}>Выберите объект на карте</p>
          )}
        </div>
      </div>
    </div>
  );
}
