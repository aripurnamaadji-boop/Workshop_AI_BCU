import styles from "./FunnelInsight.module.css";

export type FunnelStage = {
  value: string;
  caption: string;
  pctOfPrev?: string;
};

export type BreakdownSegment = {
  label: string;
  value: number;
  pct: number;
  color: string;
  highlight?: boolean;
};

export default function FunnelInsight({
  headline,
  subtitle,
  stages,
  breakdownTitle,
  breakdown,
}: {
  headline: string;
  subtitle: string;
  stages: FunnelStage[];
  breakdownTitle: string;
  breakdown: BreakdownSegment[];
}) {
  return (
    <div className={styles.wrap}>
      <div className={styles.headline}>{headline}</div>
      <div className={styles.subtitle}>{subtitle}</div>

      <div className={styles.funnelRow}>
        {stages.map((s, i) => (
          <div key={i} className={styles.stageGroup}>
            {i > 0 && (
              <div className={styles.arrow}>
                {s.pctOfPrev && <span className={styles.arrowPct}>{s.pctOfPrev}</span>}
                <svg width="26" height="14" viewBox="0 0 26 14" fill="none" stroke="#a3aba6" strokeWidth="1.6">
                  <path d="M1 7h22m0 0-6-6m6 6-6 6" />
                </svg>
              </div>
            )}
            <div className={styles.stage}>
              <div className={styles.stageValue}>{s.value}</div>
              <div className={styles.stageCaption}>{s.caption}</div>
            </div>
          </div>
        ))}
      </div>

      {breakdown.length > 0 && (
        <div className={styles.breakdown}>
          <div className={styles.breakdownTitle}>{breakdownTitle}</div>
          <div className={styles.calloutRow}>
            {breakdown.map((b) => (
              <div key={b.label} className={styles.calloutCell} style={{ flexGrow: Math.max(b.value, 0.001) }}>
                {b.highlight && (
                  <div className={styles.callout}>
                    <span className={styles.calloutPct}>{b.pct}%</span>
                    <span className={styles.calloutLabel}>{b.label}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className={styles.stackBar}>
            {breakdown.map((b) => (
              <div
                key={b.label}
                className={`${styles.segment} ${b.highlight ? styles.segmentHighlight : ""}`}
                style={{ flexGrow: Math.max(b.value, 0.001), background: b.color }}
                title={`${b.label}: ${b.pct}%`}
              />
            ))}
          </div>
          <div className={styles.legendRow}>
            {breakdown.map((b) => (
              <span key={b.label} className={styles.legendItem}>
                <span className={styles.legendSwatch} style={{ background: b.color }} />
                {b.label} <strong>{b.pct}%</strong>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
