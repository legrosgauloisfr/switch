"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import { useRequireAge } from "@/hooks/useGuard";

const POINTS = [
  "Environ deux minutes",
  "Aucun jugement, aucune obligation",
  "Gratuit, sans abonnement",
];

export default function IntroPage() {
  useRequireAge();
  const router = useRouter();

  return (
    <div className="absolute inset-0 flex flex-col px-[26px] pt-[76px] pb-[46px] anim-scIn">
      <div className="flex items-center gap-2.5">
        <Image src="/images/switch-logo.png" alt="" width={34} height={34} className="-ml-1 object-contain" />
        <div className="text-[22px] font-extrabold tracking-[0.14em]">SWITCH</div>
      </div>
      <div className="flex-1 flex flex-col justify-center gap-[18px]">
        <h1 className="text-[34px] font-bold leading-[1.14] text-pretty">
          Prêt à changer vos habitudes ?
        </h1>
        <p className="text-[15.5px] leading-relaxed text-ink-secondary text-pretty">
          Huit questions courtes, comme en boutique. Nous vous aidons ensuite à comprendre
          quelles solutions peuvent correspondre à vos préférences.
        </p>
        <div className="flex flex-col gap-2.5 mt-1.5">
          {POINTS.map((p) => (
            <div key={p} className="flex gap-3 items-center text-[14px] text-ink">
              <span className="w-[7px] h-[7px] rounded-full bg-primary" />
              {p}
            </div>
          ))}
        </div>
      </div>
      <Button onClick={() => router.push("/quiz/1")}>Commencer</Button>
      <div className="mt-3.5 text-[11.5px] leading-relaxed text-ink-quaternary text-center text-pretty">
        Switch informe et oriente. Ce n&apos;est pas un dispositif médical et l&apos;arrêt
        complet du tabac reste l&apos;objectif prioritaire.
      </div>
    </div>
  );
}
