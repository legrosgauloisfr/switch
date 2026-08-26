"use client";

import { useRouter } from "next/navigation";
import { useUserStore } from "@/store/useAppStore";
import Button from "@/components/ui/Button";

export default function AgePage() {
  const router = useRouter();
  const ageBlocked = useUserStore((s) => s.ageBlocked);
  const confirmAge = useUserStore((s) => s.confirmAge);
  const blockAge = useUserStore((s) => s.blockAge);

  return (
    <div className="absolute inset-0 flex flex-col px-[26px] pt-[76px] pb-[46px] anim-scIn">
      <div className="text-[11px] font-bold tracking-[0.16em] text-ink-tertiary">
        VÉRIFICATION D&apos;ÂGE
      </div>
      <h1 className="mt-5 text-[27px] font-bold leading-tight text-pretty">
        Switch est réservée aux adultes.
      </h1>
      <p className="mt-3.5 text-[15px] leading-relaxed text-ink-secondary text-pretty">
        Les produits de vapotage sont réglementés en France et leur vente est interdite aux
        personnes mineures. Confirmez votre âge pour continuer.
      </p>
      <div className="flex-1" />
      {ageBlocked && (
        <div className="mb-[18px] p-4 rounded-2xl bg-warn-bg border border-[rgba(178,101,42,0.18)] anim-scIn">
          <div className="text-[14px] font-bold text-warn-ink">Accès non disponible</div>
          <div className="mt-1.5 text-[13.5px] leading-relaxed text-[#7A5433]">
            Cette application ne peut pas être utilisée par des personnes de moins de 18 ans.
            Pour parler du tabac, Tabac info service reste accessible à tous (39 89).
          </div>
        </div>
      )}
      <div className="flex flex-col gap-2.5">
        <Button
          onClick={() => {
            confirmAge();
            router.push("/intro");
          }}
        >
          J&apos;ai 18 ans ou plus
        </Button>
        <Button variant="secondary" onClick={blockAge}>
          J&apos;ai moins de 18 ans
        </Button>
      </div>
      <div className="mt-4 text-[11.5px] leading-relaxed text-ink-quaternary text-center">
        Aucune donnée n&apos;est partagée à cette étape.
      </div>
    </div>
  );
}
