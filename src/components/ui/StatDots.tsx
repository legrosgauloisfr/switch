export default function StatDots({ value, max = 5 }: { value: number; max?: number }) {
  return (
    <span className="text-[13px] tracking-[2px] text-primary">
      {"●".repeat(Math.max(0, Math.min(max, value)))}
      <span className="text-[#D2D8DE]">{"○".repeat(Math.max(0, max - value))}</span>
    </span>
  );
}
