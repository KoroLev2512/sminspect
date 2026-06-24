"use client";

import { Children, type CSSProperties, type ReactNode } from "react";
import styles from "./Stagger.module.css";

interface StaggerProps {
  children: ReactNode;
  className?: string;
}

export function Stagger({ children, className }: StaggerProps) {
  return (
    <div className={`${styles.stagger} ${className ?? ""}`}>
      {Children.toArray(children).map((child, index) => (
        <div
          key={index}
          className={styles.item}
          style={{ "--stagger-index": index } as CSSProperties}
        >
          {child}
        </div>
      ))}
    </div>
  );
}
