"use client";

import { useEffect, useRef, useState } from "react";
import { useDemoData } from "@/components/DemoDataProvider";
import { Icon } from "@/components/dash-icons";
import { Spinner } from "@/components/dash-ui";
import {
  DEMO_AS_OF,
  formatBytes,
  formatDate,
  formatDateTime,
  getInspection,
  getObjectName,
  reportTypes,
  type ReportItem,
  type ReportType,
} from "@/lib/dashboard";
import { buildReportPayload } from "@/lib/pdf/payload";
import { useInitialQuery } from "@/lib/use-query-params";
import styles from "@/components/Dashboard.module.css";

const typeHints: Record<ReportType, string> = {
  Состояние: "Показатели, реестр дефектов, фото с разметкой и рекомендации по одному объекту.",
  Инспекция: "Ход обработки, материалы с разметкой и найденные дефекты одной инспекции.",
  "Прогноз износа": "Динамика индекса, оценочные сроки ремонта и приоритеты по объектам.",
  Сводный: "Состояние всех объектов, открытые и критические дефекты.",
};

function nowIso() {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

function newReportId() {
  return `rep-${Date.now().toString(36)}`;
}

function nextNumber(reports: ReportItem[]) {
  const max = reports.reduce((m, r) => Math.max(m, Number(r.number.slice(-4)) || 0), 0);
  return `SI-2026-${String(max + 1).padStart(4, "0")}`;
}

function saveBlob(blob: Blob, name: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 10000);
}

export default function ReportsPage() {
  const { state, addReport, updateReport } = useDemoData();
  const initial = useInitialQuery();
  const [type, setType] = useState<ReportType>("Состояние");
  const [objectId, setObjectId] = useState<string>("obj-1");
  const [inspectionId, setInspectionId] = useState<string>("");
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  // Generated files of this session, so «Скачать» / «Открыть» does not regenerate.
  const blobs = useRef(new Map<string, Blob>());

  const inspectionOptions = state.inspections.filter(
    (i) => i.status === "completed" && i.materials.length > 0,
  );

  useEffect(() => {
    if (!initial) return;
    const t = initial.get("type");
    const obj = initial.get("object");
    const ins = initial.get("inspection");
    /* eslint-disable react-hooks/set-state-in-effect -- prefill from the URL once */
    if (t && (reportTypes as string[]).includes(t)) setType(t as ReportType);
    if (obj) setObjectId(obj);
    if (ins) setInspectionId(ins);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [initial]);

  const effectiveInspection = inspectionId || inspectionOptions[0]?.id || "";

  async function render(report: ReportItem): Promise<Blob> {
    const payload = buildReportPayload(state, report);
    const res = await fetch("/api/reports/pdf", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const data = (await res.json().catch(() => null)) as { error?: string } | null;
      throw new Error(data?.error ?? `Сервер вернул ошибку ${res.status}`);
    }
    const blob = await res.blob();
    if (blob.type !== "application/pdf" || blob.size === 0) throw new Error("Получен некорректный файл");
    return blob;
  }

  async function generate() {
    setError("");
    setNotice("");
    let title: string;
    let report: ReportItem;
    const number = nextNumber(state.reports);
    const createdAt = nowIso();

    if (type === "Инспекция") {
      const ins = getInspection(state, effectiveInspection);
      if (!ins) {
        setError("Нет завершённых инспекций со снимками");
        return;
      }
      title = `Инспекция: ${ins.title}`;
      report = {
        id: newReportId(),
        number,
        title,
        objectId: ins.objectId,
        inspectionId: ins.id,
        type,
        period: formatDate(ins.date),
        createdAt,
      };
    } else {
      const scoped = type === "Сводный" ? null : objectId === "all" ? null : objectId;
      if (type === "Состояние" && !scoped) {
        setError("Для отчёта о состоянии выберите объект");
        return;
      }
      title =
        type === "Состояние"
          ? `Состояние: ${getObjectName(state, scoped)}`
          : type === "Прогноз износа"
            ? `Прогноз износа: ${scoped ? getObjectName(state, scoped) : "все объекты"}`
            : "Сводный отчёт по всем объектам";
      report = {
        id: newReportId(),
        number,
        title,
        objectId: scoped,
        inspectionId: null,
        type,
        period: `на ${formatDate(DEMO_AS_OF)}`,
        createdAt,
      };
    }

    setBusy("new");
    try {
      const blob = await render(report);
      blobs.current.set(report.id, blob);
      addReport({ ...report, sizeBytes: blob.size });
      saveBlob(blob, `${report.number}.pdf`);
      setNotice(`Отчёт ${report.number} сформирован (${formatBytes(blob.size)}) и скачан.`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Не удалось сформировать отчёт");
    } finally {
      setBusy(null);
    }
  }

  async function obtain(report: ReportItem) {
    const cached = blobs.current.get(report.id);
    if (cached) return cached;
    const blob = await render(report);
    blobs.current.set(report.id, blob);
    updateReport(report.id, { sizeBytes: blob.size });
    return blob;
  }

  async function download(report: ReportItem) {
    setError("");
    setBusy(report.id);
    try {
      saveBlob(await obtain(report), `${report.number}.pdf`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Не удалось сформировать отчёт");
    } finally {
      setBusy(null);
    }
  }

  async function preview(report: ReportItem) {
    setError("");
    // Open the tab synchronously so the popup is not blocked, then load the PDF.
    const tab = window.open("", "_blank");
    setBusy(report.id);
    try {
      const url = URL.createObjectURL(await obtain(report));
      if (tab) tab.location.href = url;
      else window.location.assign(url);
    } catch (err) {
      tab?.close();
      setError(err instanceof Error ? err.message : "Не удалось открыть отчёт");
    } finally {
      setBusy(null);
    }
  }

  const rows = [...state.reports].sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  return (
    <div className={styles.page}>
      <div className={styles.pageHead}>
        <h2 className={styles.pageTitle}>Отчёты</h2>
        <p className={styles.pageSubtitle}>
          PDF-отчёты формируются на сервере из текущих данных кабинета. Повторное скачивание
          формирует документ заново по актуальным данным.
        </p>
      </div>

      <div className={styles.card} style={{ marginBottom: 20 }}>
        <div className={styles.cardHead}>
          <h3 className={styles.cardTitle}>Сформировать отчёт</h3>
        </div>
        <div className={styles.toolbar} style={{ marginBottom: 8 }}>
          <select
            className={styles.select}
            value={type}
            onChange={(e) => setType(e.target.value as ReportType)}
            aria-label="Тип отчёта"
          >
            {reportTypes.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>

          {type === "Инспекция" ? (
            <select
              className={styles.select}
              value={effectiveInspection}
              onChange={(e) => setInspectionId(e.target.value)}
              aria-label="Инспекция"
              style={{ maxWidth: 420 }}
            >
              {inspectionOptions.map((i) => (
                <option key={i.id} value={i.id}>
                  {formatDate(i.date)} — {i.title}
                </option>
              ))}
            </select>
          ) : (
            <select
              className={styles.select}
              value={type === "Сводный" ? "all" : objectId}
              onChange={(e) => setObjectId(e.target.value)}
              disabled={type === "Сводный"}
              aria-label="Объект"
            >
              {type !== "Состояние" && <option value="all">Все объекты</option>}
              {state.objects.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.name}
                </option>
              ))}
            </select>
          )}

          <button type="button" className="btnPrimary" onClick={generate} disabled={busy !== null}>
            {busy === "new" ? <Spinner size={16} /> : <Icon name="plus" size={16} />}
            {busy === "new" ? "Формируется…" : "Сформировать PDF"}
          </button>
        </div>
        <p className={styles.fieldNote}>{typeHints[type]}</p>
        {error && (
          <p className={styles.formError} role="alert">
            {error}
          </p>
        )}
        {notice && (
          <p className={styles.savedBox} role="status" style={{ marginTop: 12 }}>
            <Icon name="check" size={16} /> {notice}
          </p>
        )}
      </div>

      <div className={styles.card}>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Номер</th>
                <th>Отчёт</th>
                <th>Тип</th>
                <th>Период</th>
                <th>Сформирован</th>
                <th>Размер PDF</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id}>
                  <td className={styles.cellMuted} style={{ whiteSpace: "nowrap" }}>
                    {r.number}
                  </td>
                  <td className={styles.cellStrong}>{r.title}</td>
                  <td>
                    <span className={`${styles.badge} ${styles.badgeNeutral}`}>{r.type}</span>
                  </td>
                  <td className={styles.cellMuted}>{r.period}</td>
                  <td className={styles.cellMuted} style={{ whiteSpace: "nowrap" }}>
                    {r.createdAt.includes("T") ? formatDateTime(r.createdAt) : formatDate(r.createdAt)}
                  </td>
                  <td className={styles.cellMuted}>
                    {r.sizeBytes ? formatBytes(r.sizeBytes) : "сформируется при скачивании"}
                  </td>
                  <td style={{ textAlign: "right", whiteSpace: "nowrap" }}>
                    {busy === r.id ? (
                      <span className={`${styles.badge} ${styles.badgeInfo}`}>
                        <Spinner size={12} /> Формируется…
                      </span>
                    ) : (
                      <div style={{ display: "inline-flex", gap: 8 }}>
                        <button
                          type="button"
                          className={`${styles.btnSecondary} ${styles.btnSm}`}
                          onClick={() => preview(r)}
                          disabled={busy !== null}
                        >
                          Открыть
                        </button>
                        <button
                          type="button"
                          className={`${styles.btnSecondary} ${styles.btnSm}`}
                          onClick={() => download(r)}
                          disabled={busy !== null}
                        >
                          <Icon name="download" size={16} />
                          Скачать
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {rows.length === 0 && <p className={styles.empty}>Отчётов пока нет</p>}
      </div>
    </div>
  );
}
