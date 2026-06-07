import { db } from "@/lib/db";
import { PROGRESS_STATUS } from "@/lib/constants";

interface ProgressPatch {
  lessonRead?: boolean;
  quizPassed?: boolean;
  pronunciationDone?: boolean;
}

/**
 * Critério de conclusão da aula:
 *   - leitura concluída (lessonRead) E quiz aprovado (quizPassed)
 * A pronúncia é registrada mas não bloqueia a conclusão.
 */
export async function updateLessonProgress(
  userId: string,
  lessonId: string,
  patch: ProgressPatch
) {
  const existing = await db.userProgress.findUnique({
    where: { userId_lessonId: { userId, lessonId } },
  });

  const merged = {
    lessonRead: patch.lessonRead ?? existing?.lessonRead ?? false,
    quizPassed: patch.quizPassed ?? existing?.quizPassed ?? false,
    pronunciationDone:
      patch.pronunciationDone ?? existing?.pronunciationDone ?? false,
  };

  const completed = merged.lessonRead && merged.quizPassed;
  const anyProgress =
    merged.lessonRead || merged.quizPassed || merged.pronunciationDone;
  const status = completed
    ? PROGRESS_STATUS.COMPLETED
    : anyProgress
      ? PROGRESS_STATUS.IN_PROGRESS
      : PROGRESS_STATUS.NOT_STARTED;

  const wasCompleted = existing?.status === PROGRESS_STATUS.COMPLETED;

  const result = await db.userProgress.upsert({
    where: { userId_lessonId: { userId, lessonId } },
    update: {
      ...merged,
      status,
      completedAt: completed
        ? (existing?.completedAt ?? new Date())
        : null,
    },
    create: {
      userId,
      lessonId,
      ...merged,
      status,
      completedAt: completed ? new Date() : null,
    },
  });

  // Atualiza sequência de estudo (streak simples) ao concluir algo novo.
  if (completed && !wasCompleted) {
    await db.user.update({
      where: { id: userId },
      data: { lastStudyAt: new Date(), streakCount: { increment: 1 } },
    });
  } else if (anyProgress) {
    await db.user.update({
      where: { id: userId },
      data: { lastStudyAt: new Date() },
    });
  }

  return result;
}
