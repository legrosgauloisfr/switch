import TutorialForm from "@/components/admin/TutorialForm";
import { PageHeader } from "@/components/admin/AdminUi";

export default function NewTutorialPage() {
  return (
    <div>
      <PageHeader title="Nouveau tutoriel" />
      <TutorialForm />
    </div>
  );
}
