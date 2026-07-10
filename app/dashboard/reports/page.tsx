"use client";

import { useState } from "react";
import { Icon } from "@/components/dash-icons";
import {
  formatDate,
  getObjectName,
  objects,
  reports as seedReports,
  type ReportItem,
} from "@/lib/dashboard";
import styles from "@/components/Dashboard.module.css";

const reportTypes: ReportItem["type"][] = [
  "Состояние",
  "Прогноз износа",
  "Инспекция",
  "Сводный",
];

export default function ReportsPage() {
  const [rows, setRows] = useState<ReportItem[]>(seedReports);
  const [type, setType] = useState<ReportItem["type"]>("Состояние");
  const [objectId, setObjectId] = useState<string>("all");
  const [counter, setCounter] = useState(seedReports.length);

  function generate() {
    const id = `rep-gen-${counter + 1}`;
    const objId = objectId === "all" ? null : objectId;
    const draft: ReportItem = {
      id,
      title: `${type} — ${getObjectName(objId)} (июль 2026)`,
      objectId: objId,
      period: "Июль 2026",
      type,
      createdAt: "2026-07-10",
      status: "generating",
      size: "—",
    };
    setRows((prev) => [draft, ...prev]);
    setCounter((c) => c + 1);

    window.setTimeout(() => {
      setRows((prev) =>
        prev.map((r) =>
          r.id === id ? { ...r, status: "ready", size: "2,6 МБ" } : r,
        ),
      );
    }, 1600);
  }

  function download(report: ReportItem) {
    const content = [
      `Отчёт SmartInspect`,
      `Название: ${report.title}`,
      `Тип: ${report.type}`,
      `Объект: ${getObjectName(report.objectId)}`,
      `Период: ${report.period}`,
      `Сформирован: ${formatDate(report.createdAt)}`,
      ``,
      `Демонстрационный отчёт на моковых данных.`,
    ].join("\n");
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${report.id}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className={styles.page}>
      <div className={styles.pageHead}>
        <h2 className={styles.pageTitle}>Отчёты</h2>
        <p className={styles.pageSubtitle}>
          Автоматически сформированные отчёты о состоянии объектов, инспекциях и
          прогнозах износа.
        </p>
      </div>

      <div className={styles.card} style={{ marginBottom: 20 }}>
        <div className={styles.cardHead}>
          <h3 className={styles.cardTitle}>Сформировать отчёт</h3>
        </div>
        <div className={styles.toolbar} style={{ marginBottom: 0 }}>
          <select
            className={styles.select}
            value={type}
            onChange={(e) => setType(e.target.value as ReportItem["type"])}
          >
            {reportTypes.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
          <select
            className={styles.select}
            value={objectId}
            onChange={(e) => setObjectId(e.target.value)}
          >
            <option value="all">Все объекты</option>
            {objects.map((o) => (
              <option key={o.id} value={o.id}>
                {o.name}
              </option>
            ))}
          </select>
          <button type="button" className="btnPrimary" onClick={generate}>
            <Icon name="plus" size={16} />
            Сформировать
          </button>
        </div>
      </div>

      <div className={styles.card}>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Отчёт</th>
                <th>Тип</th>
                <th>Период</th>
                <th>Дата</th>
                <th>Размер</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id}>
                  <td className={styles.cellStrong}>{r.title}</td>
                  <td>
                    <span className={`${styles.badge} ${styles.badgeNeutral}`}>{r.type}</span>
                  </td>
                  <td className={styles.cellMuted}>{r.period}</td>
                  <td className={styles.cellMuted}>{formatDate(r.createdAt)}</td>
                  <td className={styles.cellMuted}>{r.size}</td>
                  <td style={{ textAlign: "right" }}>
                    {r.status === "generating" ? (
                      <span className={`${styles.badge} ${styles.badgeInfo}`}>
                        Формируется…
                      </span>
                    ) : (
                      <button
                        type="button"
                        className={`${styles.btnSecondary} ${styles.btnSm}`}
                        onClick={() => download(r)}
                      >
                        <Icon name="download" size={16} />
                        Скачать
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
