import styles from "./KpiCard.module.css";

type Props = {
  label: string;
  value: string;
  unit: string;
  delta: string;
  note: string;
  deltaColor: string;
  bar?: number;
  onClick?: () => void;
};

export default function KpiCard({ label, value, unit, delta, note, deltaColor, bar, onClick }: Props) {
  return (
    <div className={`${styles.card} ${onClick ? styles.clickable : ""}`} onClick={onClick}>
      <div className={styles.label}>{label}</div>
      <div className={styles.valueRow}>
        <span className={`${styles.value} tabular`}>{value}</span>
        <span className={styles.unit}>{unit}</span>
      </div>
      {bar !== undefined ? (
        <>
          <div className={styles.deltaRow}>
            <span className={styles.delta} style={{ color: deltaColor }}>
              {delta}
            </span>
            <span className={styles.note}>{note}</span>
          </div>
          <div className={styles.bar}>
            <div className={styles.barFill} style={{ background: deltaColor, width: `${bar}%` }} />
          </div>
        </>
      ) : (
        <div className={styles.deltaInline}>
          <strong style={{ color: deltaColor }}>{delta}</strong> {note}
        </div>
      )}
    </div>
  );
}
