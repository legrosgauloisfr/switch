"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCatalogStore } from "@/store/useCatalogStore";
import { tutorialService } from "@/services";
import { AddLink, Card, PageHeader, StatusPill } from "@/components/admin/AdminUi";
import Toggle from "@/components/ui/Toggle";
import PhotoPlaceholder from "@/components/ui/PhotoPlaceholder";

export default function AdminTutorialsPage() {
  const router = useRouter();
  const tutorials = useCatalogStore((s) => s.tutorials);

  return (
    <div>
      <PageHeader
        title="Tutoriels"
        subtitle="Guides pas-à-pas affichés dans l'onglet Apprendre."
        action={<AddLink href="/admin/tutorials/new" label="Ajouter un tutoriel" />}
      />
      <div className="flex flex-col gap-2.5">
        {tutorials.map((t) => (
          <Card key={t.id} className="flex items-center gap-4">
            <div className="w-14 h-14 flex-none">
              <PhotoPlaceholder src={t.image} radius={10} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-bold text-[15px] truncate">{t.title || "(sans titre)"}</div>
              <div className="text-[13px] text-ink-secondary">{t.category} · {t.durationMin} min · {t.steps.length} étapes</div>
            </div>
            <StatusPill active={t.published} />
            <Toggle checked={t.published} onChange={() => tutorialService.save({ ...t, published: !t.published })} />
            <Link href={`/admin/tutorials/${t.id}`} className="text-primary text-[13.5px] font-semibold">
              Modifier
            </Link>
            <button
              onClick={async () => {
                const copy = await tutorialService.duplicate(t.id);
                if (copy) router.push(`/admin/tutorials/${copy.id}`);
              }}
              className="text-ink-secondary text-[13.5px] font-semibold hover:text-primary"
            >
              Dupliquer
            </button>
            <button
              onClick={() => {
                if (confirm(`Supprimer « ${t.title} » ?`)) tutorialService.remove(t.id);
              }}
              className="text-ink-tertiary text-[13.5px] font-semibold hover:text-red-600"
            >
              Supprimer
            </button>
          </Card>
        ))}
        {tutorials.length === 0 && (
          <Card className="text-center text-ink-tertiary text-[14px]">Aucun tutoriel pour l&apos;instant.</Card>
        )}
      </div>
    </div>
  );
}
