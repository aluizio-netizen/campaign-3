import type { AiMode } from "@/lib/constants";
import { buildSystemPrompt } from "@/lib/ai/prompts";
import { demoReply } from "@/lib/ai/demo";

export type ChatRole = "user" | "assistant" | "system";
export interface ChatMessage {
  role: ChatRole;
  content: string;
}

export interface GenerateOptions {
  mode: AiMode;
  messages: ChatMessage[]; // histórico (sem system)
  studentLevel?: string;
}

export interface GenerateResult {
  content: string;
  demo: boolean;
  provider: string;
}

/**
 * Camada de serviço de IA desacoplada.
 * Troque o provider por variável de ambiente (AI_PROVIDER) sem mexer no app.
 *   - demo (padrão / sem key): respostas simuladas
 *   - openai: API compatível OpenAI Chat Completions
 *   - anthropic: API Messages da Anthropic
 *
 * NUNCA hardcode chaves — sempre via process.env.AI_API_KEY.
 */
export async function generateReply(
  opts: GenerateOptions
): Promise<GenerateResult> {
  const provider = (process.env.AI_PROVIDER ?? "demo").toLowerCase();
  const apiKey = process.env.AI_API_KEY;
  const level = opts.studentLevel ?? "A1";
  const system = buildSystemPrompt(opts.mode, level);
  const lastUser =
    [...opts.messages].reverse().find((m) => m.role === "user")?.content ?? "";

  // Sem chave => sempre modo demo, independente do provider configurado.
  if (!apiKey || provider === "demo") {
    return {
      content: demoReply(opts.mode, lastUser, level),
      demo: true,
      provider: "demo",
    };
  }

  try {
    if (provider === "openai") {
      const content = await callOpenAI(system, opts.messages, apiKey);
      return { content, demo: false, provider: "openai" };
    }
    if (provider === "anthropic") {
      const content = await callAnthropic(system, opts.messages, apiKey);
      return { content, demo: false, provider: "anthropic" };
    }
  } catch (err) {
    console.error("[ai-provider] falha ao chamar provider real:", err);
    // Degradação graciosa: cai para o modo demo em caso de erro.
    return {
      content:
        demoReply(opts.mode, lastUser, level) +
        "\n\n_(houve um erro ao contatar a IA real; resposta de demonstração)_",
      demo: true,
      provider: "demo-fallback",
    };
  }

  return {
    content: demoReply(opts.mode, lastUser, level),
    demo: true,
    provider: "demo",
  };
}

async function callOpenAI(
  system: string,
  messages: ChatMessage[],
  apiKey: string
): Promise<string> {
  const model = process.env.AI_MODEL || "gpt-4o-mini";
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [{ role: "system", content: system }, ...messages],
      temperature: 0.7,
      max_tokens: 500,
    }),
  });
  if (!res.ok) throw new Error(`OpenAI ${res.status}: ${await res.text()}`);
  const data = await res.json();
  return data.choices?.[0]?.message?.content?.trim() ?? "";
}

async function callAnthropic(
  system: string,
  messages: ChatMessage[],
  apiKey: string
): Promise<string> {
  const model = process.env.AI_MODEL || "claude-3-5-sonnet-latest";
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model,
      system,
      max_tokens: 500,
      messages: messages.map((m) => ({
        role: m.role === "assistant" ? "assistant" : "user",
        content: m.content,
      })),
    }),
  });
  if (!res.ok) throw new Error(`Anthropic ${res.status}: ${await res.text()}`);
  const data = await res.json();
  return data.content?.[0]?.text?.trim() ?? "";
}

export function isAiConfigured(): boolean {
  return Boolean(process.env.AI_API_KEY) && process.env.AI_PROVIDER !== "demo";
}
