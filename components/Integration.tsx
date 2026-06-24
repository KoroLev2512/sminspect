import styles from "./Integration.module.css";

const integrations = [
  { name: "Дроны", desc: "DJI и совместимые платформы для аэрофотосъёмки" },
  { name: "Мобильные камеры", desc: "Смартфоны и планшеты инспекторов в поле" },
  { name: "Сенсоры", desc: "Стационарные датчики вибрации и деформации" },
  { name: "ГИС / УДС", desc: "Интеграция с системами управления дорожным движением" },
  { name: "Облако", desc: "Отечественные облачные сервисы для хранения данных" },
  { name: "API", desc: "Открытый API для встраивания в корпоративные системы" },
];

const flow = ["Сбор данных", "Облачная обработка", "AI-анализ", "Отчёт и карта"];

export function Integration() {
  return (
    <section className="section">
      <hr className="sectionDivider" />
      <div className="container">
        <p className="eyebrow">Интеграция</p>
        <h2 className="headingLg">
          Прямая интеграция
          <br />с вашей инфраструктурой
        </h2>
        <p className="bodyMuted">
          SmartInspect работает с существующими системами мониторинга и не
          требует замены оборудования.
        </p>

        <div className={styles.flow}>
          {flow.map((step, i) => (
            <div key={step} className={styles.flowItem}>
              <span className={styles.flowStep}>{step}</span>
              {i < flow.length - 1 && <span className={styles.flowArrow} aria-hidden>→</span>}
            </div>
          ))}
        </div>

        <div className={styles.grid}>
          {integrations.map((item) => (
            <div key={item.name} className={styles.item}>
              <h3 className={styles.itemName}>{item.name}</h3>
              <p className={styles.itemDesc}>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
