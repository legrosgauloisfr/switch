"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { Brand, BudgetTier, Cartridge, FormatTag, Product, ProductSpec, Resistance, SimplicityTag } from "@/types";
import { partsService, productService, taxonomyService } from "@/services";
import { genId } from "@/store/useCatalogStore";
import ImageDropzone from "@/components/admin/ImageDropzone";
import { Card, DraftBanner, Field, PrimaryButton, SecondaryButton, Select, TextArea, TextInput } from "@/components/admin/AdminUi";
import Toggle from "@/components/ui/Toggle";
import { useAdminDraft } from "@/hooks/useAdminDraft";

const FORMAT_OPTIONS: { value: FormatTag; label: string }[] = [
  { value: "compact", label: "Compact" },
  { value: "standard", label: "Standard / classique" },
  { value: "autonomous", label: "Plus autonome" },
];
const SIMPLICITY_TAG_OPTIONS: { value: SimplicityTag; label: string }[] = [
  { value: "simple", label: "Simple" },
  { value: "customizable", label: "Personnalisable" },
  { value: "unsure", label: "Indécis" },
];
const BUDGET_OPTIONS: { value: BudgetTier; label: string }[] = [
  { value: "low", label: "Moins de 30 €" },
  { value: "mid", label: "30–50 €" },
  { value: "mid-high", label: "50–80 €" },
  { value: "high", label: "80 € et plus" },
];

function emptyProduct(): Product {
  return {
    id: genId("product"),
    name: "",
    kind: "",
    priceEur: 0,
    runningCostLabel: "",
    simplicity: 3,
    autonomy: 3,
    formatTag: "compact",
    simplicityTag: "simple",
    budgetTier: "mid",
    specs: [],
    images: [],
    active: true,
  };
}

export default function ProductForm({ initial }: { initial?: Product }) {
  const router = useRouter();
  const [product, setProduct] = useState<Product>(initial ?? emptyProduct());
  const [brands, setBrands] = useState<Brand[]>([]);
  const [saving, setSaving] = useState(false);
  const isEditing = !!initial;
  const draft = useAdminDraft(`product:${product.id}`, product, setProduct);

  const [cartridges, setCartridges] = useState<Cartridge[]>([]);
  const [resistances, setResistances] = useState<Resistance[]>([]);

  useEffect(() => {
    taxonomyService.brands().then(setBrands);
    if (isEditing) {
      partsService.cartridgesFor(product.id).then(setCartridges);
      partsService.resistancesFor(product.id).then(setResistances);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addCartridge = async () => {
    const c = await partsService.saveCartridge({
      id: genId("cartridge"),
      deviceId: product.id,
      name: "Nouvelle cartouche",
      active: true,
    });
    setCartridges((list) => [...list, c]);
  };
  const updateCartridge = async (c: Cartridge, patch: Partial<Cartridge>) => {
    const next = { ...c, ...patch };
    await partsService.saveCartridge(next);
    setCartridges((list) => list.map((x) => (x.id === c.id ? next : x)));
  };
  const removeCartridge = async (id: string) => {
    await partsService.removeCartridge(id);
    setCartridges((list) => list.filter((c) => c.id !== id));
  };

  const addResistance = async () => {
    const r = await partsService.saveResistance({
      id: genId("resistance"),
      deviceId: product.id,
      name: "Nouvelle résistance",
      active: true,
    });
    setResistances((list) => [...list, r]);
  };
  const updateResistance = async (r: Resistance, patch: Partial<Resistance>) => {
    const next = { ...r, ...patch };
    await partsService.saveResistance(next);
    setResistances((list) => list.map((x) => (x.id === r.id ? next : x)));
  };
  const removeResistance = async (id: string) => {
    await partsService.removeResistance(id);
    setResistances((list) => list.filter((r) => r.id !== id));
  };

  const set = <K extends keyof Product>(key: K, value: Product[K]) =>
    setProduct((p) => ({ ...p, [key]: value }));

  const setSpec = (i: number, patch: Partial<ProductSpec>) =>
    setProduct((p) => {
      const specs = p.specs.slice();
      specs[i] = { ...specs[i], ...patch };
      return { ...p, specs };
    });

  const addSpec = () => setProduct((p) => ({ ...p, specs: [...p.specs, { key: "", value: "" }] }));
  const removeSpec = (i: number) => setProduct((p) => ({ ...p, specs: p.specs.filter((_, idx) => idx !== i) }));

  const save = async () => {
    setSaving(true);
    try {
      await productService.save(product);
      draft.clearDraft();
      router.push("/admin/products");
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
            <TextInput value={product.name} onChange={(e) => set("name", e.target.value)} placeholder="Pod Compact A1" />
          </Field>
          <Field label="Marque">
            <Select value={product.brandId ?? ""} onChange={(e) => set("brandId", e.target.value || undefined)}>
              <option value="">—</option>
              {brands.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Type" hint="Ex : Pod rechargeable · cartouches">
            <TextInput value={product.kind} onChange={(e) => set("kind", e.target.value)} />
          </Field>
          <Field label="Prix (€)">
            <TextInput
              type="number"
              min={0}
              step="0.01"
              value={product.priceEur}
              onChange={(e) => set("priceEur", Number(e.target.value))}
            />
          </Field>
          <Field label="Coût d'usage" hint="Ex : ≈ 12 € / mois de consommables">
            <TextInput value={product.runningCostLabel} onChange={(e) => set("runningCostLabel", e.target.value)} />
          </Field>
        </div>
      </Card>

      <Card>
        <div className="text-[14px] font-bold mb-3">Correspondance avec le questionnaire</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Format">
            <Select value={product.formatTag} onChange={(e) => set("formatTag", e.target.value as FormatTag)}>
              {FORMAT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Profil de simplicité">
            <Select value={product.simplicityTag} onChange={(e) => set("simplicityTag", e.target.value as SimplicityTag)}>
              {SIMPLICITY_TAG_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </Select>
          </Field>
          <Field label={`Simplicité (${product.simplicity}/5)`}>
            <input
              type="range"
              min={1}
              max={5}
              value={product.simplicity}
              onChange={(e) => set("simplicity", Number(e.target.value))}
              className="w-full"
            />
          </Field>
          <Field label={`Autonomie (${product.autonomy}/5)`}>
            <input
              type="range"
              min={1}
              max={5}
              value={product.autonomy}
              onChange={(e) => set("autonomy", Number(e.target.value))}
              className="w-full"
            />
          </Field>
          <Field label="Budget">
            <Select value={product.budgetTier} onChange={(e) => set("budgetTier", e.target.value as BudgetTier)}>
              {BUDGET_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </Select>
          </Field>
        </div>
      </Card>

      <Card>
        <Field label="Description courte">
          <TextArea value={product.descriptionShort ?? ""} onChange={(e) => set("descriptionShort", e.target.value)} />
        </Field>
        <div className="h-4" />
        <Field label="Description longue">
          <TextArea value={product.descriptionLong ?? ""} onChange={(e) => set("descriptionLong", e.target.value)} />
        </Field>
      </Card>

      <Card>
        <div className="flex items-center justify-between mb-3">
          <div className="text-[14px] font-bold">Caractéristiques</div>
          <SecondaryButton type="button" onClick={addSpec}>
            + Ajouter
          </SecondaryButton>
        </div>
        <div className="flex flex-col gap-2">
          {product.specs.map((s, i) => (
            <div key={i} className="flex gap-2">
              <TextInput
                placeholder="Format"
                value={s.key}
                onChange={(e) => setSpec(i, { key: e.target.value })}
                className="flex-1"
              />
              <TextInput
                placeholder="Compact"
                value={s.value}
                onChange={(e) => setSpec(i, { value: e.target.value })}
                className="flex-1"
              />
              <button
                type="button"
                onClick={() => removeSpec(i)}
                className="px-3 rounded-lg border border-border-strong text-ink-tertiary hover:text-red-600 hover:border-red-200"
              >
                ×
              </button>
            </div>
          ))}
          {product.specs.length === 0 && (
            <div className="text-[13px] text-ink-tertiary">Aucune caractéristique.</div>
          )}
        </div>
      </Card>

      {isEditing && (
        <Card>
          <div className="flex items-center justify-between mb-3">
            <div className="text-[14px] font-bold">Cartouches compatibles</div>
            <SecondaryButton type="button" onClick={addCartridge}>
              + Ajouter
            </SecondaryButton>
          </div>
          <div className="flex flex-col gap-2">
            {cartridges.map((c) => (
              <div key={c.id} className="flex gap-2 items-center">
                <TextInput
                  defaultValue={c.name}
                  onBlur={(e) => e.target.value.trim() && updateCartridge(c, { name: e.target.value.trim() })}
                  className="flex-1"
                />
                <TextInput
                  defaultValue={c.description ?? ""}
                  placeholder="Description"
                  onBlur={(e) => updateCartridge(c, { description: e.target.value })}
                  className="flex-1"
                />
                <Toggle checked={c.active} onChange={() => updateCartridge(c, { active: !c.active })} />
                <button
                  type="button"
                  onClick={() => removeCartridge(c.id)}
                  className="px-3 rounded-lg border border-border-strong text-ink-tertiary hover:text-red-600 hover:border-red-200"
                >
                  ×
                </button>
              </div>
            ))}
            {cartridges.length === 0 && <div className="text-[13px] text-ink-tertiary">Aucune cartouche liée.</div>}
          </div>
        </Card>
      )}

      {isEditing && (
        <Card>
          <div className="flex items-center justify-between mb-3">
            <div className="text-[14px] font-bold">Résistances compatibles</div>
            <SecondaryButton type="button" onClick={addResistance}>
              + Ajouter
            </SecondaryButton>
          </div>
          <div className="flex flex-col gap-2">
            {resistances.map((r) => (
              <div key={r.id} className="flex gap-2 items-center">
                <TextInput
                  defaultValue={r.name}
                  onBlur={(e) => e.target.value.trim() && updateResistance(r, { name: e.target.value.trim() })}
                  className="flex-1"
                />
                <TextInput
                  defaultValue={r.ohm ?? ""}
                  placeholder="Ω"
                  type="number"
                  step="0.1"
                  onBlur={(e) => updateResistance(r, { ohm: e.target.value ? Number(e.target.value) : undefined })}
                  className="w-24"
                />
                <Toggle checked={r.active} onChange={() => updateResistance(r, { active: !r.active })} />
                <button
                  type="button"
                  onClick={() => removeResistance(r.id)}
                  className="px-3 rounded-lg border border-border-strong text-ink-tertiary hover:text-red-600 hover:border-red-200"
                >
                  ×
                </button>
              </div>
            ))}
            {resistances.length === 0 && <div className="text-[13px] text-ink-tertiary">Aucune résistance liée.</div>}
          </div>
        </Card>
      )}

      <Card>
        <ImageDropzone images={product.images} onChange={(images) => set("images", images)} folder="products" />
      </Card>

      <Card className="flex items-center justify-between">
        <div>
          <div className="text-[14px] font-bold">Statut</div>
          <div className="text-[12.5px] text-ink-tertiary">Visible dans les recommandations quand actif.</div>
        </div>
        <Toggle checked={product.active} onChange={() => set("active", !product.active)} />
      </Card>

      <div className="flex gap-2.5">
        <PrimaryButton onClick={save} disabled={saving || !product.name}>
          {saving ? "Enregistrement…" : "Enregistrer"}
        </PrimaryButton>
        <SecondaryButton type="button" onClick={() => router.push("/admin/products")}>
          Annuler
        </SecondaryButton>
      </div>
    </div>
  );
}
