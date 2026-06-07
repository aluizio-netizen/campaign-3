import { PageHeader } from "@/components/shared/page-header";
import { UnitEditor } from "@/components/app/unit-editor";
import { requireAdmin } from "@/lib/queries";

export default async function NovaUnidadePage() {
  await requireAdmin();

  return (
    <div>
      <PageHeader
        title="Nova unidade"
        description="Preencha o texto da unidade. Depois de criar, você poderá anexar áudios e páginas."
      />
      <UnitEditor mode="create" />
    </div>
  );
}
