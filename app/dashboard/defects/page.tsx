"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { DefectPhoto } from "@/components/DefectPhoto";
import { DefectViewer } from "@/components/DefectViewer";
import { Icon } from "@/components/dash-icons";
import { DefectStatusBadge, SeverityBadge } from "@/components/dash-ui";
import {
  defectStatusLabels,
  defects as seedDefects,
  formatDate,
  getObjectName,
  severityLabels,
  sourceLabels,
  type Defect,
  type DefectStatus,
  type Severity,
} from "@/lib/dashboard";
import styles from "@/components/Dashboard.module.css";

const severityRank: Record<Severity, number> = { critical: 0, medium: 1, low: 2 };

type View = "gallery" | "table";

export default function DefectsPage() {
  const [rows, setRows] = useState<Defect[]>(seedDefects);
  const [query, setQuery] = useState("");
  const [severity, setSeverity] = useState<Severity | "all">("all");
  const [status, setStatus] = useState<DefectStatus | "all">("all");
  const [view, setView] = useState<View>("gallery");
  const [openId, setOpenId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows
      .filter((d) => {
        if (severity !== "all" && d.severity !== severity) return false;
        if (status !== "all" && d.status !== status) return false;
        if (!q) return true;
        return (
          d.type.toLowerCase().includes(q) ||
          getObjectName(d.objectId).toLowerCase().includes(q) ||
          d.location.toLowerCase().includes(q)
        );
      })
      .sort(
        (a, b) =>
          severityRank[a.severity] - severityRank[b.severity] ||
          b.detectedAt.localeCompare(a.detectedAt),
      );
  }, [rows, query, severity, status]);

  function changeStatus(id: string, next: DefectStatus) {
    setRows((prev) => prev.map((d) => (d.id === id ? { ...d, status: next } : d)));
  }

  const open = rows.filter((d) => d.status !== "resolved").length;
  const critical = rows.filter((d) => d.severity === "critical" && d.status !== "resolved").length;

  return (
    <div className={styles.page}>
      <div className={styles.pageHead}>
        <h2 className={styles.pageTitle}>Дефекты</h2>
        <p className={styles.pageSubtitle}>
          Выявлено {rows.length} дефектов, {open} в работе, из них {critical} критических.
          Классификация и разметка кадров выполнены модулем «Зрение ИИ».
        </p>
      </div>

      <div className={styles.toolbar}>
        <div className={styles.search}>
          <Icon name="search" size={18} />
          <input
            type="search"
            placeholder="Поиск по типу, объекту, расположению"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <select
          className={styles.select}
          value={severity}
          onChange={(e) => setSeverity(e.target.value as Severity | "all")}
        >
          <option value="all">Любая критичность</option>
          {(Object.keys(severityLabels) as Severity[]).map((s) => (
            <option key={s} value={s}>
              {severityLabels[s]}
            </option>
          ))}
        </select>
        <select
          className={styles.select}
          value={status}
          onChange={(e) => setStatus(e.target.value as DefectStatus | "all")}
        >
          <option value="all">Любой статус</option>
          {(Object.keys(defectStatusLabels) as DefectStatus[]).map((s) => (
            <option key={s} value={s}>
              {defectStatusLabels[s]}
            </option>
          ))}
        </select>
        <div className={styles.viewToggle} role="group" aria-label="Вид списка">
          <button
            type="button"
            className={view === "gallery" ? styles.viewToggleActive : undefined}
            aria-pressed={view === "gallery"}
            onClick={() => setView("gallery")}
          >
            Галерея
          </button>
          <button
            type="button"
            className={view === "table" ? styles.viewToggleActive : undefined}
            aria-pressed={view === "table"}
            onClick={() => setView("table")}
          >
            Таблица
          </button>
        </div>
      </div>

      {view === "gallery" ? (
        <div className={styles.defectGrid}>
          {filtered.map((d) => (
            <button
              key={d.id}
              type="button"
              className={`${styles.card} ${styles.defectCard}`}
              onClick={() => setOpenId(d.id)}
            >
              <DefectPhoto defect={d} label="compact" />
              <div className={styles.defectCardBody}>
                <div className={styles.defectCardBadges}>
                  <SeverityBadge severity={d.severity} />
                  <DefectStatusBadge status={d.status} />
                </div>
                <h3 className={styles.defectCardTitle}>{d.type}</h3>
                <p className={styles.defectCardMeta}>
                  {getObjectName(d.objectId)}
                  <br />
                  {d.location} · {formatDate(d.detectedAt)} · {sourceLabels[d.source]}
                </p>
              </div>
            </button>
          ))}
        </div>
      ) : (
        <div className={styles.card}>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th className={styles.thumbCell}>Кадр</th>
                  <th>Дефект</th>
                  <th>Объект</th>
                  <th>Источник</th>
                  <th>ИИ</th>
                  <th>Критичность</th>
                  <th>Статус</th>
                  <th>Действие</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((d) => (
                  <tr key={d.id} className={styles.rowLink} onClick={() => setOpenId(d.id)}>
                    <td className={styles.thumbCell}>
                      <DefectPhoto defect={d} className={styles.defectThumb} />
                    </td>
                    <td>
                      <div className={styles.cellStrong}>{d.type}</div>
                      <div className={styles.cellMuted} style={{ fontSize: "var(--text-caption)" }}>
                        {d.location} · {formatDate(d.detectedAt)}
                      </div>
                    </td>
                    <td className={styles.cellMuted}>
                      <Link
                        href={`/dashboard/objects/${d.objectId}`}
                        onClick={(e) => e.stopPropagation()}
                      >
                        {getObjectName(d.objectId)}
                      </Link>
                    </td>
                    <td className={styles.cellMuted}>{sourceLabels[d.source]}</td>
                    <td className={styles.cellMuted}>{d.confidence}%</td>
                    <td>
                      <SeverityBadge severity={d.severity} />
                    </td>
                    <td>
                      <DefectStatusBadge status={d.status} />
                    </td>
                    <td onClick={(e) => e.stopPropagation()}>
                      <select
                        className={styles.select}
                        value={d.status}
                        onChange={(e) => changeStatus(d.id, e.target.value as DefectStatus)}
                        aria-label="Изменить статус"
                      >
                        {(Object.keys(defectStatusLabels) as DefectStatus[]).map((s) => (
                          <option key={s} value={s}>
                            {defectStatusLabels[s]}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {filtered.length === 0 && (
        <div className={styles.card}>
          <p className={styles.empty}>Дефекты не найдены</p>
        </div>
      )}

      <DefectViewer
        defects={filtered}
        openId={openId}
        onChange={setOpenId}
        onStatusChange={changeStatus}
      />
    </div>
  );
}
