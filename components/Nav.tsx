"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/Logo";
import styles from "./Nav.module.css";

const links = [
  { href: "/platform", label: "Платформа" },
  { href: "/solutions", label: "Решения" },
  { href: "/#safety", label: "Безопасность" },
  { href: "/#company", label: "Компания" },
  { href: "/news", label: "Новости" },
];

function isActive(pathname: string, href: string) {
  if (href.includes("#")) {
    return false;
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Nav() {
  const pathname = usePathname();

  return (
    <header className={styles.header}>
      <div className={`container ${styles.inner}`}>
        <Logo size={32} />
        <nav className={styles.nav} aria-label="Основная навигация">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`${styles.link} ${isActive(pathname, link.href) ? styles.linkActive : ""}`}
            >
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
