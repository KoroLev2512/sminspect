import Image from "next/image";
import Link from "next/link";
import styles from "./Logo.module.css";

interface LogoProps {
  size?: number;
  showText?: boolean;
  className?: string;
}

export function Logo({ size = 32, showText = true, className }: LogoProps) {
  return (
    <Link href="/" className={`${styles.logo} ${className ?? ""}`}>
      <Image
        src="/logo.png"
        alt="SmartInspect"
        width={size}
        height={size}
        style={{ width: `${size}px`, height: `${size}px`, objectFit: "contain" }}
        className={styles.mark}
        priority
      />
      {showText && <span className={styles.text}>SmartInspect</span>}
    </Link>
  );
}
