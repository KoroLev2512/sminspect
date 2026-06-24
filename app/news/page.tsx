import type { Metadata } from "next";
import Link from "next/link";
import { SiteShell } from "@/components/SiteShell";
import { PageHero } from "@/components/PageHero";
import { createPageMetadata } from "@/lib/metadata";
import { newsArticles } from "@/lib/news";
import styles from "./page.module.css";

export const metadata: Metadata = createPageMetadata({
  title: "Новости",
  description: "Новости и истории SmartInspect о диагностике дорог и мостов с применением ИИ.",
  path: "/news",
});

export default function NewsPage() {
  return (
    <SiteShell>
      <PageHero
        eyebrow="Новости"
        title="Истории с дорог"
        description="Пилоты, исследования и развитие платформы SmartInspect."
      />

      <section className="section">
        <div className="container">
          <div className={styles.grid}>
            {newsArticles.map((article) => (
              <Link key={article.slug} href={`/news/${article.slug}`} className={styles.card}>
                <div className={styles.meta}>
                  <span className={styles.tag}>{article.tag}</span>
                  <time>{article.date}</time>
                </div>
                <h2 className={styles.title}>{article.title}</h2>
                <p className={styles.excerpt}>{article.excerpt}</p>
                <span className={styles.link}>Читать →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
