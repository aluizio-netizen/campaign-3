import { Award, CheckCircle2, Circle, Lock } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Card } from "@/components/ui/card";
import { ProgressBar } from "@/components/ui/progress-bar";
import { EmptyState } from "@/components/shared/states";
import { CertificateView } from "@/components/app/certificate-view";
import { IssueCertificateButton } from "@/components/app/issue-certificate-button";
import { db } from "@/lib/db";
import { requireUser, getCourse, getProgressMap } from "@/lib/queries";
import { PROGRESS_STATUS } from "@/lib/constants";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

export default async function CertificatePage() {
  const user = await requireUser();
  const course = await getCourse();

  if (!course) {
    return (
      <EmptyState
        icon={Award}
        title="Nenhum curso disponível"
        description="O conteúdo ainda não foi carregado. Rode o seed do banco."
      />
    );
  }

  const [progressMap, attempts, certificate] = await Promise.all([
    getProgressMap(user.id),
    db.quizAttempt.findMany({ where: { userId: user.id } }),
    db.certificate.findFirst({ where: { userId: user.id } }),
  ]);

  // Já emitido — mostra o certificado.
  if (certificate) {
    return (
      <div className="mx-auto max-w-3xl">
        <PageHeader
          title="Seu certificado"
          description="Parabéns! Você concluiu o curso. Imprima ou baixe em PDF."
        />
        <CertificateView
          studentName={certificate.studentName}
          courseTitle={certificate.courseTitle}
          hours={certificate.hours}
          code={certificate.code}
          issuedAt={certificate.issuedAt}
          score={certificate.score}
        />
      </div>
    );
  }

  const lessons = course.levels.flatMap((l) => l.lessons);
  const total = lessons.length;
  const completed = lessons.filter(
    (l) => progressMap.get(l.id)?.status === PROGRESS_STATUS.COMPLETED
  ).length;

  const avgScore = attempts.length
    ? Math.round(attempts.reduce((s, a) => s + a.score, 0) / attempts.length)
    : 0;

  const lessonsDone = total > 0 && completed === total;
  const scoreOk = avgScore >= siteConfig.passScore;
  const eligible = lessonsDone && scoreOk;

  const pct = total ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader
        title="Certificado de conclusão"
        description="Cumpra os critérios abaixo para emitir o seu certificado."
      />

      <Card className="space-y-5 p-6">
        <div>
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="font-medium">Progresso geral</span>
            <span className="text-muted-foreground">
              {completed}/{total} aulas
            </span>
          </div>
          <ProgressBar value={pct} showLabel />
        </div>

        <div className="space-y-3 border-t pt-5">
          <CriterionRow
            done={lessonsDone}
            label="Concluir todas as aulas do curso"
            detail={`${completed} de ${total} aulas concluídas`}
          />
          <CriterionRow
            done={scoreOk}
            label="Atingir a média mínima nos quizzes"
            detail={`Média atual: ${avgScore}% · Mínimo: ${siteConfig.passScore}%`}
          />
        </div>

        <div className="border-t pt-5">
          {eligible ? (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Você cumpriu todos os critérios. Emita seu certificado oficial
                com {siteConfig.courseHours} horas e aproveitamento de{" "}
                {avgScore}%.
              </p>
              <IssueCertificateButton />
            </div>
          ) : (
            <EmptyState
              icon={Lock}
              title="Certificado ainda não disponível"
              description={
                !lessonsDone
                  ? `Conclua todas as aulas (${completed}/${total}) para liberar.`
                  : `Aumente sua média nos quizzes para ${siteConfig.passScore}% ou mais (atual: ${avgScore}%).`
              }
            />
          )}
        </div>
      </Card>
    </div>
  );
}

function CriterionRow({
  done,
  label,
  detail,
}: {
  done: boolean;
  label: string;
  detail: string;
}) {
  return (
    <div className="flex items-start gap-3">
      {done ? (
        <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-success" />
      ) : (
        <Circle className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" />
      )}
      <div>
        <p className={cn("text-sm font-medium", done && "text-success")}>
          {label}
        </p>
        <p className="text-xs text-muted-foreground">{detail}</p>
      </div>
    </div>
  );
}
