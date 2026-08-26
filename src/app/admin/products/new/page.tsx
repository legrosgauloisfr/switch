import ProductForm from "@/components/admin/ProductForm";
import { PageHeader } from "@/components/admin/AdminUi";

export default function NewProductPage() {
  return (
    <div>
      <PageHeader title="Nouvel appareil" />
      <ProductForm />
    </div>
  );
}
