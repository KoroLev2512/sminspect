"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { useDemoData } from "@/components/DemoDataProvider";
import { Icon } from "@/components/dash-icons";
import { InspectionStatusBadge, StatCard } from "@/components/dash-ui";
import {
  formatDate,
  getObjectName,
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
  const router = useRouter();
  const { state, processing } = useDemoData();
  const [source, setSource] = useState<InspectionSource | "all">("all");

  const all = useMemo(
    () =>
      [...state.inspections].sort(
        (a, b) => b.date.localeCompare(a.date) || b.createdAt.localeCompare(a.createdAt),
      ),
    [state.inspections],
  );
  const filtered = all.filter((i) => source === "all" || i.source === source);

  const completed = all.filter((i) => i.status === "completed");
  const withFindings = completed.filter((i) => i.savedDefectIds.length > 0).length;
  const analyzed = all.reduce(
    (s, i) => s + i.materials.filter((m) => m.analysis?.state === "matched").length,
    0,
  );

  return (
    <div className={styles.page}>
      <div className={styles.pageHeadRow}>
        <div className={styles.pageHead} style={{ marginBottom: 0 }}>
          <h2 className={styles.pageTitle}>Инспекции</h2>
          <p className={styles.pageSubtitle}>
            Обследования объектов дронами, мобильными камерами и стационарными сенсорами. Создайте
            инспекцию и загрузите снимки — модуль анализа разметит повреждения.
          </p>
        </div>
        <Link href="/dashboard/inspections/new" className="btnPrimary">
          <Icon name="plus" size={16} />
          Новая инспекция
        </Link>
      </div>

      <div className={styles.statGrid} style={{ marginTop: 24 }}>
        <StatCard label="Всего инспекций" value={all.length} icon="inspections" />
        <StatCard
          label="Завершено"
          value={completed.length}
          icon="check"
          meta={`с выявленными дефектами: ${withFindings}`}
        />
        <StatCard
          label="Дефектов в реестре"
          value={state.defects.length}
          icon="defects"
          meta="уникальные дефекты из инспекций"
          href="/dashboard/defects"
        />
        <StatCard
          label="Размеченных снимков"
          value={analyzed}
          icon="analytics"
          meta="подготовленная разметка"
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
                <th>Инспекция</th>
                <th>Источник</th>
                <th>Снимков</th>
                <th>Дефектов в реестре</th>
                <th>Статус</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((i) => {
                const progress = processing[i.id];
                return (
                  <tr
                    key={i.id}
                    className={styles.rowLink}
                    onClick={() => router.push(`/dashboard/inspections/${i.id}`)}
                  >
                    <td className={styles.cellMuted} style={{ whiteSpace: "nowrap" }}>
                      {formatDate(i.date)}
                    </td>
                    <td>
                      <Link
                        href={`/dashboard/inspections/${i.id}`}
                        className={styles.cellStrong}
                        onClick={(e) => e.stopPropagation()}
                      >
                        {i.title}
                      </Link>
                      <div className={styles.cellMuted} style={{ fontSize: "var(--text-caption)" }}>
                        {getObjectName(state, i.objectId)} · {i.operator}
                      </div>
                    </td>
                    <td>
                      <span className={`${styles.badge} ${sourceBadge[i.source]}`}>
                        {sourceLabels[i.source]}
                      </span>
                    </td>
                    <td className={styles.cellMuted}>{i.materials.length || "архив"}</td>
                    <td className={styles.cellStrong}>{i.savedDefectIds.length}</td>
                    <td>
                      <InspectionStatusBadge status={i.status} />
                      {progress && (
                        <div className={styles.cellMuted} style={{ fontSize: "var(--text-caption)", marginTop: 4 }}>
                          {progress.done} из {progress.total}
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && <p className={styles.empty}>Инспекций с этим источником нет</p>}
      </div>
    </div>
  );
}
