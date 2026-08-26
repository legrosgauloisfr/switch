"use client";

import { useEffect, useState } from "react";
import { useRequireOnboarding } from "@/hooks/useGuard";
import { contentService } from "@/services";
import type { AdviceItem } from "@/types";
import BackButton from "@/components/ui/BackButton";

export default function AdvicePage() {
  useRequireOnboarding();
  const [items, setItems] = useState<AdviceItem[]>([]);

  useEffect(() => {
    let alive = true;
    contentService.advice().then((a) => alive && setItems(a));
    return () => {
      alive = false;
    };
  }, []);

  return (
    <div className="absolute inset-0 flex flex-col anim-scIn">
      <div className="flex-1 overflow-y-auto px-[22px] pt-[62px] pb-10">
        <BackButton />
        <h1 className="mt-[18px] px-1 text-[25px] font-bold">Conseils du jour</h1>
        <div className="mt-5 p-[22px] rounded-[22px] bg-primary-dark text-primary-dark-ink">
          <div className="text-[10.5px] font-extrabold tracking-[0.14em] text-white/60">
            AUJOURD&apos;HUI
          </div>
          <p className="mt-3 text-[18px] font-semibold leading-relaxed text-pretty">
            Comprendre vos habitudes peut vous aider à identifier les moments où l&apos;envie
            de fumer est la plus forte.
          </p>
        </div>
        <div className="mt-5 flex flex-col gap-2.5">
          {items.map((c) => (
            <div key={c.id} className="p-[18px] rounded-[18px] bg-surface border border-border">
              <div className="text-[11px] font-bold tracking-wide text-ink-tertiary">{c.tag}</div>
              <p className="mt-2 text-[14.5px] leading-relaxed text-[#25313D] text-pretty">{c.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
