import Link from "next/link";
import { Layers, BookOpen } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/stat-card";
import { EmptyState } from "@/components/shared/states";
import { Badge } from "@/components/ui/badge";
import { FlashcardDeck, type DeckCard } from "@/components/app/flashcard-deck";
import { db } from "@/lib/db";
import { requireUser, getCourse } from "@/lib/queries";
import { cn } from "@/lib/utils";

export default async function FlashcardsPage({
  searchParams,
}: {
  searchParams: { level?: string; lesson?: string };
}) {
  const user = await requireUser();

  const [course, reviewedCount] = await Promise.all([
    db.course.findFirst({
      orderBy: { createdAt: "asc" },
      include: {
        levels: {
          orderBy: { order: "asc" },
          include: {
            lessons: {
              orderBy: { order: "asc" },
              include: { flashcards: { orderBy: { order: "asc" } } },
            },
          },
        },
      },
    }),
    db.flashcardReview.count({ where: { userId: user.id } }),
  ]);

  if (!course) {
    return (
      <EmptyState
        icon={Layers}
        title="Nenhum curso disponível"
        description="O conteúdo ainda não foi carregado. Rode o seed do banco."
      />
    );
  }

  const levelFilter = searchParams.level;
  const lessonFilter = searchParams.lesson;

  // Aplica filtros de nível (code) e aula (slug).
  const filteredLevels = levelFilter
    ? course.levels.filter((l) => l.code === levelFilter)
    : course.levels;

  const cards: DeckCard[] = filteredLevels
    .flatMap((level) => level.lessons)
    .filter((lesson) => !lessonFilter || lesson.slug === lessonFilter)
    .flatMap((lesson) =>
      lesson.flashcards.map((f) => ({
        id: f.id,
        front: f.front,
        back: f.back,
        example: f.example,
        pronunciationTip: f.pronunciationTip,
        category: f.category,
      }))
    );

  const totalCards = course.levels
    .flatMap((l) => l.lessons)
    .flatMap((l) => l.flashcards).length;

  // Aulas disponíveis para o seletor (respeita o filtro de nível).
  const lessonsForSelect = filteredLevels.flatMap((level) =>
    level.lessons
      .filter((l) => l.flashcards.length > 0)
      .map((l) => ({ slug: l.slug, title: l.title, code: level.code }))
  );

  function buildQuery(next: { level?: string; lesson?: string }) {
    const params = new URLSearchParams();
    if (next.level) params.set("level", next.level);
    if (next.lesson) params.set("lesson", next.lesson);
    const q = params.toString();
    return q ? `/flashcards?${q}` : "/flashcards";
  }

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader
        title="Flashcards"
        description="Revise o vocabulário com repetição espaçada. Avalie cada card como fácil, médio ou difícil."
      />

      <div className="mb-6">
        <StatCard
          label="Flashcards do curso"
          value={totalCards}
          icon={Layers}
          hint={`${reviewedCount} ${reviewedCount === 1 ? "revisado" : "revisados"} por você`}
        />
      </div>

      {/* Filtro por nível */}
      <div className="mb-3">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Nível
        </p>
        <div className="flex flex-wrap gap-2">
          <Link href={buildQuery({})}>
            <Badge variant={!levelFilter ? "default" : "muted"}>Todos</Badge>
          </Link>
          {course.levels.map((level) => (
            <Link key={level.id} href={buildQuery({ level: level.code })}>
              <Badge variant={levelFilter === level.code ? "default" : "muted"}>
                {level.code}
              </Badge>
            </Link>
          ))}
        </div>
      </div>

      {/* Filtro por aula */}
      {lessonsForSelect.length > 0 && (
        <div className="mb-6">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Aula
          </p>
          <div className="flex flex-wrap gap-2">
            <Link href={buildQuery({ level: levelFilter })}>
              <Badge variant={!lessonFilter ? "accent" : "outline"}>
                Todas as aulas
              </Badge>
            </Link>
            {lessonsForSelect.map((lesson) => (
              <Link
                key={lesson.slug}
                href={buildQuery({ level: levelFilter, lesson: lesson.slug })}
                className={cn(
                  "rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors",
                  lessonFilter === lesson.slug
                    ? "border-transparent bg-accent/15 text-accent-foreground"
                    : "hover:bg-muted"
                )}
              >
                {lesson.title}
              </Link>
            ))}
          </div>
        </div>
      )}

      {cards.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="Nenhum flashcard encontrado"
          description="Não há flashcards para os filtros selecionados. Tente outro nível ou aula."
        />
      ) : (
        <FlashcardDeck cards={cards} />
      )}
    </div>
  );
}
