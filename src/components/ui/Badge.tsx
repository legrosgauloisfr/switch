export default function Badge({
  label,
  tone = "primary",
}: {
  label: string;
  tone?: "primary" | "neutral";
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-[10px] font-extrabold tracking-wider ${
        tone === "primary" ? "bg-primary-tint text-primary-hover" : "bg-black/[0.045] text-ink-secondary"
      }`}
    >
      {label}
    </span>
  );
}
