"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Send, Loader2, Bot, User, Sparkles, Plus } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { AI_MODES, type AiMode } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface Msg {
  role: "user" | "assistant";
  content: string;
}

const SUGGESTIONS: Record<AiMode, string[]> = {
  free: ["Let's talk about my day", "Ask me a question in English", "Como digo 'estou pronto'?"],
  correction: ["I goed to the base yesterday", "Corrija: 'He have a radio'", "Me ajuda com esta frase"],
  travel: ["Roleplay a checkpoint", "Simule um pedido no refeitório", "Hotel check-in roleplay"],
  pronunciation: ["Treinar o som do 'th'", "Give me a sentence to repeat", "Como pronuncio 'enough'?"],
  review: ["Revisar a aula de saudações", "Me teste no vocabulário", "Quiz me on directions"],
  study_plan: ["Tenho 30 min por dia", "Quero focar em conversação", "Monte um plano de 7 dias"],
};

export function AiChat({
  initialConversationId,
  initialMessages,
  initialMode,
  studentLevel,
  demoMode,
}: {
  initialConversationId?: string;
  initialMessages: Msg[];
  initialMode: AiMode;
  studentLevel: string;
  demoMode: boolean;
}) {
  const router = useRouter();
  const [conversationId, setConversationId] = useState(initialConversationId);
  const [messages, setMessages] = useState<Msg[]>(initialMessages);
  const [mode, setMode] = useState<AiMode>(initialMode);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [messages, loading]);

  async function send(text: string) {
    const content = text.trim();
    if (!content || loading) return;
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content }]);
    setLoading(true);
    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conversationId, mode, message: content, studentLevel }),
      });
      const data = await res.json();
      if (res.ok) {
        setConversationId(data.conversationId);
        setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
        router.refresh();
      } else {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: "⚠️ " + (data.error ?? "Erro ao responder.") },
        ]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "⚠️ Erro de conexão." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function newConversation() {
    setConversationId(undefined);
    setMessages([]);
    router.push("/professor-ia");
  }

  return (
    <Card className="flex h-[calc(100vh-12rem)] min-h-[28rem] flex-col">
      {/* Cabeçalho: modos */}
      <div className="border-b p-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Badge variant="accent">Nível {studentLevel}</Badge>
            {demoMode && <Badge variant="warning">Modo demo</Badge>}
          </div>
          <Button variant="outline" size="sm" onClick={newConversation}>
            <Plus className="h-4 w-4" /> Nova conversa
          </Button>
        </div>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {(Object.keys(AI_MODES) as AiMode[]).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={cn(
                "rounded-full px-3 py-1 text-xs font-medium transition-colors",
                mode === m
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              )}
            >
              {AI_MODES[m]}
            </button>
          ))}
        </div>
      </div>

      {/* Mensagens */}
      <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto p-4">
        {messages.length === 0 && (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <span className="grid h-12 w-12 place-items-center rounded-full bg-primary/10 text-primary">
              <Bot className="h-6 w-6" />
            </span>
            <p className="mt-3 font-medium">Sargento Maia · Professor IA</p>
            <p className="mt-1 max-w-sm text-sm text-muted-foreground">
              Converse em inglês, peça correções ou simule uma missão. Eu
              respondo em inglês e explico em português quando você pedir.
            </p>
          </div>
        )}
        {messages.map((m, i) => (
          <div
            key={i}
            className={cn(
              "flex gap-2",
              m.role === "user" ? "justify-end" : "justify-start"
            )}
          >
            {m.role === "assistant" && (
              <span className="mt-1 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-primary/10 text-primary">
                <Bot className="h-4 w-4" />
              </span>
            )}
            <div
              className={cn(
                "max-w-[80%] whitespace-pre-line rounded-2xl px-4 py-2.5 text-sm",
                m.role === "user"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted"
              )}
            >
              {m.content}
            </div>
            {m.role === "user" && (
              <span className="mt-1 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-secondary text-secondary-foreground">
                <User className="h-4 w-4" />
              </span>
            )}
          </div>
        ))}
        {loading && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" /> Sargento Maia está
            digitando…
          </div>
        )}
      </div>

      {/* Sugestões + input */}
      <div className="border-t p-3">
        {messages.length === 0 && (
          <div className="mb-2 flex flex-wrap gap-1.5">
            {SUGGESTIONS[mode].map((s) => (
              <button
                key={s}
                onClick={() => send(s)}
                className="inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs text-muted-foreground hover:bg-muted"
              >
                <Sparkles className="h-3 w-3" /> {s}
              </button>
            ))}
          </div>
        )}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            send(input);
          }}
          className="flex items-end gap-2"
        >
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                send(input);
              }
            }}
            placeholder="Digite em inglês (ou peça ajuda em português)…"
            className="min-h-[44px] max-h-32 resize-none"
            rows={1}
          />
          <Button type="submit" size="icon" disabled={loading || !input.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </Card>
  );
}
