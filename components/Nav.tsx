import Link from "next/link";
import { Logo } from "@/components/Logo";
import styles from "./Nav.module.css";

const links = [
  { href: "/platform", label: "Платформа" },
  { href: "/solutions", label: "Решения" },
  { href: "/#safety", label: "Безопасность" },
  { href: "/#company", label: "Компания" },
  { href: "/#news", label: "Новости" },
];

export function Nav() {
  return (
    <header className={styles.header}>
      <div className={`container ${styles.inner}`}>
        <Logo size={32} />
        <nav className={styles.nav} aria-label="Основная навигация">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className={styles.link}>
              {link.label}
            </Link>
          ))}
        </nav>
        <Link href="/demo" className="btnPrimary">
          Запросить демо
        </Link>
      </div>
    </header>
  );
}
