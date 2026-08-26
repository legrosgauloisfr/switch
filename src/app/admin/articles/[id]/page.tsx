"use client";

import { useParams } from "next/navigation";
import { useCatalogStore } from "@/store/useCatalogStore";
import ArticleForm from "@/components/admin/ArticleForm";
import { PageHeader } from "@/components/admin/AdminUi";

export default function EditArticlePage() {
  const { id } = useParams<{ id: string }>();
  const article = useCatalogStore((s) => s.articles.find((a) => a.id === id));

  if (!article) {
    return <div className="text-ink-tertiary">Article introuvable.</div>;
  }

  return (
    <div>
      <PageHeader title={`Modifier « ${article.title} »`} />
      <ArticleForm key={article.id} initial={article} />
    </div>
  );
}
