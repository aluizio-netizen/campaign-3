import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { gradeQuiz, type SubmittedAnswer } from "@/lib/quiz";
import { updateLessonProgress } from "@/lib/progress";

export async function POST(req: Request) {
  const session = await getSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const lessonSlug = body?.lessonSlug as string | undefined;
  const answers = (body?.answers ?? []) as SubmittedAnswer[];
  if (!lessonSlug) {
    return NextResponse.json({ error: "lessonSlug ausente." }, { status: 400 });
  }

  const lesson = await db.lesson.findUnique({
    where: { slug: lessonSlug },
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
  if (!lesson?.quiz) {
    return NextResponse.json({ error: "Quiz não encontrado." }, { status: 404 });
  }

  const graded = gradeQuiz(lesson.quiz.questions, answers);
  const passed = graded.score >= lesson.quiz.passScore;

  await db.quizAttempt.create({
    data: {
      userId: session.user.id,
      quizId: lesson.quiz.id,
      score: graded.score,
      correct: graded.correct,
      total: graded.total,
      passed,
      answers: JSON.stringify(answers),
    },
  });

  // Atualiza progresso (aprovação no quiz).
  await updateLessonProgress(session.user.id, lesson.id, {
    quizPassed: passed,
  });

  return NextResponse.json({
    ok: true,
    score: graded.score,
    correct: graded.correct,
    total: graded.total,
    passed,
    passScore: lesson.quiz.passScore,
    results: graded.results,
  });
}
