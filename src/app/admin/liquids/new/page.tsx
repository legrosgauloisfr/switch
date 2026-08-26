import LiquidForm from "@/components/admin/LiquidForm";
import { PageHeader } from "@/components/admin/AdminUi";

export default function NewLiquidPage() {
  return (
    <div>
      <PageHeader title="Nouvel e-liquide" />
      <LiquidForm />
    </div>
  );
}
