"use client";

import { useParams, useRouter } from "next/navigation";
import { useRequireAge } from "@/hooks/useGuard";
import { useUserStore } from "@/store/useAppStore";
import { QUESTIONS } from "@/data/seed/questions";
import Button from "@/components/ui/Button";
import ProgressBar from "@/components/ui/ProgressBar";
import ListOption from "@/components/ui/ListOption";
import SelectCard from "@/components/ui/SelectCard";
import Chip from "@/components/ui/Chip";
import type { OnboardingAnswers } from "@/types";

export default function QuizStepPage() {
  useRequireAge();
  const router = useRouter();
  const params = useParams<{ step: string }>();
  const stepNum = Math.min(Math.max(parseInt(params.step, 10) || 1, 1), QUESTIONS.length);
  const index = stepNum - 1;
  const question = QUESTIONS[index];
  const isLast = index === QUESTIONS.length - 1;

  const answers = useUserStore((s) => s.answers);
  const setAnswer = useUserStore((s) => s.setAnswer);
  const toggleMultiAnswer = useUserStore((s) => s.toggleMultiAnswer);

  const goToStep = (n: number) => router.push(`/quiz/${n}`);
  const qNext = () => (isLast ? router.push("/profile-summary") : goToStep(stepNum + 1));
  const qBack = () => (index === 0 ? router.push("/intro") : goToStep(stepNum - 1));

  const sel = answers[question.id as keyof OnboardingAnswers];
  const isSelected = (label: string) =>
    question.multi ? (sel as string[] | undefined)?.includes(label) ?? false : sel === label;

  const pick = (label: string) => {
    if (question.multi) {
      toggleMultiAnswer(question.id as "moments" | "flavors", label);
    } else {
      setAnswer(question.id as keyof OnboardingAnswers, label as never);
      setTimeout(qNext, 210);
    }
  };

  const answered =
    question.type === "slider"
      ? true
      : question.multi
      ? ((sel as string[] | undefined)?.length ?? 0) > 0
      : !!sel;

  const qAnim = index % 2 === 0 ? "anim-qA" : "anim-qB";
  const cigs = answers.cigsPerDay;

  return (
    <div className="absolute inset-0 flex flex-col">
      <div className="pt-[62px] px-[26px] pb-3.5 bg-bg">
        <div className="flex items-center justify-between h-[34px]">
          <button
            type="button"
            onClick={qBack}
            className="w-[34px] h-[34px] rounded-full bg-black/[0.05] text-ink-secondary text-[16px] hover:bg-black/[0.1] transition-colors"
          >
            ‹
          </button>
          <div className="text-[12.5px] font-semibold text-ink-tertiary">
            Question {stepNum} sur {QUESTIONS.length}
          </div>
          <button
            type="button"
            onClick={qNext}
            className="text-ink-tertiary text-[12.5px] font-semibold hover:text-primary transition-colors"
          >
            Passer
          </button>
        </div>
        <div className="mt-3.5">
          <ProgressBar percent={((index + 1) / QUESTIONS.length) * 100} />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-[26px] pt-2.5 pb-[26px]">
        <h1 key={question.id} className={`text-[25px] font-bold leading-[1.22] text-pretty ${qAnim}`}>
          {question.title}
        </h1>
        {question.help && (
          <p className={`mt-2 text-[14px] leading-relaxed text-ink-secondary ${qAnim}`}>
            {question.help}
          </p>
        )}

        {question.type === "slider" && (
          <>
            <div className={`mt-10 flex flex-col items-center gap-1 ${qAnim}`}>
              <div className="text-[62px] font-bold leading-none text-primary">
                {cigs >= 40 ? "40+" : cigs}
              </div>
              <div className="text-[14px] text-ink-secondary">cigarettes par jour</div>
            </div>
            <input
              type="range"
              min={1}
              max={40}
              step={1}
              value={cigs}
              onChange={(e) => setAnswer("cigsPerDay", Number(e.target.value))}
              className="mt-[34px] w-full h-[34px] cursor-pointer"
            />
            <div className="flex justify-between text-[11.5px] font-semibold text-ink-quaternary px-0.5">
              {[5, 10, 15, 20, 25, "30+"].map((n) => (
                <span key={n}>{n}</span>
              ))}
            </div>
            <div className="mt-[30px] p-4 rounded-2xl bg-surface border border-border text-[13.5px] leading-relaxed text-ink-secondary">
              Une estimation suffit. Cette information nous aide à orienter le niveau de
              nicotine des e-liquides.
            </div>
          </>
        )}

        {question.type === "chips" && (
          <div className="mt-[26px] flex flex-wrap gap-2.5">
            {question.options?.map((o, i) => (
              <Chip
                key={o.label}
                label={o.label}
                selected={isSelected(o.label)}
                onClick={() => pick(o.label)}
                animClass={qAnim}
                delay={`${60 + i * 45}ms`}
              />
            ))}
          </div>
        )}

        {question.type === "cards" && (
          <div className="mt-[26px] flex flex-col gap-3">
            {question.options?.map((o, i) => (
              <SelectCard
                key={o.label}
                label={o.label}
                desc={o.desc}
                gaugeWidth={o.gaugeWidth}
                gaugeHeight={o.gaugeHeight}
                selected={isSelected(o.label)}
                onClick={() => pick(o.label)}
                animClass={qAnim}
                delay={`${60 + i * 45}ms`}
              />
            ))}
          </div>
        )}

        {question.type === "list" && (
          <div className="mt-[26px] flex flex-col gap-2.5">
            {question.options?.map((o, i) => (
              <ListOption
                key={o.label}
                label={o.label}
                selected={isSelected(o.label)}
                onClick={() => pick(o.label)}
                animClass={qAnim}
                delay={`${60 + i * 45}ms`}
              />
            ))}
          </div>
        )}
      </div>

      <div className="px-[26px] pt-3 pb-10 bg-gradient-to-t from-bg via-bg to-transparent">
        <Button disabled={!answered} onClick={qNext}>
          {isLast ? "Voir mon profil" : "Continuer"}
        </Button>
      </div>
    </div>
  );
}
