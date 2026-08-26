"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCatalogStore } from "@/store/useCatalogStore";
import { productService } from "@/services";
import { AddLink, Card, PageHeader, StatusPill } from "@/components/admin/AdminUi";
import Toggle from "@/components/ui/Toggle";
import PhotoPlaceholder from "@/components/ui/PhotoPlaceholder";

export default function AdminProductsPage() {
  const router = useRouter();
  const products = useCatalogStore((s) => s.products);

  return (
    <div>
      <PageHeader
        title="Appareils"
        subtitle="Pods, kits, dispositifs — visibles dans les recommandations quand actifs."
        action={
          <div className="flex gap-2.5">
            <Link
              href="/admin/products/import"
              className="px-4 py-2.5 rounded-lg border border-border-strong bg-white text-ink text-[14px] font-semibold hover:border-primary/45 transition-colors"
            >
              Importer CSV
            </Link>
            <AddLink href="/admin/products/new" label="Ajouter un appareil" />
          </div>
        }
      />
      <div className="flex flex-col gap-2.5">
        {products.map((p) => (
          <Card key={p.id} className="flex items-center gap-4">
            <div className="w-14 h-14 flex-none">
              <PhotoPlaceholder src={p.images[0]} radius={10} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-bold text-[15px] truncate">{p.name || "(sans nom)"}</div>
              <div className="text-[13px] text-ink-secondary">{p.kind} · {p.priceEur} €</div>
            </div>
            <StatusPill active={p.active} />
            <Toggle
              checked={p.active}
              onChange={() => productService.save({ ...p, active: !p.active })}
            />
            <Link href={`/admin/products/${p.id}`} className="text-primary text-[13.5px] font-semibold">
              Modifier
            </Link>
            <button
              onClick={async () => {
                const copy = await productService.duplicate(p.id);
                if (copy) router.push(`/admin/products/${copy.id}`);
              }}
              className="text-ink-secondary text-[13.5px] font-semibold hover:text-primary"
            >
              Dupliquer
            </button>
            <button
              onClick={() => {
                if (confirm(`Supprimer « ${p.name} » ?`)) productService.remove(p.id);
              }}
              className="text-ink-tertiary text-[13.5px] font-semibold hover:text-red-600"
            >
              Supprimer
            </button>
          </Card>
        ))}
        {products.length === 0 && (
          <Card className="text-center text-ink-tertiary text-[14px]">Aucun appareil pour l&apos;instant.</Card>
        )}
      </div>
    </div>
  );
}
