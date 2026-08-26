"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Tutorial } from "@/types";
import { tutorialService } from "@/services";
import { genId } from "@/store/useCatalogStore";
import ImageDropzone from "@/components/admin/ImageDropzone";
import { Card, DraftBanner, Field, PrimaryButton, SecondaryButton, TextArea, TextInput } from "@/components/admin/AdminUi";
import Toggle from "@/components/ui/Toggle";
import { useAdminDraft } from "@/hooks/useAdminDraft";

function emptyTutorial(): Tutorial {
  return {
    id: genId("tutorial"),
    title: "",
    category: "",
    durationMin: 3,
    intro: "",
    gridSummary: "",
    steps: [],
    published: false,
  };
}

export default function TutorialForm({ initial }: { initial?: Tutorial }) {
  const router = useRouter();
  const [tuto, setTuto] = useState<Tutorial>(initial ?? emptyTutorial());
  const [saving, setSaving] = useState(false);
  const draft = useAdminDraft(`tutorial:${tuto.id}`, tuto, setTuto);

  const set = <K extends keyof Tutorial>(key: K, value: Tutorial[K]) =>
    setTuto((t) => ({ ...t, [key]: value }));

  const addStep = () => setTuto((t) => ({ ...t, steps: [...t.steps, { n: t.steps.length + 1, text: "" }] }));
  const removeStep = (i: number) =>
    setTuto((t) => ({ ...t, steps: t.steps.filter((_, idx) => idx !== i).map((s, idx) => ({ ...s, n: idx + 1 })) }));
  const setStepText = (i: number, text: string) =>
    setTuto((t) => {
      const steps = t.steps.slice();
      steps[i] = { ...steps[i], text };
      return { ...t, steps };
    });
  const moveStep = (i: number, dir: -1 | 1) =>
    setTuto((t) => {
      const j = i + dir;
      if (j < 0 || j >= t.steps.length) return t;
      const steps = t.steps.slice();
      [steps[i], steps[j]] = [steps[j], steps[i]];
      return { ...t, steps: steps.map((s, idx) => ({ ...s, n: idx + 1 })) };
    });

  const save = async () => {
    setSaving(true);
    try {
      await tutorialService.save(tuto);
      draft.clearDraft();
      router.push("/admin/tutorials");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl flex flex-col gap-5">
      {draft.hasDraft && <DraftBanner onRestore={draft.restore} onDismiss={draft.dismiss} />}
      <Card>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Titre">
            <TextInput value={tuto.title} onChange={(e) => set("title", e.target.value)} placeholder="Changer la cartouche" />
          </Field>
          <Field label="Catégorie (étiquette)" hint="Ex : PRISE EN MAIN, ENTRETIEN…">
            <TextInput value={tuto.category} onChange={(e) => set("category", e.target.value.toUpperCase())} />
          </Field>
          <Field label="Durée (minutes)">
            <TextInput
              type="number"
              min={1}
              value={tuto.durationMin}
              onChange={(e) => set("durationMin", Number(e.target.value))}
            />
          </Field>
          <Field label="Résumé court (carte / vidéo)">
            <TextInput value={tuto.gridSummary} onChange={(e) => set("gridSummary", e.target.value)} />
          </Field>
        </div>
        <div className="h-4" />
        <Field label="Introduction">
          <TextArea value={tuto.intro} onChange={(e) => set("intro", e.target.value)} />
        </Field>
      </Card>

      <Card>
        <ImageDropzone
          label="Image / miniature"
          images={tuto.image ? [tuto.image] : []}
          onChange={(images) => set("image", images[0])}
          folder="tutorials"
        />
      </Card>

      <Card>
        <div className="flex items-center justify-between mb-3">
          <div className="text-[14px] font-bold">Étapes</div>
          <SecondaryButton type="button" onClick={addStep}>
            + Ajouter une étape
          </SecondaryButton>
        </div>
        <div className="flex flex-col gap-2">
          {tuto.steps.map((s, i) => (
            <div key={i} className="flex gap-2 items-start">
              <div className="flex-none w-7 h-9 flex items-center justify-center text-[13px] font-bold text-ink-tertiary">
                {s.n}
              </div>
              <TextInput
                value={s.text}
                onChange={(e) => setStepText(i, e.target.value)}
                placeholder="Décrivez cette étape"
                className="flex-1"
              />
              <div className="flex flex-none gap-1">
                <button type="button" onClick={() => moveStep(i, -1)} disabled={i === 0} className="px-2 rounded-lg border border-border-strong text-ink-tertiary disabled:opacity-30">
                  ↑
                </button>
                <button type="button" onClick={() => moveStep(i, 1)} disabled={i === tuto.steps.length - 1} className="px-2 rounded-lg border border-border-strong text-ink-tertiary disabled:opacity-30">
                  ↓
                </button>
                <button type="button" onClick={() => removeStep(i)} className="px-2 rounded-lg border border-border-strong text-ink-tertiary hover:text-red-600 hover:border-red-200">
                  ×
                </button>
              </div>
            </div>
          ))}
          {tuto.steps.length === 0 && <div className="text-[13px] text-ink-tertiary">Aucune étape.</div>}
        </div>
      </Card>

      <Card className="flex items-center justify-between">
        <div>
          <div className="text-[14px] font-bold">Publication</div>
          <div className="text-[12.5px] text-ink-tertiary">Visible dans l&apos;app quand publié.</div>
        </div>
        <Toggle checked={tuto.published} onChange={() => set("published", !tuto.published)} />
      </Card>

      <div className="flex gap-2.5">
        <PrimaryButton onClick={save} disabled={saving || !tuto.title}>
          {saving ? "Enregistrement…" : "Enregistrer"}
        </PrimaryButton>
        <SecondaryButton type="button" onClick={() => router.push("/admin/tutorials")}>
          Annuler
        </SecondaryButton>
      </div>
    </div>
  );
}
