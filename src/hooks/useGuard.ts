"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/store/useAppStore";

/** Screens past the age gate must not be reachable without confirming age first.
 * Waits for the persisted store to finish rehydrating from localStorage before deciding —
 * otherwise a hard navigation/reload would see the default (unconfirmed) state for a moment
 * and bounce a returning user straight back to the age gate. */
export function useRequireAge() {
  const router = useRouter();
  const hasHydrated = useUserStore((s) => s.hasHydrated);
  const ageConfirmed = useUserStore((s) => s.ageConfirmed);
  useEffect(() => {
    if (hasHydrated && !ageConfirmed) router.replace("/age");
  }, [hasHydrated, ageConfirmed, router]);
}

/** Screens past onboarding (home, recos, learn, account…) need a completed quiz. */
export function useRequireOnboarding() {
  const router = useRouter();
  const hasHydrated = useUserStore((s) => s.hasHydrated);
  const ageConfirmed = useUserStore((s) => s.ageConfirmed);
  const onboardingComplete = useUserStore((s) => s.onboardingComplete);
  useEffect(() => {
    if (!hasHydrated) return;
    if (!ageConfirmed) router.replace("/age");
    else if (!onboardingComplete) router.replace("/intro");
  }, [hasHydrated, ageConfirmed, onboardingComplete, router]);
}
