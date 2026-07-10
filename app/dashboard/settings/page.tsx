"use client";

import { useState, type FormEvent } from "react";
import { useAuth } from "@/components/AuthProvider";
import { Icon } from "@/components/dash-icons";
import { planLabels, planPrices, segments, type PlanId } from "@/lib/auth";
import styles from "@/components/Dashboard.module.css";

const planFeatures: Record<PlanId, string[]> = {
  basic: [
    "Мониторинг до 10 объектов",
    "Базовые отчёты о состоянии",
    "Оповещения о критических дефектах",
  ],
  extended: [
    "Мониторинг до 50 объектов",
    "Прогнозирование износа",
    "Интеграция с внешними системами",
    "Расширенная аналитика",
  ],
  corporate: [
    "Неограниченное число объектов",
    "Индивидуальные модели ИИ",
    "Приоритетная поддержка 24/7",
    "Интеграция по API и с ГИС",
  ],
};

const planOrder: PlanId[] = ["basic", "extended", "corporate"];

const notificationOptions = [
  { id: "critical", label: "Критические дефекты", desc: "Мгновенные оповещения" },
  { id: "weekly", label: "Еженедельная сводка", desc: "Отчёт по состоянию объектов" },
  { id: "forecast", label: "Прогноз ремонтов", desc: "Уведомления о приближении сроков" },
];

export default function SettingsPage() {
  const { user, updateProfile, setPlan } = useAuth();
  const [saved, setSaved] = useState(false);
  const [toggles, setToggles] = useState<Record<string, boolean>>({
    critical: true,
    weekly: true,
    forecast: false,
  });
  const [form, setForm] = useState({
    name: user?.name ?? "",
    company: user?.company ?? "",
    role: user?.role ?? "",
    segment: user?.segment ?? segments[0],
  });

  if (!user) return null;

  function saveProfile(e: FormEvent) {
    e.preventDefault();
    updateProfile(form);
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2500);
  }

  return (
    <div className={styles.page}>
      <div className={styles.pageHead}>
        <h2 className={styles.pageTitle}>Настройки</h2>
        <p className={styles.pageSubtitle}>
          Управление профилем, тарифным планом и уведомлениями.
        </p>
      </div>

      <div className={styles.stackGap}>
        <div className={styles.card}>
          <div className={styles.cardHead}>
            <h3 className={styles.cardTitle}>Профиль</h3>
            {saved && (
              <span className={styles.saved}>
                <Icon name="check" size={16} /> Сохранено
              </span>
            )}
          </div>
          <form onSubmit={saveProfile}>
            <div className={styles.formGrid}>
              <label className={styles.field}>
                <span>Имя и фамилия</span>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </label>
              <label className={styles.field}>
                <span>Почта</span>
                <input type="email" value={user.email} disabled />
              </label>
              <label className={styles.field}>
                <span>Компания</span>
                <input
                  type="text"
                  value={form.company}
                  onChange={(e) => setForm({ ...form, company: e.target.value })}
                />
              </label>
              <label className={styles.field}>
                <span>Должность</span>
                <input
                  type="text"
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                />
              </label>
              <label className={styles.field}>
                <span>Сегмент</span>
                <select
                  value={form.segment}
                  onChange={(e) => setForm({ ...form, segment: e.target.value })}
                >
                  {segments.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <button type="submit" className="btnPrimary" style={{ marginTop: 20 }}>
              Сохранить изменения
            </button>
          </form>
        </div>

        <div className={styles.card}>
          <div className={styles.cardHead}>
            <h3 className={styles.cardTitle}>Тарифный план</h3>
            <span className={styles.pill}>текущий: {planLabels[user.plan]}</span>
          </div>
          <div className={styles.planGrid}>
            {planOrder.map((plan) => {
              const active = user.plan === plan;
              return (
                <div
                  key={plan}
                  className={`${styles.plan} ${active ? styles.planActive : ""}`}
                >
                  <div>
                    <div className={styles.planName}>{planLabels[plan]}</div>
                    <div className={styles.planPrice}>{planPrices[plan]}</div>
                  </div>
                  <ul className={styles.planFeatures}>
                    {planFeatures[plan].map((f) => (
                      <li key={f}>
                        <Icon name="check" size={16} />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <button
                    type="button"
                    className={active ? styles.btnSecondary : "btnPrimary"}
                    disabled={active}
                    onClick={() => setPlan(plan)}
                    style={{ marginTop: "auto", justifyContent: "center" }}
                  >
                    {active ? "Текущий план" : "Выбрать план"}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        <div className={styles.card}>
          <div className={styles.cardHead}>
            <h3 className={styles.cardTitle}>Уведомления</h3>
          </div>
          {notificationOptions.map((opt) => (
            <div key={opt.id} className={styles.toggleRow}>
              <div>
                <div className={styles.cellStrong}>{opt.label}</div>
                <div className={styles.cellMuted} style={{ fontSize: "var(--text-caption)" }}>
                  {opt.desc}
                </div>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={toggles[opt.id]}
                aria-label={opt.label}
                className={`${styles.toggle} ${toggles[opt.id] ? styles.toggleOn : ""}`}
                onClick={() =>
                  setToggles((t) => ({ ...t, [opt.id]: !t[opt.id] }))
                }
              >
                <span className={styles.toggleKnob} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
