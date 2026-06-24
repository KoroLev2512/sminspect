import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";
import { createPageMetadata } from "@/lib/metadata";
import { privacyPolicyMeta, privacyPolicySections } from "@/lib/privacy-policy";
import { siteConfig } from "@/lib/site";
import styles from "./page.module.css";

export const metadata: Metadata = createPageMetadata({
  title: privacyPolicyMeta.title,
  description:
    "Политика обработки персональных данных Оператора на сайте SmartInspect в соответствии с Федеральным законом № 152-ФЗ.",
  path: privacyPolicyMeta.path,
});

export default function PrivacyPage() {
  return (
    <>
      <PageHero
        eyebrow="Документы"
        title={privacyPolicyMeta.title}
        description={`Оператор: ${siteConfig.operator}. Сайт: ${siteConfig.url}`}
      />

      <section className={`section ${styles.section}`}>
        <div className="container">
          <article className={styles.document}>
            {privacyPolicySections.map((section, i) => (
              <Reveal key={section.id} delay={i * 40}>
                <section id={section.id} className={styles.block}>
                  <h2 className={styles.blockTitle}>{section.title}</h2>

                  {"paragraphs" in section &&
                    section.paragraphs?.map((paragraph) => (
                      <p key={paragraph.slice(0, 40)} className={styles.paragraph}>
                        {paragraph}
                      </p>
                    ))}

                  {"list" in section &&
                    section.list?.map((item) => (
                      <p key={item.slice(0, 40)} className={styles.paragraph}>
                        {item}
                      </p>
                    ))}

                  {"subsections" in section &&
                    section.subsections?.map((subsection) => (
                      <div key={subsection.title} className={styles.subsection}>
                        <h3 className={styles.subsectionTitle}>{subsection.title}</h3>
                        <ul className={styles.list}>
                          {subsection.list.map((item) => (
                            <li key={item.slice(0, 40)}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    ))}

                  {"table" in section && section.table && (
                    <dl className={styles.table}>
                      {section.table.map((row) => (
                        <div key={row.label} className={styles.tableRow}>
                          <dt>{row.label}</dt>
                          <dd>{row.value}</dd>
                        </div>
                      ))}
                    </dl>
                  )}
                </section>
              </Reveal>
            ))}

            <Reveal>
              <p className={styles.contact}>
                По вопросам обработки персональных данных:{" "}
                <a href={`mailto:${siteConfig.privacyEmail}`}>{siteConfig.privacyEmail}</a>
              </p>

              <Link href="/" className={styles.back}>
                ← На главную
              </Link>
            </Reveal>
          </article>
        </div>
      </section>
    </>
  );
}
