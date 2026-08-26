"use client";

import { useParams } from "next/navigation";
import { useCatalogStore } from "@/store/useCatalogStore";
import LiquidForm from "@/components/admin/LiquidForm";
import { PageHeader } from "@/components/admin/AdminUi";

export default function EditLiquidPage() {
  const { id } = useParams<{ id: string }>();
  const liquid = useCatalogStore((s) => s.liquids.find((l) => l.id === id));

  if (!liquid) {
    return <div className="text-ink-tertiary">E-liquide introuvable.</div>;
  }

  return (
    <div>
      <PageHeader title={`Modifier « ${liquid.name} »`} />
      <LiquidForm key={liquid.id} initial={liquid} />
    </div>
  );
}
