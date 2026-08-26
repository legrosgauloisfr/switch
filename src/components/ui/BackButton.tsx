"use client";

import { useRouter } from "next/navigation";

export default function BackButton({ onClick, className = "" }: { onClick?: () => void; className?: string }) {
  const router = useRouter();
  return (
    <button
      type="button"
      onClick={onClick ?? (() => router.back())}
      aria-label="Retour"
      className={`w-[34px] h-[34px] rounded-full bg-black/[0.05] text-ink-secondary text-[16px] flex items-center justify-center hover:bg-black/[0.1] transition-colors ${className}`}
    >
      ‹
    </button>
  );
}
