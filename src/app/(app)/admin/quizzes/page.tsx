import { ListChecks } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { AdminTable } from "@/components/app/admin-table";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/shared/states";
import { db } from "@/lib/db";

export default async function AdminQuizzesPage() {
  const quizzes = await db.quiz.findMany({
    orderBy: [{ lesson: { level: { order: "asc" } } }, { lesson: { order: "asc" } }],
    select: {
      id: true,
      title: true,
      passScore: true,
      lesson: {
        select: {
          title: true,
          level: { select: { code: true } },
        },
      },
      _count: { select: { questions: true } },
      attempts: { select: { score: true } },
    },
  });

  const columns = [
    { key: "title", label: "Quiz" },
    { key: "lesson", label: "Aula" },
    { key: "questions", label: "Questões" },
    { key: "passScore", label: "Nota mínima" },
    { key: "attempts", label: "Tentativas" },
    { key: "avg", label: "Média" },
  ];

  const rows = quizzes.map((q) => {
    const avgScore = q.attempts.length
      ? Math.round(
          q.attempts.reduce((sum, a) => sum + a.score, 0) / q.attempts.length
        )
      : null;

    return [
      <span key="title" className="font-medium">
        {q.title}
      </span>,
      <div key="lesson" className="flex items-center gap-2">
        <Badge variant="accent">{q.lesson.level.code}</Badge>
        <span className="text-muted-foreground">{q.lesson.title}</span>
      </div>,
      <span key="questions">{q._count.questions}</span>,
      <span key="passScore" className="text-muted-foreground">
        {q.passScore}%
      </span>,
      <span key="attempts">{q.attempts.length}</span>,
      <span key="avg">
        {avgScore === null ? (
          <span className="text-muted-foreground">—</span>
        ) : (
          `${avgScore}%`
        )}
      </span>,
    ];
  });

  return (
    <div>
      <PageHeader
        title="Quizzes"
        description="Desempenho dos quizzes por aula."
      />
      {rows.length ? (
        <AdminTable columns={columns} rows={rows} />
      ) : (
        <EmptyState
          icon={ListChecks}
          title="Nenhum quiz cadastrado"
          description="Adicione quizzes às aulas para visualizá-los aqui."
        />
      )}
    </div>
  );
}
