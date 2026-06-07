import { Users, BookOpen, Award, ListChecks } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/stat-card";
import { AccessBadge } from "@/components/shared/access-badge";
import { AdminTable } from "@/components/app/admin-table";
import { EmptyState } from "@/components/shared/states";
import { db } from "@/lib/db";
import { ROLES } from "@/lib/constants";
import { formatDate } from "@/lib/utils";

export default async function AdminOverviewPage() {
  const [studentCount, lessonCount, certificateCount, quizAttemptCount, recent] =
    await Promise.all([
      db.user.count({ where: { role: ROLES.STUDENT } }),
      db.lesson.count(),
      db.certificate.count(),
      db.quizAttempt.count(),
      db.user.findMany({
        where: { role: ROLES.STUDENT },
        orderBy: { createdAt: "desc" },
        take: 8,
        select: {
          id: true,
          name: true,
          email: true,
          plan: true,
          accessBlocked: true,
          createdAt: true,
        },
      }),
    ]);

  const columns = [
    { key: "name", label: "Aluno" },
    { key: "email", label: "E-mail" },
    { key: "createdAt", label: "Cadastro" },
    { key: "access", label: "Acesso" },
  ];

  const rows = recent.map((u) => [
    <span key="name" className="font-medium">
      {u.name}
    </span>,
    <span key="email" className="text-muted-foreground">
      {u.email}
    </span>,
    <span key="createdAt" className="text-muted-foreground">
      {formatDate(u.createdAt)}
    </span>,
    <AccessBadge key="access" plan={u.plan} blocked={u.accessBlocked} />,
  ]);

  return (
    <div>
      <PageHeader
        title="Painel admin"
        description="Visão geral da plataforma e dos alunos."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Alunos" value={studentCount} icon={Users} />
        <StatCard label="Aulas" value={lessonCount} icon={BookOpen} />
        <StatCard
          label="Certificados emitidos"
          value={certificateCount}
          icon={Award}
        />
        <StatCard
          label="Tentativas de quiz"
          value={quizAttemptCount}
          icon={ListChecks}
        />
      </div>

      <div className="mt-8">
        <h2 className="mb-3 font-display text-lg font-semibold">
          Últimos alunos cadastrados
        </h2>
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
    </div>
  );
}
