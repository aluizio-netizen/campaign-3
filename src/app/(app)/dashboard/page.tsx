import Link from "next/link";
import {
  CheckCircle2,
  Flame,
  Bot,
  Award,
  ListChecks,
  Mic,
  ArrowRight,
  Library,
} from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/stat-card";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProgressBar } from "@/components/ui/progress-bar";
import { buttonVariants } from "@/components/ui/button";
import {
  requireUser,
  getCourse,
  getProgressMap,
  getDashboardStats,
  getNextLesson,
} from "@/lib/queries";
import { PROGRESS_STATUS } from "@/lib/constants";
import { cn } from "@/lib/utils";

export default async function DashboardPage() {
  const user = await requireUser();
  const course = await getCourse();
  const progressMap = await getProgressMap(user.id);
  const stats = await getDashboardStats(user.id, course);
  const next = getNextLesson(course, progressMap);

  const firstName = user.name.split(" ")[0];

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        title={`Olá, ${firstName} 👋`}
        description="Bem-vindo de volta. Continue sua missão de onde parou."
      />

      {/* Banner do material real (Campaign 3) */}
      <Link href="/material" className="mb-6 block">
        <div className="gradient-hero flex items-center gap-4 rounded-lg p-5 text-white transition-opacity hover:opacity-95">
          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-white/15">
            <Library className="h-6 w-6" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="font-display text-lg font-semibold">Unidades do curso (Campaign 3)</p>
            <p className="text-sm text-white/80">
              As 12 unidades com páginas do livro e áudios — comece por aqui.
            </p>
          </div>
          <ArrowRight className="h-5 w-5 shrink-0" />
        </div>
      </Link>

      {/* Linha de destaque: progresso + próxima aula */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Progresso operacional</p>
              <p className="mt-1 font-display text-3xl font-semibold">
                {stats.percent}%
              </p>
            </div>
            <Badge variant="accent" className="h-fit">
              Nível atual: {stats.currentLevelCode}
            </Badge>
          </div>
          <div className="mt-4">
            <ProgressBar value={stats.percent} showLabel />
          </div>
          <p className="mt-3 text-sm text-muted-foreground">
            {stats.completedLessons} de {stats.totalLessons} missões concluídas.
          </p>
        </Card>

        <Card className="p-6">
          <p className="text-sm text-muted-foreground">Próxima missão</p>
          {next ? (
            <>
              <p className="mt-1 font-display text-lg font-semibold leading-tight">
                {next.lesson.title}
              </p>
              <Badge variant="muted" className="mt-2">
                {next.level.code} · {next.lesson.durationMin} min
              </Badge>
              <Link
                href={`/aula/${next.lesson.slug}`}
                className={cn(buttonVariants({ size: "sm" }), "mt-4 w-full")}
              >
                Continuar <ArrowRight className="h-4 w-4" />
              </Link>
            </>
          ) : (
            <p className="mt-2 text-sm text-muted-foreground">
              Nenhuma aula disponível ainda.
            </p>
          )}
        </Card>
      </div>

      {/* Indicadores de desempenho */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Aulas concluídas"
          value={`${stats.completedLessons}/${stats.totalLessons}`}
          icon={CheckCircle2}
        />
        <StatCard
          label="Quizzes realizados"
          value={stats.quizzesTaken}
          icon={ListChecks}
          hint={`Média de acertos: ${stats.avgScore}%`}
        />
        <StatCard
          label="Pronúncia"
          value={stats.pronunciationDone}
          icon={Mic}
          hint="exercícios concluídos"
        />
        <StatCard
          label="Sequência"
          value={`${stats.streak} dias`}
          icon={Flame}
          hint={`~${Math.round(stats.estimatedMinutes / 60)}h de estudo estimadas`}
        />
      </div>

      {/* Níveis */}
      <div className="mt-8">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold">Seus níveis</h2>
          <Link
            href="/curso"
            className="text-sm font-medium text-primary hover:underline"
          >
            Ver curso completo
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {course?.levels.map((level) => {
            const total = level.lessons.length;
            const done = level.lessons.filter(
              (l) => progressMap.get(l.id)?.status === PROGRESS_STATUS.COMPLETED
            ).length;
            const pct = total ? Math.round((done / total) * 100) : 0;
            return (
              <Card key={level.id} className="p-5">
                <div className="flex items-center justify-between">
                  <Badge variant="accent">{level.code}</Badge>
                  <span className="text-xs text-muted-foreground">
                    {done}/{total}
                  </span>
                </div>
                <h3 className="mt-3 font-display text-base font-semibold">
                  {level.title.replace(/^A\d — |^B\d — /, "")}
                </h3>
                <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                  {level.description}
                </p>
                <div className="mt-4">
                  <ProgressBar value={pct} />
                </div>
                <Link
                  href={`/curso/${level.slug}`}
                  className={cn(
                    buttonVariants({ variant: "outline", size: "sm" }),
                    "mt-4 w-full"
                  )}
                >
                  Abrir nível
                </Link>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Atalhos */}
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <QuickLink
          href="/professor-ia"
          icon={Bot}
          title="Professor IA"
          text="Pratique conversação e correções."
        />
        <QuickLink
          href="/pronuncia"
          icon={Mic}
          title="Pronúncia"
          text="Treine e grave sua voz."
        />
        <QuickLink
          href="/certificado"
          icon={Award}
          title="Certificado"
          text="Acompanhe seus critérios."
        />
      </div>
    </div>
  );
}

function QuickLink({
  href,
  icon: Icon,
  title,
  text,
}: {
  href: string;
  icon: typeof Bot;
  title: string;
  text: string;
}) {
  return (
    <Link href={href}>
      <Card className="p-5 transition-shadow hover:shadow-card">
        <CardContent className="flex items-start gap-3 p-0">
          <span className="grid h-10 w-10 place-items-center rounded-lg bg-primary/10 text-primary">
            <Icon className="h-5 w-5" />
          </span>
          <div>
            <p className="font-medium">{title}</p>
            <p className="text-sm text-muted-foreground">{text}</p>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
