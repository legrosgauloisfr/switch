"use client";

import { useRouter } from "next/navigation";
import { useRequireOnboarding } from "@/hooks/useGuard";
import { useUserStore } from "@/store/useAppStore";
import { buildProfileRows, ROW_TO_QUESTION_STEP } from "@/lib/profileRows";
import BackButton from "@/components/ui/BackButton";
import Button from "@/components/ui/Button";

export default function PreferencesPage() {
  useRequireOnboarding();
  const router = useRouter();
  const answers = useUserStore((s) => s.answers);
  const resetAnswers = useUserStore((s) => s.resetAnswers);
  const rows = buildProfileRows(answers);

  return (
    <div className="absolute inset-0 flex flex-col anim-scIn">
      <div className="flex-1 overflow-y-auto px-[22px] pt-[62px] pb-10">
        <BackButton />
        <h1 className="mt-[18px] px-1 text-[25px] font-bold">Gestion des préférences</h1>
        <p className="mt-2 px-1 text-[14px] leading-relaxed text-ink-secondary">
          Modifiez une réponse à tout moment : votre sélection est recalculée.
        </p>
        <div className="mt-5 flex flex-col gap-2">
          {rows.map((r) => (
            <button
              key={r.key}
              onClick={() => router.push(`/quiz/${ROW_TO_QUESTION_STEP[r.key]}`)}
              className="flex items-center gap-3.5 text-left px-[18px] py-4 border border-border rounded-2xl bg-surface hover:border-primary/35 transition-colors"
            >
              <div className="flex-1">
                <div className="text-[12.5px] font-semibold text-ink-tertiary">{r.label}</div>
                <div className="mt-0.5 text-[15px] font-bold">{r.value}</div>
              </div>
              <div className="flex-none text-[13px] font-semibold text-primary">Modifier</div>
            </button>
          ))}
        </div>
        <Button
          variant="secondary"
          height={52}
          className="mt-[18px]"
          onClick={() => {
            resetAnswers();
            router.push("/quiz/1");
          }}
        >
          Refaire le questionnaire
        </Button>
      </div>
    </div>
  );
}
