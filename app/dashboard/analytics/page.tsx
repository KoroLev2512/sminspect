import Link from "next/link";
import { Bars, Donut, StatCard, TrendLine } from "@/components/dash-ui";
import {
  conditionTrend,
  defectDistribution,
  defectsByMonth,
  objects,
} from "@/lib/dashboard";
import styles from "@/components/Dashboard.module.css";

export default function AnalyticsPage() {
  const forecast = [...objects].sort((a, b) => a.forecastMonths - b.forecastMonths);

  return (
    <div className={styles.page}>
      <div className={styles.pageHead}>
        <h2 className={styles.pageTitle}>Аналитика</h2>
        <p className={styles.pageSubtitle}>
          Прогнозирование износа и распределение дефектов на основе истории
          инспекций и моделей машинного обучения.
        </p>
      </div>

      <div className={styles.statGrid}>
        <StatCard
          label="Экономия на инспекциях"
          value="14,2 млн ₽"
          icon="shield"
          meta="за 12 месяцев против ручного метода"
        />
        <StatCard
          label="Предотвращено аварийных ремонтов"
          value="7"
          icon="check"
          meta="по прогнозу критических дефектов"
        />
        <StatCard
          label="Средняя точность ИИ"
          value="93%"
          icon="analytics"
          meta="классификация дефектов"
        />
        <StatCard
          label="Обработано снимков"
          value="128 400"
          icon="inspections"
          meta="дроны, камеры, сенсоры"
        />
      </div>

      <div className={styles.cols2} style={{ marginTop: 20 }}>
        <div className={styles.card}>
          <div className={styles.cardHead}>
            <h3 className={styles.cardTitle}>Средний индекс состояния</h3>
            <span className={styles.pill}>тренд, 8 мес.</span>
          </div>
          <TrendLine data={conditionTrend} />
        </div>

        <div className={styles.card}>
          <div className={styles.cardHead}>
            <h3 className={styles.cardTitle}>Распределение дефектов по типам</h3>
          </div>
          <Donut data={defectDistribution} />
        </div>
      </div>

      <div className={styles.cols2} style={{ marginTop: 20 }}>
        <div className={styles.card}>
          <div className={styles.cardHead}>
            <h3 className={styles.cardTitle}>Найдено дефектов по месяцам</h3>
          </div>
          <Bars data={defectsByMonth} />
        </div>

        <div className={styles.card}>
          <div className={styles.cardHead}>
            <h3 className={styles.cardTitle}>Прогноз ремонтов</h3>
            <span className={styles.pill}>приоритет по срокам</span>
          </div>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Объект</th>
                  <th>Индекс</th>
                  <th>Ремонт через</th>
                </tr>
              </thead>
              <tbody>
                {forecast.map((o) => (
                  <tr key={o.id}>
                    <td className={styles.cellStrong}>
                      <Link href={`/dashboard/objects/${o.id}`}>{o.name}</Link>
                    </td>
                    <td className={styles.cellMuted}>{o.condition}</td>
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
                        {o.forecastMonths} мес.
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
