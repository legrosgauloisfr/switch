"use client";

import { useState } from "react";
import { useCatalogStore } from "@/store/useCatalogStore";
import { taxonomyService } from "@/services";
import { genId } from "@/store/useCatalogStore";
import { Card, PageHeader, PrimaryButton, StatusPill, TextInput } from "@/components/admin/AdminUi";
import Toggle from "@/components/ui/Toggle";
import type { Category } from "@/types";

const slugify = (s: string) =>
  s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

export default function AdminCategoriesPage() {
  const categories = useCatalogStore((s) => s.categories);
  const [name, setName] = useState("");

  const add = async () => {
    if (!name.trim()) return;
    const category: Category = { id: genId("category"), name: name.trim(), slug: slugify(name), active: true };
    await taxonomyService.saveCategory(category);
    setName("");
  };

  return (
    <div>
      <PageHeader title="Catégories" subtitle="Regroupements utilisés pour organiser le catalogue." />
      <Card className="flex gap-2.5 mb-4">
        <TextInput
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && add()}
          placeholder="Nom de la catégorie"
          className="flex-1"
        />
        <PrimaryButton onClick={add} disabled={!name.trim()}>
          Ajouter
        </PrimaryButton>
      </Card>
      <div className="flex flex-col gap-2">
        {categories.map((c) => (
          <Card key={c.id} className="flex items-center gap-4">
            <div className="flex-1">
              <TextInput
                defaultValue={c.name}
                onBlur={(e) =>
                  e.target.value.trim() &&
                  taxonomyService.saveCategory({ ...c, name: e.target.value.trim(), slug: slugify(e.target.value) })
                }
              />
              <div className="mt-1 text-[11.5px] text-ink-quaternary">/{c.slug}</div>
            </div>
            <StatusPill active={c.active} />
            <Toggle checked={c.active} onChange={() => taxonomyService.saveCategory({ ...c, active: !c.active })} />
            <button
              onClick={() => confirm(`Supprimer « ${c.name} » ?`) && taxonomyService.removeCategory(c.id)}
              className="text-ink-tertiary text-[13.5px] font-semibold hover:text-red-600"
            >
              Supprimer
            </button>
          </Card>
        ))}
        {categories.length === 0 && <Card className="text-center text-ink-tertiary text-[14px]">Aucune catégorie.</Card>}
      </div>
    </div>
  );
}
