"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useRequireOnboarding } from "@/hooks/useGuard";
import { tutorialService } from "@/services";
import type { Tutorial } from "@/types";
import PhotoPlaceholder from "@/components/ui/PhotoPlaceholder";

export default function VideoPage() {
  useRequireOnboarding();
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [tuto, setTuto] = useState<Tutorial | null | undefined>(undefined);
  const [playing, setPlaying] = useState(false);
  const [pct, setPct] = useState(32);

  useEffect(() => {
    let alive = true;
    tutorialService.get(id).then((t) => alive && setTuto(t ?? null));
    return () => {
      alive = false;
    };
  }, [id]);

  useEffect(() => {
    if (!playing) return;
    const t = setInterval(() => setPct((p) => (p >= 100 ? 0 : p + 4)), 400);
    return () => clearInterval(t);
  }, [playing]);

  if (!tuto) return null;

  return (
    <div className="absolute inset-0 flex flex-col bg-[#14181A] anim-scIn">
      <div className="flex-1 flex flex-col justify-center">
        <div className="relative h-[260px] bg-[#1D2224] flex items-center justify-center">
          <PhotoPlaceholder radius={0} />
          <button
            onClick={() => setPlaying((p) => !p)}
            className="relative w-[66px] h-[66px] rounded-full bg-white/94 flex items-center justify-center"
          >
            {playing ? (
              <span className="flex gap-[5px]">
                <span className="w-[5px] h-5 bg-[#14181A] rounded-sm" />
                <span className="w-[5px] h-5 bg-[#14181A] rounded-sm" />
              </span>
            ) : (
              <span className="w-0 h-0 border-l-[17px] border-l-[#14181A] border-y-[10px] border-y-transparent ml-1.5" />
            )}
          </button>
          <div className="absolute bottom-0 left-0 right-0 p-[14px_18px]">
            <div className="h-[3px] rounded-full bg-white/22 overflow-hidden">
              <div
                className="h-full bg-[#8FB3D4] transition-[width] duration-300"
                style={{ width: `${pct}%` }}
              />
            </div>
            <div className="mt-2 flex justify-between text-[11.5px] font-semibold text-white/70">
              <span>{Math.round((pct / 100) * tuto.durationMin * 60)}s</span>
              <span>{tuto.durationMin}:00</span>
            </div>
          </div>
        </div>
      </div>
      <div className="px-[26px] pb-[46px]">
        <div className="text-[11px] font-bold tracking-[0.14em] text-white/45">TUTORIEL VIDÉO</div>
        <h1 className="mt-3 text-[22px] font-bold leading-snug text-[#EDF1F6] text-pretty">
          {tuto.gridSummary}
        </h1>
        <p className="mt-2 text-[13.5px] leading-relaxed text-white/60 text-pretty">{tuto.intro}</p>
        <div className="mt-[22px] flex gap-2.5">
          <button
            onClick={() => router.back()}
            className="flex-1 h-[52px] rounded-2xl border border-white/16 text-[#EDF1F6] font-bold text-[15px] hover:bg-white/[0.06] transition-colors"
          >
            Fermer
          </button>
          <Link
            href={`/learn/tutorial/${tuto.id}`}
            className="flex-1 h-[52px] rounded-2xl bg-[#8FB3D4] text-[#0E2032] font-bold text-[15px] flex items-center justify-center hover:bg-[#A4C3DE] transition-colors"
          >
            Guide écrit
          </Link>
        </div>
      </div>
    </div>
  );
}
