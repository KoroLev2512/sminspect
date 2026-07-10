"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Icon } from "@/components/dash-icons";
import { ConditionMeter, ObjectStatusBadge } from "@/components/dash-ui";
import {
  formatDate,
  objects,
  typeLabels,
  type ObjectType,
} from "@/lib/dashboard";
import styles from "@/components/Dashboard.module.css";

export default function ObjectsPage() {
  const [query, setQuery] = useState("");
  const [type, setType] = useState<ObjectType | "all">("all");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return objects.filter((o) => {
      if (type !== "all" && o.type !== type) return false;
      if (!q) return true;
      return (
        o.name.toLowerCase().includes(q) || o.region.toLowerCase().includes(q)
      );
    });
  }, [query, type]);

  return (
    <div className={styles.page}>
      <div className={styles.pageHead}>
        <h2 className={styles.pageTitle}>Объекты инфраструктуры</h2>
        <p className={styles.pageSubtitle}>
          {objects.length} объектов на мониторинге. Дороги, мосты и путепроводы.
        </p>
      </div>

      <div className={styles.toolbar}>
        <div className={styles.search}>
          <Icon name="search" size={18} />
          <input
            type="search"
            placeholder="Поиск по названию или региону"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <select
          className={styles.select}
          value={type}
          onChange={(e) => setType(e.target.value as ObjectType | "all")}
        >
          <option value="all">Все типы</option>
          <option value="road">Дороги</option>
          <option value="bridge">Мосты и путепроводы</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className={styles.card}>
          <p className={styles.empty}>Ничего не найдено</p>
        </div>
      ) : (
        <div className={styles.cols3}>
          {filtered.map((o) => (
            <Link
              key={o.id}
              href={`/dashboard/objects/${o.id}`}
              className={`${styles.card} ${styles.objectCard}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={o.image} alt={o.name} className={styles.objectImg} />
              <div className={styles.objectBody}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  <span className={styles.pill}>
                    <Icon name={o.type === "bridge" ? "bridge" : "road"} size={16} />
                    {typeLabels[o.type]}
                  </span>
                  <ObjectStatusBadge status={o.status} />
                </div>
                <h3 className={styles.objectName}>{o.name}</h3>
                <p className={styles.cellMuted} style={{ fontSize: "var(--text-body-sm)" }}>
                  {o.region} · {o.length}
                </p>
                <div style={{ marginTop: "auto" }}>
                  <ConditionMeter value={o.condition} />
                </div>
                <p className={styles.statMeta}>
                  Инспекция: {formatDate(o.lastInspection)} · дефектов: {o.defects}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
