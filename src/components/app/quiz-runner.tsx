"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  CheckCircle2,
  XCircle,
  Loader2,
  RotateCcw,
  Trophy,
  Info,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ProgressBar } from "@/components/ui/progress-bar";
import {
  QUESTION_TYPES,
  QUESTION_TYPE_LABELS,
  type QuestionType,
} from "@/lib/constants";
import { cn } from "@/lib/utils";

export interface ClientQuestion {
  id: string;
  type: string;
  prompt: string;
  options: { id: string; text: string }[];
  words?: string[];
}

interface QResult {
  questionId: string;
  correct: boolean;
  autoGraded: boolean;
  explanation: string;
  expected: string;
  given: string;
}
interface SubmitResponse {
  score: number;
  correct: number;
  total: number;
  passed: boolean;
  passScore: number;
  results: QResult[];
}

export function QuizRunner({
  lessonSlug,
  passScore,
  questions,
}: {
  lessonSlug: string;
  passScore: number;
  questions: ClientQuestion[];
}) {
  const router = useRouter();
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SubmitResponse | null>(null);

  function setAnswer(qid: string, value: string) {
    setAnswers((prev) => ({ ...prev, [qid]: value }));
  }

  async function submit() {
    setLoading(true);
    const payload = {
      lessonSlug,
      answers: questions.map((q) => ({
        questionId: q.id,
        value: answers[q.id] ?? "",
      })),
    };
    const res = await fetch("/api/quiz/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    setLoading(false);
    if (res.ok) {
      setResult(data);
      router.refresh();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  function reset() {
    setAnswers({});
    setResult(null);
  }

  const resultMap = result
    ? new Map(result.results.map((r) => [r.questionId, r]))
    : null;
  const answeredCount = questions.filter((q) => answers[q.id]?.trim()).length;

  return (
    <div className="space-y-5">
      {result && (
        <Card
          className={cn(
            "p-6",
            result.passed ? "border-success/40 bg-success/5" : "border-warning/40 bg-warning/5"
          )}
        >
          <div className="flex items-center gap-3">
            <span
              className={cn(
                "grid h-12 w-12 place-items-center rounded-full",
                result.passed
                  ? "bg-success/15 text-success"
                  : "bg-warning/15 text-warning"
              )}
            >
              <Trophy className="h-6 w-6" />
            </span>
            <div>
              <p className="font-display text-2xl font-semibold">
                {result.score}%
              </p>
              <p className="text-sm text-muted-foreground">
                {result.correct}/{result.total} acertos ·{" "}
                {result.passed
                  ? "Aprovado! 🎉"
                  : `Mínimo ${result.passScore}% — tente novamente.`}
              </p>
            </div>
          </div>
          <div className="mt-4">
            <ProgressBar value={result.score} />
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={reset}>
              <RotateCcw className="h-4 w-4" /> Refazer
            </Button>
            <Link
              href={`/aula/${lessonSlug}`}
              className="inline-flex h-9 items-center rounded-md border px-3 text-xs font-medium hover:bg-muted"
            >
              Voltar para a aula
            </Link>
          </div>
        </Card>
      )}

      {questions.map((q, idx) => {
        const r = resultMap?.get(q.id);
        return (
          <Card key={q.id} className="p-5">
            <div className="mb-2 flex items-center gap-2">
              <span className="text-sm font-semibold text-muted-foreground">
                {idx + 1}.
              </span>
              <Badge variant="muted" className="text-[10px]">
                {QUESTION_TYPE_LABELS[q.type as QuestionType] ?? q.type}
              </Badge>
              {r && r.autoGraded && (
                <span className="ml-auto">
                  {r.correct ? (
                    <CheckCircle2 className="h-5 w-5 text-success" />
                  ) : (
                    <XCircle className="h-5 w-5 text-danger" />
                  )}
                </span>
              )}
            </div>
            <p className="mb-3 font-medium">{q.prompt}</p>

            <QuestionInput
              question={q}
              value={answers[q.id] ?? ""}
              onChange={(v) => setAnswer(q.id, v)}
              disabled={Boolean(result)}
              result={r}
            />

            {r && (
              <div className="mt-3 rounded-md bg-muted/60 p-3 text-sm">
                {r.autoGraded && !r.correct && (
                  <p className="mb-1">
                    <span className="font-medium">Resposta correta:</span>{" "}
                    {r.expected}
                  </p>
                )}
                {!r.autoGraded && (
                  <p className="mb-1 flex items-center gap-1 text-muted-foreground">
                    <Info className="h-3.5 w-3.5" /> Resposta aberta — pratique
                    com o Professor IA para correção detalhada.
                  </p>
                )}
                <p className="text-muted-foreground">{r.explanation}</p>
              </div>
            )}
          </Card>
        );
      })}

      {!result && (
        <div className="sticky bottom-4 flex items-center justify-between gap-3 rounded-lg border bg-card/95 p-3 shadow-card backdrop-blur">
          <span className="text-sm text-muted-foreground">
            {answeredCount}/{questions.length} respondidas
          </span>
          <Button onClick={submit} disabled={loading}>
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            Enviar respostas
          </Button>
        </div>
      )}
    </div>
  );
}

function QuestionInput({
  question,
  value,
  onChange,
  disabled,
  result,
}: {
  question: ClientQuestion;
  value: string;
  onChange: (v: string) => void;
  disabled: boolean;
  result?: QResult;
}) {
  const isChoice =
    question.type === QUESTION_TYPES.MULTIPLE_CHOICE ||
    question.type === QUESTION_TYPES.FIND_ERROR;

  if (isChoice) {
    return (
      <div className="space-y-2">
        {question.options.map((o) => {
          const selected = value === o.id;
          return (
            <button
              key={o.id}
              type="button"
              disabled={disabled}
              onClick={() => onChange(o.id)}
              className={cn(
                "flex w-full items-center gap-3 rounded-lg border px-3 py-2.5 text-left text-sm transition-colors",
                selected
                  ? "border-primary bg-primary/5"
                  : "hover:bg-muted",
                disabled && "cursor-default"
              )}
            >
              <span
                className={cn(
                  "grid h-5 w-5 shrink-0 place-items-center rounded-full border text-[10px]",
                  selected
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-muted-foreground/40"
                )}
              >
                {selected ? "✓" : ""}
              </span>
              {o.text}
            </button>
          );
        })}
      </div>
    );
  }

  if (question.type === QUESTION_TYPES.WORD_ORDER) {
    const words = question.words ?? [];
    const built = value.trim();
    return (
      <div>
        <div className="min-h-[44px] rounded-lg border bg-muted/40 p-2 text-sm">
          {built || (
            <span className="text-muted-foreground">
              Clique nas palavras na ordem correta…
            </span>
          )}
        </div>
        <div className="mt-2 flex flex-wrap gap-2">
          {words.map((w, i) => (
            <button
              key={`${w}-${i}`}
              type="button"
              disabled={disabled}
              onClick={() => onChange((value ? value + " " : "") + w)}
              className="rounded-md border bg-card px-2.5 py-1 text-sm hover:bg-muted disabled:opacity-50"
            >
              {w}
            </button>
          ))}
        </div>
        {!disabled && built && (
          <button
            type="button"
            onClick={() => onChange("")}
            className="mt-2 text-xs text-muted-foreground hover:text-foreground"
          >
            Limpar
          </button>
        )}
      </div>
    );
  }

  if (question.type === QUESTION_TYPES.FREE_TEXT) {
    return (
      <Textarea
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Escreva sua resposta em inglês…"
        className={cn(
          result && (result.correct ? "border-success" : "")
        )}
      />
    );
  }

  // FILL_BLANK / TRANSLATE_*
  return (
    <Input
      value={value}
      disabled={disabled}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Sua resposta…"
      className={cn(
        result &&
          (result.correct
            ? "border-success bg-success/5"
            : "border-danger bg-danger/5")
      )}
    />
  );
}
