import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { PROGRESS_STATUS } from "@/lib/constants";

/** Usuário autenticado completo, ou redireciona para /login. */
export async function requireUser() {
  const session = await getSession();
  if (!session?.user?.id) redirect("/login");
  const user = await db.user.findUnique({ where: { id: session.user.id } });
  if (!user) redirect("/login");
  return user;
}

/** Exige papel de admin. */
export async function requireAdmin() {
  const user = await requireUser();
  if (user.role !== "ADMIN") redirect("/dashboard");
  return user;
}

/** Curso principal com níveis e aulas ordenados. */
export async function getCourse() {
  return db.course.findFirst({
    orderBy: { createdAt: "asc" },
    include: {
      levels: {
        orderBy: { order: "asc" },
        include: {
          lessons: { orderBy: { order: "asc" } },
        },
      },
    },
  });
}

export type CourseWithLevels = NonNullable<
  Awaited<ReturnType<typeof getCourse>>
>;

/** Mapa lessonId -> progresso do usuário. */
export async function getProgressMap(userId: string) {
  const rows = await db.userProgress.findMany({ where: { userId } });
  return new Map(rows.map((r) => [r.lessonId, r]));
}

export interface DashboardStats {
  totalLessons: number;
  completedLessons: number;
  percent: number;
  quizzesTaken: number;
  avgScore: number;
  pronunciationDone: number;
  estimatedMinutes: number;
  streak: number;
  currentLevelCode: string;
}

export async function getDashboardStats(
  userId: string,
  course: CourseWithLevels | null
): Promise<DashboardStats> {
  const lessons = course?.levels.flatMap((l) => l.lessons) ?? [];
  const totalLessons = lessons.length;

  const [progress, attempts, pronunciation, user] = await Promise.all([
    db.userProgress.findMany({ where: { userId } }),
    db.quizAttempt.findMany({ where: { userId } }),
    db.pronunciationAttempt.count({ where: { userId } }),
    db.user.findUnique({ where: { id: userId } }),
  ]);

  const completed = progress.filter(
    (p) => p.status === PROGRESS_STATUS.COMPLETED
  );
  const completedLessons = completed.length;
  const percent = totalLessons
    ? Math.round((completedLessons / totalLessons) * 100)
    : 0;

  const avgScore = attempts.length
    ? Math.round(
        attempts.reduce((s, a) => s + a.score, 0) / attempts.length
      )
    : 0;

  const estimatedMinutes = lessons.reduce((s, l) => s + l.durationMin, 0);

  // Nível atual = primeiro nível com aula não concluída.
  let currentLevelCode = course?.levels[0]?.code ?? "A1";
  if (course) {
    const completedIds = new Set(completed.map((c) => c.lessonId));
    for (const level of course.levels) {
      const allDone = level.lessons.every((l) => completedIds.has(l.id));
      if (!allDone) {
        currentLevelCode = level.code;
        break;
      }
      currentLevelCode = level.code;
    }
  }

  return {
    totalLessons,
    completedLessons,
    percent,
    quizzesTaken: attempts.length,
    avgScore,
    pronunciationDone: pronunciation,
    estimatedMinutes,
    streak: user?.streakCount ?? 0,
    currentLevelCode,
  };
}

/** Biblioteca de áudio (álbuns + faixas) ordenada. */
export async function getAudioLibrary() {
  return db.audioAlbum.findMany({
    orderBy: { order: "asc" },
    include: { tracks: { orderBy: { order: "asc" } } },
  });
}

/** Biblioteca de páginas (coleções + páginas) ordenada. */
export async function getBookLibrary() {
  return db.bookCollection.findMany({
    orderBy: { order: "asc" },
    include: { pages: { orderBy: { order: "asc" } } },
  });
}

/** Curso real (Campaign 3) com unidades publicadas. */
export async function getCampaignUnits(opts?: { includeUnpublished?: boolean }) {
  const course = await db.course.findUnique({ where: { slug: "campaign-3" } });
  if (!course) return [];
  return db.unit.findMany({
    where: {
      courseId: course.id,
      ...(opts?.includeUnpublished ? {} : { published: true }),
    },
    orderBy: { order: "asc" },
    include: {
      _count: { select: { tracks: true, pages: true } },
    },
  });
}

/** Próxima aula recomendada (primeira não concluída na ordem do curso). */
export function getNextLesson(
  course: CourseWithLevels | null,
  progressMap: Map<string, { status: string }>
) {
  if (!course) return null;
  for (const level of course.levels) {
    for (const lesson of level.lessons) {
      const p = progressMap.get(lesson.id);
      if (!p || p.status !== PROGRESS_STATUS.COMPLETED) {
        return { lesson, level };
      }
    }
  }
  // Tudo concluído -> retorna a última.
  const lastLevel = course.levels[course.levels.length - 1];
  const lastLesson = lastLevel?.lessons[lastLevel.lessons.length - 1];
  return lastLesson ? { lesson: lastLesson, level: lastLevel } : null;
}
