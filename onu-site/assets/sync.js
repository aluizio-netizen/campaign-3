/* ============================================================
   ONU / Model UN — decisão de sincronização (pura, sem rede)
   ------------------------------------------------------------
   Ordena versões por REVISÃO — um contador que só cresce, mantido
   pelo servidor via transação — e NUNCA por horário.

   Motivo: o carimbo de tempo antigo era gravado com Date.now() no
   navegador de quem salvava, e comparado com o Date.now() gravado
   no navegador de quem entrava. São relógios diferentes. Se a
   máquina de um aluno estivesse adiantada, o trabalho dela sempre
   parecia "mais novo" e sobrescrevia edições realmente mais
   recentes feitas em outro lugar — e o contrário se estivesse
   atrasada. Em ambos os casos, silenciosamente.

   Nesta versão nenhum relógio participa da decisão, e nenhuma
   ponta é descartada sem confirmação explícita do aluno.
   ============================================================ */
"use strict";

/* Serialização estável: mesma estrutura → mesma string,
   independentemente da ordem em que as chaves foram criadas. */
export function stable(v){
  if (v === null || typeof v !== "object") return JSON.stringify(v) ?? "null";
  if (Array.isArray(v)) return "[" + v.map(stable).join(",") + "]";
  return "{" + Object.keys(v).sort()
    .map(k => JSON.stringify(k) + ":" + stable(v[k])).join(",") + "}";
}

/** Dois estados têm exatamente o mesmo conteúdo? */
export function same(a, b){
  return stable(a || {}) === stable(b || {});
}

/** Um estado tem algum conteúdo? */
export function hasContent(s){
  return !!s && typeof s === "object" && Object.keys(s).length > 0;
}

/* Resultados possíveis:
     "upload"   sobe o local para a nuvem (vira a revisão seguinte)
     "adopt"    aplica a nuvem por cima do local
     "align"    conteúdo idêntico: só registra a revisão, não mexe em dados
     "conflict" as duas pontas avançaram: pergunta ao aluno, não descarta nada
     "idle"     nada a fazer                                                  */

/**
 * @param {object}  e
 * @param {boolean} e.hasCloud  existe registro na nuvem para este uid
 * @param {number}  e.cloudRev  revisão do registro na nuvem (0 se legado, sem rev)
 * @param {?number} e.baseRev   última revisão que ESTE navegador sincronizou
 *                              (null = primeiro acesso com o novo esquema)
 * @param {boolean} e.dirty     há edições locais posteriores a baseRev
 * @param {boolean} e.hasLocal  o estado local tem conteúdo
 * @param {boolean} e.identical local e nuvem têm exatamente o mesmo conteúdo
 * @returns {"upload"|"adopt"|"align"|"conflict"|"idle"}
 */
export function decideSync(e){
  const { hasCloud, cloudRev, baseRev, dirty, hasLocal, identical } = e;

  // Nuvem vazia: o que existir localmente vira a revisão 1.
  if (!hasCloud) return hasLocal ? "upload" : "idle";

  // Conteúdo igual dos dois lados: nunca há o que decidir.
  if (identical) return "align";

  // Primeiro acesso deste navegador ao novo esquema: não há base de
  // comparação, então não dá para ordenar as duas pontas com honestidade.
  if (baseRev === null || baseRev === undefined) {
    return hasLocal ? "conflict" : "adopt";
  }

  // A nuvem não se moveu desde a última vez que este navegador sincronizou:
  // o local é descendente direto dela.
  if (cloudRev === baseRev) return dirty ? "upload" : "idle";

  // A nuvem avançou em outro acesso.
  if (cloudRev > baseRev) return dirty ? "conflict" : "adopt";

  // A nuvem regrediu (restauração de backup, escrita concorrente perdida).
  // Raro, mas não pode descartar nada em silêncio.
  return "conflict";
}
