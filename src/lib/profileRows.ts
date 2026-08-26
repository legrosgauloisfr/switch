import type { OnboardingAnswers } from "@/types";

function joinOrFallback(list: string[], fallback: string) {
  return list.length ? list.join(" • ") : fallback;
}

/** Shared "what we understood about you" rows, used by both the onboarding summary and the
 * account preferences screen so the two never drift apart. */
export function buildProfileRows(answers: OnboardingAnswers) {
  const cigsLabel = answers.cigsPerDay >= 40 ? "40+" : String(answers.cigsPerDay);
  return [
    { key: "goal", label: "Objectif", value: answers.goal ?? "Arrêter de fumer" },
    { key: "cigs", label: "Consommation", value: `≈ ${cigsLabel} cigarettes / jour` },
    { key: "moments", label: "Moments clés", value: joinOrFallback(answers.moments, "Au réveil • Après les repas") },
    { key: "exp", label: "Expérience", value: answers.exp ?? "Jamais" },
    { key: "format", label: "Format", value: answers.format ?? "Compact" },
    { key: "simple", label: "Simplicité", value: answers.simplicity ?? "Simple" },
    { key: "budget", label: "Budget", value: answers.budget ?? "30–50 €" },
    { key: "flavors", label: "Saveurs", value: joinOrFallback(answers.flavors, "Fruité • Frais") },
  ];
}

/** Question index (1-based, matches /quiz/[step]) for editing a given profile row. */
export const ROW_TO_QUESTION_STEP: Record<string, number> = {
  goal: 1,
  cigs: 2,
  moments: 3,
  exp: 4,
  format: 5,
  simple: 6,
  budget: 7,
  flavors: 8,
};
