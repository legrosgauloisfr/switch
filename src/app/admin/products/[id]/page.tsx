"use client";

import { useParams } from "next/navigation";
import { useCatalogStore } from "@/store/useCatalogStore";
import ProductForm from "@/components/admin/ProductForm";
import { PageHeader } from "@/components/admin/AdminUi";

export default function EditProductPage() {
  const { id } = useParams<{ id: string }>();
  const product = useCatalogStore((s) => s.products.find((p) => p.id === id));

  if (!product) {
    return <div className="text-ink-tertiary">Appareil introuvable.</div>;
  }

  return (
    <div>
      <PageHeader title={`Modifier « ${product.name} »`} />
      <ProductForm key={product.id} initial={product} />
    </div>
  );
}
