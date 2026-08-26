"use client";

import { useParams } from "next/navigation";
import { useCatalogStore } from "@/store/useCatalogStore";
import TutorialForm from "@/components/admin/TutorialForm";
import { PageHeader } from "@/components/admin/AdminUi";

export default function EditTutorialPage() {
  const { id } = useParams<{ id: string }>();
  const tuto = useCatalogStore((s) => s.tutorials.find((t) => t.id === id));

  if (!tuto) {
    return <div className="text-ink-tertiary">Tutoriel introuvable.</div>;
  }

  return (
    <div>
      <PageHeader title={`Modifier « ${tuto.title} »`} />
      <TutorialForm key={tuto.id} initial={tuto} />
    </div>
  );
}
