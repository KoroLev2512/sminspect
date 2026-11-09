"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { DefectPhoto } from "@/components/DefectPhoto";
import { Icon } from "@/components/dash-icons";
import { DefectStatusBadge, SeverityBadge } from "@/components/dash-ui";
import {
  defectStatusLabels,
  formatDate,
  getObjectName,
  sourceLabels,
  type Defect,
  type DefectStatus,
} from "@/lib/dashboard";
import styles from "@/components/Dashboard.module.css";

interface DefectViewerProps {
  /** Defects the viewer can page through (usually the current filtered list). */
  defects: Defect[];
  /** Id of the defect that is open, or null when closed. */
  openId: string | null;
  onChange: (id: string | null) => void;
  /** When provided, the status can be changed from the viewer. */
  onStatusChange?: (id: string, status: DefectStatus) => void;
}

export function DefectViewer({ defects, openId, onChange, onStatusChange }: DefectViewerProps) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const index = defects.findIndex((d) => d.id === openId);
  const defect = index >= 0 ? defects[index] : null;

  useEffect(() => {
    if (!defect) return;
    closeRef.current?.focus();
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onChange(null);
      if (e.key === "ArrowRight" && index < defects.length - 1) onChange(defects[index + 1].id);
      if (e.key === "ArrowLeft" && index > 0) onChange(defects[index - 1].id);
    }
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [defect, index, defects, onChange]);

  if (!defect) return null;

  return (
    <div className={styles.viewerBackdrop} onClick={() => onChange(null)}>
      <div
        className={styles.viewer}
        role="dialog"
        aria-modal="true"
        aria-label={`Дефект: ${defect.type}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.viewerMedia}>
          <DefectPhoto defect={defect} label="full" />
          <div className={styles.viewerNav}>
            <button
              type="button"
              className={styles.viewerNavBtn}
              onClick={() => onChange(defects[index - 1].id)}
              disabled={index === 0}
              aria-label="Предыдущий дефект"
            >
              <Icon name="arrowLeft" size={18} />
            </button>
            <span>
              {index + 1} из {defects.length}
            </span>
            <button
              type="button"
              className={styles.viewerNavBtn}
              onClick={() => onChange(defects[index + 1].id)}
              disabled={index === defects.length - 1}
              aria-label="Следующий дефект"
            >
              <Icon name="arrowLeft" size={18} style={{ transform: "rotate(180deg)" }} />
            </button>
          </div>
        </div>

        <div className={styles.viewerBody}>
          <div className={styles.viewerHead}>
            <div>
              <p className={styles.viewerEyebrow}>Обнаружено ИИ · {defect.id.toUpperCase()}</p>
              <h3 className={styles.viewerTitle}>{defect.type}</h3>
            </div>
            <button
              ref={closeRef}
              type="button"
              className={styles.viewerClose}
              onClick={() => onChange(null)}
              aria-label="Закрыть"
            >
              <Icon name="close" size={20} />
            </button>
          </div>

          <div className={styles.viewerBadges}>
            <SeverityBadge severity={defect.severity} />
            <DefectStatusBadge status={defect.status} />
          </div>

          <dl className={styles.viewerFacts}>
            <div>
              <dt>Объект</dt>
              <dd>
                <Link href={`/dashboard/objects/${defect.objectId}`}>
                  {getObjectName(defect.objectId)}
                </Link>
              </dd>
            </div>
            <div>
              <dt>Расположение</dt>
              <dd>{defect.location}</dd>
            </div>
            <div>
              <dt>Обнаружен</dt>
              <dd>{formatDate(defect.detectedAt)}</dd>
            </div>
            <div>
              <dt>Источник данных</dt>
              <dd>{sourceLabels[defect.source]}</dd>
            </div>
          </dl>

          <div>
            <div className={styles.viewerConfidenceHead}>
              <span>Уверенность классификатора</span>
              <strong>{defect.confidence}%</strong>
            </div>
            <div className={styles.meter}>
              <div
                className={styles.meterFill}
                style={{ width: `${defect.confidence}%`, background: "var(--color-signal-blue)" }}
              />
            </div>
          </div>

          <div className={styles.viewerRecommendation}>
            <p className={styles.viewerEyebrow}>Рекомендация</p>
            <p>{defect.recommendation}</p>
          </div>

          {onStatusChange && (
            <label className={styles.viewerStatus}>
              <span>Статус работ</span>
              <select
                className={styles.select}
                value={defect.status}
                onChange={(e) => onStatusChange(defect.id, e.target.value as DefectStatus)}
              >
                {(Object.keys(defectStatusLabels) as DefectStatus[]).map((s) => (
                  <option key={s} value={s}>
                    {defectStatusLabels[s]}
                  </option>
                ))}
              </select>
            </label>
          )}
        </div>
      </div>
    </div>
  );
}
