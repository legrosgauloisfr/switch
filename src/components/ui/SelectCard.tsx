"use client";

interface Props {
  label: string;
  desc?: string;
  gaugeWidth?: string;
  gaugeHeight?: string;
  selected: boolean;
  onClick: () => void;
  animClass?: string;
  delay?: string;
}

export default function SelectCard({
  label,
  desc,
  gaugeWidth = "20px",
  gaugeHeight = "30px",
  selected,
  onClick,
  animClass,
  delay,
}: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={delay ? { animationDelay: delay } : undefined}
      className={`w-full flex items-center gap-4 text-left p-[18px] rounded-[20px] bg-surface transition-colors ${animClass ?? ""} ${
        selected
          ? "border-[1.5px] border-primary shadow-[0_6px_18px_rgba(27,58,92,0.12)]"
          : "border-[1.5px] border-border hover:border-primary/35"
      }`}
    >
      <div className="flex-none w-11 flex items-end justify-center h-[52px]">
        <div
          style={{ width: gaugeWidth, height: gaugeHeight }}
          className={`rounded-lg ${selected ? "bg-primary" : "bg-[#C6CFD9]"}`}
        />
      </div>
      <div className="flex-1">
        <div className="text-[16px] font-bold text-ink">{label}</div>
        {desc && <div className="mt-0.5 text-[13.5px] leading-snug text-ink-secondary">{desc}</div>}
      </div>
      <div
        className={`flex-none w-[22px] h-[22px] rounded-full flex items-center justify-center text-[12px] ${
          selected ? "bg-primary text-white" : "border-[1.5px] border-black/14"
        }`}
      >
        {selected ? "✓" : ""}
      </div>
    </button>
  );
}
