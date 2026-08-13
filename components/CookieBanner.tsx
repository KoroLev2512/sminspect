"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { useCookieConsent } from "./AnalyticsProvider";
import styles from "./CookieBanner.module.css";

const mountedSubscribe = () => () => {};
const getMounted = () => true;
const getServerMounted = () => false;

export function CookieBanner() {
  const { consent, acceptAll, acceptNecessary } = useCookieConsent();
  const mounted = useSyncExternalStore(mountedSubscribe, getMounted, getServerMounted);

  if (!mounted || consent !== null) {
    return null;
  }

  return (
    <div
      className={styles.banner}
      role="dialog"
      aria-live="polite"
      aria-label="Уведомление о файлах cookie"
    >
      <div className={styles.container}>
        <div className={styles.content}>
          <p className={styles.title}>Мы используем файлы cookie</p>
          <p className={styles.desc}>
            Наш сайт использует файлы cookie для обеспечения своей работы, сбора обезличенной аналитики и
            улучшения пользовательского опыта. Подробнее в нашей{" "}
            <Link href="/privacy#cookies" className={styles.link}>
              Политике конфиденциальности
            </Link>.
          </p>
        </div>
        <div className={styles.actions}>
          <button type="button" className={styles.btnSecondary} onClick={acceptNecessary}>
            Только необходимые
          </button>
          <button type="button" className={styles.btnPrimary} onClick={acceptAll}>
            Принять все
          </button>
        </div>
      </div>
    </div>
  );
}
