import Link from "next/link";
import styles from "./FinalCTA.module.css";

export function FinalCTA() {
  return (
    <section id="demo" className={styles.section}>
      <div className="container">
        <div className={styles.inner}>
          <h2 className={styles.title}>
            Ваша инфраструктура.
            <br />
            Полностью под контролем.
          </h2>
          <p className={styles.desc}>
            Запросите демонстрацию платформы и узнайте, как SmartInspect снизит
            затраты на инспекции и повысит безопасность дорог в вашем регионе.
          </p>
          <div className={styles.actions}>
            <Link href="/demo" className="btnPrimary">
              Запросить демо →
            </Link>
            <Link href="/platform" className="btnGhost">
              Смотреть платформу
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
