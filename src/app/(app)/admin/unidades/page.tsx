import Link from "next/link";
import { Layers, Plus } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { AdminTable } from "@/components/app/admin-table";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/states";
import { requireAdmin } from "@/lib/queries";
import { db } from "@/lib/db";
import { cn } from "@/lib/utils";

export default async function AdminUnitsPage() {
  await requireAdmin();

  const course = await db.course.findUnique({
    where: { slug: "campaign-3" },
    select: { id: true },
  });

  const units = course
    ? await db.unit.findMany({
        where: { courseId: course.id },
        orderBy: { order: "asc" },
        select: {
          id: true,
          order: true,
          title: true,
          published: true,
          _count: { select: { tracks: true, pages: true } },
        },
      })
    : [];

  const novaUnidade = (
    <Link
      href="/admin/unidades/nova"
      className={cn(buttonVariants({ size: "sm" }), "gap-1.5")}
    >
      <Plus className="h-4 w-4" /> Nova unidade
    </Link>
  );

  const columns = [
    { key: "order", label: "Ordem", className: "w-16" },
    { key: "title", label: "Título" },
    { key: "status", label: "Status" },
    { key: "media", label: "Mídia" },
    { key: "actions", label: "Ações", className: "text-right" },
  ];

  const rows = units.map((u) => [
    <span key="order" className="font-mono text-muted-foreground">
      {u.order}
    </span>,
    <span key="title" className="font-medium">
      {u.title}
    </span>,
    u.published ? (
      <Badge key="status" variant="success">
        Publicada
      </Badge>
    ) : (
      <Badge key="status" variant="warning">
        Rascunho
      </Badge>
    ),
    <span key="media" className="text-xs text-muted-foreground">
      {u._count.tracks} áudio(s) · {u._count.pages} página(s)
    </span>,
    <div key="actions" className="flex justify-end">
      <Link
        href={`/admin/unidades/${u.id}`}
        className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
      >
        Editar
      </Link>
    </div>,
  ]);

  return (
    <div>
      <PageHeader
        title="Unidades"
        description="Crie e edite as unidades do curso, anexando áudios e páginas."
        action={novaUnidade}
      />
      {rows.length ? (
        <AdminTable columns={columns} rows={rows} />
      ) : (
        <EmptyState
          icon={Layers}
          title="Nenhuma unidade criada"
          description="Comece criando a primeira unidade do curso."
          action={novaUnidade}
        />
      )}
    </div>
  );
}
