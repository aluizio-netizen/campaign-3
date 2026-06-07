import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Target,
  Flame,
  BookMarked,
  GraduationCap,
  MessagesSquare,
  Quote,
  PencilLine,
  Mic,
  ListChecks,
  Flag,
  CheckSquare,
  Headphones,
  Clock,
  ArrowRight,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { RichText } from "@/components/app/rich-text";
import {
  VocabularyTable,
  DialogueBlock,
  PhraseList,
  FalseFriends,
  MissionChecklist,
  VideoLessonPlaceholder,
  AudioPlayerPlaceholder,
  type DialogueLine,
  type PhraseItem,
  type FalseFriendItem,
} from "@/components/app/lesson-blocks";
import { MarkLessonRead } from "@/components/app/mark-lesson-read";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/queries";
import { parseJson, cn } from "@/lib/utils";

export default async function LessonPage({
  params,
}: {
  params: { lessonSlug: string };
}) {
  const user = await requireUser();
  const lesson = await db.lesson.findUnique({
    where: { slug: params.lessonSlug },
    include: {
      content: true,
      vocabulary: { orderBy: { order: "asc" } },
      quiz: { include: { _count: { select: { questions: true } } } },
      level: true,
    },
  });
  if (!lesson || !lesson.content) notFound();

  const progress = await db.userProgress.findUnique({
    where: { userId_lessonId: { userId: user.id, lessonId: lesson.id } },
  });

  const dialogue = parseJson<DialogueLine[]>(lesson.content.dialogue, []);
  const phrases = parseJson<PhraseItem[]>(lesson.content.phrases, []);
  const falseFriends = parseJson<FalseFriendItem[]>(
    lesson.content.falseFriends,
    []
  );
  const checklist = parseJson<string[]>(lesson.content.checklist, []);

  return (
    <div className="mx-auto max-w-3xl">
      <Link
        href={`/curso/${lesson.level.slug}`}
        className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> {lesson.level.title}
      </Link>

      {/* Cabeçalho da missão */}
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="accent">{lesson.level.code}</Badge>
        <Badge variant="muted">Missão {lesson.order}</Badge>
        <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
          <Clock className="h-3.5 w-3.5" /> {lesson.durationMin} min
        </span>
        {progress?.status === "COMPLETED" && (
          <Badge variant="success">Concluída</Badge>
        )}
      </div>
      <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight">
        {lesson.title}
      </h1>
      <p className="mt-1 text-muted-foreground">{lesson.summary}</p>

      <div className="mt-6 space-y-6">
        <Section icon={Target} title="1. Objetivo da missão">
          <p className="text-sm leading-relaxed">{lesson.objective}</p>
        </Section>

        <VideoLessonPlaceholder title={lesson.title} />

        <Section icon={Flame} title="2. Aquecimento">
          <RichText text={lesson.content.warmup} />
        </Section>

        <Section icon={BookMarked} title="3. Vocabulário">
          <VocabularyTable items={lesson.vocabulary} />
        </Section>

        <Section icon={GraduationCap} title="4. Gramática essencial">
          <RichText text={lesson.content.grammar} />
          <div className="mt-4 rounded-lg bg-muted/50 p-4">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Comparação com o português
            </p>
            <RichText text={lesson.content.comparison} />
          </div>
          {falseFriends.length > 0 && (
            <div className="mt-4">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Falsos cognatos
              </p>
              <FalseFriends items={falseFriends} />
            </div>
          )}
        </Section>

        <Section icon={MessagesSquare} title="5. Diálogo">
          <DialogueBlock lines={dialogue} />
        </Section>

        <Section icon={Quote} title="6. Frases úteis">
          <PhraseList items={phrases} />
        </Section>

        <Section icon={Headphones} title="Exercício de escuta">
          <p className="mb-3 text-sm leading-relaxed">
            {lesson.content.listeningExercise}
          </p>
          {dialogue[0] && (
            <AudioPlayerPlaceholder
              text={dialogue.map((d) => d.en).join(" ")}
              label="Ouvir o diálogo completo"
            />
          )}
        </Section>

        <Section icon={ListChecks} title="7. Exercício guiado">
          <RichText text={lesson.content.guidedExercise} />
        </Section>

        <Section icon={PencilLine} title="8. Prática de escrita">
          <RichText text={lesson.content.writingExercise} />
        </Section>

        <Section icon={Mic} title="9. Prática de fala">
          <RichText text={lesson.content.speakingExercise} />
          <Link
            href={`/pronuncia?lesson=${lesson.slug}`}
            className={cn(
              buttonVariants({ variant: "outline", size: "sm" }),
              "mt-3"
            )}
          >
            <Mic className="h-4 w-4" /> Ir para o treino de pronúncia
          </Link>
        </Section>

        {/* Quiz */}
        <Section icon={ListChecks} title="10. Quiz">
          <Card className="flex flex-col items-start gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-medium">{lesson.quiz?.title ?? "Quiz da aula"}</p>
              <p className="text-sm text-muted-foreground">
                {lesson.quiz?._count.questions ?? 0} questões ·{" "}
                {progress?.quizPassed
                  ? "✅ aprovado"
                  : `mínimo ${lesson.quiz?.passScore ?? 70}% para aprovar`}
              </p>
            </div>
            <Link
              href={`/quiz/${lesson.slug}`}
              className={buttonVariants({ size: "sm" })}
            >
              {progress?.quizPassed ? "Refazer quiz" : "Fazer quiz"}{" "}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Card>
        </Section>

        <Section icon={Flag} title="11. Missão final">
          <div className="rounded-lg border border-accent/40 bg-accent/5 p-4">
            <RichText text={lesson.content.mission} />
          </div>
        </Section>

        <Section icon={CheckSquare} title="12. Checklist de conclusão">
          <MissionChecklist items={checklist} />
          <p className="mt-4 text-xs text-muted-foreground">
            Critério para concluir esta aula: leitura concluída + quiz aprovado
            ({lesson.quiz?.passScore ?? 70}%).
          </p>
        </Section>

        {/* Ações de conclusão */}
        <div className="flex flex-wrap items-center gap-3 border-t pt-6">
          <MarkLessonRead
            lessonId={lesson.id}
            alreadyRead={Boolean(progress?.lessonRead)}
          />
          <Link
            href={`/quiz/${lesson.slug}`}
            className={buttonVariants({ variant: "outline" })}
          >
            Fazer o quiz
          </Link>
        </div>
      </div>
    </div>
  );
}

function Section({
  icon: Icon,
  title,
  children,
}: {
  icon: typeof Target;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h2 className="mb-3 flex items-center gap-2 font-display text-lg font-semibold">
        <span className="grid h-7 w-7 place-items-center rounded-md bg-primary/10 text-primary">
          <Icon className="h-4 w-4" />
        </span>
        {title}
      </h2>
      {children}
    </section>
  );
}
