import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SiteShell } from "@/components/SiteShell";
import { PageHero } from "@/components/PageHero";
import { Integration } from "@/components/Integration";
import { FinalCTA } from "@/components/FinalCTA";
import { createPageMetadata } from "@/lib/metadata";
import { platformModules } from "@/lib/platform";
import styles from "./page.module.css";

export const metadata: Metadata = createPageMetadata({
  title: "Платформа",
  description:
    "Модули Vision AI, Predict, Map и Alert для автоматизированной диагностики дорог и мостов.",
  path: "/platform",
});

export default function PlatformPage() {
  return (
    <SiteShell>
      <PageHero
        eyebrow="Платформа"
        title="SmartInspect — интеллектуальная диагностика инфраструктуры"
        description="Четыре модуля для сбора, анализа и визуализации данных о состоянии дорог и мостов — от детекции дефектов до прогноза износа."
      />

      <section className="section">
        <div className="container">
          {platformModules.map((mod, i) => (
            <article
              key={mod.id}
              id={mod.id}
              className={`${styles.module} ${i % 2 === 1 ? styles.moduleReverse : ""}`}
            >
              <div className={styles.moduleImage}>
                <Image
                  src={mod.image}
                  alt={mod.alt}
                  fill
                  className={styles.image}
                  sizes="(max-width: 900px) 100vw, 50vw"
                />
              </div>
              <div className={styles.moduleCopy}>
                <p className="eyebrow">{mod.name}</p>
                <h2 className="headingSm">{mod.title}</h2>
                <p className="bodyMuted">{mod.description}</p>
                <ul className={styles.features}>
                  {mod.features.map((f) => (
                    <li key={f}>{f}</li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </section>

      <Integration />

      <section className={`section ${styles.ctaBand}`}>
        <div className="container">
          <div className={styles.ctaInner}>
            <h2 className="headingSm">Готовы увидеть платформу в действии?</h2>
            <Link href="/demo" className="btnPrimary">
              Запросить демо
            </Link>
          </div>
        </div>
      </section>

      <FinalCTA />
    </SiteShell>
  );
}
