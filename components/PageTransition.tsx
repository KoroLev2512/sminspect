"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import styles from "./PageTransition.module.css";

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [progress, setProgress] = useState(false);

  useEffect(() => {
    setProgress(true);
    const timer = window.setTimeout(() => setProgress(false), 700);
    return () => window.clearTimeout(timer);
  }, [pathname]);

  return (
    <div className={styles.root}>
      <div
        className={`${styles.progress} ${progress ? styles.progressActive : ""}`}
        aria-hidden
      />
      <div key={pathname} className={styles.page}>
        {children}
      </div>
    </div>
  );
}
