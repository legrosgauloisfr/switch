import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { JournalEntry, OnboardingAnswers } from "@/types";

export interface SettingsToggles {
  rappels: boolean;
  conseils: boolean;
  motion: boolean; // "reduce animations"
  stats: boolean; // "personalize my selection"
}

const DEFAULT_ANSWERS: OnboardingAnswers = {
  cigsPerDay: 15,
  moments: [],
  flavors: [],
};

interface UserState {
  hasHydrated: boolean;
  userName: string;
  ageConfirmed: boolean;
  ageBlocked: boolean;
  answers: OnboardingAnswers;
  onboardingComplete: boolean;
  startedAt: number | null;
  journal: JournalEntry[];
  toggles: SettingsToggles;
  notificationsRead: boolean;

  setHasHydrated: (v: boolean) => void;
  confirmAge: () => void;
  blockAge: () => void;
  setAnswer: <K extends keyof OnboardingAnswers>(key: K, value: OnboardingAnswers[K]) => void;
  toggleMultiAnswer: (key: "moments" | "flavors", value: string) => void;
  resetAnswers: () => void;
  completeOnboarding: () => void;
  addJournalEntry: (label: string) => JournalEntry;
  removeJournalEntry: (id: string) => void;
  toggleSetting: (key: keyof SettingsToggles) => void;
  markNotificationsRead: () => void;
  deleteAccount: () => void;
}

function dayCountFrom(startedAt: number | null): number {
  if (!startedAt) return 0;
  const days = Math.floor((Date.now() - startedAt) / (1000 * 60 * 60 * 24));
  return Math.max(1, days + 1);
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      hasHydrated: false,
      userName: "Camille",
      ageConfirmed: false,
      ageBlocked: false,
      answers: DEFAULT_ANSWERS,
      onboardingComplete: false,
      startedAt: null,
      journal: [
        { id: "seed-1", label: "Envie passée sans fumer", whenLabel: "Hier, 18:20", createdAt: Date.now() - 86400000 },
        { id: "seed-2", label: "Moment difficile — pause café", whenLabel: "Hier, 10:05", createdAt: Date.now() - 90000000 },
        { id: "seed-3", label: "Réussite — trajet sans cigarette", whenLabel: "Lundi, 08:40", createdAt: Date.now() - 260000000 },
      ],
      toggles: { rappels: true, conseils: true, motion: false, stats: true },
      notificationsRead: false,

      setHasHydrated: (v) => set({ hasHydrated: v }),
      confirmAge: () => set({ ageConfirmed: true, ageBlocked: false }),
      blockAge: () => set({ ageBlocked: true }),

      setAnswer: (key, value) =>
        set((state) => ({ answers: { ...state.answers, [key]: value } })),

      toggleMultiAnswer: (key, value) =>
        set((state) => {
          const current = state.answers[key] as string[];
          const next = current.includes(value)
            ? current.filter((v) => v !== value)
            : [...current, value];
          return { answers: { ...state.answers, [key]: next } };
        }),

      resetAnswers: () => set({ answers: DEFAULT_ANSWERS, onboardingComplete: false }),

      completeOnboarding: () =>
        set((state) => ({
          onboardingComplete: true,
          startedAt: state.startedAt ?? Date.now() - 12 * 86400000,
        })),

      addJournalEntry: (label: string) => {
        const entry: JournalEntry = {
          id: `j-${Date.now()}`,
          label,
          whenLabel: "À l'instant",
          createdAt: Date.now(),
        };
        set((state) => ({ journal: [entry, ...state.journal] }));
        return entry;
      },

      removeJournalEntry: (id: string) =>
        set((state) => ({ journal: state.journal.filter((j) => j.id !== id) })),

      toggleSetting: (key) =>
        set((state) => ({ toggles: { ...state.toggles, [key]: !state.toggles[key] } })),

      markNotificationsRead: () => set({ notificationsRead: true }),

      // No real backend account exists yet (brief §39) — this clears every trace of the
      // local profile (answers, journal, prefs) and drops the visitor back to onboarding,
      // which is the closest honest equivalent until real auth + server-side deletion exist.
      deleteAccount: () => {
        set({
          userName: "Camille",
          ageConfirmed: false,
          ageBlocked: false,
          answers: DEFAULT_ANSWERS,
          onboardingComplete: false,
          startedAt: null,
          journal: [],
          toggles: { rappels: true, conseils: true, motion: false, stats: true },
          notificationsRead: false,
        });
      },
    }),
    {
      name: "switch-app-store",
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
      partialize: (state) => ({
        userName: state.userName,
        ageConfirmed: state.ageConfirmed,
        ageBlocked: state.ageBlocked,
        answers: state.answers,
        onboardingComplete: state.onboardingComplete,
        startedAt: state.startedAt,
        journal: state.journal,
        toggles: state.toggles,
        notificationsRead: state.notificationsRead,
      }),
    }
  )
);

export function useDayCount() {
  return useUserStore((s) => dayCountFrom(s.startedAt));
}
