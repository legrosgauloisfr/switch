"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRequireOnboarding } from "@/hooks/useGuard";
import { useDayCount, useUserStore } from "@/store/useAppStore";
import { coachService } from "@/services/coach";
import { recommendationService, tutorialService } from "@/services";
import type { ScoredProduct, Tutorial } from "@/types";
import { buildProfileRows } from "@/lib/profileRows";
import SectionLabel from "@/components/ui/SectionLabel";
import PhotoPlaceholder from "@/components/ui/PhotoPlaceholder";

export default function HomePage() {
  useRequireOnboarding();
  const userName = useUserStore((s) => s.userName);
  const answers = useUserStore((s) => s.answers);
  const notificationsRead = useUserStore((s) => s.notificationsRead);
  const dayCount = useDayCount();

  const [topPick, setTopPick] = useState<ScoredProduct | null>(null);
  const [tutos, setTutos] = useState<Tutorial[]>([]);

  useEffect(() => {
    let alive = true;
    recommendationService.build(answers).then((r) => alive && setTopPick(r.products[0] ?? null));
    tutorialService.list().then((t) => alive && setTutos(t.slice(0, 3)));
    return () => {
      alive = false;
    };
  }, [answers]);

  const rows = buildProfileRows(answers);
  const chips = rows.filter((r) => r.key !== "goal" && r.key !== "exp" && r.key !== "moments");

  return (
    <div className="absolute inset-0 flex flex-col anim-scIn">
      <div className="flex-1 overflow-y-auto px-[22px] pt-[66px] pb-[108px]">
        <div className="flex items-start justify-between px-1">
          <div>
            <div className="text-[25px] font-bold">Bonjour {userName}</div>
            <div className="mt-1 text-[14px] text-ink-secondary">On avance étape par étape.</div>
          </div>
          <Link
            href="/account/notifications"
            className="w-[38px] h-[38px] rounded-full border border-border-strong bg-surface relative flex items-center justify-center hover:border-primary/40 transition-colors"
          >
            <span className="text-[13px] text-ink-secondary">◔</span>
            {!notificationsRead && (
              <span className="absolute top-2 right-[9px] w-[7px] h-[7px] rounded-full bg-primary border-[1.5px] border-surface" />
            )}
          </Link>
        </div>

        <Link
          href="/craving"
          className="mt-5 w-full flex items-center gap-3.5 p-4 rounded-2xl border-[1.5px] border-primary/30 bg-primary-tint hover:border-primary/55 transition-colors"
        >
          <span className="flex-none w-9 h-9 rounded-full bg-primary text-white flex items-center justify-center text-[16px]">
            !
          </span>
          <span className="flex-1 text-left">
            <span className="block text-[15px] font-bold text-primary-hover">J&apos;ai envie de fumer</span>
            <span className="block mt-0.5 text-[12.5px] text-ink-secondary">
              Un accompagnement immédiat, sans jugement.
            </span>
          </span>
          <span className="text-ink-quaternary text-[18px]">›</span>
        </Link>

        <div className="mt-[22px] rounded-[22px] bg-primary-dark text-primary-dark-ink p-5 overflow-hidden">
          <div className="text-[10.5px] font-extrabold tracking-[0.14em] text-white/60">
            VOTRE PROCHAINE ÉTAPE
          </div>
          <div className="mt-2.5 text-[19px] font-bold leading-snug text-pretty">
            {coachService.nextStepMessage(answers)}
          </div>
          <div className="mt-2 text-[13.5px] leading-relaxed text-white/72">
            3 minutes · Étape 2 sur 5 de votre prise en main
          </div>
          <Link
            href={`/learn/tutorial/${tutos[0]?.id ?? "changer-cartouche"}`}
            className="inline-flex mt-4 h-11 px-5 rounded-xl bg-[#EDF1F6] text-primary-dark font-bold text-[14px] items-center hover:bg-white transition-colors"
          >
            Ouvrir le guide
          </Link>
        </div>

        <div className="mt-6 flex items-baseline justify-between px-1">
          <SectionLabel>VOTRE PROFIL</SectionLabel>
          <Link href="/account/preferences" className="text-primary text-[13px] font-semibold">
            Modifier
          </Link>
        </div>
        <div className="mt-2.5 flex flex-wrap gap-2">
          {chips.map((c) => (
            <div
              key={c.key}
              className="px-3.5 py-2.5 rounded-full bg-surface border border-border text-[13px] font-semibold text-ink"
            >
              {c.value}
            </div>
          ))}
        </div>

        <div className="mt-[26px] px-1 text-[12px] font-bold tracking-[0.12em] text-ink-tertiary">
          VOTRE RECOMMANDATION
        </div>
        {topPick && (
          <Link
            href="/recommendations"
            className="mt-2.5 w-full flex gap-3.5 items-center text-left p-3.5 border border-border rounded-[20px] bg-surface hover:border-primary/35 transition-colors"
          >
            <div className="flex-none w-[62px] h-[74px]">
              <PhotoPlaceholder radius={14} />
            </div>
            <div className="flex-1">
              <div className="text-[9.5px] font-extrabold tracking-wide text-primary">
                {topPick.badge}
              </div>
              <div className="mt-1.5 text-[16px] font-bold">{topPick.product.name}</div>
              <div className="mt-0.5 text-[13px] text-ink-secondary">
                {topPick.product.priceEur} € · {topPick.product.simplicityTag === "simple" ? "Compact, très simple" : topPick.product.kind}
              </div>
            </div>
            <span className="text-ink-quaternary text-[18px]">›</span>
          </Link>
        )}

        <div className="mt-6 flex items-baseline justify-between px-1">
          <div className="text-[12px] font-bold tracking-[0.12em] text-ink-tertiary">DERNIERS TUTORIELS</div>
          <Link href="/learn" className="text-primary text-[13px] font-semibold">
            Tout voir
          </Link>
        </div>
        <div className="mt-2.5 flex gap-3 overflow-x-auto pb-1">
          {tutos.map((t) => (
            <Link
              key={t.id}
              href={`/learn/tutorial/${t.id}`}
              className="flex-none w-[168px] text-left border border-border rounded-[18px] bg-surface pb-3 overflow-hidden hover:border-primary/35 transition-colors"
            >
              <div className="h-[92px]">
                <PhotoPlaceholder radius={0} />
              </div>
              <div className="px-3.5 pt-2.5 text-[14px] font-bold leading-snug">{t.title}</div>
              <div className="px-3.5 pt-1 text-[12px] text-ink-tertiary">{t.durationMin} min</div>
            </Link>
          ))}
        </div>

        <div className="mt-6 px-1 text-[12px] font-bold tracking-[0.12em] text-ink-tertiary">
          VOTRE PARCOURS
        </div>
        <Link
          href="/journey"
          className="mt-2.5 w-full flex items-center gap-4 text-left p-[18px] border border-border rounded-[20px] bg-surface hover:border-primary/35 transition-colors"
        >
          <div className="flex-none w-[52px] h-[52px] rounded-full bg-primary-tint flex items-center justify-center text-[19px] font-bold text-primary">
            {dayCount}
          </div>
          <div className="flex-1">
            <div className="text-[15.5px] font-bold">Jour {dayCount}</div>
            <div className="mt-0.5 text-[13px] text-ink-secondary">Jours depuis votre décision</div>
          </div>
          <span className="text-ink-quaternary text-[18px]">›</span>
        </Link>
      </div>
    </div>
  );
}
