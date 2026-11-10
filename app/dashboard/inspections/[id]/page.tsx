"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { AnnotatedImage, severityColor } from "@/components/AnnotatedImage";
import { useDemoData } from "@/components/DemoDataProvider";
import { Icon } from "@/components/dash-icons";
import { InspectionStatusBadge, SeverityBadge } from "@/components/dash-ui";
import {
  formatDate,
  formatDateTime,
  getInspection,
  getObjectName,
  inspectionStatusLabels,
  plural,
  severityLabels,
  sourceLabels,
  type InspectionStatus,
  type Severity,
} from "@/lib/dashboard";
import styles from "@/components/Dashboard.module.css";

const steps: InspectionStatus[] = ["created", "queued", "processing", "completed"];
const severityOrder: Severity[] = ["critical", "medium", "low"];

export default function InspectionDetailPage() {
  const params = useParams<{ id: string }>();
  const { state, processing, saveInspectionDefects } = useDemoData();
  const inspection = getInspection(state, params.id);
  const [selected, setSelected] = useState(0);
  const [showMarkup, setShowMarkup] = useState(true);
  const [highlight, setHighlight] = useState<number | null>(null);

  if (!inspection) {
    return (
      <div className={styles.page}>
        <div className={styles.card}>
          <p className={styles.empty}>Инспекция не найдена.</p>
          <div style={{ textAlign: "center" }}>
            <Link href="/dashboard/inspections" className={styles.btnSecondary}>
              К списку инспекций
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const progress = processing[inspection.id];
  const materials = inspection.materials;
  const current = materials[Math.min(selected, materials.length - 1)];
  const detections = current?.analysis?.detections ?? [];
  const allDetections = materials.flatMap((m) =>
    m.analysis?.state === "matched" ? m.analysis.detections : [],
  );
  const bySeverity = severityOrder.map((sev) => ({
    sev,
    count: allDetections.filter((d) => d.severity === sev).length,
  }));
  const unsupported = materials.filter((m) => m.analysis?.state === "unsupported").length;
  const failed = materials.filter((m) => m.analysis?.state === "error").length;
  const saved = inspection.savedDefectIds.length > 0;
  const done = inspection.status === "completed";
  const reachedIdx = inspection.status === "failed" ? -1 : steps.indexOf(inspection.status);
  const loggedAt = (s: InspectionStatus) =>
    inspection.statusLog.filter((l) => l.status === s).at(-1)?.at;

  return (
    <div className={styles.page}>
      <Link href="/dashboard/inspections" className={styles.pill} style={{ marginBottom: 16 }}>
        <Icon name="arrowLeft" size={16} /> Все инспекции
      </Link>

      <div className={styles.pageHeadRow}>
        <div className={styles.pageHead} style={{ marginBottom: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
            <h2 className={styles.pageTitle}>{inspection.title}</h2>
            <InspectionStatusBadge status={inspection.status} />
          </div>
          <p className={styles.pageSubtitle}>
            <Link href={`/dashboard/objects/${inspection.objectId}`}>
              {getObjectName(state, inspection.objectId)}
            </Link>{" "}
            · {formatDate(inspection.date)} · {sourceLabels[inspection.source]} ·{" "}
            {inspection.operator}
          </p>
        </div>
        {done && (
          <div className={styles.headActions}>
            <Link
              href={`/dashboard/reports?inspection=${inspection.id}&type=Инспекция`}
              className={styles.btnSecondary}
            >
              <Icon name="reports" size={16} />
              Отчёт по инспекции
            </Link>
          </div>
        )}
      </div>

      <div className={styles.card} style={{ marginTop: 24 }}>
        <ol className={styles.stepper}>
          {steps.map((s, idx) => {
            const state_ =
              inspection.status === "failed"
                ? loggedAt(s)
                  ? "done"
                  : "todo"
                : idx < reachedIdx || (idx === reachedIdx && s === "completed")
                  ? "done"
                  : idx === reachedIdx
                    ? "active"
                    : "todo";
            return (
              <li key={s} className={styles.step} data-state={state_}>
                <span className={styles.stepDot}>{state_ === "done" ? <Icon name="check" size={14} /> : idx + 1}</span>
                <span className={styles.stepLabel}>{inspectionStatusLabels[s]}</span>
                <span className={styles.stepTime}>{loggedAt(s) ? formatDateTime(loggedAt(s)!) : ""}</span>
              </li>
            );
          })}
          {inspection.status === "failed" && (
            <li className={styles.step} data-state="failed">
              <span className={styles.stepDot}>!</span>
              <span className={styles.stepLabel}>Ошибка обработки</span>
              <span className={styles.stepTime}>
                {loggedAt("failed") ? formatDateTime(loggedAt("failed")!) : ""}
              </span>
            </li>
          )}
        </ol>
        {progress && (
          <div style={{ marginTop: 16 }}>
            <div className={styles.viewerConfidenceHead}>
              <span>
                Анализ снимка {Math.min(progress.done + 1, progress.total)} из {progress.total}
                {progress.currentName ? `: ${progress.currentName}` : ""}
              </span>
              <strong>{Math.round((progress.done / progress.total) * 100)}%</strong>
            </div>
            <div className={styles.meter}>
              <div
                className={styles.meterFill}
                style={{
                  width: `${(progress.done / progress.total) * 100}%`,
                  background: "var(--color-signal-blue)",
                }}
              />
            </div>
          </div>
        )}
        {inspection.status === "failed" && inspection.failureReason && (
          <p className={styles.formError} role="alert">
            {inspection.failureReason}
          </p>
        )}
        {inspection.description && (
          <p className={styles.cellMuted} style={{ margin: "16px 0 0", fontSize: "var(--text-body-sm)" }}>
            {inspection.description}
          </p>
        )}
      </div>

      {materials.length === 0 ? (
        <div className={styles.card} style={{ marginTop: 20 }}>
          <p className={styles.empty}>
            Архивная инспекция: исходные снимки хранятся в архиве обследований.
            Новых дефектов по её итогам не выявлено.
          </p>
        </div>
      ) : (
        <div className={styles.split} style={{ marginTop: 20 }}>
          <div className={styles.stackGap}>
            <div className={styles.card}>
              <div className={styles.cardHead}>
                <h3 className={styles.cardTitle}>Материалы</h3>
                <div className={styles.viewToggle} role="group" aria-label="Режим просмотра">
                  <button
                    type="button"
                    className={!showMarkup ? styles.viewToggleActive : undefined}
                    aria-pressed={!showMarkup}
                    onClick={() => setShowMarkup(false)}
                  >
                    Оригинал
                  </button>
                  <button
                    type="button"
                    className={showMarkup ? styles.viewToggleActive : undefined}
                    aria-pressed={showMarkup}
                    onClick={() => setShowMarkup(true)}
                  >
                    Разметка
                  </button>
                </div>
              </div>

              {current && (
                <>
                  <div className={styles.mainFrame}>
                    <AnnotatedImage
                      src={current.url}
                      alt={current.name}
                      detections={detections}
                      showMarkup={showMarkup}
                      highlight={highlight}
                    />
                    {!current.analysis && (
                      <div className={styles.frameOverlay}>
                        <span className={styles.badgeSpinner} /> Ожидает анализа
                      </div>
                    )}
                  </div>
                  <p className={styles.fieldNote} style={{ marginTop: 10 }}>
                    {current.name}
                    {current.sizeBytes ? ` · ${Math.round(current.sizeBytes / 1024)} КБ` : ""} ·{" "}
                    {current.analysis?.message ??
                      (current.analysis?.state === "matched"
                        ? `Разметка: ${detections.length} ${plural(detections.length, ["область", "области", "областей"])}`
                        : "Анализ ещё не выполнен")}
                  </p>
                </>
              )}

              {materials.length > 1 && (
                <div className={styles.thumbStrip}>
                  {materials.map((m, idx) => (
                    <button
                      key={m.id}
                      type="button"
                      className={`${styles.thumbBtn} ${idx === selected ? styles.thumbBtnActive : ""}`}
                      onClick={() => {
                        setSelected(idx);
                        setHighlight(null);
                      }}
                      aria-label={m.name}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={m.url} alt="" />
                      <span className={styles.thumbState} data-state={m.analysis?.state ?? "pending"}>
                        {m.analysis?.state === "matched"
                          ? m.analysis.detections.length
                          : m.analysis?.state === "unsupported"
                            ? "—"
                            : m.analysis?.state === "error"
                              ? "!"
                              : "…"}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className={styles.stackGap}>
            <div className={styles.card}>
              <div className={styles.cardHead}>
                <h3 className={styles.cardTitle}>Результаты анализа</h3>
              </div>
              <div className={styles.resultCounts}>
                {bySeverity.map((b) => (
                  <div key={b.sev}>
                    <strong style={{ color: severityColor[b.sev] }}>{b.count}</strong>
                    <span>{severityLabels[b.sev].toLowerCase()}</span>
                  </div>
                ))}
              </div>
              {(unsupported > 0 || failed > 0) && (
                <p className={styles.fieldNote} style={{ marginTop: 12 }}>
                  {unsupported > 0 &&
                    `${unsupported} ${plural(unsupported, ["снимок", "снимка", "снимков"])} без разметки повреждений. `}
                  {failed > 0 && `${failed} не удалось обработать.`}
                </p>
              )}
              <p className={styles.fieldNote} style={{ marginTop: 12 }}>
                Разметка снимков подготовлена заранее. Рекомендации требуют подтверждения
                инженером.
              </p>

              {done && allDetections.length > 0 && (
                <div style={{ marginTop: 16 }}>
                  {saved ? (
                    <div className={styles.savedBox}>
                      <Icon name="check" size={16} />
                      <span>
                        В реестре: {inspection.savedDefectIds.length}{" "}
                        {plural(inspection.savedDefectIds.length, ["дефект", "дефекта", "дефектов"])}.{" "}
                        <Link href={`/dashboard/defects?object=${inspection.objectId}`}>Открыть реестр</Link>
                      </span>
                    </div>
                  ) : (
                    <button
                      type="button"
                      className="btnPrimary"
                      style={{ width: "100%", justifyContent: "center" }}
                      onClick={() => saveInspectionDefects(inspection.id)}
                    >
                      Сохранить {allDetections.length}{" "}
                      {plural(allDetections.length, ["дефект", "дефекта", "дефектов"])} в реестр
                    </button>
                  )}
                </div>
              )}
            </div>

            {detections.length > 0 && (
              <div className={styles.card}>
                <div className={styles.cardHead}>
                  <h3 className={styles.cardTitle}>Повреждения на снимке</h3>
                  <span className={styles.pill}>{detections.length}</span>
                </div>
                <ol className={styles.detectionList}>
                  {detections.map((d, idx) => (
                    <li
                      key={idx}
                      onMouseEnter={() => setHighlight(idx)}
                      onMouseLeave={() => setHighlight(null)}
                      onFocus={() => setHighlight(idx)}
                      onBlur={() => setHighlight(null)}
                      tabIndex={0}
                    >
                      <div className={styles.detectionHead}>
                        <span className={styles.detectionNum} style={{ background: severityColor[d.severity] }}>
                          {idx + 1}
                        </span>
                        <span className={styles.cellStrong}>{d.type}</span>
                        <SeverityBadge severity={d.severity} />
                      </div>
                      <p className={styles.cellMuted}>{d.location}</p>
                      <p>{d.recommendation}</p>
                      <span className={styles.fieldNote}>Оценка уверенности: {d.confidence}%</span>
                    </li>
                  ))}
                </ol>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
