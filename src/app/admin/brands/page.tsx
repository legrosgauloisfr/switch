"use client";

import { useState } from "react";
import { useCatalogStore } from "@/store/useCatalogStore";
import { taxonomyService } from "@/services";
import { genId } from "@/store/useCatalogStore";
import { Card, PageHeader, PrimaryButton, StatusPill, TextInput } from "@/components/admin/AdminUi";
import Toggle from "@/components/ui/Toggle";
import type { Brand } from "@/types";

export default function AdminBrandsPage() {
  const brands = useCatalogStore((s) => s.brands);
  const [name, setName] = useState("");

  const add = async () => {
    if (!name.trim()) return;
    const brand: Brand = { id: genId("brand"), name: name.trim(), active: true };
    await taxonomyService.saveBrand(brand);
    setName("");
  };

  return (
    <div>
      <PageHeader title="Marques" subtitle="Utilisées dans les fiches appareils et e-liquides." />
      <Card className="flex gap-2.5 mb-4">
        <TextInput
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && add()}
          placeholder="Nom de la marque"
          className="flex-1"
        />
        <PrimaryButton onClick={add} disabled={!name.trim()}>
          Ajouter
        </PrimaryButton>
      </Card>
      <div className="flex flex-col gap-2">
        {brands.map((b) => (
          <Card key={b.id} className="flex items-center gap-4">
            <TextInput
              defaultValue={b.name}
              onBlur={(e) => e.target.value.trim() && taxonomyService.saveBrand({ ...b, name: e.target.value.trim() })}
              className="flex-1"
            />
            <StatusPill active={b.active} />
            <Toggle checked={b.active} onChange={() => taxonomyService.saveBrand({ ...b, active: !b.active })} />
            <button
              onClick={() => confirm(`Supprimer « ${b.name} » ?`) && taxonomyService.removeBrand(b.id)}
              className="text-ink-tertiary text-[13.5px] font-semibold hover:text-red-600"
            >
              Supprimer
            </button>
          </Card>
        ))}
        {brands.length === 0 && <Card className="text-center text-ink-tertiary text-[14px]">Aucune marque.</Card>}
      </div>
    </div>
  );
}
