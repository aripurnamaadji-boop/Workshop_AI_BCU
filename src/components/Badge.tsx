export default function Badge({ label, bg, fg }: { label: string; bg: string; fg: string }) {
  return (
    <span
      style={{
        display: "inline-block",
        font: "600 10.5px 'Source Sans 3',sans-serif",
        padding: "3px 9px",
        borderRadius: "11px",
        background: bg,
        color: fg,
      }}
    >
      {label}
    </span>
  );
}
