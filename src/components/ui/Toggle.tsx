"use client";

export default function Toggle({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={(e) => {
        e.stopPropagation();
        onChange();
      }}
      className="flex-none w-[46px] h-7 rounded-full p-[3px] box-border transition-colors"
      style={{ background: checked ? "var(--primary)" : "rgba(22,25,26,.14)" }}
    >
      <div
        className="w-[22px] h-[22px] rounded-full bg-white shadow-[0_1px_3px_rgba(0,0,0,0.2)] transition-transform"
        style={{ transform: checked ? "translateX(18px)" : "translateX(0)" }}
      />
    </button>
  );
}
