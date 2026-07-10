"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
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

export default function DefectsPage() {
  const [rows, setRows] = useState<Defect[]>(seedDefects);
  const [query, setQuery] = useState("");
  const [severity, setSeverity] = useState<Severity | "all">("all");
  const [status, setStatus] = useState<DefectStatus | "all">("all");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows.filter((d) => {
      if (severity !== "all" && d.severity !== severity) return false;
      if (status !== "all" && d.status !== status) return false;
      if (!q) return true;
      return (
        d.type.toLowerCase().includes(q) ||
        getObjectName(d.objectId).toLowerCase().includes(q) ||
        d.location.toLowerCase().includes(q)
      );
    });
  }, [rows, query, severity, status]);

  function changeStatus(id: string, next: DefectStatus) {
    setRows((prev) => prev.map((d) => (d.id === id ? { ...d, status: next } : d)));
  }

  const open = rows.filter((d) => d.status !== "resolved").length;

  return (
    <div className={styles.page}>
      <div className={styles.pageHead}>
        <h2 className={styles.pageTitle}>Дефекты</h2>
        <p className={styles.pageSubtitle}>
          Выявлено {rows.length} дефектов, из них {open} в работе. Классификация
          выполнена ИИ-модулем «Зрение ИИ».
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
      </div>

      <div className={styles.card}>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
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
                <tr key={d.id}>
                  <td>
                    <div className={styles.cellStrong}>{d.type}</div>
                    <div className={styles.cellMuted} style={{ fontSize: "var(--text-caption)" }}>
                      {d.location} · {formatDate(d.detectedAt)}
                    </div>
                  </td>
                  <td className={styles.cellMuted}>
                    <Link href={`/dashboard/objects/${d.objectId}`}>
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
                  <td>
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
        {filtered.length === 0 && <p className={styles.empty}>Дефекты не найдены</p>}
      </div>
    </div>
  );
}
