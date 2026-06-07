import { Info } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/shared/states";
import { PronunciationStudio } from "@/components/app/pronunciation-studio";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/queries";
import { parseJson, formatDate } from "@/lib/utils";

/** Frases padrão (contexto de missão) quando nenhuma aula é informada. */
const DEFAULT_PHRASES = [
  "Copy that.",
  "Say again, please.",
  "I'm ready.",
  "Where is the base?",
  "Nice to meet you.",
  "Stand by.",
];

interface PhraseItem {
  en: string;
  pt?: string;
  tip?: string;
}

export default async function PronunciationPage({
  searchParams,
}: {
  searchParams: { lesson?: string };
}) {
  const user = await requireUser();
  const lessonSlug = searchParams.lesson;

  const lesson = lessonSlug
    ? await db.lesson.findUnique({
        where: { slug: lessonSlug },
        include: { content: true },
      })
    : null;

  // content.phrases é STRING JSON de [{ en, pt, tip? }].
  const lessonPhrases = lesson?.content
    ? parseJson<PhraseItem[]>(lesson.content.phrases, [])
        .map((p) => p.en)
        .filter((en): en is string => Boolean(en))
    : [];

  const phrases = lessonPhrases.length > 0 ? lessonPhrases : DEFAULT_PHRASES;

  const history = await db.pronunciationAttempt.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader
        title="Treino de pronúncia"
        description={
          lesson
            ? `Pratique as frases da aula "${lesson.title}".`
            : "Pratique frases úteis e receba uma avaliação da sua pronúncia."
        }
      />

      <div className="mb-5 flex items-start gap-2 rounded-lg border border-accent/40 bg-accent/5 p-3 text-sm">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-accent-foreground" />
        <span className="text-muted-foreground">
          Nesta versão, a avaliação de pronúncia é{" "}
          <span className="font-medium text-foreground">simulada</span> — uma
          nota aproximada para orientar a prática. A análise por reconhecimento
          de voz real chegará em breve.
        </span>
      </div>

      <PronunciationStudio phrases={phrases} lessonSlug={lesson?.slug} />

      {/* Histórico */}
      <section className="mt-8">
        <h2 className="mb-3 font-display text-lg font-semibold">
          Últimas tentativas
        </h2>
        {history.length === 0 ? (
          <EmptyState
            title="Nenhuma tentativa ainda"
            description="Grave sua primeira frase e avalie a pronúncia para começar seu histórico."
          />
        ) : (
          <div className="space-y-2">
            {history.map((attempt) => (
              <Card
                key={attempt.id}
                className="flex items-center justify-between gap-3 p-3"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">
                    {attempt.phrase}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatDate(attempt.createdAt)}
                  </p>
                </div>
                <Badge
                  variant={
                    attempt.score > 90
                      ? "success"
                      : attempt.score >= 80
                        ? "default"
                        : "warning"
                  }
                >
                  {attempt.score}%
                </Badge>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
