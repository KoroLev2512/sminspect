import type { Metadata } from "next";
import { SiteShell } from "@/components/SiteShell";
import { PageHero } from "@/components/PageHero";
import { DemoForm } from "@/components/DemoForm";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Запросить демо — SmartInspect",
  description:
    "Запросите демонстрацию платформы SmartInspect для автоматизированной диагностики дорог и мостов.",
};

export default function DemoPage() {
  return (
    <SiteShell>
      <PageHero
        eyebrow="Демонстрация"
        title="Запросить демо платформы"
        description="Расскажите о ваших задачах — мы покажем, как SmartInspect снизит затраты на инспекции и повысит безопасность инфраструктуры."
      />
      <section className={`section ${styles.section}`}>
        <div className="container">
          <div className={styles.grid}>
            <div className={styles.info}>
              <h2 className="headingSm">Что вы получите</h2>
              <ul className={styles.list}>
                <li>Персональную демонстрацию модулей Vision AI, Predict, Map и Alert</li>
                <li>Обзор интеграций с дронами, камерами и ГИС</li>
                <li>Оценку применимости для вашего масштаба инфраструктуры</li>
                <li>Рекомендации по пилотному внедрению</li>
              </ul>
              <p className={styles.note}>
                Ответим в течение 1–2 рабочих дней. Данные защищены и используются
                только для связи по вашей заявке.
              </p>
            </div>
            <DemoForm />
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
