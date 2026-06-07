import type { AiMode } from "@/lib/constants";

/**
 * Respostas simuladas para o modo DEMO (sem API key).
 * Não são IA real, mas dão uma experiência coerente e útil para testes.
 */
export function demoReply(
  mode: AiMode,
  userMessage: string,
  studentLevel: string
): string {
  const wantsHelp = /ajuda|portugu[eê]s|explica|n[aã]o entendi|help/i.test(
    userMessage
  );

  const intro = "🪖 (modo demonstração — configure AI_API_KEY para IA real)\n\n";

  switch (mode) {
    case "correction": {
      return (
        intro +
        `**Corrected:** "${capitalizeFirst(userMessage)}" → check your verb tense and word order.\n\n` +
        `**Explicação (PT):** Em inglês a ordem costuma ser Sujeito + Verbo + Complemento. ` +
        `Confira também o tempo verbal.\n\n` +
        `**Example:** "I report to the base at 0800."`
      );
    }
    case "travel": {
      return (
        intro +
        `*[Checkpoint scene]* Soldier: "Halt. State your name and unit, please."\n\n` +
        (wantsHelp
          ? `Dica (PT): responda algo como "My name is ___, I'm with the 2nd unit."`
          : `Your turn — answer in English. (Peça "ajuda" se travar.)`)
      );
    }
    case "pronunciation": {
      return (
        intro +
        `Repeat after me: **"Copy that, moving to the checkpoint."**\n\n` +
        `Pronúncia aproximada: "Cópi dét, múving tchu dâ tchéquipoint".\n` +
        `Foco: o "th" de *that* (língua entre os dentes). Grave e compare!`
      );
    }
    case "review": {
      return (
        intro +
        `Quick review (${studentLevel}): How do you say "relatar a posição" in English?\n\n` +
        `Responda em inglês. (Resposta esperada: "to report the position".)`
      );
    }
    case "study_plan": {
      return (
        intro +
        `**Plano sugerido (7 dias):**\n` +
        `- Dias 1–2: Aulas 1 e 2 + flashcards.\n` +
        `- Dias 3–4: Aula 3 + quiz + 10 min de pronúncia.\n` +
        `- Dia 5: Revisão com o Professor IA (modo Revisão).\n` +
        `- Dias 6–7: Simulação de missão + quiz da aula 4.\n\n` +
        `Quanto tempo por dia você tem? Ajusto o ritmo.`
      );
    }
    case "free":
    default: {
      return (
        intro +
        (wantsHelp
          ? `Sem problema! Em português: me conte, em inglês, o que você fez hoje. ` +
            `Comece com "Today I...". Eu corrijo e respondo.`
          : `Roger that! Let's talk. What did you do today? Answer in English ` +
            `and I'll keep the conversation going. (Digite "ajuda" para PT.)`)
      );
    }
  }
}

function capitalizeFirst(s: string): string {
  const t = s.trim();
  return t.charAt(0).toUpperCase() + t.slice(1);
}
