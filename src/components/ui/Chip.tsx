"use client";

interface Props {
  label: string;
  selected: boolean;
  onClick: () => void;
  animClass?: string;
  delay?: string;
}

export default function Chip({ label, selected, onClick, animClass, delay }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={delay ? { animationDelay: delay } : undefined}
      className={`px-[18px] py-[13px] rounded-full text-[14.5px] font-semibold transition-colors ${animClass ?? ""} ${
        selected
          ? "bg-primary border border-primary text-white"
          : "bg-surface border border-border-strong text-ink hover:border-primary/50"
      }`}
    >
      {label}
    </button>
  );
}
