import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Target, Headphones, BookOpen, BookMarked } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { RichText } from "@/components/app/rich-text";
import { VocabularyTable, type VocabItem } from "@/components/app/lesson-blocks";
import { AudioPlaylist } from "@/components/app/audio-playlist";
import { PageReader } from "@/components/app/page-reader";
import { EmptyState } from "@/components/shared/states";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/queries";
import { parseJson } from "@/lib/utils";

export default async function UnitPage({
  params,
}: {
  params: { slug: string };
}) {
  const user = await requireUser();
  const unit = await db.unit.findUnique({
    where: { slug: params.slug },
    include: {
      tracks: { orderBy: { order: "asc" } },
      pages: { orderBy: { order: "asc" } },
    },
  });
  // Não publicada só é visível para admin.
  if (!unit || (!unit.published && user.role !== "ADMIN")) notFound();

  const vocab = parseJson<VocabItem[]>(unit.vocab, []);

  return (
    <div className="mx-auto max-w-3xl">
      <Link
        href="/material"
        className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Material do curso
      </Link>

      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="accent">Unidade {unit.order}</Badge>
        {!unit.published && <Badge variant="warning">Rascunho</Badge>}
      </div>
      <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight">
        {unit.title}
      </h1>
      {unit.summary && (
        <p className="mt-1 text-muted-foreground">{unit.summary}</p>
      )}

      <div className="mt-6 space-y-8">
        {unit.objective && (
          <section>
            <h2 className="mb-2 flex items-center gap-2 font-display text-lg font-semibold">
              <Target className="h-4 w-4 text-primary" /> Objetivo
            </h2>
            <p className="text-sm leading-relaxed">{unit.objective}</p>
          </section>
        )}

        {unit.body.trim() && (
          <section>
            <h2 className="mb-2 font-display text-lg font-semibold">Conteúdo</h2>
            <RichText text={unit.body} />
          </section>
        )}

        {vocab.length > 0 && (
          <section>
            <h2 className="mb-2 flex items-center gap-2 font-display text-lg font-semibold">
              <BookMarked className="h-4 w-4 text-primary" /> Vocabulário
            </h2>
            <VocabularyTable items={vocab} />
          </section>
        )}

        {unit.tracks.length > 0 && (
          <section>
            <h2 className="mb-2 flex items-center gap-2 font-display text-lg font-semibold">
              <Headphones className="h-4 w-4 text-primary" /> Áudios da unidade
            </h2>
            <AudioPlaylist tracks={unit.tracks} />
          </section>
        )}

        {unit.pages.length > 0 && (
          <section>
            <h2 className="mb-2 flex items-center gap-2 font-display text-lg font-semibold">
              <BookOpen className="h-4 w-4 text-primary" /> Páginas do livro
            </h2>
            <PageReader pages={unit.pages} />
          </section>
        )}

        {!unit.body.trim() &&
          vocab.length === 0 &&
          unit.tracks.length === 0 &&
          unit.pages.length === 0 && (
            <EmptyState
              title="Unidade em construção"
              description="O conteúdo desta unidade ainda está sendo montado."
            />
          )}
      </div>
    </div>
  );
}
