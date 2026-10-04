import Image from "next/image";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import { platformModules } from "@/lib/platform";
import { siteConfig } from "@/lib/site";
import styles from "./Footer.module.css";

const columns = [
  {
    title: "Платформа",
    links: [
      { label: "Обзор", href: "/platform" },
      ...platformModules.map((mod) => ({
        label: mod.name,
        href: `/platform#${mod.id}`,
      })),
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
      { label: "Новости", href: "/news" },
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
            <p className={styles.tagline}>Инфраструктура под контролем</p>
            <p className={styles.credit}>
              Дизайн и разработка{" "}
              <a
                href="https://dev-by-yurii.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
              >
                dev-by-yurii
              </a>
            </p>
          </div>
        </div>

        <div className={styles.grantSection}>
          <div className={styles.grantLogos}>
            <Image
              src="/icons/footer/fasie.svg"
              alt="Фонд содействия инновациям"
              width={93}
              height={48}
              className={styles.grantLogo}
              priority={false}
            />
            <Image
              src="/icons/footer/univertechpred.svg"
              alt="Платформа университетского технологического предпринимательства"
              width={64}
              height={48}
              className={styles.grantLogo}
              priority={false}
            />
          </div>
          <p className={styles.grantText}>
            {siteConfig.grantSupport}
          </p>
        </div>

        <div className={styles.requisites}>
          <p className={styles.requisitesTitle}>Реквизиты владельца сайта и Оператора:</p>
          <p>
            {siteConfig.operatorDetails.fullName} | ИНН: {siteConfig.operatorDetails.inn} | КПП: {siteConfig.operatorDetails.kpp} | ОГРН: {siteConfig.operatorDetails.ogrn} | ОКПО: {siteConfig.operatorDetails.okpo}
          </p>
          <p>
            {siteConfig.operatorDetails.ceoTitle}: {siteConfig.operatorDetails.ceo}
          </p>
          <p>
            Адрес местонахождения: {siteConfig.operatorDetails.legalAddress}
          </p>
        </div>

        <div className={styles.legal}>
          <p>© {new Date().getFullYear()} SmartInspect. Все права защищены.</p>
          <div className={styles.legalLinks}>
            <Link href="/privacy">Политика конфиденциальности</Link>
            <Link href="/terms">Условия использования</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
