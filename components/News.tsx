import styles from "./News.module.css";

const articles = [
  {
    tag: "Progress",
    date: "Март 2025",
    title: "Пилот SmartInspect: автоматическая диагностика мостов в Ленобласти",
  },
  {
    tag: "Company News",
    date: "Февраль 2025",
    title: "Как ИИ находит коррозию опор быстрее ручного осмотра",
  },
  {
    tag: "Progress",
    date: "Январь 2025",
    title: "Цифровизация дорожного хозяйства: тренды 2025 года",
  },
  {
    tag: "Company News",
    date: "Декабрь 2024",
    title: "SmartInspect и ИТМО: совместная разработка алгоритмов CV",
  },
];

export function News() {
  return (
    <section id="news" className="section">
      <hr className="sectionDivider" />
      <div className="container">
        <div className={styles.header}>
          <div>
            <p className="eyebrow">Новости</p>
            <h2 className="headingLg">
              Истории
              <br />с дорог
            </h2>
          </div>
          <a href="#" className="btnGhost">
            Все новости →
          </a>
        </div>

        <div className={styles.grid}>
          {articles.map((article) => (
            <article key={article.title} className={styles.card}>
              <div className={styles.cardMeta}>
                <span className={styles.tag}>{article.tag}</span>
                <time>{article.date}</time>
              </div>
              <h3 className={styles.cardTitle}>
                <a href="#">{article.title}</a>
              </h3>
              <a href="#" className="btnCircle" aria-label={`Читать: ${article.title}`}>
                →
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
