"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRequireOnboarding } from "@/hooks/useGuard";
import { useUserStore } from "@/store/useAppStore";
import { recommendationService } from "@/services";
import type { RecommendationResult } from "@/types";
import SectionLabel from "@/components/ui/SectionLabel";
import Badge from "@/components/ui/Badge";
import StatDots from "@/components/ui/StatDots";
import PhotoPlaceholder from "@/components/ui/PhotoPlaceholder";

export default function RecommendationsPage() {
  useRequireOnboarding();
  const answers = useUserStore((s) => s.answers);
  const [result, setResult] = useState<RecommendationResult | null>(null);

  useEffect(() => {
    let alive = true;
    recommendationService.build(answers).then((r) => alive && setResult(r));
    return () => {
      alive = false;
    };
  }, [answers]);

  if (!result) {
    return <div className="flex-1 flex items-center justify-center text-ink-tertiary">Chargement…</div>;
  }

  return (
    <div className="absolute inset-0 flex flex-col anim-scIn">
      <div className="flex-1 overflow-y-auto px-[22px] pt-[66px] pb-[112px]">
        <div className="flex justify-end">
          <Link
            href="/compare"
            className="px-[15px] py-2.5 rounded-full border border-border-strong bg-surface text-ink text-[13px] font-semibold hover:border-primary/40 transition-colors"
          >
            Comparer
          </Link>
        </div>

        <div className="mt-[18px] px-1">
          <SectionLabel>NOS RECOMMANDATIONS</SectionLabel>
          <h1 className="mt-3 text-[25px] font-bold leading-tight text-pretty">
            Trois options qui correspondent à vos préférences.
          </h1>
        </div>

        <div className="mt-[22px] flex flex-col gap-3.5">
          {result.products.map((sp) => (
            <div
              key={sp.product.id}
              className="border border-border rounded-[22px] bg-surface overflow-hidden anim-revealUp"
            >
              <div className="flex gap-4 p-4 pb-0">
                <div className="flex-none w-24 h-[116px]">
                  <PhotoPlaceholder radius={16} />
                </div>
                <div className="flex-1 min-w-0 pt-0.5">
                  <Badge label={sp.badge} tone={sp.rank === 0 ? "primary" : "neutral"} />
                  <div className="mt-2.5 text-[17px] font-bold leading-tight">{sp.product.name}</div>
                  <div className="mt-0.5 text-[13px] text-ink-secondary">{sp.product.kind}</div>
                  <div className="mt-2.5 text-[19px] font-bold">{sp.product.priceEur} €</div>
                  <div className="mt-0.5 text-[11.5px] text-ink-tertiary">{sp.product.runningCostLabel}</div>
                </div>
              </div>
              <div className="m-3.5 mt-3.5 p-3.5 rounded-2xl bg-primary-tint">
                <div className="text-[11.5px] font-bold tracking-wide text-primary">POURQUOI CE PRODUIT ?</div>
                <p className="mt-1.5 text-[13.5px] leading-relaxed text-[#3C444B] text-pretty">{sp.why}</p>
              </div>
              <div className="flex gap-[22px] px-4 pt-1 pb-1">
                <div>
                  <div className="text-[10.5px] font-bold tracking-wide text-ink-quaternary">SIMPLICITÉ</div>
                  <div className="mt-0.5">
                    <StatDots value={sp.product.simplicity} />
                  </div>
                </div>
                <div>
                  <div className="text-[10.5px] font-bold tracking-wide text-ink-quaternary">AUTONOMIE</div>
                  <div className="mt-0.5">
                    <StatDots value={sp.product.autonomy} />
                  </div>
                </div>
              </div>
              <div className="p-4 pt-3">
                <Link
                  href={`/product/${sp.product.id}`}
                  className="w-full h-12 rounded-2xl border border-border-strong bg-surface text-ink font-bold text-[14.5px] flex items-center justify-center hover:border-primary/45 transition-colors"
                >
                  Voir le détail
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-[30px] px-1 text-[11px] font-bold tracking-[0.16em] text-ink-tertiary">
          NIVEAU DE NICOTINE SUGGÉRÉ
        </div>
        <div className="mt-3 p-5 rounded-[22px] bg-primary-dark text-primary-dark-ink anim-revealUp">
          <div className="flex items-end gap-2.5">
            <div className="text-[40px] font-bold leading-none">{result.nicotine.doseMg}</div>
            <div className="text-[14px] font-semibold text-white/70 pb-1">
              mg/ml · {result.nicotine.type}
            </div>
          </div>
          <div className="mt-4 flex gap-1.5">
            {result.nicotine.bands.map((b) => (
              <div key={b.label} className="flex-1">
                <div
                  className="h-[5px] rounded"
                  style={{ background: b.active ? "#8FB3D4" : "rgba(237,241,246,.18)" }}
                />
                <div
                  className="mt-1.5 text-[10px] font-bold"
                  style={{ color: b.active ? "#EDF1F6" : "rgba(237,241,246,.45)" }}
                >
                  {b.label}
                </div>
              </div>
            ))}
          </div>
          <p className="mt-[18px] text-[13.5px] leading-relaxed text-white/78 text-pretty">
            {result.nicotine.why}
          </p>
          <p className="mt-3.5 pt-3.5 border-t border-white/[0.16] text-[12px] leading-relaxed text-white/55 text-pretty">
            Repère indicatif, à ajuster selon vos sensations. En cas de doute, un professionnel
            de santé ou un conseiller en boutique peut vous orienter.
          </p>
        </div>

        <div className="mt-[30px] px-1 flex items-baseline justify-between">
          <div className="text-[11px] font-bold tracking-[0.16em] text-ink-tertiary">
            E-LIQUIDES POUR DÉMARRER
          </div>
          <div className="text-[12px] text-ink-quaternary">
            Selon : {answers.flavors.length ? answers.flavors.join(" • ") : "Fruité • Frais"}
          </div>
        </div>
        <div className="mt-3 flex flex-col gap-2.5">
          {result.liquids.map((l) => (
            <div
              key={l.id}
              className="flex items-center gap-3.5 p-3.5 rounded-[18px] bg-surface border border-border anim-revealUp"
            >
              <div className="flex-none w-[46px] h-[62px]">
                <PhotoPlaceholder radius={10} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2">
                  <div className="text-[15px] font-bold">{l.name}</div>
                  <div className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-primary-tint text-primary">
                    {l.universe}
                  </div>
                </div>
                <p className="mt-1 text-[12.5px] leading-snug text-ink-secondary text-pretty">
                  {l.description}
                </p>
                <div className="mt-1 text-[12.5px] font-semibold">{l.specHint}</div>
              </div>
            </div>
          ))}
        </div>
        <p className="mt-3 text-[12px] leading-relaxed text-ink-faint text-pretty">
          Les e-liquides contenant de la nicotine sont réservés aux adultes. La nicotine crée
          une forte dépendance.
        </p>

        <div className="mt-[18px] p-4 rounded-2xl border border-border text-[12px] leading-relaxed text-ink-faint text-pretty">
          Ces options sont classées selon vos réponses. Certains liens vers nos partenaires
          sont rémunérés ; cela n&apos;influence pas l&apos;ordre affiché.
        </div>
        <Link
          href="/home"
          className="mt-3.5 w-full h-[52px] rounded-2xl bg-primary text-white font-bold text-[15.5px] flex items-center justify-center hover:bg-primary-hover transition-colors"
        >
          Continuer vers l&apos;accompagnement
        </Link>
      </div>
    </div>
  );
}
