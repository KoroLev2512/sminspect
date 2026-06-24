import type { Metadata } from "next";
import Link from "next/link";
import { SiteShell } from "@/components/SiteShell";
import { PageHero } from "@/components/PageHero";
import { createPageMetadata } from "@/lib/metadata";
import { siteConfig } from "@/lib/site";
import { termsMeta, termsSections } from "@/lib/terms";
import styles from "../privacy/page.module.css";

export const metadata: Metadata = createPageMetadata({
  title: termsMeta.title,
  description: `Условия использования сайта ${siteConfig.domain} и сервисов SmartInspect.`,
  path: termsMeta.path,
});

export default function TermsPage() {
  return (
    <SiteShell>
      <PageHero
        eyebrow="Документы"
        title={termsMeta.title}
        description={`Оператор: ${siteConfig.operator}. Сайт: ${siteConfig.url}`}
      />

      <section className={`section ${styles.section}`}>
        <div className="container">
          <article className={styles.document}>
            {termsSections.map((section) => (
              <section key={section.id} id={section.id} className={styles.block}>
                <h2 className={styles.blockTitle}>{section.title}</h2>
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph.slice(0, 40)} className={styles.paragraph}>
                    {paragraph}
                  </p>
                ))}
              </section>
            ))}

            <p className={styles.contact}>
              По вопросам использования сайта:{" "}
              <a href={`mailto:${siteConfig.privacyEmail}`}>{siteConfig.privacyEmail}</a>
            </p>

            <Link href="/" className={styles.back}>
              ← На главную
            </Link>
          </article>
        </div>
      </section>
    </SiteShell>
  );
}
