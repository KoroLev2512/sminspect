import Image from "next/image";
import styles from "./Comparison.module.css";

export function Comparison() {
  return (
    <section id="safety" className="section">
      <hr className="sectionDivider" />
      <div className="container">
        <div className="gradientAccent" />
        <p className="eyebrow">Преимущество</p>
        <h2 className="headingLg">48 часов экономии на каждой инспекции</h2>
        <p className="bodyMuted">
          Ручная инспекция моста занимает дни. SmartInspect анализирует тот же
          объём за часы и фиксирует дефекты, которые легко пропустить при
          визуальном осмотре.
        </p>

        <div className={styles.compare}>
          <div className={styles.panel}>
            <span className={styles.panelLabel}>Ручной осмотр</span>
            <div className={styles.panelImage}>
              <Image
                src="https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=900&q=80"
                alt="Ручной осмотр дорожного покрытия"
                fill
                className={styles.image}
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className={styles.panelOverlay} />
            </div>
            <ul className={styles.list}>
              <li>2–5 дней на объект</li>
              <li>Субъективная оценка</li>
              <li>Риск пропуска дефектов</li>
            </ul>
          </div>

          <div className={`${styles.panel} ${styles.panelActive}`}>
            <span className={styles.panelLabel}>SmartInspect</span>
            <div className={styles.panelImage}>
              <Image
                src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=900&q=80"
                alt="AI-анализ дефектов инфраструктуры"
                fill
                className={styles.image}
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className={styles.aiOverlay}>
                <span className={styles.bbox}>Трещина · 94%</span>
                <span className={styles.bbox2}>Выбоина · 87%</span>
              </div>
            </div>
            <ul className={styles.list}>
              <li>Анализ за часы</li>
              <li>Объективные данные</li>
              <li>Прогноз развития дефектов</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
