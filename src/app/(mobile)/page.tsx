"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function SplashPage() {
  const router = useRouter();

  useEffect(() => {
    const t = setTimeout(() => router.replace("/age"), 1700);
    return () => clearTimeout(t);
  }, [router]);

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-[18px] bg-bg anim-scIn">
      <div className="relative w-[132px] h-[132px] flex items-center justify-center">
        <div className="absolute w-[108px] h-[108px] rounded-full bg-primary-tint-2 anim-breathe" />
        <Image
          src="/images/switch-logo.png"
          alt="Switch"
          width={118}
          height={118}
          priority
          className="relative object-contain anim-revealUp"
        />
      </div>
      <div className="text-[30px] font-extrabold tracking-[0.14em] pl-[0.14em]">SWITCH</div>
      <div className="text-[14px] font-medium text-ink-secondary">
        Votre transition, étape par étape.
      </div>
    </div>
  );
}
