"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { useDemoData } from "@/components/DemoDataProvider";
import { Icon } from "@/components/dash-icons";
import {
  Bars,
  ConditionMeter,
  ObjectStatusBadge,
  SeverityBadge,
  StatCard,
  TrendLine,
} from "@/components/dash-ui";
import {
  DEMO_AS_OF,
  conditionTrend,
  dashboardStats,
  formatDate,
  formatDateTime,
  getObjectName,
  inspectionsByMonth,
  isOpen,
  objectMetrics,
  periodLabels,
  plural,
  type Period,
} from "@/lib/dashboard";
import styles from "@/components/Dashboard.module.css";

const periods: Period[] = ["30d", "90d", "all"];

export default function OverviewPage() {
  const { user } = useAuth();
  const { state } = useDemoData();
  const [period, setPeriod] = useState<Period>("90d");
  const stats = dashboardStats(state, period);

  const attention = state.objects
    .map((o) => ({ object: o, m: objectMetrics(state, o.id) }))
    .sort((a, b) => a.m.condition - b.m.condition)
    .slice(0, 5);

  const recentAlerts = [...state.alerts]
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, 4);

  const priority = state.defects
    .filter((d) => isOpen(d) && d.severity === "critical")
    .sort((a, b) => a.detectedAt.localeCompare(b.detectedAt))
    .slice(0, 4);

  return (
    <div className={styles.page}>
      <div className={styles.pageHeadRow}>
        <div className={styles.pageHead} style={{ marginBottom: 0 }}>
          <h2 className={styles.pageTitle}>Здравствуйте, {user?.name.split(" ")[0]}</h2>
          <p className={styles.pageSubtitle}>
            Сводка на {formatDate(DEMO_AS_OF)}: {stats.criticalObjects}{" "}
            {plural(stats.criticalObjects, ["объект", "объекта", "объектов"])} в критическом
            состоянии, {stats.warningObjects} {plural(stats.warningObjects, ["требует", "требуют", "требуют"])}{" "}
            внимания; открыто {stats.openDefects}{" "}
            {plural(stats.openDefects, ["дефект", "дефекта", "дефектов"])}, из них{" "}
            {stats.criticalDefects} {plural(stats.criticalDefects, ["критический", "критических", "критических"])}.
          </p>
        </div>
        <div className={styles.viewToggle} role="group" aria-label="Период">
          {periods.map((p) => (
            <button
              key={p}
              type="button"
              className={period === p ? styles.viewToggleActive : undefined}
              aria-pressed={period === p}
              onClick={() => setPeriod(p)}
            >
              {periodLabels[p]}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.statGrid} style={{ marginTop: 24 }}>
        <StatCard
          label="Объектов на мониторинге"
          value={stats.objects}
          icon="objects"
          meta={`${stats.criticalObjects} крит. · ${stats.warningObjects} требуют внимания`}
          href="/dashboard/objects"
        />
        <StatCard
          label="Открытых критических дефектов"
          value={stats.criticalDefects}
          icon="defects"
          danger={stats.criticalDefects > 0}
          meta={`всего открыто: ${stats.openDefects}`}
          href="/dashboard/defects?severity=critical&status=open"
        />
        <StatCard
          label="Завершённых инспекций"
          value={stats.inspections}
          icon="inspections"
          meta={`за ${periodLabels[period].toLowerCase()} · дефектов выявлено: ${stats.defectsInPeriod}`}
          href="/dashboard/inspections"
        />
        <StatCard
          label="Средний индекс состояния"
          value={stats.avgCondition}
          icon="analytics"
          meta="из 100 · по открытым дефектам"
          href="/dashboard/analytics"
        />
      </div>

      <div className={styles.split} style={{ marginTop: 20 }}>
        <div className={styles.stackGap}>
          {priority.length > 0 && (
            <div className={`${styles.card} ${styles.priorityCard}`}>
              <div className={styles.cardHead}>
                <h3 className={styles.cardTitle}>Приоритетные действия</h3>
                <Link href="/dashboard/defects?severity=critical&status=open" className={styles.cardLink}>
                  Все критические
                </Link>
              </div>
              <ol className={styles.priorityList}>
                {priority.map((d) => (
                  <li key={d.id}>
                    <SeverityBadge severity={d.severity} />
                    <div>
                      <Link href={`/dashboard/defects?open=${d.id}`} className={styles.cellStrong}>
                        {d.type} — {getObjectName(state, d.objectId)}
                      </Link>
                      <p className={styles.cellMuted}>
                        {d.location}. {d.recommendation}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          )}

          <div className={styles.card}>
            <div className={styles.cardHead}>
              <h3 className={styles.cardTitle}>Объекты, требующие внимания</h3>
              <Link href="/dashboard/objects" className={styles.cardLink}>
                Все объекты
              </Link>
            </div>
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Объект</th>
                    <th>Регион</th>
                    <th style={{ width: 200 }}>Индекс состояния</th>
                    <th>Статус</th>
                  </tr>
                </thead>
                <tbody>
                  {attention.map(({ object: o, m }) => (
                    <tr key={o.id}>
                      <td className={styles.cellStrong}>
                        <Link href={`/dashboard/objects/${o.id}`}>{o.name}</Link>
                      </td>
                      <td className={styles.cellMuted}>{o.region}</td>
                      <td>
                        <ConditionMeter value={m.condition} />
                      </td>
                      <td>
                        <ObjectStatusBadge status={m.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className={styles.card}>
            <div className={styles.cardHead}>
              <h3 className={styles.cardTitle}>Динамика среднего индекса</h3>
              <span className={styles.pill}>
                6 месяцев
              </span>
            </div>
            <TrendLine data={conditionTrend(state)} />
            <p className={styles.fieldNote}>
              Последняя точка — текущий расчёт по реестру дефектов; предыдущие — история индексов
              объектов.
            </p>
          </div>
        </div>

        <div className={styles.stackGap}>
          <div className={styles.card}>
            <div className={styles.cardHead}>
              <h3 className={styles.cardTitle}>Последние оповещения</h3>
              <Link href="/dashboard/alerts" className={styles.cardLink}>
                Все
              </Link>
            </div>
            {recentAlerts.length === 0 && <p className={styles.empty}>Оповещений нет</p>}
            {recentAlerts.map((a) => (
              <div key={a.id} className={styles.alertRow}>
                <span
                  className={styles.alertIcon}
                  style={{
                    background:
                      a.severity === "critical"
                        ? "color-mix(in srgb, #c0392b 12%, transparent)"
                        : "var(--color-hailstone)",
                    color: a.severity === "critical" ? "#c0392b" : "var(--color-signal-blue)",
                  }}
                >
                  <Icon name="alerts" size={18} />
                </span>
                <div className={styles.alertBody}>
                  <p className={styles.alertMessage}>{a.message}</p>
                  <p className={styles.alertMeta}>
                    {getObjectName(state, a.objectId)} · {formatDateTime(a.createdAt)}
                  </p>
                </div>
                <SeverityBadge severity={a.severity} />
              </div>
            ))}
          </div>

          <div className={styles.card}>
            <div className={styles.cardHead}>
              <h3 className={styles.cardTitle}>Завершённые инспекции</h3>
              <span className={styles.pill}>по месяцам</span>
            </div>
            <Bars data={inspectionsByMonth(state)} />
          </div>
        </div>
      </div>
    </div>
  );
}
