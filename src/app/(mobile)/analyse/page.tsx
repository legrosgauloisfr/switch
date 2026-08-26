"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useRequireAge } from "@/hooks/useGuard";
import { useUserStore } from "@/store/useAppStore";

export default function AnalysePage() {
  useRequireAge();
  const router = useRouter();
  const completeOnboarding = useUserStore((s) => s.completeOnboarding);

  useEffect(() => {
    completeOnboarding();
    const t = setTimeout(() => router.replace("/recommendations"), 2400);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-[26px] px-10 anim-scIn">
      <div className="relative w-[84px] h-[84px] flex items-center justify-center">
        <div className="absolute inset-0 rounded-full bg-primary-tint-2 anim-breathe" />
        <div className="relative w-[22px] h-[22px] rounded-full bg-primary" />
      </div>
      <div className="text-center">
        <div className="text-[20px] font-bold">Nous préparons votre sélection</div>
        <p className="mt-2 text-[14px] leading-relaxed text-ink-secondary">
          Nous croisons vos réponses avec les caractéristiques du matériel disponible.
        </p>
      </div>
      <div className="w-40 h-[3px] rounded-full bg-black/[0.08] overflow-hidden relative">
        <div className="absolute inset-y-0 w-2/5 rounded-full bg-primary anim-sweep" />
      </div>
    </div>
  );
}
