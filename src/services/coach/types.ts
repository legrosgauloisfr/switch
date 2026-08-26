import type { CravingTrigger, JournalEntry, OnboardingAnswers } from "@/types";

// Swappable coach brain (brief §37-38). RuleBasedCoach is the only implementation today;
// an LLM-backed one can implement the same interface later without touching screens.
export interface CoachService {
  nextStepMessage(answers: OnboardingAnswers): string;
  cravingFollowUp(trigger: CravingTrigger, journal: JournalEntry[]): string;
  dailyAdviceIntro(dayCount: number): string;
}
