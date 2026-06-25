"use client";

import { usePathname } from "next/navigation";
import styles from "./PageTransition.module.css";

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className={styles.root}>
      <div
        className={`${styles.progress} ${styles.progressActive}`}
        aria-hidden
      />
      <div key={pathname} className={styles.page}>
        {children}
      </div>
    </div>
  );
}
