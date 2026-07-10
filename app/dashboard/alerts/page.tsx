"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Icon } from "@/components/dash-icons";
import { SeverityBadge } from "@/components/dash-ui";
import {
  alerts as seedAlerts,
  formatDateTime,
  getObjectName,
  type Alert,
} from "@/lib/dashboard";
import styles from "@/components/Dashboard.module.css";

export default function AlertsPage() {
  const [rows, setRows] = useState<Alert[]>(seedAlerts);
  const [onlyUnread, setOnlyUnread] = useState(false);

  const visible = useMemo(
    () => rows.filter((a) => !onlyUnread || !a.read),
    [rows, onlyUnread],
  );
  const unread = rows.filter((a) => !a.read).length;

  function markRead(id: string) {
    setRows((prev) => prev.map((a) => (a.id === id ? { ...a, read: true } : a)));
  }

  function markAll() {
    setRows((prev) => prev.map((a) => ({ ...a, read: true })));
  }

  return (
    <div className={styles.page}>
      <div className={styles.pageHead}>
        <h2 className={styles.pageTitle}>Оповещения</h2>
        <p className={styles.pageSubtitle}>
          Уведомления о критических дефектах в реальном времени. Непрочитанных:{" "}
          {unread}.
        </p>
      </div>

      <div className={styles.toolbar}>
        <div className={styles.chips} style={{ flex: 1 }}>
          <button
            type="button"
            className={`${styles.chip} ${!onlyUnread ? styles.chipActive : ""}`}
            onClick={() => setOnlyUnread(false)}
          >
            Все
          </button>
          <button
            type="button"
            className={`${styles.chip} ${onlyUnread ? styles.chipActive : ""}`}
            onClick={() => setOnlyUnread(true)}
          >
            Непрочитанные
          </button>
        </div>
        <button
          type="button"
          className={styles.btnSecondary}
          onClick={markAll}
          disabled={unread === 0}
        >
          <Icon name="check" size={16} />
          Отметить все прочитанными
        </button>
      </div>

      <div className={styles.card}>
        {visible.map((a) => (
          <div
            key={a.id}
            className={`${styles.alertRow} ${!a.read ? styles.alertUnread : ""}`}
          >
            <span
              className={styles.alertIcon}
              style={{
                background:
                  a.severity === "critical"
                    ? "color-mix(in srgb, #c0392b 12%, transparent)"
                    : "var(--color-hailstone)",
                color: a.severity === "critical" ? "#c0392b" : "var(--color-signal-blue)",
              }}
            >
              <Icon name="alerts" size={18} />
            </span>
            <div className={styles.alertBody}>
              <p className={styles.alertMessage}>{a.message}</p>
              <p className={styles.alertMeta}>
                <Link href={`/dashboard/objects/${a.objectId}`}>
                  {getObjectName(a.objectId)}
                </Link>{" "}
                · {formatDateTime(a.createdAt)}
              </p>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <SeverityBadge severity={a.severity} />
              {!a.read && (
                <button
                  type="button"
                  className={`${styles.btnSecondary} ${styles.btnSm}`}
                  onClick={() => markRead(a.id)}
                >
                  Прочитано
                </button>
              )}
            </div>
          </div>
        ))}
        {visible.length === 0 && (
          <p className={styles.empty}>Непрочитанных оповещений нет</p>
        )}
      </div>
    </div>
  );
}
