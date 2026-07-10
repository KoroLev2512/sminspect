"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { useAuth } from "./AuthProvider";
import { Icon, type IconName } from "./dash-icons";
import { dashboardStats } from "@/lib/dashboard";
import styles from "./Dashboard.module.css";

interface NavLink {
  href: string;
  label: string;
  icon: IconName;
}

const navLinks: NavLink[] = [
  { href: "/dashboard", label: "Обзор", icon: "overview" },
  { href: "/dashboard/map", label: "Карта", icon: "map" },
  { href: "/dashboard/objects", label: "Объекты", icon: "objects" },
  { href: "/dashboard/defects", label: "Дефекты", icon: "defects" },
  { href: "/dashboard/inspections", label: "Инспекции", icon: "inspections" },
  { href: "/dashboard/alerts", label: "Оповещения", icon: "alerts" },
  { href: "/dashboard/analytics", label: "Аналитика", icon: "analytics" },
  { href: "/dashboard/reports", label: "Отчёты", icon: "reports" },
  { href: "/dashboard/leads", label: "Заявки", icon: "leads" },
  { href: "/dashboard/settings", label: "Настройки", icon: "settings" },
];

const titles: Record<string, string> = {
  "/dashboard": "Обзор",
  "/dashboard/map": "Карта инфраструктуры",
  "/dashboard/objects": "Объекты",
  "/dashboard/defects": "Дефекты",
  "/dashboard/inspections": "Инспекции",
  "/dashboard/alerts": "Оповещения",
  "/dashboard/analytics": "Аналитика",
  "/dashboard/reports": "Отчёты",
  "/dashboard/leads": "Заявки на демо",
  "/dashboard/settings": "Настройки",
};

function initials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
}

function isActive(pathname: string, href: string) {
  if (href === "/dashboard") return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function DashboardShell({ children }: { children: ReactNode }) {
  const { user, status, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const stats = dashboardStats();

  useEffect(() => {
    if (status === "ready" && !user) router.replace("/login");
  }, [status, user, router]);

  if (status === "loading" || !user) {
    return (
      <div className={styles.loader}>
        <span className={styles.loaderBadge}>
          <span className={styles.loaderRing} />
          <Image
            src="/logo.png"
            alt=""
            width={36}
            height={36}
            className={styles.loaderLogo}
            priority
          />
        </span>
        <p className={styles.loaderText}>Загрузка личного кабинета…</p>
      </div>
    );
  }

  const title =
    titles[pathname] ??
    (pathname.startsWith("/dashboard/objects/") ? "Объект" : "Личный кабинет");

  return (
    <div className={styles.shell}>
      <aside className={`${styles.sidebar} ${menuOpen ? styles.sidebarOpen : ""}`}>
        <Link href="/dashboard" className={styles.sidebarBrand}>
          <span className={styles.brandMark}>
            <Image src="/logo.png" alt="" width={28} height={28} priority />
          </span>
          SmartInspect
        </Link>

        <nav className={styles.sidebarNav} aria-label="Навигация личного кабинета">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className={`${styles.navItem} ${isActive(pathname, link.href) ? styles.navItemActive : ""}`}
            >
              <Icon name={link.icon} size={18} />
              <span className={styles.navLabel}>{link.label}</span>
              {link.href === "/dashboard/alerts" && stats.unreadAlerts > 0 && (
                <span className={styles.navBadge}>{stats.unreadAlerts}</span>
              )}
            </Link>
          ))}
        </nav>

        <div className={styles.sidebarFooter}>
          <Link href="/dashboard/settings" className={styles.userChip}>
            <span className={styles.avatar}>{initials(user.name)}</span>
            <span className={styles.userChipMeta}>
              <span className={styles.userChipName}>{user.name}</span>
              <span className={styles.userChipRole}>{user.company}</span>
            </span>
          </Link>
          <button type="button" className={styles.logoutBtn} onClick={logout}>
            <Icon name="logout" size={18} />
            Выйти
          </button>
        </div>
      </aside>

      <div
        className={`${styles.backdrop} ${menuOpen ? styles.backdropShow : ""}`}
        onClick={() => setMenuOpen(false)}
        aria-hidden
      />

      <div className={styles.content}>
        <header className={styles.topbar}>
          <button
            type="button"
            className={styles.menuToggle}
            aria-label="Открыть меню"
            onClick={() => setMenuOpen(true)}
          >
            <Icon name="menu" size={22} />
          </button>
          <h1 className={styles.topbarTitle}>{title}</h1>
          <div className={styles.topbarActions}>
            <Link href="/dashboard/alerts" className={styles.iconBtn} aria-label="Оповещения">
              <Icon name="bell" size={20} />
              {stats.unreadAlerts > 0 && <span className={styles.iconBtnDot} />}
            </Link>
            <Link href="/" className={styles.iconBtn} aria-label="На сайт">
              <Icon name="home" size={20} />
            </Link>
          </div>
        </header>

        {children}
      </div>
    </div>
  );
}
