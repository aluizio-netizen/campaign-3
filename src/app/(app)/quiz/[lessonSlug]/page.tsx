import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/queries";
import { QUESTION_TYPES } from "@/lib/constants";
import { QuizRunner, type ClientQuestion } from "@/components/app/quiz-runner";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default async function QuizPage({
  params,
}: {
  params: { lessonSlug: string };
}) {
  await requireUser();
  const lesson = await db.lesson.findUnique({
    where: { slug: params.lessonSlug },
    include: {
      quiz: {
        include: {
          questions: {
            orderBy: { order: "asc" },
            include: { options: { orderBy: { order: "asc" } } },
          },
        },
      },
    },
  });
  if (!lesson?.quiz) notFound();

  // Sanitiza: não enviar isCorrect/correctAnswer ao cliente.
  const questions: ClientQuestion[] = lesson.quiz.questions.map((q) => ({
    id: q.id,
    type: q.type,
    prompt: q.prompt,
    options: q.options.map((o) => ({ id: o.id, text: o.text })),
    words:
      q.type === QUESTION_TYPES.WORD_ORDER
        ? shuffle((q.correctAnswer ?? "").split(/\s+/).filter(Boolean))
        : undefined,
  }));

  return (
    <div className="mx-auto max-w-2xl">
      <Link
        href={`/aula/${lesson.slug}`}
        className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Voltar para a aula
      </Link>
      <h1 className="font-display text-2xl font-semibold tracking-tight">
        {lesson.quiz.title}
      </h1>
      <p className="mt-1 text-sm text-muted-foreground">
        {questions.length} questões · mínimo {lesson.quiz.passScore}% para
        aprovar.
      </p>

      <div className="mt-6">
        <QuizRunner
          lessonSlug={lesson.slug}
          passScore={lesson.quiz.passScore}
          questions={questions}
        />
      </div>
    </div>
  );
}
