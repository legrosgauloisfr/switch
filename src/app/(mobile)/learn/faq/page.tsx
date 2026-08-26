"use client";

import { useEffect, useState } from "react";
import { useRequireOnboarding } from "@/hooks/useGuard";
import { contentService } from "@/services";
import type { FaqItem } from "@/types";
import BackButton from "@/components/ui/BackButton";

export default function FaqPage() {
  useRequireOnboarding();
  const [items, setItems] = useState<FaqItem[]>([]);
  const [openId, setOpenId] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    contentService.faq().then((f) => alive && setItems(f));
    return () => {
      alive = false;
    };
  }, []);

  return (
    <div className="absolute inset-0 flex flex-col anim-scIn">
      <div className="flex-1 overflow-y-auto px-[22px] pt-[62px] pb-10">
        <BackButton />
        <h1 className="mt-[18px] px-1 text-[25px] font-bold">Questions fréquentes</h1>
        <div className="mt-5 flex flex-col gap-2">
          {items.map((f) => {
            const open = openId === f.id;
            return (
              <div key={f.id} className="border border-border rounded-[18px] bg-surface overflow-hidden">
                <button
                  onClick={() => setOpenId(open ? null : f.id)}
                  className="w-full flex gap-3.5 items-center text-left px-[18px] py-[17px]"
                >
                  <span className="flex-1 text-[15px] font-semibold leading-snug">{f.question}</span>
                  <span className="flex-none text-ink-tertiary text-[17px]">{open ? "−" : "+"}</span>
                </button>
                {open && (
                  <div className="px-[18px] pb-[18px] text-[14px] leading-relaxed text-ink-secondary anim-revealUp text-pretty">
                    {f.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
