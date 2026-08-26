"use client";

import { useRouter } from "next/navigation";
import { useRequireAge } from "@/hooks/useGuard";
import { useUserStore } from "@/store/useAppStore";
import { buildProfileRows } from "@/lib/profileRows";
import { GroupedList, GroupedRow } from "@/components/ui/GroupedList";
import Button from "@/components/ui/Button";
import SectionLabel from "@/components/ui/SectionLabel";

export default function ProfileSummaryPage() {
  useRequireAge();
  const router = useRouter();
  const answers = useUserStore((s) => s.answers);
  const resetAnswers = useUserStore((s) => s.resetAnswers);
  const rows = buildProfileRows(answers);

  return (
    <div className="absolute inset-0 flex flex-col anim-scIn">
      <div className="flex-1 overflow-y-auto px-[26px] pt-[70px] pb-5">
        <SectionLabel>VOTRE PROFIL</SectionLabel>
        <h1 className="mt-3.5 text-[26px] font-bold leading-tight text-pretty">
          Voilà ce que nous avons retenu.
        </h1>
        <div className="mt-[22px]">
          <GroupedList>
            {rows.map((r, i) => (
              <GroupedRow key={r.key} label={r.label} value={r.value} delay={`${i * 55}ms`} />
            ))}
          </GroupedList>
        </div>
        <p className="mt-[18px] text-[14.5px] leading-relaxed text-ink-secondary">
          Nous avons préparé une sélection pour vous, basée uniquement sur ces réponses.
        </p>
      </div>
      <div className="px-[26px] pt-3 pb-10">
        <Button onClick={() => router.push("/analyse")}>Voir ma sélection</Button>
        <Button
          variant="ghost"
          height={46}
          className="mt-1.5"
          onClick={() => {
            resetAnswers();
            router.push("/quiz/1");
          }}
        >
          Modifier mes réponses
        </Button>
      </div>
    </div>
  );
}
