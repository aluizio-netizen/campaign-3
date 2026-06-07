import Link from "next/link";
import { CheckCircle2, Circle, Clock, PlayCircle, Lock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export interface LessonRowData {
  slug: string;
  title: string;
  order: number;
  objective: string;
  durationMin: number;
  status: "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED" | string;
}

export function LessonRow({
  lesson,
  levelCode,
  locked = false,
}: {
  lesson: LessonRowData;
  levelCode?: string;
  locked?: boolean;
}) {
  const completed = lesson.status === "COMPLETED";
  const inProgress = lesson.status === "IN_PROGRESS";

  const Icon = locked
    ? Lock
    : completed
      ? CheckCircle2
      : inProgress
        ? PlayCircle
        : Circle;

  const content = (
    <div
      className={cn(
        "flex items-center gap-4 rounded-lg border bg-card p-4 transition-colors",
        locked ? "opacity-60" : "hover:border-primary/40 hover:bg-muted/40"
      )}
    >
      <Icon
        className={cn(
          "h-6 w-6 shrink-0",
          completed
            ? "text-success"
            : inProgress
              ? "text-primary"
              : "text-muted-foreground"
        )}
      />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-muted-foreground">
            Missão {lesson.order}
          </span>
          {levelCode && (
            <Badge variant="muted" className="text-[10px]">
              {levelCode}
            </Badge>
          )}
          {completed && (
            <Badge variant="success" className="text-[10px]">
              Concluída
            </Badge>
          )}
          {inProgress && (
            <Badge variant="warning" className="text-[10px]">
              Em andamento
            </Badge>
          )}
        </div>
        <p className="truncate font-medium">{lesson.title}</p>
        <p className="truncate text-sm text-muted-foreground">
          {lesson.objective}
        </p>
      </div>
      <div className="hidden shrink-0 items-center gap-1 text-xs text-muted-foreground sm:flex">
        <Clock className="h-3.5 w-3.5" /> {lesson.durationMin} min
      </div>
    </div>
  );

  if (locked) return <div>{content}</div>;
  return <Link href={`/aula/${lesson.slug}`}>{content}</Link>;
}
