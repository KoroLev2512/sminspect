import Link from "next/link";
import { newsArticles } from "@/lib/news";
import styles from "./News.module.css";

export function News() {
  return (
    <section id="news" className="section">
      <hr className="sectionDivider" />
      <div className="container">
        <div className={styles.header}>
          <div>
            <p className="eyebrow">Новости</p>
            <h2 className="headingLg">
              Истории
              <br />с дорог
            </h2>
          </div>
          <Link href="/news" className="btnGhost">
            Все новости →
          </Link>
        </div>

        <div className={styles.grid}>
          {newsArticles.map((article) => (
            <article key={article.slug} className={styles.card}>
              <div className={styles.cardMeta}>
                <span className={styles.tag}>{article.tag}</span>
                <time>{article.date}</time>
              </div>
              <h3 className={styles.cardTitle}>
                <Link href={`/news/${article.slug}`}>{article.title}</Link>
              </h3>
              <Link
                href={`/news/${article.slug}`}
                className={`btnCircle ${styles.cardAction}`}
                aria-label={`Читать: ${article.title}`}
              >
                →
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
