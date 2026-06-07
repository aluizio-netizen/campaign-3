import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Badge } from "@/components/ui/badge";
import { ProgressBar } from "@/components/ui/progress-bar";
import { LessonRow } from "@/components/app/lesson-row";
import { db } from "@/lib/db";
import { requireUser, getProgressMap } from "@/lib/queries";
import { PROGRESS_STATUS } from "@/lib/constants";

export default async function LevelPage({
  params,
}: {
  params: { levelSlug: string };
}) {
  const user = await requireUser();
  const level = await db.level.findUnique({
    where: { slug: params.levelSlug },
    include: { lessons: { orderBy: { order: "asc" } } },
  });
  if (!level) notFound();

  const progressMap = await getProgressMap(user.id);
  const total = level.lessons.length;
  const done = level.lessons.filter(
    (l) => progressMap.get(l.id)?.status === PROGRESS_STATUS.COMPLETED
  ).length;
  const pct = total ? Math.round((done / total) * 100) : 0;

  return (
    <div className="mx-auto max-w-4xl">
      <Link
        href="/curso"
        className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Voltar ao curso
      </Link>

      <PageHeader
        title={level.title}
        description={level.description}
        action={<Badge variant="accent" className="text-sm">{level.code}</Badge>}
      />

      <div className="mb-6 rounded-lg border bg-card p-4">
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="font-medium">Progresso do nível</span>
          <span className="text-muted-foreground">
            {done}/{total} missões
          </span>
        </div>
        <ProgressBar value={pct} showLabel />
      </div>

      <div className="space-y-2">
        {level.lessons.map((lesson) => (
          <LessonRow
            key={lesson.id}
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
    </div>
  );
}
