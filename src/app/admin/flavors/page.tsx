"use client";

import { useState } from "react";
import { useCatalogStore } from "@/store/useCatalogStore";
import { taxonomyService } from "@/services";
import { genId } from "@/store/useCatalogStore";
import { Card, PageHeader, PrimaryButton, TextInput } from "@/components/admin/AdminUi";
import Toggle from "@/components/ui/Toggle";
import type { Flavor } from "@/types";

export default function AdminFlavorsPage() {
  const flavors = useCatalogStore((s) => s.flavors);
  const [name, setName] = useState("");

  const add = async () => {
    if (!name.trim()) return;
    const flavor: Flavor = { id: genId("flavor"), name: name.trim(), active: true };
    await taxonomyService.saveFlavor(flavor);
    setName("");
  };

  return (
    <div>
      <PageHeader
        title="Saveurs"
        subtitle="Tags utilisés dans le questionnaire et pour matcher les e-liquides. Ex : « Fruits rouges »."
      />
      <Card className="flex gap-2.5 mb-4">
        <TextInput
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && add()}
          placeholder="Nom de la saveur"
          className="flex-1"
        />
        <PrimaryButton onClick={add} disabled={!name.trim()}>
          Ajouter
        </PrimaryButton>
      </Card>
      <div className="flex flex-wrap gap-2">
        {flavors.map((f) => (
          <div
            key={f.id}
            className="flex items-center gap-2.5 pl-3.5 pr-2.5 py-2 rounded-full border border-border-strong bg-white"
          >
            <span className={`text-[13.5px] font-semibold ${f.active ? "" : "text-ink-quaternary line-through"}`}>
              {f.name}
            </span>
            <Toggle checked={f.active} onChange={() => taxonomyService.saveFlavor({ ...f, active: !f.active })} />
            <button
              onClick={() => confirm(`Supprimer « ${f.name} » ?`) && taxonomyService.removeFlavor(f.id)}
              className="text-ink-tertiary hover:text-red-600 text-[13px]"
            >
              ×
            </button>
          </div>
        ))}
        {flavors.length === 0 && <Card className="text-center text-ink-tertiary text-[14px]">Aucune saveur.</Card>}
      </div>
    </div>
  );
}
