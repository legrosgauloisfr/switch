"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { Brand, Flavor, Liquid } from "@/types";
import { liquidService, taxonomyService } from "@/services";
import { genId } from "@/store/useCatalogStore";
import ImageDropzone from "@/components/admin/ImageDropzone";
import { Card, DraftBanner, Field, PrimaryButton, SecondaryButton, Select, TextArea, TextInput } from "@/components/admin/AdminUi";
import Toggle from "@/components/ui/Toggle";
import { useAdminDraft } from "@/hooks/useAdminDraft";

function emptyLiquid(): Liquid {
  return {
    id: genId("liquid"),
    name: "",
    flavorTag: "",
    universe: "",
    description: "",
    specHint: "10 ml · ≈ 6 €",
    images: [],
    active: true,
  };
}

export default function LiquidForm({ initial }: { initial?: Liquid }) {
  const router = useRouter();
  const [liquid, setLiquid] = useState<Liquid>(initial ?? emptyLiquid());
  const [brands, setBrands] = useState<Brand[]>([]);
  const [flavors, setFlavors] = useState<Flavor[]>([]);
  const [saving, setSaving] = useState(false);
  const draft = useAdminDraft(`liquid:${liquid.id}`, liquid, setLiquid);

  useEffect(() => {
    taxonomyService.brands().then(setBrands);
    taxonomyService.flavors().then(setFlavors);
  }, []);

  const set = <K extends keyof Liquid>(key: K, value: Liquid[K]) =>
    setLiquid((l) => ({ ...l, [key]: value }));

  const save = async () => {
    setSaving(true);
    try {
      await liquidService.save(liquid);
      draft.clearDraft();
      router.push("/admin/liquids");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl flex flex-col gap-5">
      {draft.hasDraft && <DraftBanner onRestore={draft.restore} onDismiss={draft.dismiss} />}
      <Card>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Nom">
            <TextInput value={liquid.name} onChange={(e) => set("name", e.target.value)} placeholder="Fruits rouges" />
          </Field>
          <Field label="Marque">
            <Select value={liquid.brandId ?? ""} onChange={(e) => set("brandId", e.target.value || undefined)}>
              <option value="">—</option>
              {brands.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Famille de saveur" hint="Utilisée pour matcher les réponses du questionnaire">
            <Select value={liquid.flavorTag} onChange={(e) => set("flavorTag", e.target.value)}>
              <option value="">—</option>
              {flavors.map((f) => (
                <option key={f.id} value={f.name}>
                  {f.name}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Univers affiché" hint="Ex : Fruité, Frais, Gourmand…">
            <TextInput value={liquid.universe} onChange={(e) => set("universe", e.target.value)} />
          </Field>
          <Field label="Format / prix" hint="Ex : 10 ml · ≈ 6 €">
            <TextInput value={liquid.specHint} onChange={(e) => set("specHint", e.target.value)} />
          </Field>
        </div>
      </Card>

      <Card>
        <Field label="Description">
          <TextArea value={liquid.description} onChange={(e) => set("description", e.target.value)} />
        </Field>
      </Card>

      <Card>
        <ImageDropzone images={liquid.images} onChange={(images) => set("images", images)} folder="liquids" />
      </Card>

      <Card className="flex items-center justify-between">
        <div>
          <div className="text-[14px] font-bold">Statut</div>
          <div className="text-[12.5px] text-ink-tertiary">Visible dans les recommandations quand actif.</div>
        </div>
        <Toggle checked={liquid.active} onChange={() => set("active", !liquid.active)} />
      </Card>

      <div className="flex gap-2.5">
        <PrimaryButton onClick={save} disabled={saving || !liquid.name}>
          {saving ? "Enregistrement…" : "Enregistrer"}
        </PrimaryButton>
        <SecondaryButton type="button" onClick={() => router.push("/admin/liquids")}>
          Annuler
        </SecondaryButton>
      </div>
    </div>
  );
}
