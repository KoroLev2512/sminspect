"use client";

import Link from "next/link";
import { useState } from "react";
import { solutions } from "@/lib/solutions";
import styles from "./UseCases.module.css";

export function UseCases() {
  const [index, setIndex] = useState(0);
  const current = solutions[index];

  return (
    <section id="solutions" className="section">
      <hr className="sectionDivider" />
      <div className="container">
        <p className="eyebrow">Решения</p>
        <h2 className="headingLg">Вы в надёжной компании</h2>

        <div className={styles.layout}>
          <div className={styles.tabs}>
            {solutions.map((item, i) => (
              <button
                key={item.slug}
                type="button"
                className={`${styles.tab} ${i === index ? styles.tabActive : ""}`}
                onClick={() => setIndex(i)}
              >
                {item.segment}
              </button>
            ))}
          </div>

          <article className={styles.card}>
            <div className={styles.cardHeader}>
              <div>
                <h3 className={styles.segment}>{current.segment}</h3>
                <p className={styles.pain}>
                  <strong>Проблема:</strong> {current.pain}
                </p>
                <p className={styles.solution}>
                  <strong>Решение:</strong> {current.solution}
                </p>
                <Link href={`/solutions/${current.slug}`} className={styles.detailLink}>
                  Подробнее о решении →
                </Link>
              </div>
            </div>
            <blockquote className={styles.quote}>
              <p>&ldquo;{current.quote}&rdquo;</p>
              <footer>
                <cite>{current.author}</cite>
                <span>{current.org}</span>
              </footer>
            </blockquote>
            <div className={styles.pagination}>
              <span>
                {String(index + 1).padStart(2, "0")}/{String(solutions.length).padStart(2, "0")}
              </span>
              <div className={styles.paginationBtns}>
                <button
                  type="button"
                  className={styles.pageBtn}
                  onClick={() => setIndex((i) => (i === 0 ? solutions.length - 1 : i - 1))}
                  aria-label="Предыдущий кейс"
                >
                  ←
                </button>
                <button
                  type="button"
                  className={styles.pageBtn}
                  onClick={() => setIndex((i) => (i === solutions.length - 1 ? 0 : i + 1))}
                  aria-label="Следующий кейс"
                >
                  →
                </button>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
