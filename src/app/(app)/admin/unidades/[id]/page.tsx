import { notFound } from "next/navigation";
import { PageHeader } from "@/components/shared/page-header";
import { UnitEditor } from "@/components/app/unit-editor";
import { requireAdmin } from "@/lib/queries";
import { db } from "@/lib/db";

export default async function EditarUnidadePage({
  params,
}: {
  params: { id: string };
}) {
  await requireAdmin();

  const [unit, albums, collections] = await Promise.all([
    db.unit.findUnique({
      where: { id: params.id },
      include: {
        tracks: { orderBy: { order: "asc" } },
        pages: { orderBy: { order: "asc" } },
      },
    }),
    db.audioAlbum.findMany({
      orderBy: { order: "asc" },
      include: { tracks: { orderBy: { order: "asc" } } },
    }),
    db.bookCollection.findMany({
      orderBy: { order: "asc" },
      include: { pages: { orderBy: { order: "asc" } } },
    }),
  ]);

  if (!unit) notFound();

  return (
    <div>
      <PageHeader
        title={`Editar: ${unit.title}`}
        description={`Unidade ${unit.order} · ${unit.published ? "publicada" : "rascunho"}`}
      />
      <UnitEditor
        mode="edit"
        unit={{
          id: unit.id,
          slug: unit.slug,
          order: unit.order,
          title: unit.title,
          summary: unit.summary,
          objective: unit.objective,
          body: unit.body,
          vocab: unit.vocab,
          durationMin: unit.durationMin,
          published: unit.published,
        }}
        albums={albums.map((a) => ({
          id: a.id,
          title: a.title,
          kind: a.kind,
          order: a.order,
          tracks: a.tracks.map((t) => ({
            id: t.id,
            order: t.order,
            title: t.title,
            src: t.src,
            unitId: t.unitId,
          })),
        }))}
        collections={collections.map((c) => ({
          id: c.id,
          title: c.title,
          kind: c.kind,
          order: c.order,
          pages: c.pages.map((p) => ({
            id: p.id,
            order: p.order,
            src: p.src,
            unitId: p.unitId,
          })),
        }))}
      />
    </div>
  );
}
