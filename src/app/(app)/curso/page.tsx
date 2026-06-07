import Link from "next/link";
import { PageHeader } from "@/components/shared/page-header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProgressBar } from "@/components/ui/progress-bar";
import { LessonRow } from "@/components/app/lesson-row";
import { EmptyState } from "@/components/shared/states";
import { BookOpen } from "lucide-react";
import { requireUser, getCourse, getProgressMap } from "@/lib/queries";
import { PROGRESS_STATUS } from "@/lib/constants";

export default async function CoursePage() {
  const user = await requireUser();
  const course = await getCourse();
  const progressMap = await getProgressMap(user.id);

  if (!course) {
    return (
      <EmptyState
        icon={BookOpen}
        title="Nenhum curso disponível"
        description="O conteúdo ainda não foi carregado. Rode o seed do banco."
      />
    );
  }

  return (
    <div className="mx-auto max-w-4xl">
      <PageHeader
        title={course.title}
        description={course.description}
      />

      <div className="space-y-8">
        {course.levels.map((level) => {
          const total = level.lessons.length;
          const done = level.lessons.filter(
            (l) => progressMap.get(l.id)?.status === PROGRESS_STATUS.COMPLETED
          ).length;
          const pct = total ? Math.round((done / total) * 100) : 0;

          return (
            <section key={level.id}>
              <div className="mb-3 flex items-center gap-3">
                <Badge variant="accent">{level.code}</Badge>
                <Link
                  href={`/curso/${level.slug}`}
                  className="font-display text-lg font-semibold hover:underline"
                >
                  {level.title.replace(/^A\d — |^B\d — /, "")}
                </Link>
                <span className="ml-auto text-xs text-muted-foreground">
                  {done}/{total}
                </span>
              </div>
              <div className="mb-4">
                <ProgressBar value={pct} />
              </div>
              <div className="space-y-2">
                {level.lessons.map((lesson) => (
                  <LessonRow
                    key={lesson.id}
                    levelCode={level.code}
                    lesson={{
                      slug: lesson.slug,
                      title: lesson.title,
                      order: lesson.order,
                      objective: lesson.objective,
                      durationMin: lesson.durationMin,
                      status: progressMap.get(lesson.id)?.status ?? "NOT_STARTED",
                    }}
                  />
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
