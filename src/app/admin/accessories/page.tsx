"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCatalogStore, genId } from "@/store/useCatalogStore";
import { accessoryService } from "@/services";
import { Card, PageHeader, PrimaryButton, SecondaryButton, StatusPill, TextInput } from "@/components/admin/AdminUi";
import Toggle from "@/components/ui/Toggle";
import type { Accessory } from "@/types";

export default function AdminAccessoriesPage() {
  const router = useRouter();
  const accessories = useCatalogStore((s) => s.accessories);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");

  const add = async () => {
    if (!name.trim()) return;
    const accessory: Accessory = {
      id: genId("accessory"),
      name: name.trim(),
      priceEur: price ? Number(price) : undefined,
      active: true,
    };
    await accessoryService.save(accessory);
    setName("");
    setPrice("");
  };

  return (
    <div>
      <PageHeader title="Accessoires" subtitle="Câbles, étuis, embouts… non liés à un appareil précis." />
      <Card className="flex gap-2.5 mb-4">
        <TextInput
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && add()}
          placeholder="Nom de l'accessoire"
          className="flex-1"
        />
        <TextInput
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && add()}
          placeholder="Prix (€)"
          type="number"
          className="w-32"
        />
        <PrimaryButton onClick={add} disabled={!name.trim()}>
          Ajouter
        </PrimaryButton>
      </Card>
      <div className="flex flex-col gap-2">
        {accessories.map((a) => (
          <Card key={a.id} className="flex items-center gap-4">
            <div className="flex-1">
              <TextInput
                defaultValue={a.name}
                onBlur={(e) => e.target.value.trim() && accessoryService.save({ ...a, name: e.target.value.trim() })}
              />
            </div>
            <TextInput
              defaultValue={a.priceEur ?? ""}
              onBlur={(e) => accessoryService.save({ ...a, priceEur: e.target.value ? Number(e.target.value) : undefined })}
              type="number"
              className="w-28"
            />
            <StatusPill active={a.active} />
            <Toggle checked={a.active} onChange={() => accessoryService.save({ ...a, active: !a.active })} />
            <SecondaryButton
              onClick={async () => {
                const copy = await accessoryService.duplicate(a.id);
                if (copy) router.refresh();
              }}
            >
              Dupliquer
            </SecondaryButton>
            <button
              onClick={() => confirm(`Supprimer « ${a.name} » ?`) && accessoryService.remove(a.id)}
              className="text-ink-tertiary text-[13.5px] font-semibold hover:text-red-600"
            >
              Supprimer
            </button>
          </Card>
        ))}
        {accessories.length === 0 && <Card className="text-center text-ink-tertiary text-[14px]">Aucun accessoire.</Card>}
      </div>
    </div>
  );
}
