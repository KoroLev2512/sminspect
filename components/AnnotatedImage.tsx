import type { CSSProperties } from "react";
import type { Detection, Severity } from "@/lib/dashboard";
import styles from "@/components/Dashboard.module.css";

export const severityColor: Record<Severity, string> = {
  critical: "#e5484d",
  medium: "#f5a623",
  low: "#18dcdc",
};

interface AnnotatedImageProps {
  src: string;
  alt: string;
  detections: Detection[];
  /** false — show the original frame without markup. */
  showMarkup?: boolean;
  labeled?: boolean;
  /** Index of a detection to emphasise (others are dimmed). */
  highlight?: number | null;
  className?: string;
}

/**
 * Inspection frame with demo annotation boxes. Frames are 4:3 and the box
 * coordinates are percentages, so the container keeps a 4:3 ratio; other
 * images are letterboxed (they carry no boxes in the demo).
 */
export function AnnotatedImage({
  src,
  alt,
  detections,
  showMarkup = true,
  labeled = true,
  highlight = null,
  className,
}: AnnotatedImageProps) {
  return (
    <div className={`${styles.defectPhoto} ${styles.annotated} ${className ?? ""}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} />
      {showMarkup &&
        detections.map((d, idx) => {
          const style = {
            left: `${d.bbox.x}%`,
            top: `${d.bbox.y}%`,
            width: `${d.bbox.w}%`,
            height: `${d.bbox.h}%`,
            "--bbox-color": severityColor[d.severity],
            opacity: highlight === null || highlight === idx ? 1 : 0.35,
          } as CSSProperties;
          return (
            <span key={idx} className={styles.bbox} style={style} aria-hidden="true">
              {labeled && (
                <span
                  className={`${styles.bboxLabel} ${d.bbox.y < 10 ? styles.bboxLabelInside : ""} ${d.bbox.x + d.bbox.w > 70 ? styles.bboxLabelRight : ""}`}
                >
                  {idx + 1}. {d.type}
                </span>
              )}
            </span>
          );
        })}
    </div>
  );
}
