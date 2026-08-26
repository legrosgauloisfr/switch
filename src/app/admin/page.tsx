"use client";

import Link from "next/link";
import { useCatalogStore } from "@/store/useCatalogStore";
import { Card, PageHeader } from "@/components/admin/AdminUi";

const TILES = [
  { href: "/admin/products", label: "Appareils", key: "products" as const },
  { href: "/admin/liquids", label: "E-liquides", key: "liquids" as const },
  { href: "/admin/tutorials", label: "Tutoriels", key: "tutorials" as const },
  { href: "/admin/brands", label: "Marques", key: "brands" as const },
  { href: "/admin/categories", label: "Catégories", key: "categories" as const },
  { href: "/admin/flavors", label: "Saveurs", key: "flavors" as const },
  { href: "/admin/faq", label: "Questions FAQ", key: "faq" as const },
  { href: "/admin/advice", label: "Conseils", key: "advice" as const },
];

export default function AdminDashboardPage() {
  const catalog = useCatalogStore();

  return (
    <div>
      <PageHeader
        title="Tableau de bord"
        subtitle="Ajoutez, modifiez ou désactivez du contenu — aucun code, aucun redéploiement."
      />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        {TILES.map((t) => (
          <Link key={t.key} href={t.href}>
            <Card className="hover:border-primary/40 transition-colors">
              <div className="text-[28px] font-bold">{catalog[t.key].length}</div>
              <div className="mt-1 text-[13.5px] font-semibold text-ink-secondary">{t.label}</div>
            </Card>
          </Link>
        ))}
      </div>

      <div className="mt-8">
        <Card>
          <div className="text-[15px] font-bold">Bon à savoir</div>
          <ul className="mt-2.5 flex flex-col gap-1.5 text-[13.5px] leading-relaxed text-ink-secondary list-disc pl-4">
            <li>Tout ce qui est ajouté ici apparaît immédiatement dans l&apos;application — aucune publication séparée.</li>
            <li>Un produit ou un tutoriel désactivé reste modifiable mais n&apos;apparaît plus côté utilisateur.</li>
            <li>
              Les images sont stockées localement pour l&apos;instant (pas encore de compte Supabase connecté) —
              elles resteront sur cet appareil tant que le stockage cloud n&apos;est pas branché.
            </li>
          </ul>
        </Card>
      </div>
    </div>
  );
}
