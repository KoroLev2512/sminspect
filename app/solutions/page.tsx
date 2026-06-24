import type { Metadata } from "next";
import Link from "next/link";
import { SiteShell } from "@/components/SiteShell";
import { PageHero } from "@/components/PageHero";
import { FinalCTA } from "@/components/FinalCTA";
import { solutions } from "@/lib/solutions";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Решения — SmartInspect",
  description:
    "SmartInspect для муниципалитетов, дорожных компаний, логистики и страхования.",
};

export default function SolutionsPage() {
  return (
    <SiteShell>
      <PageHero
        eyebrow="Решения"
        title="Для каждого сегмента инфраструктуры"
        description="Платформа адаптируется под задачи муниципалитетов, подрядчиков, логистических и страховых компаний."
      />

      <section className="section">
        <div className="container">
          <div className={styles.grid}>
            {solutions.map((item) => (
              <Link key={item.slug} href={`/solutions/${item.slug}`} className={styles.card}>
                <p className="eyebrow">{item.segment}</p>
                <h2 className={styles.cardTitle}>{item.title}</h2>
                <p className={styles.cardPain}>{item.pain}</p>
                <span className={styles.cardLink}>Подробнее →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <FinalCTA />
    </SiteShell>
  );
}
