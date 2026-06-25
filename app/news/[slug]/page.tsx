import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/JsonLd";
import { Reveal } from "@/components/Reveal";
import { Stagger } from "@/components/Stagger";
import { createPageMetadata } from "@/lib/metadata";
import { formatNewsDate, getNewsArticle, newsArticles } from "@/lib/news";
import { articleSchema, breadcrumbSchema } from "@/lib/schema";
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
    type: "article",
    publishedTime: article.publishedAt,
  });
}

export default async function NewsArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = getNewsArticle(slug);
  if (!article) notFound();

  return (
    <article className={styles.article}>
      <JsonLd
        data={[
          articleSchema(article),
          breadcrumbSchema([
            { name: "Главная", path: "/" },
            { name: "Новости", path: "/news" },
            { name: article.title, path: `/news/${article.slug}` },
          ]),
        ]}
      />
      <div className="container">
        <Reveal>
          <Link href="/news" className={styles.back}>
            ← Все новости
          </Link>
        </Reveal>
        <Stagger>
          <div className={styles.meta}>
            <span className={styles.tag}>{article.tag}</span>
            <time dateTime={article.publishedAt}>{formatNewsDate(article.publishedAt)}</time>
          </div>
          <h1 className={styles.title}>{article.title}</h1>
        </Stagger>
        {article.paragraphs.map((paragraph, i) => (
          <Reveal key={paragraph.slice(0, 40)} delay={i * 60}>
            <p className={styles.paragraph}>{paragraph}</p>
          </Reveal>
        ))}
      </div>
    </article>
  );
}
