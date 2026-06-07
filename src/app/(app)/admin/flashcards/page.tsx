import { Layers } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { AdminTable } from "@/components/app/admin-table";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/shared/states";
import { db } from "@/lib/db";

export default async function AdminFlashcardsPage() {
  // Aulas com seus flashcards (apenas categoria) para contar e agrupar.
  const lessons = await db.lesson.findMany({
    orderBy: [{ level: { order: "asc" } }, { order: "asc" }],
    select: {
      id: true,
      title: true,
      level: { select: { code: true } },
      flashcards: { select: { category: true } },
    },
  });

  // Mostra apenas aulas que possuem flashcards.
  const withCards = lessons.filter((l) => l.flashcards.length > 0);

  const columns = [
    { key: "level", label: "Nível" },
    { key: "lesson", label: "Aula" },
    { key: "count", label: "Flashcards" },
    { key: "categories", label: "Categorias" },
  ];

  const rows = withCards.map((l) => {
    const categories = Array.from(
      new Set(l.flashcards.map((f) => f.category).filter(Boolean))
    );
    return [
      <Badge key="level" variant="accent">
        {l.level.code}
      </Badge>,
      <span key="lesson" className="font-medium">
        {l.title}
      </span>,
      <span key="count">{l.flashcards.length}</span>,
      <div key="categories" className="flex flex-wrap gap-1">
        {categories.length ? (
          categories.map((c) => (
            <Badge key={c} variant="muted">
              {c}
            </Badge>
          ))
        ) : (
          <span className="text-muted-foreground">—</span>
        )}
      </div>,
    ];
  });

  return (
    <div>
      <PageHeader
        title="Flashcards"
        description="Flashcards disponíveis por aula."
      />
      {rows.length ? (
        <AdminTable columns={columns} rows={rows} />
      ) : (
        <EmptyState
          icon={Layers}
          title="Nenhum flashcard cadastrado"
          description="Adicione flashcards às aulas para visualizá-los aqui."
        />
      )}
    </div>
  );
}
