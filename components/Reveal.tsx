"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import styles from "./Reveal.module.css";

interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  threshold?: number;
}

export function Reveal({
  children,
  className,
  delay = 0,
  threshold = 0.12,
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setVisible(true);
        observer.disconnect();
      },
      { threshold, rootMargin: "0px 0px -8% 0px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return (
    <div
      ref={ref}
      className={`${styles.reveal} ${visible ? styles.visible : ""} ${className ?? ""}`}
      style={{ "--reveal-delay": `${delay}ms` } as CSSProperties}
    >
      {children}
    </div>
  );
}
