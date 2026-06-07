"use client";

import { useState } from "react";
import {
  Eye,
  RotateCcw,
  Sparkles,
  Loader2,
  CheckCircle2,
  Lightbulb,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProgressBar } from "@/components/ui/progress-bar";
import { SpeakButton } from "@/components/app/speak-button";
import { EmptyState } from "@/components/shared/states";
import { FLASHCARD_DIFFICULTY, type FlashcardDifficulty } from "@/lib/constants";

export interface DeckCard {
  id: string;
  front: string;
  back: string;
  example: string;
  pronunciationTip: string;
  category: string;
}

const DIFFICULTY_BUTTONS: {
  value: FlashcardDifficulty;
  label: string;
  variant: "default" | "secondary" | "outline";
}[] = [
  { value: FLASHCARD_DIFFICULTY.EASY, label: "Fácil", variant: "default" },
  { value: FLASHCARD_DIFFICULTY.MEDIUM, label: "Médio", variant: "secondary" },
  { value: FLASHCARD_DIFFICULTY.HARD, label: "Difícil", variant: "outline" },
];

const DIFFICULTY_LABELS: Record<FlashcardDifficulty, string> = {
  EASY: "Fácil",
  MEDIUM: "Médio",
  HARD: "Difícil",
};

export function FlashcardDeck({ cards }: { cards: DeckCard[] }) {
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [pending, setPending] = useState<FlashcardDifficulty | null>(null);
  const [counts, setCounts] = useState<Record<FlashcardDifficulty, number>>({
    EASY: 0,
    MEDIUM: 0,
    HARD: 0,
  });
  const [finished, setFinished] = useState(false);

  if (cards.length === 0) {
    return (
      <EmptyState
        icon={Sparkles}
        title="Nenhum flashcard disponível"
        description="Não há flashcards para os filtros selecionados. Tente outro nível ou aula."
      />
    );
  }

  const card = cards[index];
  const total = cards.length;

  function restart() {
    setIndex(0);
    setRevealed(false);
    setFinished(false);
    setCounts({ EASY: 0, MEDIUM: 0, HARD: 0 });
  }

  async function rate(difficulty: FlashcardDifficulty) {
    if (pending) return;
    setPending(difficulty);
    try {
      await fetch("/api/flashcards/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ flashcardId: card.id, difficulty }),
      });
    } catch {
      // Falha silenciosa: a revisão é registrada de forma best-effort.
    }
    setCounts((prev) => ({ ...prev, [difficulty]: prev[difficulty] + 1 }));
    setPending(null);
    setRevealed(false);

    if (index + 1 >= total) {
      setFinished(true);
    } else {
      setIndex((i) => i + 1);
    }
  }

  if (finished) {
    return (
      <Card className="p-8 text-center">
        <span className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-full bg-success/15 text-success">
          <CheckCircle2 className="h-7 w-7" />
        </span>
        <h3 className="font-display text-xl font-semibold">
          Revisão concluída!
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Você revisou {total} {total === 1 ? "flashcard" : "flashcards"}.
        </p>
        <div className="mx-auto mt-5 flex max-w-xs flex-col gap-2">
          {DIFFICULTY_BUTTONS.map((d) => (
            <div
              key={d.value}
              className="flex items-center justify-between rounded-md bg-muted/60 px-3 py-2 text-sm"
            >
              <span>{DIFFICULTY_LABELS[d.value]}</span>
              <span className="font-semibold">{counts[d.value]}</span>
            </div>
          ))}
        </div>
        <Button className="mt-6" onClick={restart}>
          <RotateCcw className="h-4 w-4" /> Reiniciar
        </Button>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm text-muted-foreground">
          {index + 1}/{total}
        </span>
        <div className="w-full max-w-xs">
          <ProgressBar value={((index + (revealed ? 1 : 0)) / total) * 100} />
        </div>
      </div>

      <Card className="p-6">
        <div className="mb-3 flex items-center gap-2">
          <Badge variant="muted">{card.category}</Badge>
        </div>

        {/* Frente — termo em inglês */}
        <div className="flex items-center justify-center gap-3 py-6">
          <p className="font-display text-3xl font-semibold tracking-tight">
            {card.front}
          </p>
          <SpeakButton text={card.front} />
        </div>

        {!revealed ? (
          <Button className="w-full" onClick={() => setRevealed(true)}>
            <Eye className="h-4 w-4" /> Mostrar resposta
          </Button>
        ) : (
          <div className="space-y-4">
            <div className="rounded-lg bg-muted/50 p-4 text-center">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Tradução
              </p>
              <p className="mt-1 text-xl font-medium">{card.back}</p>
            </div>

            <div className="rounded-lg border p-4">
              <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Exemplo
              </p>
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm italic">{card.example}</p>
                <SpeakButton text={card.example} />
              </div>
            </div>

            {card.pronunciationTip && (
              <div className="flex items-start gap-2 rounded-lg bg-accent/5 p-3 text-sm">
                <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-accent-foreground" />
                <span>
                  <span className="font-medium">Dica de pronúncia: </span>
                  {card.pronunciationTip}
                </span>
              </div>
            )}

            <div>
              <p className="mb-2 text-center text-xs text-muted-foreground">
                Como foi lembrar este termo?
              </p>
              <div className="grid grid-cols-3 gap-2">
                {DIFFICULTY_BUTTONS.map((d) => (
                  <Button
                    key={d.value}
                    variant={d.variant}
                    disabled={Boolean(pending)}
                    onClick={() => rate(d.value)}
                  >
                    {pending === d.value && (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    )}
                    {d.label}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
