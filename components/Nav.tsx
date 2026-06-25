"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
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
  const [menuPath, setMenuPath] = useState<string | null>(null);
  const menuOpen = menuPath === pathname;

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setMenuPath(null);
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  function closeMenu() {
    setMenuPath(null);
  }

  function toggleMenu() {
    setMenuPath(menuOpen ? null : pathname);
  }

  return (
    <header className={styles.header}>
      <div className={`container ${styles.inner}`}>
        <Logo size={32} className={styles.logo} />

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

        <div className={styles.actions}>
          <Link href="/demo" className={`btnPrimary ${styles.desktopCta}`}>
            Запросить демо
          </Link>
          <button
            type="button"
            className={styles.menuBtn}
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            aria-label={menuOpen ? "Закрыть меню" : "Открыть меню"}
            onClick={toggleMenu}
          >
            <span className={styles.menuIcon} data-open={menuOpen} aria-hidden />
          </button>
        </div>
      </div>

      <button
        type="button"
        className={`${styles.overlay} ${menuOpen ? styles.overlayOpen : ""}`}
        aria-label="Закрыть меню"
        tabIndex={menuOpen ? 0 : -1}
        onClick={closeMenu}
      />

      <nav
        id="mobile-nav"
        className={`${styles.mobileNav} ${menuOpen ? styles.mobileNavOpen : ""}`}
        aria-label="Мобильная навигация"
        aria-hidden={!menuOpen}
      >
        <div className={styles.mobileNavHeader}>
          <button
            type="button"
            className={styles.closeBtn}
            aria-label="Закрыть меню"
            onClick={closeMenu}
            tabIndex={menuOpen ? 0 : -1}
          >
            <span className={styles.closeIcon} aria-hidden />
          </button>
        </div>
        <div className={styles.mobileLinks}>
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`${styles.mobileLink} ${isActive(pathname, link.href) ? styles.mobileLinkActive : ""}`}
              onClick={closeMenu}
              tabIndex={menuOpen ? 0 : -1}
            >
              {link.label}
            </Link>
          ))}
        </div>
        <Link
          href="/demo"
          className={`btnPrimary ${styles.mobileCta}`}
          onClick={closeMenu}
          tabIndex={menuOpen ? 0 : -1}
        >
          Запросить демо
        </Link>
      </nav>
    </header>
  );
}
