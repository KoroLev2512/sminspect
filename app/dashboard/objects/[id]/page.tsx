"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { Icon } from "@/components/dash-icons";
import {
  ConditionMeter,
  DefectStatusBadge,
  ObjectStatusBadge,
  SeverityBadge,
  StatCard,
} from "@/components/dash-ui";
import {
  defectsForObject,
  formatDate,
  getObject,
  inspectionsForObject,
  sourceLabels,
  typeLabels,
} from "@/lib/dashboard";
import styles from "@/components/Dashboard.module.css";

export default function ObjectDetailPage() {
  const params = useParams<{ id: string }>();
  const object = getObject(params.id);

  if (!object) {
    return (
      <div className={styles.page}>
        <div className={styles.card}>
          <p className={styles.empty}>Объект не найден.</p>
          <div style={{ textAlign: "center" }}>
            <Link href="/dashboard/objects" className={styles.btnSecondary}>
              К списку объектов
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const defects = defectsForObject(object.id);
  const inspections = inspectionsForObject(object.id);

  return (
    <div className={styles.page}>
      <Link
        href="/dashboard/objects"
        className={styles.pill}
        style={{ marginBottom: 16 }}
      >
        <Icon name="arrowLeft" size={16} /> Все объекты
      </Link>

      <div className={styles.pageHead}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
          <h2 className={styles.pageTitle}>{object.name}</h2>
          <ObjectStatusBadge status={object.status} />
        </div>
        <p className={styles.pageSubtitle}>
          {typeLabels[object.type]} · {object.region} · {object.length}
        </p>
      </div>

      <div className={styles.statGrid}>
        <StatCard label="Индекс состояния" value={object.condition} icon="analytics" />
        <StatCard label="Всего дефектов" value={object.defects} icon="defects" />
        <StatCard
          label="Критических"
          value={object.criticalDefects}
          icon="alerts"
          danger={object.criticalDefects > 0}
        />
        <StatCard
          label="Прогноз ремонта"
          value={`${object.forecastMonths} мес.`}
          icon="clock"
          meta="до рекомендованных работ"
        />
      </div>

      <div className={styles.split} style={{ marginTop: 20 }}>
        <div className={styles.stackGap}>
          <div className={styles.card}>
            <div className={styles.cardHead}>
              <h3 className={styles.cardTitle}>Обнаруженные дефекты</h3>
              <Link href="/dashboard/defects" className={styles.cardLink}>
                Все дефекты
              </Link>
            </div>
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Тип</th>
                    <th>Расположение</th>
                    <th>ИИ</th>
                    <th>Критичность</th>
                    <th>Статус</th>
                  </tr>
                </thead>
                <tbody>
                  {defects.map((d) => (
                    <tr key={d.id}>
                      <td className={styles.cellStrong}>{d.type}</td>
                      <td className={styles.cellMuted}>{d.location}</td>
                      <td className={styles.cellMuted}>{d.confidence}%</td>
                      <td>
                        <SeverityBadge severity={d.severity} />
                      </td>
                      <td>
                        <DefectStatusBadge status={d.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className={styles.stackGap}>
          <div className={styles.card}>
            <div className={styles.cardHead}>
              <h3 className={styles.cardTitle}>Состояние</h3>
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={object.image}
              alt={object.name}
              className={styles.objectImg}
              style={{ borderRadius: "var(--radius-md)", marginBottom: 16 }}
            />
            <ConditionMeter value={object.condition} />
            <p className={styles.statMeta}>
              Последняя инспекция: {formatDate(object.lastInspection)}
            </p>
          </div>

          <div className={styles.card}>
            <div className={styles.cardHead}>
              <h3 className={styles.cardTitle}>История инспекций</h3>
            </div>
            <div className={styles.timeline}>
              {inspections.map((ins) => (
                <div key={ins.id} className={styles.timelineItem}>
                  <div className={styles.timelineMark}>
                    <span className={styles.timelineDot} />
                  </div>
                  <div>
                    <p className={styles.alertMessage}>
                      {formatDate(ins.date)} — {sourceLabels[ins.source]}
                    </p>
                    <p className={styles.alertMeta}>
                      Покрытие: {ins.coverage} · дефектов: {ins.defectsFound} ·{" "}
                      {ins.operator}
                    </p>
                  </div>
                </div>
              ))}
              {inspections.length === 0 && (
                <p className={styles.empty}>Инспекции не проводились</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
