"use client";

import Link from "next/link";
import { SavingsCalculator } from "@/components/SavingsCalculator";
import { useDemoData } from "@/components/DemoDataProvider";
import { Bars, Donut, StatCard, TrendLine } from "@/components/dash-ui";
import {
  conditionTrend,
  dashboardStats,
  defectsByMonth,
  defectsByType,
  objectMetrics,
} from "@/lib/dashboard";
import styles from "@/components/Dashboard.module.css";

export default function AnalyticsPage() {
  const { state } = useDemoData();
  const stats = dashboardStats(state);
  const resolved = state.defects.filter((d) => d.status === "resolved").length;
  const forecast = state.objects
    .map((o) => ({ o, m: objectMetrics(state, o.id) }))
    .sort((a, b) => a.o.forecastMonths - b.o.forecastMonths);

  return (
    <div className={styles.page}>
      <div className={styles.pageHead}>
        <h2 className={styles.pageTitle}>Аналитика</h2>
        <p className={styles.pageSubtitle}>
          Показатели рассчитаны по демонстрационным данным кабинета. Прогноз сроков ремонта —
          оценочный сценарий: верифицированной предиктивной модели в демо-версии нет.
        </p>
      </div>

      <div className={styles.statGrid}>
        <StatCard
          label="Средний индекс состояния"
          value={stats.avgCondition}
          icon="analytics"
          meta={`по ${stats.objects} объектам, из 100`}
          href="/dashboard/objects"
        />
        <StatCard
          label="Открытых дефектов"
          value={stats.openDefects}
          icon="defects"
          danger={stats.criticalDefects > 0}
          meta={`критических: ${stats.criticalDefects}`}
          href="/dashboard/defects?status=open"
        />
        <StatCard
          label="Устранено дефектов"
          value={resolved}
          icon="check"
          meta={`из ${state.defects.length} в реестре`}
          href="/dashboard/defects?status=resolved"
        />
        <StatCard
          label="Размеченных снимков"
          value={stats.analyzedImages}
          icon="inspections"
          meta={<><span className={styles.demoTag}>Демо</span> подготовленная разметка</>}
          href="/dashboard/inspections"
        />
      </div>

      <div className={styles.cols2} style={{ marginTop: 20 }}>
        <div className={styles.card}>
          <div className={styles.cardHead}>
            <h3 className={styles.cardTitle}>Средний индекс состояния</h3>
            <span className={styles.pill}>
              6 мес. · <span className={styles.demoTag}>Демо-история</span>
            </span>
          </div>
          <TrendLine data={conditionTrend(state)} />
        </div>
        <div className={styles.card}>
          <div className={styles.cardHead}>
            <h3 className={styles.cardTitle}>Дефекты реестра по типам</h3>
            <span className={styles.pill}>{state.defects.length} всего</span>
          </div>
          <Donut data={defectsByType(state)} />
        </div>
      </div>

      <div className={styles.cols2} style={{ marginTop: 20 }}>
        <div className={styles.card}>
          <div className={styles.cardHead}>
            <h3 className={styles.cardTitle}>Выявлено дефектов по месяцам</h3>
            <span className={styles.pill}>по дате инспекции</span>
          </div>
          <Bars data={defectsByMonth(state)} />
        </div>
        <div className={styles.card}>
          <div className={styles.cardHead}>
            <h3 className={styles.cardTitle}>Приоритеты ремонта</h3>
            <span className={styles.demoTag}>Оценка</span>
          </div>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Объект</th>
                  <th>Индекс</th>
                  <th>Крит.</th>
                  <th>Ремонт через</th>
                </tr>
              </thead>
              <tbody>
                {forecast.map(({ o, m }) => (
                  <tr key={o.id}>
                    <td className={styles.cellStrong}>
                      <Link href={`/dashboard/objects/${o.id}`}>{o.name}</Link>
                    </td>
                    <td className={styles.cellMuted}>{m.condition}</td>
                    <td className={styles.cellMuted}>{m.critical}</td>
                    <td>
                      <span
                        className={`${styles.badge} ${
                          o.forecastMonths <= 4
                            ? styles.badgeCritical
                            : o.forecastMonths <= 9
                              ? styles.badgeMedium
                              : styles.badgeGood
                        }`}
                      >
                        ≈ {o.forecastMonths} мес.
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className={styles.fieldNote} style={{ marginTop: 12 }}>
            Срок — экспертная оценка демо-сценария по индексу и критическим дефектам, не результат
            прогнозной модели.
          </p>
        </div>
      </div>

      <div style={{ marginTop: 20 }}>
        <SavingsCalculator />
      </div>
    </div>
  );
}
