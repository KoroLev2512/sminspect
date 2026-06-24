import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/PageHero";
import { FinalCTA } from "@/components/FinalCTA";
import { Reveal } from "@/components/Reveal";
import { createPageMetadata } from "@/lib/metadata";
import { getSolution, solutions } from "@/lib/solutions";
import styles from "./page.module.css";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return solutions.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const solution = getSolution(slug);
  if (!solution) return { title: "Решение не найдено" };

  return createPageMetadata({
    title: solution.segment,
    description: solution.solution,
    path: `/solutions/${solution.slug}`,
  });
}

export default async function SolutionDetailPage({ params }: Props) {
  const { slug } = await params;
  const solution = getSolution(slug);
  if (!solution) notFound();

  const others = solutions.filter((s) => s.slug !== solution.slug);

  return (
    <>
      <PageHero
        eyebrow={solution.segment}
        title={solution.title}
        description={solution.solution}
      />

      <section className="section">
        <div className="container">
          <Reveal>
            <div className={styles.layout}>
              <div>
                <h2 className="headingSm">Проблема</h2>
                <p className={styles.text}>{solution.pain}</p>

                <h2 className={`headingSm ${styles.headingGap}`}>Что даёт SmartInspect</h2>
                <ul className={styles.benefits}>
                  {solution.benefits.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
              </div>

              <blockquote className={styles.quote}>
                <p>&ldquo;{solution.quote}&rdquo;</p>
                <footer>
                  <cite>{solution.author}</cite>
                  <span>{solution.org}</span>
                </footer>
              </blockquote>
            </div>
          </Reveal>
        </div>
      </section>

      <section className={`section ${styles.others}`}>
        <div className="container">
          <Reveal>
            <p className="eyebrow">Другие решения</p>
            <div className={styles.otherGrid}>
              {others.map((item) => (
                <Link key={item.slug} href={`/solutions/${item.slug}`} className={styles.otherCard}>
                  <span className={styles.otherSegment}>{item.segment}</span>
                  <span className={styles.otherTitle}>{item.title}</span>
                </Link>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <Reveal>
        <FinalCTA />
      </Reveal>
    </>
  );
}
