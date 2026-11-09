"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { DefectPhoto } from "@/components/DefectPhoto";
import { useDemoData } from "@/components/DemoDataProvider";
import { DefectViewer } from "@/components/DefectViewer";
import { Icon } from "@/components/dash-icons";
import { DefectStatusBadge, SeverityBadge } from "@/components/dash-ui";
import {
  defectStatusLabels,
  formatDate,
  getObjectName,
  plural,
  severityLabels,
  sourceLabels,
  type DefectStatus,
  type Severity,
} from "@/lib/dashboard";
import { useInitialQuery } from "@/lib/use-query-params";
import styles from "@/components/Dashboard.module.css";

const severityRank: Record<Severity, number> = { critical: 0, medium: 1, low: 2 };

type View = "gallery" | "table";

export default function DefectsPage() {
  const { state, setDefectStatus } = useDemoData();
  const rows = state.defects;
  const [query, setQuery] = useState("");
  const [severity, setSeverity] = useState<Severity | "all">("all");
  const [status, setStatus] = useState<DefectStatus | "all" | "open">("all");
  const [objectId, setObjectId] = useState<string>("all");
  const [view, setView] = useState<View>("gallery");
  const [openId, setOpenId] = useState<string | null>(null);

  // Filters can be pre-set from links: ?severity=critical&status=open&object=obj-1&open=def-1
  const initial = useInitialQuery();
  useEffect(() => {
    if (!initial) return;
    const sev = initial.get("severity");
    const st = initial.get("status");
    const obj = initial.get("object");
    /* eslint-disable react-hooks/set-state-in-effect -- applying URL filters once */
    if (sev === "critical" || sev === "medium" || sev === "low") setSeverity(sev);
    if (st === "open" || st === "new" || st === "in_progress" || st === "resolved") setStatus(st);
    if (obj) setObjectId(obj);
    if (initial.get("open")) setOpenId(initial.get("open"));
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [initial]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows
      .filter((d) => {
        if (severity !== "all" && d.severity !== severity) return false;
        if (status === "open" && d.status === "resolved") return false;
        if (status !== "all" && status !== "open" && d.status !== status) return false;
        if (objectId !== "all" && d.objectId !== objectId) return false;
        if (!q) return true;
        return (
          d.type.toLowerCase().includes(q) ||
          getObjectName(state, d.objectId).toLowerCase().includes(q) ||
          d.location.toLowerCase().includes(q)
        );
      })
      .sort(
        (a, b) =>
          severityRank[a.severity] - severityRank[b.severity] ||
          b.detectedAt.localeCompare(a.detectedAt),
      );
  }, [rows, state, query, severity, status, objectId]);

  const changeStatus = setDefectStatus;

  const newCount = rows.filter((d) => d.status === "new").length;
  const inProgress = rows.filter((d) => d.status === "in_progress").length;
  const resolved = rows.filter((d) => d.status === "resolved").length;
  const critical = rows.filter((d) => d.severity === "critical" && d.status !== "resolved").length;

  return (
    <div className={styles.page}>
      <div className={styles.pageHead}>
        <h2 className={styles.pageTitle}>Дефекты</h2>
        <p className={styles.pageSubtitle}>
          В реестре {rows.length} {plural(rows.length, ["дефект", "дефекта", "дефектов"])}: {newCount}{" "}
          {plural(newCount, ["новый", "новых", "новых"])}, {inProgress} в работе, {resolved} устранено.
          Открытых критических — {critical}. Разметка кадров выполнена демонстрационным модулем
          анализа и требует подтверждения инженером.
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
          onChange={(e) => setStatus(e.target.value as DefectStatus | "all" | "open")}
        >
          <option value="all">Любой статус</option>
          <option value="open">Открытые (новые и в работе)</option>
          {(Object.keys(defectStatusLabels) as DefectStatus[]).map((s) => (
            <option key={s} value={s}>
              {defectStatusLabels[s]}
            </option>
          ))}
        </select>
        <select
          className={styles.select}
          value={objectId}
          onChange={(e) => setObjectId(e.target.value)}
          aria-label="Объект"
        >
          <option value="all">Все объекты</option>
          {state.objects.map((o) => (
            <option key={o.id} value={o.id}>
              {o.name}
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
                  {getObjectName(state, d.objectId)}
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
                  <th>Демо-оценка</th>
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
                        {getObjectName(state, d.objectId)}
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
