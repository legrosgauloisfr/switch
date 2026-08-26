import ArticleForm from "@/components/admin/ArticleForm";
import { PageHeader } from "@/components/admin/AdminUi";

export default function NewArticlePage() {
  return (
    <div>
      <PageHeader title="Nouvel article" />
      <ArticleForm />
    </div>
  );
}
