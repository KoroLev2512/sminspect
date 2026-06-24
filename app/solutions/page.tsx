import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { FinalCTA } from "@/components/FinalCTA";
import { Reveal } from "@/components/Reveal";
import { createPageMetadata } from "@/lib/metadata";
import { solutions } from "@/lib/solutions";
import styles from "./page.module.css";

export const metadata: Metadata = createPageMetadata({
  title: "Решения",
  description: "SmartInspect для муниципалитетов, дорожных компаний, логистики и страхования.",
  path: "/solutions",
});

export default function SolutionsPage() {
  return (
    <>
      <PageHero
        eyebrow="Решения"
        title="Для каждого сегмента инфраструктуры"
        description="Платформа адаптируется под задачи муниципалитетов, подрядчиков, логистических и страховых компаний."
      />

      <section className="section">
        <div className="container">
          <div className={styles.grid}>
            {solutions.map((item, i) => (
              <Reveal key={item.slug} delay={i * 80}>
                <Link href={`/solutions/${item.slug}`} className={styles.card}>
                  <p className="eyebrow">{item.segment}</p>
                  <h2 className={styles.cardTitle}>{item.title}</h2>
                  <p className={styles.cardPain}>{item.pain}</p>
                  <span className={styles.cardLink}>Подробнее →</span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <Reveal>
        <FinalCTA />
      </Reveal>
    </>
  );
}
