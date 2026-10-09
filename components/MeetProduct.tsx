"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { platformModules } from "@/lib/platform";
import styles from "./MeetProduct.module.css";

const gallery = [
  "/images/compare-ai.jpg",
  "/images/meet-product-2.jpg",
  "/images/meet-product-3.jpg",
];

export function MeetProduct() {
  const [active, setActive] = useState(platformModules[0]);

  return (
    <section id="platform" className="section">
      <div className="container">
        <div className={styles.grid}>
          <div className={styles.gallery}>
            <div className={styles.featureImage}>
              <Image
                src={active.image}
                alt={active.alt}
                fill
                className={styles.image}
                sizes="(max-width: 1024px) 100vw, 40vw"
              />
            </div>
            <div className={styles.thumbs}>
              {gallery.map((src, i) => (
                <div key={src} className={styles.thumb}>
                  <Image
                    src={src}
                    alt={`Инспекция инфраструктуры ${i + 1}`}
                    fill
                    className={styles.image}
                    sizes="180px"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className={styles.copy}>
            <p className="eyebrow">Платформа</p>
            <h2 className="headingLg">Знакомьтесь с SmartInspect</h2>
            <p className="bodyMuted">
              Интеллектуальная система для автоматизированной диагностики
              дорожного покрытия и мостовых конструкций.
            </p>

            <div className={styles.modules} role="tablist" aria-label="Модули платформы">
              {platformModules.map((mod) => (
                <button
                  key={mod.id}
                  type="button"
                  role="tab"
                  aria-selected={active.id === mod.id}
                  className={`${styles.moduleTab} ${active.id === mod.id ? styles.moduleTabActive : ""}`}
                  onClick={() => setActive(mod)}
                >
                  {mod.name}
                </button>
              ))}
            </div>

            <div className={styles.moduleContent}>
              <h3 className={styles.moduleTitle}>{active.title}</h3>
              <p className={styles.moduleDesc}>{active.description}</p>
              <Link href="/platform" className={styles.moreLink}>
                Все модули платформы →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
