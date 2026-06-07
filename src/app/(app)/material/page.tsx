import Link from "next/link";
import { Headphones, BookOpen, Layers, ArrowRight, Dumbbell } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/states";
import { AudioPlaylist } from "@/components/app/audio-playlist";
import { BookLibrary } from "@/components/app/book-library";
import {
  requireUser,
  getAudioLibrary,
  getBookLibrary,
  getCampaignUnits,
} from "@/lib/queries";
import { cn } from "@/lib/utils";

export default async function MaterialPage() {
  await requireUser();
  const [albums, collections, units] = await Promise.all([
    getAudioLibrary(),
    getBookLibrary(),
    getCampaignUnits(),
  ]);

  const totalTracks = albums.reduce((s, a) => s + a.tracks.length, 0);
  const totalPages = collections.reduce((s, c) => s + c.pages.length, 0);

  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        title="Material do curso"
        description="Áudios e livro do Campaign 3. As unidades estruturadas são montadas pela equipe."
      />

      {/* Unidades publicadas */}
      <section className="mb-8">
        <div className="mb-3 flex items-center gap-2">
          <Layers className="h-4 w-4 text-primary" />
          <h2 className="font-display text-lg font-semibold">Unidades</h2>
          <Badge variant="muted" className="ml-auto">
            {units.length} publicada(s)
          </Badge>
        </div>
        {units.length === 0 ? (
          <EmptyState
            icon={Layers}
            title="Nenhuma unidade publicada ainda"
            description="As unidades estruturadas (texto, vocabulário e mídia) são criadas no painel admin. Enquanto isso, use a biblioteca de áudios e o livro abaixo."
          />
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {units.map((u) => (
              <Card key={u.id} className="p-5">
                <Badge variant="accent">Unidade {u.order}</Badge>
                <h3 className="mt-2 font-display text-base font-semibold leading-tight">
                  {u.title}
                </h3>
                {u.summary && (
                  <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                    {u.summary}
                  </p>
                )}
                <div className="mt-2 flex gap-2 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1">
                    <Headphones className="h-3 w-3" /> {u._count.tracks}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <BookOpen className="h-3 w-3" /> {u._count.pages}
                  </span>
                </div>
                <Link
                  href={`/unidade/${u.slug}`}
                  className={cn(buttonVariants({ variant: "outline", size: "sm" }), "mt-4 w-full")}
                >
                  Abrir <ArrowRight className="h-4 w-4" />
                </Link>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* Biblioteca de áudio */}
      <section className="mb-8">
        <div className="mb-3 flex items-center gap-2">
          <Headphones className="h-4 w-4 text-primary" />
          <h2 className="font-display text-lg font-semibold">Áudios</h2>
          <Badge variant="muted" className="ml-auto">{totalTracks} faixas</Badge>
        </div>
        <div className="grid gap-4 lg:grid-cols-2">
          {albums.map((album) => (
            <div key={album.id}>
              <div className="mb-2 flex items-center gap-2">
                <span className="text-sm font-medium">{album.title}</span>
                {album.kind === "exercise" && (
                  <Badge variant="warning" className="gap-1 text-[10px]">
                    <Dumbbell className="h-3 w-3" /> Exercícios
                  </Badge>
                )}
              </div>
              <AudioPlaylist tracks={album.tracks} />
            </div>
          ))}
        </div>
      </section>

      {/* Livro / páginas escaneadas */}
      <section>
        <div className="mb-3 flex items-center gap-2">
          <BookOpen className="h-4 w-4 text-primary" />
          <h2 className="font-display text-lg font-semibold">Livro</h2>
          <Badge variant="muted" className="ml-auto">{totalPages} páginas</Badge>
        </div>
        <BookLibrary
          collections={collections.map((c) => ({
            id: c.id,
            key: c.key,
            title: c.title,
            kind: c.kind,
            pages: c.pages,
          }))}
        />
      </section>
    </div>
  );
}
