"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useRequireOnboarding } from "@/hooks/useGuard";
import { useUserStore } from "@/store/useAppStore";
import { recommendationService } from "@/services";
import type { RecommendationResult } from "@/types";
import BackButton from "@/components/ui/BackButton";
import StatDots from "@/components/ui/StatDots";

export default function ComparePage() {
  useRequireOnboarding();
  const router = useRouter();
  const answers = useUserStore((s) => s.answers);
  const [result, setResult] = useState<RecommendationResult | null>(null);

  useEffect(() => {
    let alive = true;
    recommendationService.build(answers).then((r) => alive && setResult(r));
    return () => {
      alive = false;
    };
  }, [answers]);

  if (!result) return null;
  const [top, alt] = result.products;
  if (!top) return null;

  const specKeys = Array.from(
    new Set([...top.product.specs.map((s) => s.key), ...(alt?.product.specs.map((s) => s.key) ?? [])])
  );
  const specVal = (p: typeof top.product, key: string) => p.specs.find((s) => s.key === key)?.value ?? "—";

  return (
    <div className="absolute inset-0 flex flex-col anim-scIn">
      <div className="flex-1 overflow-y-auto px-[22px] pt-[62px] pb-[34px]">
        <BackButton />
        <h1 className="mt-[18px] px-1 text-[25px] font-bold leading-tight">Comparaison</h1>

        <div className="mt-5 border border-border rounded-[20px] bg-surface overflow-hidden">
          <div className="grid grid-cols-[1.1fr_1fr_1fr]">
            <div className="p-4" />
            <div className="p-3.5 border-l border-border bg-primary-tint">
              <div className="text-[9.5px] font-extrabold tracking-wide text-primary">LE PLUS ADAPTÉ</div>
              <div className="mt-1 text-[14px] font-bold leading-tight">{top.product.name}</div>
            </div>
            {alt && (
              <div className="p-3.5 border-l border-border">
                <div className="text-[9.5px] font-extrabold tracking-wide text-ink-quaternary">ALTERNATIVE</div>
                <div className="mt-1 text-[14px] font-bold leading-tight">{alt.product.name}</div>
              </div>
            )}
          </div>

          <Row label="Prix" a={`${top.product.priceEur} €`} b={alt ? `${alt.product.priceEur} €` : "—"} />
          <Row
            label="Simplicité"
            a={<StatDots value={top.product.simplicity} />}
            b={alt ? <StatDots value={alt.product.simplicity} /> : "—"}
          />
          <Row
            label="Autonomie"
            a={<StatDots value={top.product.autonomy} />}
            b={alt ? <StatDots value={alt.product.autonomy} /> : "—"}
          />
          <Row label="Consommables" a={top.product.runningCostLabel} b={alt?.product.runningCostLabel ?? "—"} />
          {specKeys.map((key) => (
            <Row
              key={key}
              label={key}
              a={specVal(top.product, key)}
              b={alt ? specVal(alt.product, key) : "—"}
            />
          ))}
        </div>

        <div className="mt-[18px] p-4 rounded-2xl bg-primary-tint text-[13.5px] leading-relaxed text-[#3C444B] text-pretty">
          {top.why}
        </div>

        <button
          onClick={() => router.push(`/product/${top.product.id}`)}
          className="w-full h-[54px] mt-[18px] rounded-2xl bg-primary text-white font-bold text-[15.5px] hover:bg-primary-hover transition-colors"
        >
          Voir le {top.product.name}
        </button>
      </div>
    </div>
  );
}

function Row({ label, a, b }: { label: string; a: React.ReactNode; b: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[1.1fr_1fr_1fr] border-t border-border">
      <div className="p-3.5 text-[13px] font-semibold text-ink-tertiary">{label}</div>
      <div className="p-3.5 border-l border-border bg-[#FAFBFC] text-[13.5px] font-semibold">{a}</div>
      <div className="p-3.5 border-l border-border text-[13.5px] font-semibold">{b}</div>
    </div>
  );
}
