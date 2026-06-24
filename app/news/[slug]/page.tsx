import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteShell } from "@/components/SiteShell";
import { createPageMetadata } from "@/lib/metadata";
import { getNewsArticle, newsArticles } from "@/lib/news";
import styles from "./page.module.css";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return newsArticles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = getNewsArticle(slug);
  if (!article) return { title: "Новость не найдена" };

  return createPageMetadata({
    title: article.title,
    description: article.excerpt,
    path: `/news/${article.slug}`,
  });
}

export default async function NewsArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = getNewsArticle(slug);
  if (!article) notFound();

  return (
    <SiteShell>
      <article className={styles.article}>
        <div className="container">
          <Link href="/news" className={styles.back}>
            ← Все новости
          </Link>
          <div className={styles.meta}>
            <span className={styles.tag}>{article.tag}</span>
            <time>{article.date}</time>
          </div>
          <h1 className={styles.title}>{article.title}</h1>
          {article.paragraphs.map((paragraph) => (
            <p key={paragraph.slice(0, 40)} className={styles.paragraph}>
              {paragraph}
            </p>
          ))}
        </div>
      </article>
    </SiteShell>
  );
}
