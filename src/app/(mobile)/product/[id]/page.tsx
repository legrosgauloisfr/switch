"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useRequireOnboarding } from "@/hooks/useGuard";
import { useUserStore } from "@/store/useAppStore";
import { useUiStore } from "@/store/useUiStore";
import { recommendationService } from "@/services";
import type { ScoredProduct } from "@/types";
import BackButton from "@/components/ui/BackButton";
import Badge from "@/components/ui/Badge";
import StatDots from "@/components/ui/StatDots";
import PhotoPlaceholder from "@/components/ui/PhotoPlaceholder";

export default function ProductDetailPage() {
  useRequireOnboarding();
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const answers = useUserStore((s) => s.answers);
  const openShop = useUiStore((s) => s.openShop);
  const [scored, setScored] = useState<ScoredProduct | null | undefined>(undefined);

  useEffect(() => {
    let alive = true;
    recommendationService.build(answers).then((r) => {
      if (!alive) return;
      setScored(r.products.find((p) => p.product.id === id) ?? null);
    });
    return () => {
      alive = false;
    };
  }, [answers, id]);

  if (scored === undefined) {
    return <div className="flex-1 flex items-center justify-center text-ink-tertiary">Chargement…</div>;
  }
  if (scored === null) {
    return (
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-8 text-center">
        <div className="text-[18px] font-bold">Produit introuvable</div>
        <button onClick={() => router.push("/recommendations")} className="text-primary font-semibold text-[14px]">
          Retour aux recommandations
        </button>
      </div>
    );
  }

  const { product, why, badge, rank } = scored;

  return (
    <div className="absolute inset-0 flex flex-col anim-scIn">
      <div className="flex-1 overflow-y-auto pb-5">
        <div className="relative h-[300px]">
          <PhotoPlaceholder radius={0} />
          <BackButton className="absolute top-[62px] left-[22px] !bg-white/92" />
        </div>
        <div className="px-[26px] pt-[22px]">
          <Badge label={badge} tone={rank === 0 ? "primary" : "neutral"} />
          <h1 className="mt-3 text-[26px] font-bold leading-tight">{product.name}</h1>
          <div className="mt-1.5 text-[14px] text-ink-secondary">{product.kind}</div>
          <div className="mt-3.5 flex items-baseline gap-2.5">
            <div className="text-[26px] font-bold">{product.priceEur} €</div>
            <div className="text-[12.5px] text-ink-tertiary">{product.runningCostLabel}</div>
          </div>

          <div className="mt-5 p-4 rounded-[18px] bg-primary-tint">
            <div className="text-[11.5px] font-bold tracking-wide text-primary">POURQUOI CE PRODUIT ?</div>
            <p className="mt-1.5 text-[14px] leading-relaxed text-[#3C444B] text-pretty">{why}</p>
          </div>

          <div className="mt-[22px] text-[12px] font-bold tracking-wide text-ink-tertiary">CARACTÉRISTIQUES</div>
          <div className="mt-2.5 flex flex-col">
            {product.specs.map((s) => (
              <div key={s.key} className="flex items-baseline justify-between gap-4 py-3.5 border-b border-border">
                <div className="text-[14px] text-ink-secondary">{s.key}</div>
                <div className="text-[14.5px] font-semibold text-right">{s.value}</div>
              </div>
            ))}
          </div>

          <div className="mt-[22px] flex gap-2.5">
            <div className="flex-1 p-3.5 rounded-2xl border border-border">
              <div className="text-[10.5px] font-bold tracking-wide text-ink-quaternary">SIMPLICITÉ</div>
              <div className="mt-1">
                <StatDots value={product.simplicity} />
              </div>
            </div>
            <div className="flex-1 p-3.5 rounded-2xl border border-border">
              <div className="text-[10.5px] font-bold tracking-wide text-ink-quaternary">AUTONOMIE</div>
              <div className="mt-1">
                <StatDots value={product.autonomy} />
              </div>
            </div>
          </div>

          <p className="mt-[22px] text-[12px] leading-relaxed text-ink-faint text-pretty">
            Produit réservé aux adultes. Contient de la nicotine, substance qui crée une forte
            dépendance.
          </p>
        </div>
      </div>
      <div className="px-[26px] pt-3 pb-10 flex gap-2.5 bg-gradient-to-t from-bg via-bg to-transparent">
        <button
          onClick={() => router.push("/compare")}
          className="flex-none w-[108px] h-[54px] rounded-2xl border border-border-strong bg-surface text-ink font-bold text-[14.5px] hover:border-primary/45 transition-colors"
        >
          Comparer
        </button>
        <button
          onClick={() => openShop(product)}
          className="flex-1 h-[54px] rounded-2xl bg-primary text-white font-bold text-[15.5px] hover:bg-primary-hover transition-colors"
        >
          Voir en boutique
        </button>
      </div>
    </div>
  );
}
