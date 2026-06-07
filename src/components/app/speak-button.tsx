"use client";

import { useState } from "react";
import { Volume2 } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Botão "Ouvir pronúncia".
 * Usa a Web Speech API (TTS nativo do navegador) — funciona sem chave de API.
 * Está pronto para ser trocado por um serviço de TTS real no futuro.
 */
export function SpeakButton({
  text,
  lang = "en-US",
  label,
  className,
}: {
  text: string;
  lang?: string;
  label?: string;
  className?: string;
}) {
  const [speaking, setSpeaking] = useState(false);

  function speak() {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      alert("Seu navegador não suporta síntese de voz.");
      return;
    }
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = lang;
    u.rate = 0.92;
    u.onstart = () => setSpeaking(true);
    u.onend = () => setSpeaking(false);
    u.onerror = () => setSpeaking(false);
    window.speechSynthesis.speak(u);
  }

  return (
    <button
      type="button"
      onClick={speak}
      title="Ouvir pronúncia"
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs font-medium transition-colors hover:bg-muted",
        speaking && "border-primary text-primary",
        className
      )}
    >
      <Volume2 className={cn("h-3.5 w-3.5", speaking && "animate-pulse")} />
      {label ?? "Ouvir"}
    </button>
  );
}
