import type { CSSProperties } from "react";
import type { Defect } from "@/lib/dashboard";
import styles from "@/components/Dashboard.module.css";

const severityColor: Record<Defect["severity"], string> = {
  critical: "#e5484d",
  medium: "#f5a623",
  low: "#18dcdc",
};

interface DefectPhotoProps {
  defect: Defect;
  /**
   * AI label above the detection box: "full" shows type + confidence,
   * "compact" only confidence (for cards that already show the type).
   */
  label?: "full" | "compact";
  className?: string;
}

/**
 * Inspection frame with the AI detection box drawn over it. Frames are 4:3,
 * and the container keeps that ratio, so bbox percentages stay aligned.
 */
export function DefectPhoto({ defect, label, className }: DefectPhotoProps) {
  const { x, y, w, h } = defect.bbox;
  const style = {
    left: `${x}%`,
    top: `${y}%`,
    width: `${w}%`,
    height: `${h}%`,
    "--bbox-color": severityColor[defect.severity],
  } as CSSProperties;

  return (
    <div className={`${styles.defectPhoto} ${className ?? ""}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={defect.image} alt={`${defect.type}: ${defect.location}`} loading="lazy" />
      <span className={styles.bbox} style={style} aria-hidden="true">
        {label && (
          <span className={`${styles.bboxLabel} ${y < 10 ? styles.bboxLabelInside : ""}`}>
            {label === "full" ? defect.type : "ИИ"} · {defect.confidence}%
          </span>
        )}
      </span>
    </div>
  );
}
