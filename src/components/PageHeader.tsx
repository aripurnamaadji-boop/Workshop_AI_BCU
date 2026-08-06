import type { ReactNode } from "react";
import styles from "./PageHeader.module.css";

export default function PageHeader({
  title,
  subtitle,
  pillLabel = "FILTER AKTIF",
  pills,
}: {
  title: ReactNode;
  subtitle: string;
  pillLabel?: string;
  pills: string[];
}) {
  return (
    <div className={styles.header}>
      <div>
        <div className={styles.title}>{title}</div>
        <div className={styles.subtitle}>{subtitle}</div>
      </div>
      <div className={styles.pills}>
        <span className={styles.pillLabel}>{pillLabel}</span>
        {pills.map((p) => (
          <span key={p} className={styles.pill}>
            {p}
          </span>
        ))}
      </div>
    </div>
  );
}
