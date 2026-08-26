"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { csvToRecords } from "@/lib/csv";
import { liquidService } from "@/services";
import { genId } from "@/store/useCatalogStore";
import type { Liquid } from "@/types";
import { Card, PageHeader, PrimaryButton, SecondaryButton, TextArea } from "@/components/admin/AdminUi";

const TEMPLATE =
  "name,flavorTag,universe,description,specHint\n" +
  "Melon glacé,Frais,Frais,Melon bien frais avec une pointe de fraîcheur.,10 ml · ≈ 6 €\n";

export default function ImportLiquidsPage() {
  const router = useRouter();
  const [text, setText] = useState("");
  const [importing, setImporting] = useState(false);

  const records = csvToRecords(text);
  const rows: { liquid: Liquid; errors: string[] }[] = records.map((record) => {
    const errors: string[] = [];
    if (!record.name) errors.push("nom manquant");

    const liquid: Liquid = {
      id: genId("liquid"),
      name: record.name ?? "",
      flavorTag: record.flavorTag ?? "",
      universe: record.universe ?? record.flavorTag ?? "",
      description: record.description ?? "",
      specHint: record.specHint || "10 ml · ≈ 6 €",
      images: [],
      active: true,
    };
    return { liquid, errors };
  });

  const validRows = rows.filter((r) => r.errors.length === 0);

  const runImport = async () => {
    setImporting(true);
    try {
      for (const r of validRows) {
        await liquidService.save(r.liquid);
      }
      router.push("/admin/liquids");
    } finally {
      setImporting(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="Importer des e-liquides (CSV)"
        subtitle="Collez un CSV avec en-têtes. Colonnes reconnues : name, flavorTag, universe, description, specHint."
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
                <th className="pb-2 pr-3">Saveur</th>
                <th className="pb-2 pr-3">Univers</th>
                <th className="pb-2">Statut</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={i} className="border-t border-border">
                  <td className="py-2 pr-3">{r.liquid.name || "—"}</td>
                  <td className="py-2 pr-3">{r.liquid.flavorTag || "—"}</td>
                  <td className="py-2 pr-3">{r.liquid.universe || "—"}</td>
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
          {importing ? "Import…" : `Importer ${validRows.length} e-liquide${validRows.length > 1 ? "s" : ""}`}
        </PrimaryButton>
        <SecondaryButton type="button" onClick={() => router.push("/admin/liquids")}>
          Annuler
        </SecondaryButton>
      </div>
    </div>
  );
}
