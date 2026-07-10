"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Icon } from "@/components/dash-icons";
import { StatCard } from "@/components/dash-ui";
import {
  formatDate,
  getObjectName,
  inspections,
  sourceLabels,
  type InspectionSource,
} from "@/lib/dashboard";
import styles from "@/components/Dashboard.module.css";

const sourceBadge: Record<InspectionSource, string> = {
  drone: styles.badgeInfo,
  mobile: styles.badgeNeutral,
  sensor: styles.badgeMedium,
};

export default function InspectionsPage() {
  const [source, setSource] = useState<InspectionSource | "all">("all");

  const filtered = useMemo(
    () => inspections.filter((i) => source === "all" || i.source === source),
    [source],
  );

  const totalDefects = inspections.reduce((s, i) => s + i.defectsFound, 0);

  return (
    <div className={styles.page}>
      <div className={styles.pageHead}>
        <h2 className={styles.pageTitle}>Инспекции</h2>
        <p className={styles.pageSubtitle}>
          История обследований объектов с помощью дронов, мобильных камер и
          стационарных сенсоров.
        </p>
      </div>

      <div className={styles.statGrid}>
        <StatCard label="Всего инспекций" value={inspections.length} icon="inspections" />
        <StatCard
          label="Дефектов выявлено"
          value={totalDefects}
          icon="defects"
          meta="за период"
        />
        <StatCard
          label="Съёмка дронами"
          value={inspections.filter((i) => i.source === "drone").length}
          icon="map"
        />
        <StatCard
          label="Сенсорный мониторинг"
          value={inspections.filter((i) => i.source === "sensor").length}
          icon="shield"
          meta="непрерывно"
        />
      </div>

      <div className={styles.chips} style={{ margin: "20px 0" }}>
        {(["all", "drone", "mobile", "sensor"] as const).map((s) => (
          <button
            key={s}
            type="button"
            className={`${styles.chip} ${source === s ? styles.chipActive : ""}`}
            onClick={() => setSource(s)}
          >
            {s === "all" ? "Все источники" : sourceLabels[s]}
          </button>
        ))}
      </div>

      <div className={styles.card}>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Дата</th>
                <th>Объект</th>
                <th>Источник</th>
                <th>Покрытие</th>
                <th>Дефектов</th>
                <th>Оператор</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((ins) => (
                <tr key={ins.id}>
                  <td className={styles.cellStrong}>{formatDate(ins.date)}</td>
                  <td className={styles.cellMuted}>
                    <Link href={`/dashboard/objects/${ins.objectId}`}>
                      {getObjectName(ins.objectId)}
                    </Link>
                  </td>
                  <td>
                    <span className={`${styles.badge} ${sourceBadge[ins.source]}`}>
                      <Icon name="inspections" size={14} />
                      {sourceLabels[ins.source]}
                    </span>
                  </td>
                  <td className={styles.cellMuted}>{ins.coverage}</td>
                  <td className={styles.cellStrong}>{ins.defectsFound}</td>
                  <td className={styles.cellMuted}>{ins.operator}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
