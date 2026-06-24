"use client";

import { useEffect, useRef } from "react";
import styles from "./TextReveal.module.css";

const paragraphs = [
  "SmartInspect — облачная платформа, которая автоматически выявляет трещины, выбоины и коррозию на дорогах и мостах.",
  "Данные с дронов, мобильных камер и сенсоров обрабатываются в реальном времени. Вы получаете не снимки, а решения: где ремонтировать, когда и зачем.",
  "Платформа снижает затраты на ручные инспекции, повышает прозрачность мониторинга и помогает предотвращать аварийные ситуации до их возникновения.",
];

function RevealParagraph({ text }: { text: string }) {
  const ref = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const words = text.split(" ");
    el.innerHTML = words
      .map((word) => `<span class="${styles.word}">${word}</span>`)
      .join(" ");

    const spans = el.querySelectorAll(`.${styles.word}`);
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        spans.forEach((span, i) => {
          setTimeout(() => {
            span.classList.add(styles.visible);
          }, i * 40);
        });
        observer.disconnect();
      },
      { threshold: 0.4, rootMargin: "-10% 0px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [text]);

  return <p ref={ref} className={styles.paragraph} />;
}

export function TextReveal() {
  return (
    <section className={`section ${styles.section}`}>
      <div className="container">
        <div className={styles.inner}>
          {paragraphs.map((text) => (
            <RevealParagraph key={text.slice(0, 32)} text={text} />
          ))}
        </div>
      </div>
    </section>
  );
}
