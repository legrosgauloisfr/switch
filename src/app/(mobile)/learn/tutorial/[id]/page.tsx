"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useRequireOnboarding } from "@/hooks/useGuard";
import { tutorialService } from "@/services";
import type { Tutorial } from "@/types";
import BackButton from "@/components/ui/BackButton";
import PhotoPlaceholder from "@/components/ui/PhotoPlaceholder";

export default function TutorialDetailPage() {
  useRequireOnboarding();
  const { id } = useParams<{ id: string }>();
  const [tuto, setTuto] = useState<Tutorial | null | undefined>(undefined);

  useEffect(() => {
    let alive = true;
    tutorialService.get(id).then((t) => alive && setTuto(t ?? null));
    return () => {
      alive = false;
    };
  }, [id]);

  if (tuto === undefined) return null;
  if (tuto === null) {
    return <div className="flex-1 flex items-center justify-center text-ink-tertiary">Tutoriel introuvable.</div>;
  }

  return (
    <div className="absolute inset-0 flex flex-col anim-scIn">
      <div className="flex-1 overflow-y-auto pb-[30px]">
        <div className="relative h-[230px]">
          <PhotoPlaceholder radius={0} />
          <BackButton className="absolute top-[62px] left-[22px] !bg-white/92" />
        </div>
        <div className="px-[26px] pt-[22px]">
          <div className="text-[11px] font-bold tracking-[0.14em] text-ink-tertiary">{tuto.category}</div>
          <h1 className="mt-3 text-[26px] font-bold leading-tight text-pretty">{tuto.title}</h1>
          <div className="mt-2 text-[13px] text-ink-tertiary">
            {tuto.durationMin} min · Mis à jour récemment
          </div>
          <p className="mt-5 text-[15px] leading-relaxed text-[#43494F] text-pretty">{tuto.intro}</p>
          <div className="mt-6 flex flex-col gap-3">
            {tuto.steps.map((s) => (
              <div key={s.n} className="flex gap-3.5 p-4 rounded-[18px] bg-surface border border-border">
                <div className="flex-none w-[26px] h-[26px] rounded-full bg-primary-tint text-primary text-[13px] font-bold flex items-center justify-center">
                  {s.n}
                </div>
                <div className="flex-1 text-[14.5px] leading-relaxed text-[#25313D] text-pretty">{s.text}</div>
              </div>
            ))}
          </div>
          <Link
            href={`/learn/video/${tuto.id}`}
            className="w-full h-[54px] mt-[22px] rounded-2xl border border-border-strong bg-surface text-ink font-bold text-[15px] flex items-center justify-center hover:border-primary/45 transition-colors"
          >
            Voir la vidéo ({tuto.durationMin}:00)
          </Link>
        </div>
      </div>
    </div>
  );
}
