"use client";

import { usePathname } from "next/navigation";
import styles from "./PageTransition.module.css";

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // The dashboard and auth screens use fixed-positioned layout (sidebar,
  // full-height panels). The page-enter animation keeps a `transform` on the
  // wrapper, which would turn it into the containing block for those fixed
  // elements — so render them without the animated wrapper.
  const bare =
    pathname.startsWith("/dashboard") ||
    pathname === "/login" ||
    pathname === "/register";

  if (bare) {
    return <>{children}</>;
  }

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
