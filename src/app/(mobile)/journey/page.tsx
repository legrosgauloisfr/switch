"use client";

import { useRequireOnboarding } from "@/hooks/useGuard";
import { useDayCount, useUserStore } from "@/store/useAppStore";
import { coachService } from "@/services/coach";
import BackButton from "@/components/ui/BackButton";

const JOURNAL_TAGS = ["Envie de cigarette", "Moment difficile", "Déclencheur", "Réussite", "Ressenti"];

export default function JourneyPage() {
  useRequireOnboarding();
  const dayCount = useDayCount();
  const journal = useUserStore((s) => s.journal);
  const addJournalEntry = useUserStore((s) => s.addJournalEntry);
  const removeJournalEntry = useUserStore((s) => s.removeJournalEntry);

  const dots = Array.from({ length: 14 }).map((_, i) => i < dayCount);

  return (
    <div className="absolute inset-0 flex flex-col anim-scIn">
      <div className="flex-1 overflow-y-auto px-[22px] pt-[62px] pb-10">
        <BackButton />
        <div className="mt-[18px] px-1 text-[12px] font-bold tracking-[0.12em] text-ink-tertiary">
          MON PARCOURS
        </div>

        <div className="mt-[18px] rounded-[22px] bg-surface border border-border p-6">
          <div className="flex items-end gap-2.5">
            <div className="text-[54px] font-bold leading-none text-primary">{dayCount}</div>
            <div className="text-[14px] text-ink-secondary pb-1.5">jours depuis votre décision</div>
          </div>
          <div className="mt-5 flex gap-1.5">
            {dots.map((on, i) => (
              <div key={i} className={`flex-1 h-[26px] rounded ${on ? "bg-primary" : "bg-[#E7E6E1]"}`} />
            ))}
          </div>
          <div className="mt-2.5 flex justify-between text-[11px] text-ink-quaternary">
            <span>Jour 1</span>
            <span>Aujourd&apos;hui</span>
          </div>
        </div>

        <div className="mt-[22px] px-1 text-[12px] font-bold tracking-[0.12em] text-ink-tertiary">
          CONSEIL DU JOUR
        </div>
        <div className="mt-2.5 p-[18px] rounded-[20px] bg-primary-tint text-[14.5px] leading-relaxed text-[#25313D] text-pretty">
          {coachService.dailyAdviceIntro(dayCount)}
        </div>

        <div className="mt-6 px-1 text-[12px] font-bold tracking-[0.12em] text-ink-tertiary">
          NOTER UN MOMENT
        </div>
        <div className="mt-2.5 flex flex-wrap gap-2">
          {JOURNAL_TAGS.map((label) => (
            <button
              key={label}
              onClick={() => addJournalEntry(label)}
              className="px-[15px] py-2.5 rounded-full border border-border-strong bg-surface text-ink text-[13.5px] font-semibold hover:border-primary/45 hover:text-primary transition-colors"
            >
              + {label}
            </button>
          ))}
        </div>

        <div className="mt-6 px-1 text-[12px] font-bold tracking-[0.12em] text-ink-tertiary">JOURNAL</div>
        <div className="mt-2.5 flex flex-col gap-2">
          {journal.map((j) => (
            <div
              key={j.id}
              className="flex items-center gap-3.5 p-4 rounded-2xl bg-surface border border-border anim-revealUp"
            >
              <span className="flex-none w-2 h-2 rounded-full bg-primary" />
              <div className="flex-1">
                <div className="text-[14.5px] font-semibold">{j.label}</div>
                <div className="mt-0.5 text-[12px] text-ink-tertiary">{j.whenLabel}</div>
              </div>
              <button
                onClick={() => removeJournalEntry(j.id)}
                aria-label="Supprimer"
                className="text-[#B5BAB8] text-[15px] hover:text-ink-secondary transition-colors"
              >
                ×
              </button>
            </div>
          ))}
          {journal.length === 0 && (
            <div className="p-4 text-[13.5px] text-ink-tertiary">Aucune note pour l&apos;instant.</div>
          )}
        </div>
        <p className="mt-4 text-[12px] leading-relaxed text-ink-faint text-pretty">
          Ce journal sert uniquement à mieux comprendre vos habitudes. Il ne remplace pas
          l&apos;avis d&apos;un professionnel de santé.
        </p>
      </div>
    </div>
  );
}
