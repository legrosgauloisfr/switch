"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRequireOnboarding } from "@/hooks/useGuard";
import { tutorialService } from "@/services";
import type { Tutorial } from "@/types";
import SectionLabel from "@/components/ui/SectionLabel";
import PhotoPlaceholder from "@/components/ui/PhotoPlaceholder";

export default function LearnPage() {
  useRequireOnboarding();
  const [tutos, setTutos] = useState<Tutorial[]>([]);

  useEffect(() => {
    let alive = true;
    tutorialService.list().then((t) => alive && setTutos(t));
    return () => {
      alive = false;
    };
  }, []);

  const featured = tutos[0];
  const rest = tutos.slice(1);

  return (
    <div className="absolute inset-0 flex flex-col anim-scIn">
      <div className="flex-1 overflow-y-auto px-[22px] pt-[66px] pb-[108px]">
        <div className="px-1">
          <SectionLabel>APPRENDRE</SectionLabel>
          <h1 className="mt-3 text-[25px] font-bold leading-tight text-pretty">
            Vous n&apos;avez pas besoin de tout connaître.
          </h1>
        </div>

        {featured && (
          <Link
            href={`/learn/video/${featured.id}`}
            className="mt-5 w-full block text-left border border-border rounded-[22px] bg-surface pb-4 overflow-hidden hover:border-primary/35 transition-colors"
          >
            <div className="relative h-[168px]">
              <PhotoPlaceholder radius={0} />
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-[58px] h-[58px] rounded-full bg-white/94 flex items-center justify-center">
                  <div className="w-0 h-0 border-l-[15px] border-l-primary-dark border-y-[9px] border-y-transparent ml-1" />
                </div>
              </div>
              <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-md bg-black/70 text-white text-[11px] font-semibold">
                {featured.durationMin}:00
              </div>
            </div>
            <div className="px-4 pt-3.5">
              <div className="text-[10.5px] font-extrabold tracking-wide text-primary">À LA UNE</div>
              <div className="mt-1.5 text-[17px] font-bold leading-snug">{featured.gridSummary}</div>
            </div>
          </Link>
        )}

        <div className="mt-6 px-1 text-[12px] font-bold tracking-[0.12em] text-ink-tertiary">
          GUIDES ESSENTIELS
        </div>
        <div className="mt-2.5 grid grid-cols-2 gap-2.5">
          {rest.map((t) => (
            <Link
              key={t.id}
              href={`/learn/tutorial/${t.id}`}
              className="text-left border border-border rounded-[18px] bg-surface pb-3.5 overflow-hidden hover:border-primary/35 transition-colors"
            >
              <div className="h-[76px]">
                <PhotoPlaceholder radius={0} />
              </div>
              <div className="px-3.5 pt-2.5 text-[14px] font-bold leading-snug">{t.title}</div>
              <div className="px-3.5 pt-1 text-[12px] leading-snug text-ink-tertiary">{t.gridSummary}</div>
            </Link>
          ))}
        </div>

        <div className="mt-6 flex flex-col gap-2">
          <Link
            href="/learn/articles"
            className="flex items-center gap-3.5 px-[18px] py-[17px] border border-border rounded-2xl bg-surface hover:border-primary/35 transition-colors"
          >
            <span className="flex-1 text-[15px] font-semibold">Articles</span>
            <span className="text-ink-quaternary text-[18px]">›</span>
          </Link>
          <Link
            href="/learn/faq"
            className="flex items-center gap-3.5 px-[18px] py-[17px] border border-border rounded-2xl bg-surface hover:border-primary/35 transition-colors"
          >
            <span className="flex-1 text-[15px] font-semibold">Questions fréquentes</span>
            <span className="text-ink-quaternary text-[18px]">›</span>
          </Link>
          <Link
            href="/learn/advice"
            className="flex items-center gap-3.5 px-[18px] py-[17px] border border-border rounded-2xl bg-surface hover:border-primary/35 transition-colors"
          >
            <span className="flex-1 text-[15px] font-semibold">Conseils du jour</span>
            <span className="text-ink-quaternary text-[18px]">›</span>
          </Link>
          <Link
            href="/learn/faq"
            className="flex items-center gap-3.5 px-[18px] py-[17px] border border-border rounded-2xl bg-surface hover:border-primary/35 transition-colors"
          >
            <span className="flex-1 text-[15px] font-semibold">Glossaire</span>
            <span className="text-ink-quaternary text-[18px]">›</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
