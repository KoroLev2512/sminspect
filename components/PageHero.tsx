import styles from "./PageHero.module.css";

interface PageHeroProps {
  eyebrow: string;
  title: string;
  description?: string;
  dark?: boolean;
}

export function PageHero({ eyebrow, title, description, dark }: PageHeroProps) {
  return (
    <section className={`${styles.hero} ${dark ? styles.heroDark : ""}`}>
      <div className="container">
        <p className="eyebrow">{eyebrow}</p>
        <h1 className={styles.title}>{title}</h1>
        {description && <p className={styles.desc}>{description}</p>}
      </div>
    </section>
  );
}
