"use client";

import { useEffect, useMemo, useState } from "react";
import { Icon } from "@/components/dash-icons";
import { StatCard } from "@/components/dash-ui";
import { formatDateTime } from "@/lib/dashboard";
import { leadStatusLabels, type Lead, type LeadStatus } from "@/lib/leads-types";
import styles from "@/components/Dashboard.module.css";

const statusClass: Record<LeadStatus, string> = {
  new: styles.badgeInfo,
  in_progress: styles.badgeMedium,
  done: styles.badgeGood,
};

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<LeadStatus | "all">("all");

  useEffect(() => {
    let active = true;
    fetch("/api/leads", { cache: "no-store" })
      .then((r) => r.json())
      .then((data: { leads: Lead[] }) => {
        if (!active) return;
        setLeads(data.leads ?? []);
        setLoading(false);
      })
      .catch(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return leads.filter((l) => {
      if (status !== "all" && l.status !== status) return false;
      if (!q) return true;
      return (
        l.name.toLowerCase().includes(q) ||
        l.company.toLowerCase().includes(q) ||
        l.email.toLowerCase().includes(q)
      );
    });
  }, [leads, query, status]);

  async function changeStatus(id: string, next: LeadStatus) {
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status: next } : l)));
    try {
      await fetch("/api/leads", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: next }),
      });
    } catch {
      /* optimistic update stays; refetch on reload */
    }
  }

  const counts = {
    total: leads.length,
    new: leads.filter((l) => l.status === "new").length,
    in_progress: leads.filter((l) => l.status === "in_progress").length,
    done: leads.filter((l) => l.status === "done").length,
  };

  return (
    <div className={styles.page}>
      <div className={styles.pageHead}>
        <h2 className={styles.pageTitle}>Заявки на демо</h2>
        <p className={styles.pageSubtitle}>
          Заявки с формы «Запросить демо» на сайте. Управляйте статусами обработки.
        </p>
      </div>

      <div className={styles.statGrid}>
        <StatCard label="Всего заявок" value={counts.total} icon="leads" />
        <StatCard
          label="Новые"
          value={counts.new}
          icon="bell"
          danger={counts.new > 0}
          meta="ожидают обработки"
        />
        <StatCard label="В работе" value={counts.in_progress} icon="clock" />
        <StatCard label="Обработаны" value={counts.done} icon="check" />
      </div>

      <div className={styles.toolbar} style={{ marginTop: 20 }}>
        <div className={styles.search}>
          <Icon name="search" size={18} />
          <input
            type="search"
            placeholder="Поиск по имени, компании, почте"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <select
          className={styles.select}
          value={status}
          onChange={(e) => setStatus(e.target.value as LeadStatus | "all")}
        >
          <option value="all">Все статусы</option>
          {(Object.keys(leadStatusLabels) as LeadStatus[]).map((s) => (
            <option key={s} value={s}>
              {leadStatusLabels[s]}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.card}>
        {loading ? (
          <p className={styles.empty}>Загрузка заявок…</p>
        ) : filtered.length === 0 ? (
          <p className={styles.empty}>Заявок пока нет</p>
        ) : (
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Контакт</th>
                  <th>Компания</th>
                  <th>Сегмент</th>
                  <th>Сообщение</th>
                  <th>Дата</th>
                  <th>Статус</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((l) => (
                  <tr key={l.id}>
                    <td>
                      <div className={styles.cellStrong}>{l.name}</div>
                      <div className={styles.cellMuted} style={{ fontSize: "var(--text-caption)" }}>
                        <a href={`mailto:${l.email}`}>{l.email}</a>
                        {l.role ? ` · ${l.role}` : ""}
                      </div>
                    </td>
                    <td className={styles.cellMuted}>{l.company}</td>
                    <td className={styles.cellMuted}>{l.segment}</td>
                    <td
                      className={styles.cellMuted}
                      style={{ maxWidth: 260, whiteSpace: "normal" }}
                    >
                      {l.message || "—"}
                    </td>
                    <td className={styles.cellMuted} style={{ whiteSpace: "nowrap" }}>
                      {formatDateTime(l.createdAt)}
                    </td>
                    <td>
                      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                        <span className={`${styles.badge} ${statusClass[l.status]}`}>
                          {leadStatusLabels[l.status]}
                        </span>
                        <select
                          className={styles.select}
                          value={l.status}
                          onChange={(e) => changeStatus(l.id, e.target.value as LeadStatus)}
                          aria-label="Изменить статус заявки"
                        >
                          {(Object.keys(leadStatusLabels) as LeadStatus[]).map((s) => (
                            <option key={s} value={s}>
                              {leadStatusLabels[s]}
                            </option>
                          ))}
                        </select>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
