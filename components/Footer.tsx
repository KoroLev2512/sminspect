import Link from "next/link";
import { Logo } from "@/components/Logo";
import styles from "./Footer.module.css";

const columns = [
  {
    title: "Платформа",
    links: [
      { label: "Обзор", href: "/platform" },
      { label: "Vision AI", href: "/platform#vision" },
      { label: "Predict", href: "/platform#predict" },
      { label: "Map", href: "/platform#map" },
      { label: "Alert", href: "/platform#alert" },
    ],
  },
  {
    title: "Решения",
    links: [
      { label: "Муниципалитеты", href: "/solutions/municipalities" },
      { label: "Дорожные компании", href: "/solutions/construction" },
      { label: "Логистика", href: "/solutions/logistics" },
      { label: "Страхование", href: "/solutions/insurance" },
    ],
  },
  {
    title: "Компания",
    links: [
      { label: "О нас", href: "/#company" },
      { label: "Безопасность", href: "/#safety" },
      { label: "Демо", href: "/demo" },
      { label: "Контакты", href: "/demo" },
    ],
  },
];

export function Footer() {
  return (
    <footer id="company" className={styles.footer}>
      <div className="container">
        <div className={styles.grid}>
          {columns.map((col) => (
            <div key={col.title}>
              <h3 className={styles.colTitle}>{col.title}</h3>
              <ul className={styles.links}>
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href}>{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div className={styles.brand}>
            <Logo size={28} className={styles.brandLogo} />
            <p className={styles.tagline}>Инфраструктура под контролем.</p>
          </div>
        </div>

        <div className={styles.legal}>
          <p>© {new Date().getFullYear()} SmartInspect. Все права защищены.</p>
          <div className={styles.legalLinks}>
            <Link href="/privacy">Политика конфиденциальности</Link>
            <a href="#">Условия использования</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
