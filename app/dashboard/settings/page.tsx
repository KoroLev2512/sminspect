"use client";

import { useAuth } from "@/components/AuthProvider";
import { Icon } from "@/components/dash-icons";
import {
  DeleteAccountCard,
  DemoDataCard,
  NotificationsCard,
  PasswordCard,
  ProfileCard,
} from "@/components/ProfileSettings";
import { planLabels, planPrices, type PlanId } from "@/lib/auth";
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

export default function SettingsPage() {
  const { user, setPlan } = useAuth();

  if (!user) return null;

  return (
    <div className={styles.page}>
      <div className={styles.pageHead}>
        <h2 className={styles.pageTitle}>Настройки</h2>
        <p className={styles.pageSubtitle}>
          Профиль, безопасность, тарифный план и уведомления.
        </p>
      </div>

      <div className={styles.stackGap}>
        <ProfileCard key={user.id} user={user} />

        <PasswordCard />

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

        <NotificationsCard user={user} />

        <DemoDataCard />

        <DeleteAccountCard />
      </div>
    </div>
  );
}
