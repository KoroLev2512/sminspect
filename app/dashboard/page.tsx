"use client";

import Link from "next/link";
import { useAuth } from "@/components/AuthProvider";
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
  alerts,
  conditionTrend,
  dashboardStats,
  defectsByMonth,
  formatDateTime,
  getObjectName,
  objects,
} from "@/lib/dashboard";
import styles from "@/components/Dashboard.module.css";

export default function OverviewPage() {
  const { user } = useAuth();
  const stats = dashboardStats();
  const attention = [...objects]
    .sort((a, b) => a.condition - b.condition)
    .slice(0, 5);
  const recentAlerts = alerts.slice(0, 4);

  return (
    <div className={styles.page}>
      <div className={styles.pageHead}>
        <h2 className={styles.pageTitle}>
          Здравствуйте, {user?.name.split(" ")[0]}
        </h2>
        <p className={styles.pageSubtitle}>
          Сводка по состоянию инфраструктуры на 10 июля 2026. Требуют внимания{" "}
          {stats.criticalObjects} объекта, открыто {stats.openDefects} дефектов.
        </p>
      </div>

      <div className={styles.statGrid}>
        <StatCard
          label="Объектов на мониторинге"
          value={stats.objects}
          icon="objects"
          meta="дороги и мостовые сооружения"
        />
        <StatCard
          label="Критических дефектов"
          value={stats.criticalDefects}
          icon="defects"
          danger
          meta={`${stats.criticalObjects} объекта в критическом состоянии`}
        />
        <StatCard
          label="Инспекций за месяц"
          value={stats.inspections}
          icon="inspections"
          meta="дроны, камеры, сенсоры"
        />
        <StatCard
          label="Средний индекс состояния"
          value={stats.avgCondition}
          icon="analytics"
          meta="по 100-балльной шкале"
        />
      </div>

      <div className={styles.split} style={{ marginTop: 20 }}>
        <div className={styles.stackGap}>
          <div className={styles.card}>
            <div className={styles.cardHead}>
              <h3 className={styles.cardTitle}>Динамика среднего состояния</h3>
              <span className={styles.pill}>последние 8 месяцев</span>
            </div>
            <TrendLine data={conditionTrend} />
          </div>

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
                    <th style={{ width: 200 }}>Состояние</th>
                    <th>Статус</th>
                  </tr>
                </thead>
                <tbody>
                  {attention.map((o) => (
                    <tr key={o.id}>
                      <td className={styles.cellStrong}>
                        <Link href={`/dashboard/objects/${o.id}`}>{o.name}</Link>
                      </td>
                      <td className={styles.cellMuted}>{o.region}</td>
                      <td>
                        <ConditionMeter value={o.condition} />
                      </td>
                      <td>
                        <ObjectStatusBadge status={o.status} />
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
              <h3 className={styles.cardTitle}>Последние оповещения</h3>
              <Link href="/dashboard/alerts" className={styles.cardLink}>
                Все
              </Link>
            </div>
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
                    {getObjectName(a.objectId)} · {formatDateTime(a.createdAt)}
                  </p>
                </div>
                <SeverityBadge severity={a.severity} />
              </div>
            ))}
          </div>

          <div className={styles.card}>
            <div className={styles.cardHead}>
              <h3 className={styles.cardTitle}>Найдено дефектов</h3>
              <span className={styles.pill}>по месяцам</span>
            </div>
            <Bars data={defectsByMonth} />
          </div>
        </div>
      </div>
    </div>
  );
}
