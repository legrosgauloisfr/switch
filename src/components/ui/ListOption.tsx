"use client";

interface Props {
  label: string;
  selected: boolean;
  onClick: () => void;
  animClass?: string;
  delay?: string;
}

export default function ListOption({ label, selected, onClick, animClass, delay }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={delay ? { animationDelay: delay } : undefined}
      className={`w-full flex items-center gap-3.5 text-left px-[18px] py-[17px] rounded-2xl bg-surface transition-colors ${animClass ?? ""} ${
        selected
          ? "border-[1.5px] border-primary shadow-[0_6px_18px_rgba(27,58,92,0.12)]"
          : "border-[1.5px] border-border hover:border-primary/35"
      }`}
    >
      <div
        className={`flex-none w-[22px] h-[22px] rounded-full flex items-center justify-center text-[12px] ${
          selected ? "bg-primary text-white" : "border-[1.5px] border-black/16"
        }`}
      >
        {selected ? "✓" : ""}
      </div>
      <div className="flex-1 text-[15.5px] font-semibold text-ink">{label}</div>
    </button>
  );
}
