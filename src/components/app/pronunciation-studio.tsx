"use client";

import { useRef, useState } from "react";
import {
  Mic,
  Square,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  RotateCcw,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProgressBar } from "@/components/ui/progress-bar";
import { SpeakButton } from "@/components/app/speak-button";
import { cn } from "@/lib/utils";

interface EvalResult {
  score: number;
  feedback: string;
}

export function PronunciationStudio({
  phrases,
  lessonSlug,
}: {
  phrases: string[];
  lessonSlug?: string;
}) {
  const [index, setIndex] = useState(0);
  const [recording, setRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [recorderUnavailable, setRecorderUnavailable] = useState(false);
  const [simulated, setSimulated] = useState(false);
  const [evaluating, setEvaluating] = useState(false);
  const [result, setResult] = useState<EvalResult | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);

  const phrase = phrases[index] ?? "";
  const total = phrases.length;

  function resetAttempt() {
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    setAudioUrl(null);
    setSimulated(false);
    setResult(null);
  }

  function goTo(next: number) {
    resetAttempt();
    setIndex(next);
  }

  async function startRecording() {
    // Fallback gracioso quando a captação de áudio não está disponível.
    if (
      typeof navigator === "undefined" ||
      !navigator.mediaDevices?.getUserMedia ||
      typeof MediaRecorder === "undefined"
    ) {
      setRecorderUnavailable(true);
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      chunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };
      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        if (audioUrl) URL.revokeObjectURL(audioUrl);
        setAudioUrl(URL.createObjectURL(blob));
        stream.getTracks().forEach((t) => t.stop());
      };

      mediaRecorderRef.current = recorder;
      recorder.start();
      setRecording(true);
      setResult(null);
      setSimulated(false);
    } catch {
      // Permissão negada ou erro de hardware — habilita modo simulado.
      setRecorderUnavailable(true);
    }
  }

  function stopRecording() {
    mediaRecorderRef.current?.stop();
    setRecording(false);
  }

  function simulateRecording() {
    resetAttempt();
    setSimulated(true);
  }

  async function evaluate() {
    setEvaluating(true);
    try {
      const res = await fetch("/api/pronunciation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phrase, lessonSlug }),
      });
      const data = (await res.json()) as EvalResult & { error?: string };
      if (res.ok) {
        setResult({ score: data.score, feedback: data.feedback });
      }
    } catch {
      // Falha de rede — mantém o estado anterior.
    }
    setEvaluating(false);
  }

  const canEvaluate = Boolean(audioUrl) || simulated;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm text-muted-foreground">
          Frase {index + 1} de {total}
        </span>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={index === 0}
            onClick={() => goTo(index - 1)}
          >
            <ChevronLeft className="h-4 w-4" /> Anterior
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={index >= total - 1}
            onClick={() => goTo(index + 1)}
          >
            Próxima <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Card className="p-6">
        {/* Frase modelo */}
        <div className="flex flex-col items-center gap-3 py-4 text-center">
          <p className="font-display text-2xl font-semibold tracking-tight">
            {phrase}
          </p>
          <SpeakButton text={phrase} label="Ouvir modelo" />
        </div>

        {/* Controles de gravação */}
        <div className="mt-4 flex flex-col items-center gap-3">
          {!recording ? (
            <Button onClick={startRecording}>
              <Mic className="h-4 w-4" /> Gravar minha resposta
            </Button>
          ) : (
            <Button variant="danger" onClick={stopRecording}>
              <Square className="h-4 w-4" /> Parar gravação
            </Button>
          )}

          {recording && (
            <p className="flex items-center gap-2 text-sm text-danger">
              <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-danger" />
              Gravando...
            </p>
          )}

          {recorderUnavailable && (
            <div className="w-full rounded-md bg-muted/60 p-3 text-center text-sm">
              <p className="mb-2 text-muted-foreground">
                Gravação de áudio indisponível neste navegador/dispositivo.
              </p>
              <Button variant="outline" size="sm" onClick={simulateRecording}>
                <Sparkles className="h-4 w-4" /> Simular gravação
              </Button>
            </div>
          )}

          {simulated && !audioUrl && (
            <Badge variant="muted">Gravação simulada pronta para avaliação</Badge>
          )}

          {audioUrl && (
            <audio
              controls
              src={audioUrl}
              className="w-full max-w-sm"
              aria-label="Sua gravação"
            />
          )}
        </div>

        {/* Avaliação */}
        {canEvaluate && (
          <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
            <Button onClick={evaluate} disabled={evaluating}>
              {evaluating && <Loader2 className="h-4 w-4 animate-spin" />}
              Avaliar pronúncia
            </Button>
            <Button variant="ghost" size="sm" onClick={resetAttempt}>
              <RotateCcw className="h-4 w-4" /> Refazer
            </Button>
          </div>
        )}

        {/* Resultado */}
        {result && (
          <div
            className={cn(
              "mt-5 rounded-lg border p-4",
              result.score > 90
                ? "border-success/40 bg-success/5"
                : result.score >= 80
                  ? "border-primary/40 bg-primary/5"
                  : "border-warning/40 bg-warning/5"
            )}
          >
            <div className="flex items-baseline justify-between">
              <span className="text-sm font-medium text-muted-foreground">
                Sua nota
              </span>
              <span className="font-display text-2xl font-semibold">
                {result.score}%
              </span>
            </div>
            <div className="mt-2">
              <ProgressBar value={result.score} />
            </div>
            <p className="mt-3 text-sm">{result.feedback}</p>
          </div>
        )}
      </Card>

      {/*
        Pronto para STT real no futuro:
        - O Blob gravado (chunksRef / audioUrl) pode ser enviado a um endpoint
          de Speech-to-Text + scoring de pronúncia, substituindo a nota simulada
          retornada por /api/pronunciation.
      */}
    </div>
  );
}
