import { Users } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { AdminTable } from "@/components/app/admin-table";
import { AccessBadge } from "@/components/shared/access-badge";
import { Badge } from "@/components/ui/badge";
import { ProgressBar } from "@/components/ui/progress-bar";
import { EmptyState } from "@/components/shared/states";
import { ToggleAccess } from "@/components/app/toggle-access";
import { db } from "@/lib/db";
import { ROLES, PROGRESS_STATUS } from "@/lib/constants";

export default async function AdminStudentsPage() {
  const [totalLessons, students] = await Promise.all([
    db.lesson.count(),
    db.user.findMany({
      where: { role: ROLES.STUDENT },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        plan: true,
        subscriptionStatus: true,
        accessBlocked: true,
        progress: { select: { status: true } },
        quizAttempts: { select: { score: true } },
      },
    }),
  ]);

  const columns = [
    { key: "name", label: "Aluno" },
    { key: "progress", label: "Progresso", className: "min-w-[160px]" },
    { key: "completed", label: "Concluídas" },
    { key: "avg", label: "Média quiz" },
    { key: "plan", label: "Plano" },
    { key: "access", label: "Acesso" },
    { key: "actions", label: "Ações", className: "text-right" },
  ];

  const rows = students.map((s) => {
    const completed = s.progress.filter(
      (p) => p.status === PROGRESS_STATUS.COMPLETED
    ).length;
    const percent = totalLessons
      ? Math.round((completed / totalLessons) * 100)
      : 0;
    const avgScore = s.quizAttempts.length
      ? Math.round(
          s.quizAttempts.reduce((sum, a) => sum + a.score, 0) /
            s.quizAttempts.length
        )
      : null;

    return [
      <div key="name">
        <p className="font-medium">{s.name}</p>
        <p className="text-xs text-muted-foreground">{s.email}</p>
      </div>,
      <div key="progress" className="flex items-center gap-2">
        <ProgressBar value={percent} />
        <span className="shrink-0 text-xs text-muted-foreground">{percent}%</span>
      </div>,
      <span key="completed">
        {completed}/{totalLessons}
      </span>,
      <span key="avg">
        {avgScore === null ? (
          <span className="text-muted-foreground">—</span>
        ) : (
          `${avgScore}%`
        )}
      </span>,
      <div key="plan" className="flex flex-col gap-1">
        <Badge variant="muted">{s.plan}</Badge>
        <span className="text-xs text-muted-foreground">
          {s.subscriptionStatus}
        </span>
      </div>,
      <AccessBadge key="access" plan={s.plan} blocked={s.accessBlocked} />,
      <div key="actions" className="flex justify-end">
        <ToggleAccess userId={s.id} blocked={s.accessBlocked} />
      </div>,
    ];
  });

  return (
    <div>
      <PageHeader
        title="Alunos"
        description="Acompanhe o progresso e gerencie o acesso de cada aluno."
      />
      {rows.length ? (
        <AdminTable columns={columns} rows={rows} />
      ) : (
        <EmptyState
          icon={Users}
          title="Nenhum aluno cadastrado"
          description="Quando alunos se cadastrarem, eles aparecerão aqui."
        />
      )}
    </div>
  );
}
