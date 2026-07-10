import type { CSSProperties, ReactNode } from "react";
import styles from "./Dashboard.module.css";
import { Icon, type IconName } from "./dash-icons";
import {
  defectStatusLabels,
  severityLabels,
  statusLabels,
  type DefectStatus,
  type ObjectStatus,
  type Severity,
} from "@/lib/dashboard";

export function Spinner({ size = 20 }: { size?: number }) {
  return (
    <svg
      className={styles.spinner}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.25" strokeWidth="3" />
      <path
        d="M12 3a9 9 0 0 1 9 9"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function Skeleton({
  height = 16,
  width = "100%",
  radius,
  style,
}: {
  height?: number | string;
  width?: number | string;
  radius?: number | string;
  style?: CSSProperties;
}) {
  return (
    <span
      className={styles.skeleton}
      style={{ height, width, borderRadius: radius, ...style }}
    />
  );
}

export function conditionColor(value: number) {
  if (value >= 75) return "#1e874b";
  if (value >= 50) return "#f5a623";
  return "#c0392b";
}

export function StatCard({
  label,
  value,
  icon,
  meta,
  danger,
}: {
  label: string;
  value: ReactNode;
  icon: IconName;
  meta?: ReactNode;
  danger?: boolean;
}) {
  return (
    <div className={styles.stat}>
      <div className={styles.statTop}>
        <span className={styles.statLabel}>{label}</span>
        <span className={`${styles.statIcon} ${danger ? styles.statIconDanger : ""}`}>
          <Icon name={icon} size={18} />
        </span>
      </div>
      <div className={styles.statValue}>{value}</div>
      {meta ? <div className={styles.statMeta}>{meta}</div> : null}
    </div>
  );
}

const severityClass: Record<Severity, string> = {
  low: styles.badgeLow,
  medium: styles.badgeMedium,
  critical: styles.badgeCritical,
};

export function SeverityBadge({ severity }: { severity: Severity }) {
  return (
    <span className={`${styles.badge} ${severityClass[severity]}`}>
      {severityLabels[severity]}
    </span>
  );
}

const objectStatusClass: Record<ObjectStatus, string> = {
  good: styles.badgeGood,
  warning: styles.badgeMedium,
  critical: styles.badgeCritical,
};

export function ObjectStatusBadge({ status }: { status: ObjectStatus }) {
  return (
    <span className={`${styles.badge} ${objectStatusClass[status]}`}>
      {statusLabels[status]}
    </span>
  );
}

const defectStatusClass: Record<DefectStatus, string> = {
  new: styles.badgeInfo,
  in_progress: styles.badgeMedium,
  resolved: styles.badgeGood,
};

export function DefectStatusBadge({ status }: { status: DefectStatus }) {
  return (
    <span className={`${styles.badge} ${defectStatusClass[status]}`}>
      {defectStatusLabels[status]}
    </span>
  );
}

export function ConditionMeter({ value }: { value: number }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <div className={styles.meter} style={{ flex: 1 }}>
        <div
          className={styles.meterFill}
          style={{ width: `${value}%`, background: conditionColor(value) }}
        />
      </div>
      <span
        style={{ fontWeight: 600, minWidth: 34, textAlign: "right", color: conditionColor(value) }}
      >
        {value}
      </span>
    </div>
  );
}

export function Donut({
  data,
  size = 168,
}: {
  data: { label: string; value: number; color: string }[];
  size?: number;
}) {
  const total = data.reduce((s, d) => s + d.value, 0) || 1;
  const r = size / 2 - 12;
  const circ = 2 * Math.PI * r;

  const segments = data.map((d, i) => {
    const prior = data.slice(0, i).reduce((s, x) => s + x.value, 0);
    return {
      ...d,
      len: (d.value / total) * circ,
      offset: (prior / total) * circ,
    };
  });

  return (
    <div className={styles.donutWrap}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <g transform={`rotate(-90 ${size / 2} ${size / 2})`}>
          {segments.map((d) => (
            <circle
              key={d.label}
              cx={size / 2}
              cy={size / 2}
              r={r}
              fill="none"
              stroke={d.color}
              strokeWidth={16}
              strokeDasharray={`${d.len} ${circ - d.len}`}
              strokeDashoffset={-d.offset}
            />
          ))}
        </g>
      </svg>
      <ul className={styles.legend}>
        {data.map((d) => (
          <li key={d.label} className={styles.legendRow}>
            <span className={styles.legendSwatch} style={{ background: d.color }} />
            {d.label}
            <span className={styles.legendValue}>{Math.round((d.value / total) * 100)}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Bars({
  data,
}: {
  data: { month: string; value: number }[];
}) {
  const max = Math.max(...data.map((d) => d.value), 1);
  return (
    <div className={styles.bars}>
      {data.map((d) => (
        <div key={d.month} className={styles.barCol}>
          <div className={styles.barTrack}>
            <div className={styles.barFill} style={{ height: `${(d.value / max) * 100}%` }} />
          </div>
          <span className={styles.barLabel}>{d.month}</span>
        </div>
      ))}
    </div>
  );
}

export function TrendLine({
  data,
  height = 200,
}: {
  data: { month: string; value: number }[];
  height?: number;
}) {
  const width = 560;
  const pad = 28;
  const values = data.map((d) => d.value);
  const min = Math.min(...values) - 4;
  const max = Math.max(...values) + 4;
  const stepX = (width - pad * 2) / (data.length - 1);
  const y = (v: number) => pad + (height - pad * 2) * (1 - (v - min) / (max - min));
  const points = data.map((d, i) => [pad + i * stepX, y(d.value)] as const);
  const line = points.map(([px, py]) => `${px},${py}`).join(" ");
  const area = `${pad},${height - pad} ${line} ${width - pad},${height - pad}`;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      width="100%"
      preserveAspectRatio="none"
      style={{ display: "block" }}
    >
      <defs>
        <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#006aed" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#006aed" stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={area} fill="url(#trendFill)" />
      <polyline
        points={line}
        fill="none"
        stroke="#006aed"
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {points.map(([px, py], i) => (
        <g key={data[i].month}>
          <circle cx={px} cy={py} r={3.5} fill="#006aed" />
          <text x={px} y={height - 8} textAnchor="middle" fontSize={11} fill="#68748d">
            {data[i].month}
          </text>
        </g>
      ))}
    </svg>
  );
}
