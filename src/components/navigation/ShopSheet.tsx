"use client";

import { useRouter } from "next/navigation";
import { useUiStore } from "@/store/useUiStore";

export default function ShopSheet() {
  const shopProduct = useUiStore((s) => s.shopProduct);
  const closeShop = useUiStore((s) => s.closeShop);
  const router = useRouter();

  if (!shopProduct) return null;

  return (
    <div className="absolute inset-0 z-40 flex flex-col justify-end bg-black/40 anim-scIn">
      <div className="bg-bg rounded-t-[26px] px-6 pt-6 pb-10">
        <div className="w-10 h-1 rounded bg-black/15 mx-auto mb-5" />
        <div className="text-[21px] font-bold leading-tight">Vous allez quitter Switch</div>
        <p className="mt-2.5 text-[14.5px] leading-relaxed text-ink-secondary text-pretty">
          Ce produit est vendu par une boutique partenaire. La vérification d&apos;âge et la
          vente sont assurées par le vendeur.
        </p>
        <div className="mt-[18px] p-4 rounded-2xl bg-surface border border-border flex items-center gap-3.5">
          <div className="flex-none w-11 h-11 rounded-xl bg-[repeating-linear-gradient(135deg,#F1F0EC_0_6px,#E7E6E1_6px_12px)]" />
          <div className="flex-1">
            <div className="text-[14.5px] font-bold">Boutique partenaire</div>
            <div className="mt-0.5 text-[12.5px] text-ink-tertiary">
              {shopProduct.name} · {shopProduct.priceEur} €
            </div>
          </div>
        </div>
        <div className="mt-3.5 flex gap-2.5 items-start p-3.5 rounded-2xl bg-affiliate-bg border border-affiliate-border">
          <div className="flex-none w-1.5 h-1.5 rounded-full bg-affiliate-dot mt-1.5" />
          <p className="text-[12.5px] leading-relaxed text-affiliate-ink text-pretty">
            Lien partenaire rémunéré. Switch peut recevoir une commission si vous effectuez un
            achat. Cela ne modifie pas nos recommandations.
          </p>
        </div>
        <div className="mt-5 flex flex-col gap-2.5">
          <button
            type="button"
            onClick={() => {
              closeShop();
              router.push("/home");
            }}
            className="h-[54px] rounded-2xl bg-primary text-white font-bold text-[15.5px] hover:bg-primary-hover transition-colors"
          >
            Continuer vers la boutique
          </button>
          <button
            type="button"
            onClick={closeShop}
            className="h-[50px] text-ink-secondary font-semibold text-[14.5px] hover:text-primary transition-colors"
          >
            Rester dans Switch
          </button>
        </div>
      </div>
    </div>
  );
}
