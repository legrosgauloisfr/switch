export function GroupedList({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-[20px] bg-surface border border-border overflow-hidden divide-y divide-border">
      {children}
    </div>
  );
}

export function GroupedRow({
  label,
  value,
  delay,
}: {
  label: string;
  value: string;
  delay?: string;
}) {
  return (
    <div
      className="flex items-baseline justify-between gap-4 px-[18px] py-4 bg-surface anim-revealUp"
      style={delay ? { animationDelay: delay } : undefined}
    >
      <div className="text-[13px] font-semibold text-ink-tertiary">{label}</div>
      <div className="text-[15px] font-bold text-ink text-right">{value}</div>
    </div>
  );
}
