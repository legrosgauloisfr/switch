"use client";

import { useState } from "react";
import { useCatalogStore } from "@/store/useCatalogStore";
import { contentService } from "@/services";
import { genId } from "@/store/useCatalogStore";
import { Card, PageHeader, PrimaryButton, SecondaryButton, StatusPill, TextArea, TextInput } from "@/components/admin/AdminUi";
import Toggle from "@/components/ui/Toggle";
import type { AdviceItem } from "@/types";

export default function AdminAdvicePage() {
  const advice = [...useCatalogStore((s) => s.advice)].sort((a, b) => a.sortOrder - b.sortOrder);
  const [tag, setTag] = useState("");
  const [text, setText] = useState("");

  const add = async () => {
    if (!tag.trim() || !text.trim()) return;
    const item: AdviceItem = {
      id: genId("advice"),
      tag: tag.trim().toUpperCase(),
      text: text.trim(),
      published: true,
      sortOrder: advice.length,
    };
    await contentService.saveAdvice(item);
    setTag("");
    setText("");
  };

  return (
    <div>
      <PageHeader title="Conseils" subtitle="Affichés dans Apprendre → Conseils du jour et le Parcours." />
      <Card className="flex flex-col gap-2.5 mb-4">
        <TextInput value={tag} onChange={(e) => setTag(e.target.value)} placeholder="Étiquette (ex : HABITUDES)" />
        <TextArea value={text} onChange={(e) => setText(e.target.value)} placeholder="Texte du conseil" />
        <PrimaryButton onClick={add} disabled={!tag.trim() || !text.trim()} className="self-start">
          Ajouter
        </PrimaryButton>
      </Card>
      <div className="flex flex-col gap-2.5">
        {advice.map((a, i) => (
          <Card key={a.id}>
            <div className="flex items-start gap-3">
              <div className="flex-none flex flex-col gap-1 pt-1">
                <button onClick={() => contentService.reorderAdvice(a.id, -1)} disabled={i === 0} className="text-ink-tertiary disabled:opacity-30">
                  ↑
                </button>
                <button onClick={() => contentService.reorderAdvice(a.id, 1)} disabled={i === advice.length - 1} className="text-ink-tertiary disabled:opacity-30">
                  ↓
                </button>
              </div>
              <div className="flex-1 flex flex-col gap-2">
                <TextInput
                  defaultValue={a.tag}
                  onBlur={(e) => e.target.value.trim() && contentService.saveAdvice({ ...a, tag: e.target.value.trim().toUpperCase() })}
                  className="font-semibold w-48"
                />
                <TextArea
                  defaultValue={a.text}
                  onBlur={(e) => e.target.value.trim() && contentService.saveAdvice({ ...a, text: e.target.value.trim() })}
                />
              </div>
              <div className="flex-none flex flex-col items-end gap-2">
                <StatusPill active={a.published} />
                <Toggle checked={a.published} onChange={() => contentService.saveAdvice({ ...a, published: !a.published })} />
                <SecondaryButton
                  onClick={() => confirm("Supprimer ce conseil ?") && contentService.removeAdvice(a.id)}
                  className="!border-red-200 !text-red-600"
                >
                  Supprimer
                </SecondaryButton>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
