"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useRequireOnboarding } from "@/hooks/useGuard";
import { useUserStore } from "@/store/useAppStore";
import { coachService } from "@/services/coach";
import type { CravingTrigger } from "@/types";
import BackButton from "@/components/ui/BackButton";
import Button from "@/components/ui/Button";

const TRIGGERS: CravingTrigger[] = ["Stress", "Café", "Repas", "Ennui", "Social", "Autre"];

export default function CravingPage() {
  useRequireOnboarding();
  const router = useRouter();
  const journal = useUserStore((s) => s.journal);
  const addJournalEntry = useUserStore((s) => s.addJournalEntry);
  const [trigger, setTrigger] = useState<CravingTrigger | null>(null);

  const logAndGoHome = (label: string) => {
    addJournalEntry(label);
    router.push("/journey");
  };

  return (
    <div className="absolute inset-0 flex flex-col anim-scIn">
      <div className="flex-1 overflow-y-auto px-[26px] pt-[62px] pb-10">
        <BackButton />

        {!trigger ? (
          <>
            <h1 className="mt-5 text-[26px] font-bold leading-tight text-pretty">
              Qu&apos;est-ce qui déclenche cette envie ?
            </h1>
            <p className="mt-2.5 text-[14.5px] leading-relaxed text-ink-secondary">
              Repérer le déclencheur aide à mieux le comprendre — il n&apos;y a rien à vous
              reprocher.
            </p>
            <div className="mt-6 flex flex-col gap-2.5">
              {TRIGGERS.map((t) => (
                <button
                  key={t}
                  onClick={() => setTrigger(t)}
                  className="w-full text-left px-[18px] py-[17px] rounded-2xl border-[1.5px] border-border bg-surface font-semibold text-[15.5px] hover:border-primary/40 transition-colors"
                >
                  {t}
                </button>
              ))}
            </div>
          </>
        ) : (
          <div className="anim-scIn">
            <div className="text-[11px] font-bold tracking-[0.16em] text-ink-tertiary">
              {trigger.toUpperCase()}
            </div>
            <h1 className="mt-3.5 text-[24px] font-bold leading-tight text-pretty">
              {coachService.cravingFollowUp(trigger, journal)}
            </h1>
            <div className="mt-6 p-[18px] rounded-[20px] bg-primary-tint">
              <div className="text-[13px] font-bold text-primary">UNE CHOSE À LA FOIS</div>
              <p className="mt-2 text-[14px] leading-relaxed text-[#3C444B] text-pretty">
                Respirez lentement pendant trente secondes, buvez un verre d&apos;eau, ou
                changez de pièce si possible. L&apos;envie redescend généralement en quelques
                minutes.
              </p>
            </div>
            <div className="mt-6 flex flex-col gap-2.5">
              <Button onClick={() => logAndGoHome(`Envie de cigarette — ${trigger.toLowerCase()}`)}>
                Ça va mieux, je note ce moment
              </Button>
              <Button
                variant="secondary"
                onClick={() => logAndGoHome(`Cigarette fumée — ${trigger.toLowerCase()}`)}
              >
                J&apos;ai craqué, je le note quand même
              </Button>
            </div>
            <p className="mt-4 text-[12px] leading-relaxed text-ink-faint text-pretty">
              Un craquage n&apos;efface pas vos progrès. Tabac info service (39 89) reste
              disponible si vous avez besoin d&apos;en parler.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
