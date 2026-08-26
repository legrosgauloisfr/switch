"use client";

import Image from "next/image";
import Link from "next/link";
import { useRequireOnboarding } from "@/hooks/useGuard";
import { useDayCount, useUserStore } from "@/store/useAppStore";
import SectionLabel from "@/components/ui/SectionLabel";

const MENU = [
  { label: "Mes préférences", sub: "Format, budget, saveurs", href: "/account/preferences" },
  { label: "Ma recommandation", sub: "Voir la sélection", href: "/recommendations" },
  { label: "Mon parcours", sub: "Journal et progression", href: "/journey" },
  { label: "Notifications", sub: "Nouvelles alertes", href: "/account/notifications" },
  { label: "Paramètres", sub: "Confidentialité, animations", href: "/account/settings" },
  { label: "Transparence et affiliation", sub: "Comment Switch est financée", href: "/learn/faq" },
];

export default function AccountPage() {
  useRequireOnboarding();
  const userName = useUserStore((s) => s.userName);
  const dayCount = useDayCount();

  return (
    <div className="absolute inset-0 flex flex-col anim-scIn">
      <div className="flex-1 overflow-y-auto px-[22px] pt-[66px] pb-[108px]">
        <div className="px-1">
          <SectionLabel>PROFIL</SectionLabel>
        </div>
        <div className="mt-4 flex items-center gap-4 p-[18px] rounded-[20px] bg-surface border border-border">
          <div className="flex-none w-[52px] h-[52px] rounded-full bg-primary-tint flex items-center justify-center">
            <Image src="/images/switch-logo.png" alt="" width={34} height={34} className="object-contain" />
          </div>
          <div className="flex-1">
            <div className="text-[17px] font-bold">{userName}</div>
            <div className="mt-0.5 text-[13px] text-ink-secondary">
              Membre depuis {dayCount} jours · Gratuit
            </div>
          </div>
        </div>

        <div className="mt-5 flex flex-col gap-2">
          {MENU.map((m) => (
            <Link
              key={m.label}
              href={m.href}
              className="flex items-center gap-3.5 px-[18px] py-[17px] border border-border rounded-2xl bg-surface hover:border-primary/35 transition-colors"
            >
              <div className="flex-1">
                <div className="text-[15px] font-semibold">{m.label}</div>
                <div className="mt-0.5 text-[12.5px] text-ink-tertiary">{m.sub}</div>
              </div>
              <span className="text-ink-quaternary text-[18px]">›</span>
            </Link>
          ))}
        </div>

        <div className="mt-[22px] p-4 rounded-[18px] bg-primary-tint">
          <div className="text-[13px] font-bold text-[#25313D]">Besoin d&apos;un accompagnement ?</div>
          <p className="mt-1.5 text-[13px] leading-relaxed text-[#43494F] text-pretty">
            Un professionnel de santé ou Tabac info service (39 89) peut vous accompagner,
            notamment avec des traitements de substitution nicotinique validés.
          </p>
        </div>
        <p className="mt-[18px] text-[12px] leading-relaxed text-ink-faint text-pretty">
          Switch est gratuite et sans abonnement. Certains liens vers des partenaires sont
          rémunérés et signalés comme tels.
        </p>
      </div>
    </div>
  );
}
