import styles from "./EmptyModule.module.css";

export default function EmptyModule({ title }: { title: string }) {
  return (
    <div className={styles.page}>
      <div className={styles.box}>
        <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#c3cbc6" strokeWidth="1.3" style={{ marginBottom: 14 }}>
          <rect x="3" y="4" width="18" height="16" rx="2" />
          <path d="M3 9h18M8 13h5M8 16h8" />
        </svg>
        <div className={styles.title}>{title} belum di-mockup</div>
        <div className={styles.body}>
          Modul ini ada di PRD dan sudah punya slot di navigasi, tapi belum masuk cakupan sesi desain ini. Struktur
          layarnya akan mengikuti pola yang sama: baris KPI, panel analitik, lalu tabel drill-down.
        </div>
        <button className={styles.cta}>Minta mockup modul ini</button>
      </div>
    </div>
  );
}
