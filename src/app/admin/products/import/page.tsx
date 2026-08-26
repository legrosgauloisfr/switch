"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { csvToRecords } from "@/lib/csv";
import { productService } from "@/services";
import { genId } from "@/store/useCatalogStore";
import type { BudgetTier, FormatTag, Product, SimplicityTag } from "@/types";
import { Card, PageHeader, PrimaryButton, SecondaryButton, TextArea } from "@/components/admin/AdminUi";

const TEMPLATE =
  "name,kind,priceEur,runningCostLabel,formatTag,simplicityTag,budgetTier,simplicity,autonomy\n" +
  "Pod Rapide E5,Pod rechargeable · cartouches,29,≈ 12 € / mois,compact,simple,low,5,3\n";

const FORMAT_VALUES: FormatTag[] = ["compact", "standard", "autonomous"];
const SIMPLICITY_VALUES: SimplicityTag[] = ["simple", "customizable", "unsure"];
const BUDGET_VALUES: BudgetTier[] = ["low", "mid", "mid-high", "high"];

export default function ImportProductsPage() {
  const router = useRouter();
  const [text, setText] = useState("");
  const [importing, setImporting] = useState(false);

  const records = csvToRecords(text);
  const rows: { record: Record<string, string>; product: Product; errors: string[] }[] = records.map((record) => {
    const errors: string[] = [];
    if (!record.name) errors.push("nom manquant");
    const formatTag = FORMAT_VALUES.includes(record.formatTag as FormatTag) ? (record.formatTag as FormatTag) : "compact";
    const simplicityTag = SIMPLICITY_VALUES.includes(record.simplicityTag as SimplicityTag)
      ? (record.simplicityTag as SimplicityTag)
      : "simple";
    const budgetTier = BUDGET_VALUES.includes(record.budgetTier as BudgetTier) ? (record.budgetTier as BudgetTier) : "mid";

    const product: Product = {
      id: genId("product"),
      name: record.name ?? "",
      kind: record.kind ?? "",
      priceEur: Number(record.priceEur) || 0,
      runningCostLabel: record.runningCostLabel ?? "",
      simplicity: Math.min(5, Math.max(1, Number(record.simplicity) || 3)),
      autonomy: Math.min(5, Math.max(1, Number(record.autonomy) || 3)),
      formatTag,
      simplicityTag,
      budgetTier,
      specs: [],
      images: [],
      active: true,
    };
    return { record, product, errors };
  });

  const validRows = rows.filter((r) => r.errors.length === 0);

  const runImport = async () => {
    setImporting(true);
    try {
      for (const r of validRows) {
        await productService.save(r.product);
      }
      router.push("/admin/products");
    } finally {
      setImporting(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="Importer des appareils (CSV)"
        subtitle="Collez un CSV avec en-têtes. Colonnes reconnues : name, kind, priceEur, runningCostLabel, formatTag (compact/standard/autonomous), simplicityTag (simple/customizable/unsure), budgetTier (low/mid/mid-high/high), simplicity (1-5), autonomy (1-5)."
      />
      <Card className="mb-4">
        <TextArea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={TEMPLATE}
          className="min-h-40 font-mono text-[12.5px]"
        />
        <div className="mt-2.5 flex items-center gap-3">
          <SecondaryButton type="button" onClick={() => setText(TEMPLATE)}>
            Insérer un exemple
          </SecondaryButton>
          <span className="text-[12.5px] text-ink-tertiary">
            {records.length} ligne{records.length > 1 ? "s" : ""} détectée{records.length > 1 ? "s" : ""}
          </span>
        </div>
      </Card>

      {records.length > 0 && (
        <Card className="mb-4 overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="text-left text-ink-tertiary">
                <th className="pb-2 pr-3">Nom</th>
                <th className="pb-2 pr-3">Type</th>
                <th className="pb-2 pr-3">Prix</th>
                <th className="pb-2 pr-3">Format</th>
                <th className="pb-2">Statut</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={i} className="border-t border-border">
                  <td className="py-2 pr-3">{r.product.name || "—"}</td>
                  <td className="py-2 pr-3">{r.product.kind || "—"}</td>
                  <td className="py-2 pr-3">{r.product.priceEur} €</td>
                  <td className="py-2 pr-3">{r.product.formatTag}</td>
                  <td className="py-2">
                    {r.errors.length ? (
                      <span className="text-red-600 font-semibold">{r.errors.join(", ")}</span>
                    ) : (
                      <span className="text-emerald-700 font-semibold">Prêt</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}

      <div className="flex gap-2.5">
        <PrimaryButton onClick={runImport} disabled={!validRows.length || importing}>
          {importing ? "Import…" : `Importer ${validRows.length} appareil${validRows.length > 1 ? "s" : ""}`}
        </PrimaryButton>
        <SecondaryButton type="button" onClick={() => router.push("/admin/products")}>
          Annuler
        </SecondaryButton>
      </div>
    </div>
  );
}
