"use client";

import Link from "next/link";
import { useCatalogStore } from "@/store/useCatalogStore";
import { articleService } from "@/services";
import { AddLink, Card, PageHeader, StatusPill } from "@/components/admin/AdminUi";
import Toggle from "@/components/ui/Toggle";
import PhotoPlaceholder from "@/components/ui/PhotoPlaceholder";

export default function AdminArticlesPage() {
  const articles = [...useCatalogStore((s) => s.articles)].sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <div>
      <PageHeader
        title="Articles"
        subtitle="Guides et contenus pédagogiques affichés dans Apprendre → Articles."
        action={<AddLink href="/admin/articles/new" label="Ajouter un article" />}
      />
      <div className="flex flex-col gap-2.5">
        {articles.map((a, i) => (
          <Card key={a.id} className="flex items-center gap-4">
            <div className="w-14 h-14 flex-none">
              <PhotoPlaceholder src={a.image} radius={10} />
            </div>
            <div className="flex-none flex flex-col gap-1">
              <button onClick={() => articleService.reorder(a.id, -1)} disabled={i === 0} className="text-ink-tertiary disabled:opacity-30 text-[12px]">
                ↑
              </button>
              <button onClick={() => articleService.reorder(a.id, 1)} disabled={i === articles.length - 1} className="text-ink-tertiary disabled:opacity-30 text-[12px]">
                ↓
              </button>
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-bold text-[15px] truncate">{a.title || "(sans titre)"}</div>
              <div className="text-[13px] text-ink-secondary">{a.category}</div>
            </div>
            <StatusPill active={a.published} />
            <Toggle checked={a.published} onChange={() => articleService.save({ ...a, published: !a.published })} />
            <Link href={`/admin/articles/${a.id}`} className="text-primary text-[13.5px] font-semibold">
              Modifier
            </Link>
            <button
              onClick={() => confirm(`Supprimer « ${a.title} » ?`) && articleService.remove(a.id)}
              className="text-ink-tertiary text-[13.5px] font-semibold hover:text-red-600"
            >
              Supprimer
            </button>
          </Card>
        ))}
        {articles.length === 0 && <Card className="text-center text-ink-tertiary text-[14px]">Aucun article.</Card>}
      </div>
    </div>
  );
}
