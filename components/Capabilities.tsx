import Link from "next/link";
import styles from "./Capabilities.module.css";

const items = [
  {
    tag: "Детекция",
    title: "Трещина на асфальте в условиях низкой освещённости",
    description:
      "Алгоритмы выявляют дефекты на ночных снимках и в плохую погоду — там, где человеческий глаз часто ошибается.",
  },
  {
    tag: "Планирование",
    title: "Приоритизация участков для ремонта",
    description:
      "Система ранжирует объекты по критичности и прогнозирует развитие повреждений, помогая распределять бюджет.",
  },
  {
    tag: "Мониторинг",
    title: "Динамика износа мостовых опор",
    description:
      "Сравнение данных инспекций во времени выявляет ускоренную деградацию конструкций до наступления аварии.",
  },
  {
    tag: "Отчётность",
    title: "Автогенерация отчётов для заказчика",
    description:
      "Стандартизированные отчёты с фотофиксацией, координатами и рекомендациями — готовы к передаче в ведомство.",
  },
];

export function Capabilities() {
  return (
    <section className="section">
      <hr className="sectionDivider" />
      <div className="container">
        <p className="eyebrow">Возможности</p>
        <h2 className="headingLg">
          Сверхчеловеческая
          <br />
          точность диагностики.
        </h2>

        <div className={styles.grid}>
          {items.map((item) => (
            <article key={item.title} className={styles.card}>
              <div className={styles.cardTop}>
                <span className={styles.tag}>{item.tag}</span>
                <Link href="/demo" className="btnCircle" aria-label={`Подробнее: ${item.title}`}>
                  →
                </Link>
              </div>
              <h3 className={styles.cardTitle}>{item.title}</h3>
              <p className={styles.cardDesc}>{item.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
