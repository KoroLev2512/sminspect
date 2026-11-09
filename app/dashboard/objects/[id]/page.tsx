"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { DefectPhoto } from "@/components/DefectPhoto";
import { DefectViewer } from "@/components/DefectViewer";
import { useDemoData } from "@/components/DemoDataProvider";
import { Icon } from "@/components/dash-icons";
import {
  ConditionMeter,
  DefectStatusBadge,
  ObjectStatusBadge,
  SeverityBadge,
  StatCard,
  TrendLine,
} from "@/components/dash-ui";
import {
  SEVERITY_PENALTY,
  STATUS_THRESHOLDS,
  defectsForObject,
  formatDate,
  getObject,
  inspectionStatusLabels,
  inspectionsForObject,
  isOpen,
  objectMetrics,
  severityLabels,
  sourceLabels,
  typeLabels,
  type Severity,
} from "@/lib/dashboard";
import styles from "@/components/Dashboard.module.css";

const shortMonths = ["Янв", "Фев", "Мар", "Апр", "Май", "Июн", "Июл", "Авг", "Сен", "Окт", "Ноя", "Дек"];
const severityOrder: Severity[] = ["critical", "medium", "low"];

export default function ObjectDetailPage() {
  const params = useParams<{ id: string }>();
  const { state, setDefectStatus } = useDemoData();
  const object = getObject(state, params.id);
  const [openId, setOpenId] = useState<string | null>(null);

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

  const m = objectMetrics(state, object.id);
  const defects = [...defectsForObject(state, object.id)].sort(
    (a, b) =>
      Number(isOpen(b)) - Number(isOpen(a)) ||
      severityOrder.indexOf(a.severity) - severityOrder.indexOf(b.severity),
  );
  const inspections = inspectionsForObject(state, object.id);
  const openDefects = defects.filter(isOpen);
  const penalties = severityOrder
    .map((sev) => {
      const count = openDefects.filter((d) => d.severity === sev).length;
      return { sev, count, points: count * SEVERITY_PENALTY[sev] };
    })
    .filter((p) => p.count > 0);
  const history = [
    ...object.conditionHistory.map((h) => ({
      month: shortMonths[Number(h.month.slice(5, 7)) - 1],
      value: h.value,
    })),
    { month: "Сейчас", value: m.condition },
  ];
  const priority = openDefects.filter((d) => d.severity !== "low").slice(0, 3);

  return (
    <div className={styles.page}>
      <Link href="/dashboard/objects" className={styles.pill} style={{ marginBottom: 16 }}>
        <Icon name="arrowLeft" size={16} /> Все объекты
      </Link>

      <div className={styles.pageHeadRow}>
        <div className={styles.pageHead} style={{ marginBottom: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
            <h2 className={styles.pageTitle}>{object.name}</h2>
            <ObjectStatusBadge status={m.status} />
          </div>
          <p className={styles.pageSubtitle}>
            {typeLabels[object.type]} · {object.region} · {object.length}
          </p>
        </div>
        <div className={styles.headActions}>
          <Link
            href={`/dashboard/reports?object=${object.id}&type=Состояние`}
            className={styles.btnSecondary}
          >
            <Icon name="reports" size={16} />
            Отчёт по объекту
          </Link>
          <Link href={`/dashboard/inspections/new?object=${object.id}`} className="btnPrimary">
            <Icon name="plus" size={16} />
            Новая инспекция
          </Link>
        </div>
      </div>

      <div className={styles.statGrid} style={{ marginTop: 24 }}>
        <StatCard
          label="Индекс состояния"
          value={m.condition}
          icon="analytics"
          meta="из 100, расчёт по открытым дефектам"
        />
        <StatCard
          label="Открытых дефектов"
          value={m.open}
          icon="defects"
          meta={`всего в реестре: ${m.defects}`}
          href={`/dashboard/defects?object=${object.id}&status=open`}
        />
        <StatCard
          label="Критических открытых"
          value={m.critical}
          icon="alerts"
          danger={m.critical > 0}
          href={`/dashboard/defects?object=${object.id}&severity=critical&status=open`}
        />
        <StatCard
          label="Прогноз ремонта"
          value={`${object.forecastMonths} мес.`}
          icon="clock"
          meta={<><span className={styles.demoTag}>Оценка</span> демо-сценарий, не модель</>}
        />
      </div>

      <div className={styles.split} style={{ marginTop: 20 }}>
        <div className={styles.stackGap}>
          {priority.length > 0 && (
            <div className={`${styles.card} ${styles.priorityCard}`}>
              <div className={styles.cardHead}>
                <h3 className={styles.cardTitle}>Приоритетные действия</h3>
                <span className={styles.pill}>по открытым дефектам</span>
              </div>
              <ol className={styles.priorityList}>
                {priority.map((d) => (
                  <li key={d.id}>
                    <SeverityBadge severity={d.severity} />
                    <div>
                      <button type="button" className={styles.linkButton} onClick={() => setOpenId(d.id)}>
                        {d.type} — {d.location}
                      </button>
                      <p className={styles.cellMuted}>{d.recommendation}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          )}

          <div className={styles.card}>
            <div className={styles.cardHead}>
              <h3 className={styles.cardTitle}>Дефекты объекта</h3>
              <Link href={`/dashboard/defects?object=${object.id}`} className={styles.cardLink}>
                В реестре
              </Link>
            </div>
            {defects.length === 0 ? (
              <p className={styles.empty}>Дефекты не выявлены</p>
            ) : (
              <div className={styles.tableWrap}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th className={styles.thumbCell}>Кадр</th>
                      <th>Тип</th>
                      <th>Расположение</th>
                      <th>Критичность</th>
                      <th>Статус</th>
                    </tr>
                  </thead>
                  <tbody>
                    {defects.map((d) => (
                      <tr key={d.id} className={styles.rowLink} onClick={() => setOpenId(d.id)}>
                        <td className={styles.thumbCell}>
                          <DefectPhoto defect={d} className={styles.defectThumb} />
                        </td>
                        <td className={styles.cellStrong}>{d.type}</td>
                        <td className={styles.cellMuted}>{d.location}</td>
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
            )}
          </div>

          <div className={styles.card}>
            <div className={styles.cardHead}>
              <h3 className={styles.cardTitle}>Инспекции объекта</h3>
              <span className={styles.pill}>{inspections.length}</span>
            </div>
            <div className={styles.timeline}>
              {inspections.map((ins) => (
                <div key={ins.id} className={styles.timelineItem}>
                  <div className={styles.timelineMark}>
                    <span className={styles.timelineDot} />
                  </div>
                  <div>
                    <p className={styles.alertMessage}>
                      <Link href={`/dashboard/inspections/${ins.id}`}>
                        {formatDate(ins.date)} — {ins.title}
                      </Link>
                    </p>
                    <p className={styles.alertMeta}>
                      {sourceLabels[ins.source]} · {inspectionStatusLabels[ins.status]} · дефектов
                      в реестре: {ins.savedDefectIds.length} · {ins.operator}
                    </p>
                  </div>
                </div>
              ))}
              {inspections.length === 0 && <p className={styles.empty}>Инспекции не проводились</p>}
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
            <ConditionMeter value={m.condition} />
            <p className={styles.statMeta}>
              {m.lastInspection
                ? `Последняя инспекция: ${formatDate(m.lastInspection.date)}`
                : "Инспекций нет"}
            </p>
          </div>

          <div className={styles.card}>
            <div className={styles.cardHead}>
              <h3 className={styles.cardTitle}>Как рассчитан индекс</h3>
              <span className={styles.demoTag}>Демо-методика</span>
            </div>
            <dl className={styles.calcList}>
              <div>
                <dt>Базовая оценка конструктива</dt>
                <dd>{object.baseScore}</dd>
              </div>
              {penalties.map((p) => (
                <div key={p.sev}>
                  <dt>
                    {severityLabels[p.sev]}: {p.count} × −{SEVERITY_PENALTY[p.sev]}
                  </dt>
                  <dd>−{p.points}</dd>
                </div>
              ))}
              <div className={styles.calcTotal}>
                <dt>Индекс состояния</dt>
                <dd>{m.condition}</dd>
              </div>
            </dl>
            <p className={styles.fieldNote} style={{ marginTop: 12 }}>
              Устранённые дефекты не снижают индекс. Статус: ниже {STATUS_THRESHOLDS.critical} —
              критическое, ниже {STATUS_THRESHOLDS.warning} — требует внимания, иначе в норме.
            </p>
          </div>

          <div className={styles.card}>
            <div className={styles.cardHead}>
              <h3 className={styles.cardTitle}>История индекса</h3>
              <span className={styles.demoTag}>Демо</span>
            </div>
            <TrendLine data={history} height={160} />
          </div>
        </div>
      </div>

      <DefectViewer
        defects={defects}
        openId={openId}
        onChange={setOpenId}
        onStatusChange={setDefectStatus}
      />
    </div>
  );
}
