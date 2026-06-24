"use client";

import Image from "next/image";
import Link from "next/link";
import styles from "./Hero.module.css";

const HERO_VIDEO =
  "https://videos.pexels.com/video-files/2809983/2809983-sd_960_540_24fps.mp4";
const HERO_POSTER =
  "https://images.unsplash.com/photo-1545558014-8692077e9b5c?auto=format&fit=crop&w=2400&q=80";

const stats = [
  { label: "Точность детекции", value: "до 95%" },
  { label: "Время анализа", value: "< 30 сек" },
  { label: "Типы дефектов", value: "12+" },
  { label: "Экономия на инспекциях", value: "до 60%" },
];

export function Hero() {
  return (
    <section className={styles.hero} aria-label="Главный экран">
      <div className={styles.media}>
        <video
          className={styles.video}
          autoPlay
          muted
          loop
          playsInline
          poster={HERO_POSTER}
          aria-label="Видео: инспекция дорожной инфраструктуры с воздуха"
        >
          <source src={HERO_VIDEO} type="video/mp4" />
        </video>
        <Image
          src={HERO_POSTER}
          alt=""
          fill
          priority
          className={styles.poster}
          sizes="100vw"
          aria-hidden
        />
        <div className={styles.overlay} />
      </div>

      <div className={`container ${styles.content}`}>
        <div className={styles.copy}>
          <h1 className={styles.title}>
            Дороги и мосты
            <br />
            под постоянным
            <br />
            контролем.
          </h1>
          <p className={styles.subtitle}>
            Облачная платформа для автоматизированной диагностики дефектов с
            компьютерным зрением и прогнозированием износа.
          </p>
        </div>

        <article className={styles.card}>
          <div className={styles.cardImage}>
            <Image
              src="https://images.unsplash.com/photo-1473968512647-3e447244af8f?auto=format&fit=crop&w=800&q=80"
              alt="Дрон над дорожной инфраструктурой"
              fill
              className={styles.image}
              sizes="360px"
            />
          </div>
          <div className={styles.cardBody}>
            <p className="eyebrow">Инспекция</p>
            <Link href="/platform" className={styles.cardLink}>
              Посмотреть платформу
            </Link>
            <Link
              href="/platform"
              className="btnCircle"
              aria-label="Посмотреть платформу"
            >
              →
            </Link>
          </div>
        </article>
      </div>

      <div className={styles.statsBar}>
        <div className={`container ${styles.statsInner}`}>
          {stats.map((stat, i) => (
            <div key={stat.label} className={styles.stat}>
              {i > 0 && <span className={styles.statDivider} aria-hidden />}
              <span className={styles.statLabel}>{stat.label}</span>
              <span className={styles.statValue}>{stat.value}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
