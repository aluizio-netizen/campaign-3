import { Award } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { AdminTable } from "@/components/app/admin-table";
import { EmptyState } from "@/components/shared/states";
import { db } from "@/lib/db";
import { formatDate } from "@/lib/utils";

export default async function AdminCertificatesPage() {
  const certificates = await db.certificate.findMany({
    orderBy: { issuedAt: "desc" },
    select: {
      id: true,
      code: true,
      studentName: true,
      score: true,
      hours: true,
      issuedAt: true,
    },
  });

  const columns = [
    { key: "student", label: "Aluno" },
    { key: "code", label: "Código" },
    { key: "issuedAt", label: "Emissão" },
    { key: "score", label: "Aproveitamento" },
    { key: "hours", label: "Carga horária" },
  ];

  const rows = certificates.map((c) => [
    <span key="student" className="font-medium">
      {c.studentName}
    </span>,
    <span key="code" className="font-mono text-xs text-muted-foreground">
      {c.code}
    </span>,
    <span key="issuedAt" className="text-muted-foreground">
      {formatDate(c.issuedAt)}
    </span>,
    <span key="score">{c.score}%</span>,
    <span key="hours" className="text-muted-foreground">
      {c.hours}h
    </span>,
  ]);

  return (
    <div>
      <PageHeader
        title="Certificados"
        description="Certificados emitidos pela plataforma."
      />
      {rows.length ? (
        <AdminTable columns={columns} rows={rows} />
      ) : (
        <EmptyState
          icon={Award}
          title="Nenhum certificado emitido"
          description="Os certificados emitidos pelos alunos aparecerão aqui."
        />
      )}
    </div>
  );
}
