"use client";

import { useState } from "react";
import { useCatalogStore } from "@/store/useCatalogStore";
import { contentService } from "@/services";
import { genId } from "@/store/useCatalogStore";
import { Card, PageHeader, PrimaryButton, SecondaryButton, StatusPill, TextArea, TextInput } from "@/components/admin/AdminUi";
import Toggle from "@/components/ui/Toggle";
import type { FaqItem } from "@/types";

export default function AdminFaqPage() {
  const faq = [...useCatalogStore((s) => s.faq)].sort((a, b) => a.sortOrder - b.sortOrder);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  const add = async () => {
    if (!question.trim() || !answer.trim()) return;
    const item: FaqItem = {
      id: genId("faq"),
      question: question.trim(),
      answer: answer.trim(),
      published: true,
      sortOrder: faq.length,
    };
    await contentService.saveFaq(item);
    setQuestion("");
    setAnswer("");
  };

  return (
    <div>
      <PageHeader title="Questions fréquentes" subtitle="Affichées dans Apprendre → Questions fréquentes." />
      <Card className="flex flex-col gap-2.5 mb-4">
        <TextInput value={question} onChange={(e) => setQuestion(e.target.value)} placeholder="Question" />
        <TextArea value={answer} onChange={(e) => setAnswer(e.target.value)} placeholder="Réponse" />
        <PrimaryButton onClick={add} disabled={!question.trim() || !answer.trim()} className="self-start">
          Ajouter
        </PrimaryButton>
      </Card>
      <div className="flex flex-col gap-2.5">
        {faq.map((f, i) => (
          <Card key={f.id}>
            <div className="flex items-start gap-3">
              <div className="flex-none flex flex-col gap-1 pt-1">
                <button onClick={() => contentService.reorderFaq(f.id, -1)} disabled={i === 0} className="text-ink-tertiary disabled:opacity-30">
                  ↑
                </button>
                <button onClick={() => contentService.reorderFaq(f.id, 1)} disabled={i === faq.length - 1} className="text-ink-tertiary disabled:opacity-30">
                  ↓
                </button>
              </div>
              <div className="flex-1 flex flex-col gap-2">
                <TextInput
                  defaultValue={f.question}
                  onBlur={(e) => e.target.value.trim() && contentService.saveFaq({ ...f, question: e.target.value.trim() })}
                  className="font-semibold"
                />
                <TextArea
                  defaultValue={f.answer}
                  onBlur={(e) => e.target.value.trim() && contentService.saveFaq({ ...f, answer: e.target.value.trim() })}
                />
              </div>
              <div className="flex-none flex flex-col items-end gap-2">
                <StatusPill active={f.published} />
                <Toggle checked={f.published} onChange={() => contentService.saveFaq({ ...f, published: !f.published })} />
                <SecondaryButton
                  onClick={() => confirm("Supprimer cette question ?") && contentService.removeFaq(f.id)}
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
