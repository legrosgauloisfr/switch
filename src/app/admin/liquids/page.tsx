"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCatalogStore } from "@/store/useCatalogStore";
import { liquidService } from "@/services";
import { AddLink, Card, PageHeader, StatusPill } from "@/components/admin/AdminUi";
import Toggle from "@/components/ui/Toggle";
import PhotoPlaceholder from "@/components/ui/PhotoPlaceholder";

export default function AdminLiquidsPage() {
  const router = useRouter();
  const liquids = useCatalogStore((s) => s.liquids);

  return (
    <div>
      <PageHeader
        title="E-liquides"
        subtitle="Flacons proposés dans la sélection « e-liquides pour démarrer »."
        action={
          <div className="flex gap-2.5">
            <Link
              href="/admin/liquids/import"
              className="px-4 py-2.5 rounded-lg border border-border-strong bg-white text-ink text-[14px] font-semibold hover:border-primary/45 transition-colors"
            >
              Importer CSV
            </Link>
            <AddLink href="/admin/liquids/new" label="Ajouter un e-liquide" />
          </div>
        }
      />
      <div className="flex flex-col gap-2.5">
        {liquids.map((l) => (
          <Card key={l.id} className="flex items-center gap-4">
            <div className="w-14 h-14 flex-none">
              <PhotoPlaceholder src={l.images[0]} radius={10} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-bold text-[15px] truncate">{l.name || "(sans nom)"}</div>
              <div className="text-[13px] text-ink-secondary">{l.universe} · {l.flavorTag}</div>
            </div>
            <StatusPill active={l.active} />
            <Toggle checked={l.active} onChange={() => liquidService.save({ ...l, active: !l.active })} />
            <Link href={`/admin/liquids/${l.id}`} className="text-primary text-[13.5px] font-semibold">
              Modifier
            </Link>
            <button
              onClick={async () => {
                const copy = await liquidService.duplicate(l.id);
                if (copy) router.push(`/admin/liquids/${copy.id}`);
              }}
              className="text-ink-secondary text-[13.5px] font-semibold hover:text-primary"
            >
              Dupliquer
            </button>
            <button
              onClick={() => {
                if (confirm(`Supprimer « ${l.name} » ?`)) liquidService.remove(l.id);
              }}
              className="text-ink-tertiary text-[13.5px] font-semibold hover:text-red-600"
            >
              Supprimer
            </button>
          </Card>
        ))}
        {liquids.length === 0 && (
          <Card className="text-center text-ink-tertiary text-[14px]">Aucun e-liquide pour l&apos;instant.</Card>
        )}
      </div>
    </div>
  );
}
