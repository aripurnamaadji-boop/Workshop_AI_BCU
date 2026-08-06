import type { CSSProperties, ReactNode } from "react";
import styles from "./Card.module.css";

export default function Card({
  children,
  style,
  className,
}: {
  children: ReactNode;
  style?: CSSProperties;
  className?: string;
}) {
  return (
    <div className={`${styles.card} ${className ?? ""}`} style={style}>
      {children}
    </div>
  );
}
