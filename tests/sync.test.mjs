/* ============================================================
   Teste da resolução de conflito de sincronização do onu-site.
   Executar:  node tests/sync.test.mjs
   ------------------------------------------------------------
   O foco é o cenário de RELÓGIO TORTO: duas máquinas do mesmo
   aluno com horários diferentes. A lógica antiga ordenava as
   versões por Date.now() e, sob desvio de relógio, descartava
   trabalho em silêncio. A nova ordena por revisão.
   ============================================================ */
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const raiz = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const arquivo = path.join(raiz, "onu-site", "assets", "sync.js");

// Importa os bytes exatos que vão para produção, sem depender da
// resolução CommonJS/ESM do package.json da raiz.
const fonte = await readFile(arquivo, "utf8");
const { decideSync, same, stable, hasContent } =
  await import("data:text/javascript;base64," + Buffer.from(fonte).toString("base64"));

/* ---------- a lógica ANTIGA, para comparação ---------- */
function decideLegado({ cloudTs, localTs, hasCloud, cloudTemDados }){
  if (hasCloud && (cloudTs || 0) > localTs && cloudTemDados) return "adopt";
  return "upload";
}

/* ---------- arreio de teste ---------- */
let ok = 0, falhas = [];
function checa(nome, obtido, esperado){
  if (obtido === esperado) { ok++; console.log(`  ✓ ${nome}`); }
  else { falhas.push(nome); console.log(`  ✗ ${nome}\n      esperado: ${esperado}\n      obtido:   ${obtido}`); }
}
function grupo(t){ console.log(`\n${t}`); }

const HORA = 3600e3, DIA = 24 * HORA;
const T = 1_753_800_000_000;               // instante de referência fixo

/* ============================================================
   1. RELÓGIO ADIANTADO
   O notebook está 2h à frente. O aluno salva nele (rev 5), depois
   edita no desktop com hora certa (rev 6). Ao voltar ao notebook,
   o carimbo local (2h à frente) parece mais novo que o da nuvem.
   ============================================================ */
grupo("1. Relógio do notebook 2h ADIANTADO");

checa("legado: descarta a edição mais recente do desktop",
  decideLegado({ hasCloud:true, cloudTemDados:true, cloudTs: T + 60e3, localTs: T + 2*HORA }),
  "upload");   // ← o bug: sobe o local antigo por cima do trabalho novo

checa("novo: adota a nuvem, que de fato avançou",
  decideSync({ hasCloud:true, cloudRev:6, baseRev:5, dirty:false, hasLocal:true, identical:false }),
  "adopt");

/* ============================================================
   2. RELÓGIO ATRASADO
   Máquina com 1 dia de atraso. O aluno digitou bastante nela e
   ainda não sincronizou. O carimbo local parece velho.
   ============================================================ */
grupo("2. Relógio da máquina 1 dia ATRASADO, com trabalho novo não sincronizado");

checa("legado: descarta o que o aluno acabou de digitar",
  decideLegado({ hasCloud:true, cloudTemDados:true, cloudTs: T, localTs: T - DIA }),
  "adopt");    // ← o bug: aplica a nuvem por cima e o texto recém-digitado some

checa("novo: reconhece que as duas pontas avançaram e pergunta",
  decideSync({ hasCloud:true, cloudRev:7, baseRev:6, dirty:true, hasLocal:true, identical:false }),
  "conflict");

/* ============================================================
   3. O relógio não pode alterar a decisão em nenhum caso
   ============================================================ */
grupo("3. Independência de relógio");

const desvios = [-10*DIA, -DIA, -HORA, 0, HORA, DIA, 10*DIA];
let estavel = true;
for (const _ of desvios){
  // nenhum desvio entra na função: a assinatura não aceita horário
  const r = decideSync({ hasCloud:true, cloudRev:9, baseRev:9, dirty:true, hasLocal:true, identical:false });
  if (r !== "upload") estavel = false;
}
checa(`mesma decisão para ${desvios.length} desvios de relógio diferentes`, estavel, true);
checa("a decisão não aceita nenhum parâmetro de tempo",
  Object.keys({ hasCloud:0, cloudRev:0, baseRev:0, dirty:0, hasLocal:0, identical:0 })
    .some(k => /ts|time|hora|clock|date/i.test(k)), false);

/* ============================================================
   4. Fluxos normais — não pode haver pergunta à toa
   ============================================================ */
grupo("4. Uso normal (sem conflito real)");

checa("mesma máquina, editou e vai salvar",
  decideSync({ hasCloud:true, cloudRev:4, baseRev:4, dirty:true, hasLocal:true, identical:false }), "upload");
checa("mesma máquina, nada mudou",
  decideSync({ hasCloud:true, cloudRev:4, baseRev:4, dirty:false, hasLocal:true, identical:false }), "idle");
checa("nuvem vazia, tem trabalho local",
  decideSync({ hasCloud:false, cloudRev:0, baseRev:null, dirty:true, hasLocal:true, identical:false }), "upload");
checa("nuvem vazia e local vazio",
  decideSync({ hasCloud:false, cloudRev:0, baseRev:null, dirty:false, hasLocal:false, identical:false }), "idle");
checa("outro acesso avançou, este navegador não mexeu em nada",
  decideSync({ hasCloud:true, cloudRev:8, baseRev:3, dirty:false, hasLocal:true, identical:false }), "adopt");
checa("conteúdo idêntico dos dois lados: alinha sem perguntar",
  decideSync({ hasCloud:true, cloudRev:8, baseRev:3, dirty:true, hasLocal:true, identical:true }), "align");

/* ============================================================
   5. Migração — primeiro acesso com o esquema novo
   ============================================================ */
grupo("5. Migração do esquema antigo (baseRev ausente)");

checa("navegador novo, sem nada local: pega a nuvem",
  decideSync({ hasCloud:true, cloudRev:0, baseRev:null, dirty:false, hasLocal:false, identical:false }), "adopt");
checa("tinha trabalho local igual ao da nuvem: alinha em silêncio",
  decideSync({ hasCloud:true, cloudRev:0, baseRev:null, dirty:false, hasLocal:true, identical:true }), "align");
checa("tinha trabalho local divergente: pergunta em vez de escolher sozinho",
  decideSync({ hasCloud:true, cloudRev:0, baseRev:null, dirty:false, hasLocal:true, identical:false }), "conflict");

/* ============================================================
   6. Casos degenerados
   ============================================================ */
grupo("6. Casos degenerados");

checa("nuvem regrediu (restauração de backup)",
  decideSync({ hasCloud:true, cloudRev:2, baseRev:9, dirty:false, hasLocal:true, identical:false }), "conflict");
checa("nuvem regrediu com edição local pendente",
  decideSync({ hasCloud:true, cloudRev:2, baseRev:9, dirty:true, hasLocal:true, identical:false }), "conflict");
checa("baseRev 0 é revisão válida, não ausência",
  decideSync({ hasCloud:true, cloudRev:1, baseRev:0, dirty:false, hasLocal:true, identical:false }), "adopt");

/* ============================================================
   7. Nunca descartar em silêncio — invariante geral
   ============================================================ */
grupo("7. Invariante: se as duas pontas avançaram, nunca decide sozinho");

let violacoes = 0, combinacoes = 0;
for (const cloudRev of [0,1,2,5,9])
for (const baseRev of [null,0,1,2,5,9])
for (const dirty of [true,false])
for (const hasLocal of [true,false])
for (const identical of [true,false]) {
  combinacoes++;
  const d = decideSync({ hasCloud:true, cloudRev, baseRev, dirty, hasLocal, identical });
  const nuvemAvancou = baseRev !== null && cloudRev > baseRev;
  const ambosAvancaram = nuvemAvancou && dirty && hasLocal && !identical;
  if (ambosAvancaram && d !== "conflict") violacoes++;
  // adotar a nuvem só é aceitável se o local não tiver nada a perder
  if (d === "adopt" && dirty && hasLocal && !identical) violacoes++;
}
checa(`${combinacoes} combinações sem descarte silencioso`, violacoes, 0);

/* ============================================================
   8. Comparação de conteúdo
   ============================================================ */
grupo("8. Serialização estável");

checa("ordem das chaves não afeta a comparação",
  same({ a:1, b:{ x:1, y:2 } }, { b:{ y:2, x:1 }, a:1 }), true);
checa("diferença real é detectada",
  same({ a:1 }, { a:2 }), false);
checa("vazio e ausente são equivalentes", same({}, null), true);
checa("arrays respeitam a ordem", same({ l:[1,2] }, { l:[2,1] }), false);
checa("aninhamento profundo",
  stable({ z:[{ b:2, a:1 }] }) === stable({ z:[{ a:1, b:2 }] }), true);
checa("hasContent distingue vazio de preenchido",
  [hasContent({}), hasContent(null), hasContent({ a:1 })].join(","), "false,false,true");

/* ---------- resumo ---------- */
console.log("\n" + "─".repeat(58));
if (falhas.length){
  console.log(`FALHOU — ${ok} passaram, ${falhas.length} falharam:`);
  falhas.forEach(f => console.log(`   · ${f}`));
  process.exit(1);
}
console.log(`OK — ${ok} verificações passaram.`);
