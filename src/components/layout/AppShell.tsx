"use client";

import { useUserStore } from "@/store/useAppStore";
import TabBar from "@/components/navigation/TabBar";
import ShopSheet from "@/components/navigation/ShopSheet";

export default function AppShell({ children }: { children: React.ReactNode }) {
  // Gated on hasHydrated (not just toggles.motion) so the server render and the client's
  // first paint agree — both start "not reduced" until the persisted store rehydrates,
  // which avoids an SSR/client class mismatch without a synchronous setState-in-effect.
  const hasHydrated = useUserStore((s) => s.hasHydrated);
  const motion = useUserStore((s) => s.toggles.motion);
  const reduceMotion = hasHydrated && motion;

  return (
    <div className="min-h-dvh bg-canvas flex justify-center">
      <div
        className={`relative w-full max-w-[480px] min-h-dvh bg-bg flex flex-col overflow-x-hidden ${
          reduceMotion ? "reduce-motion" : ""
        }`}
      >
        {children}
        <TabBar />
        <ShopSheet />
      </div>
    </div>
  );
}
