import type { CoachService } from "@/services/coach/types";
import type { CravingTrigger, JournalEntry, OnboardingAnswers } from "@/types";

const TRIGGER_HINTS: Record<CravingTrigger, string> = {
  Stress: "un moment de stress",
  Café: "une pause café",
  Repas: "juste après un repas",
  Ennui: "un moment d'ennui",
  Social: "un moment social",
  Autre: "ce moment",
};

export class RuleBasedCoach implements CoachService {
  nextStepMessage(answers: OnboardingAnswers): string {
    if (answers.moments.includes("Après les repas")) {
      return "Découvrez comment tenir le moment juste après les repas, l'un des plus fréquents pour vous.";
    }
    if (answers.moments.includes("Lors de moments stressants")) {
      return "Un point rapide sur les envies liées au stress, l'un des déclencheurs que vous avez mentionnés.";
    }
    return "Découvrez comment remplir votre première cartouche.";
  }

  cravingFollowUp(trigger: CravingTrigger, journal: JournalEntry[]): string {
    const hint = TRIGGER_HINTS[trigger];
    const pastSimilar = journal.find((j) =>
      j.label.toLowerCase().includes(trigger.toLowerCase())
    );
    if (pastSimilar) {
      return `Vous aviez déjà noté une envie liée à ${hint}. C'est encore le cas aujourd'hui — une chose à la fois.`;
    }
    return `Vous avez indiqué ${hint}. Respirez, l'envie redescend en général en quelques minutes.`;
  }

  dailyAdviceIntro(dayCount: number): string {
    if (dayCount <= 3) {
      return "Les premiers jours sont souvent les plus intenses. Chaque heure compte.";
    }
    if (dayCount <= 14) {
      return "Vos habitudes commencent à changer. Continuez à noter ce qui fonctionne.";
    }
    return "Vous avancez depuis un moment déjà. Ce recul aide à repérer vos vrais déclencheurs.";
  }
}
