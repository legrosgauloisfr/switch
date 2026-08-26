"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Article } from "@/types";
import { articleService } from "@/services";
import { genId } from "@/store/useCatalogStore";
import ImageDropzone from "@/components/admin/ImageDropzone";
import { Card, Field, PrimaryButton, SecondaryButton, TextArea, TextInput } from "@/components/admin/AdminUi";
import Toggle from "@/components/ui/Toggle";

function emptyArticle(): Article {
  return {
    id: genId("article"),
    title: "",
    category: "Guide",
    excerpt: "",
    body: "",
    published: false,
    sortOrder: 0,
  };
}

export default function ArticleForm({ initial }: { initial?: Article }) {
  const router = useRouter();
  const [article, setArticle] = useState<Article>(initial ?? emptyArticle());
  const [saving, setSaving] = useState(false);

  const set = <K extends keyof Article>(key: K, value: Article[K]) =>
    setArticle((a) => ({ ...a, [key]: value }));

  const save = async () => {
    setSaving(true);
    try {
      await articleService.save(article);
      router.push("/admin/articles");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl flex flex-col gap-5">
      <Card>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Titre">
            <TextInput value={article.title} onChange={(e) => set("title", e.target.value)} />
          </Field>
          <Field label="Catégorie" hint="Ex : Guide, Réglementation, FAQ…">
            <TextInput value={article.category} onChange={(e) => set("category", e.target.value)} />
          </Field>
        </div>
        <div className="h-4" />
        <Field label="Résumé" hint="Affiché dans les listes.">
          <TextArea value={article.excerpt} onChange={(e) => set("excerpt", e.target.value)} />
        </Field>
        <div className="h-4" />
        <Field label="Contenu" hint="Un paragraphe par ligne vide.">
          <TextArea value={article.body} onChange={(e) => set("body", e.target.value)} className="min-h-64" />
        </Field>
      </Card>

      <Card>
        <ImageDropzone
          label="Illustration"
          images={article.image ? [article.image] : []}
          onChange={(images) => set("image", images[0])}
          folder="articles"
        />
      </Card>

      <Card className="flex items-center justify-between">
        <div>
          <div className="text-[14px] font-bold">Publication</div>
          <div className="text-[12.5px] text-ink-tertiary">Visible dans l&apos;app quand publié.</div>
        </div>
        <Toggle checked={article.published} onChange={() => set("published", !article.published)} />
      </Card>

      <div className="flex gap-2.5">
        <PrimaryButton onClick={save} disabled={saving || !article.title}>
          {saving ? "Enregistrement…" : "Enregistrer"}
        </PrimaryButton>
        <SecondaryButton type="button" onClick={() => router.push("/admin/articles")}>
          Annuler
        </SecondaryButton>
      </div>
    </div>
  );
}
