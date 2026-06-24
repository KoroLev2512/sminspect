import Image from "next/image";
import Link from "next/link";
import styles from "./Hero.module.css";

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
        <Image
          src="/hero.png"
          alt="Дорога и мост — инфраструктура под контролем SmartInspect"
          fill
          priority
          className={styles.heroImage}
          sizes="100vw"
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
              src="/hero.png"
              alt="Инспекция дорожной инфраструктуры"
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
