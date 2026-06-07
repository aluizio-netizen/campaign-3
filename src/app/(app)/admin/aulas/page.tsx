import { BookOpen } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { AdminTable } from "@/components/app/admin-table";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/shared/states";
import { db } from "@/lib/db";

export default async function AdminLessonsPage() {
  // Aulas de todos os níveis, ordenadas por nível e ordem da aula.
  const lessons = await db.lesson.findMany({
    orderBy: [{ level: { order: "asc" } }, { order: "asc" }],
    select: {
      id: true,
      title: true,
      order: true,
      durationMin: true,
      level: { select: { code: true, title: true } },
      _count: {
        select: {
          vocabulary: true,
          flashcards: true,
        },
      },
      quiz: { select: { _count: { select: { questions: true } } } },
    },
  });

  const columns = [
    { key: "order", label: "#" },
    { key: "title", label: "Aula" },
    { key: "level", label: "Nível" },
    { key: "duration", label: "Duração" },
    { key: "vocab", label: "Vocabulário" },
    { key: "flashcards", label: "Flashcards" },
    { key: "questions", label: "Questões" },
  ];

  const rows = lessons.map((l) => [
    <span key="order" className="text-muted-foreground">
      {l.order}
    </span>,
    <span key="title" className="font-medium">
      {l.title}
    </span>,
    <Badge key="level" variant="accent">
      {l.level.code}
    </Badge>,
    <span key="duration" className="text-muted-foreground">
      {l.durationMin} min
    </span>,
    <span key="vocab">{l._count.vocabulary}</span>,
    <span key="flashcards">{l._count.flashcards}</span>,
    <span key="questions">{l.quiz?._count.questions ?? 0}</span>,
  ]);

  // edição de conteúdo: futura

  return (
    <div>
      <PageHeader
        title="Aulas"
        description="Gestão de conteúdo das aulas (somente leitura nesta versão)."
      />
      {rows.length ? (
        <AdminTable columns={columns} rows={rows} />
      ) : (
        <EmptyState
          icon={BookOpen}
          title="Nenhuma aula cadastrada"
          description="Cadastre níveis e aulas no curso para visualizá-los aqui."
        />
      )}
    </div>
  );
}
