/* COMO RODAR
     1) cd onu-site && python3 -m http.server 8477
     2) node tests/e2e-sync.mjs
   Cria uma conta descartável no Firebase de PRODUÇÃO, exercita o ciclo real
   com dois perfis de Chrome e apaga a conta e os dados no fim (inclusive se
   falhar no meio). Não toca em contas de aluno. */
/* ============================================================
   Teste ponta a ponta da sincronização do onu-site.
   Dois perfis de Chrome = dois aparelhos com localStorage separados,
   contra o Firebase de produção, com uma conta descartável que é
   apagada no fim (inclusive em caso de erro).
   ============================================================ */
import { spawn } from "node:child_process";
import { setTimeout as dorme } from "node:timers/promises";

const CHAVE = "AIzaSyArEIA1vJGcPPLJiPC-_lAvvM7jHf6zA2Y";
const DB    = "https://oea-model-un-225f1-default-rtdb.firebaseio.com";
const SITE  = "http://localhost:8477/index.html";
const TMP   = process.env.S || (await import("node:os")).tmpdir();

const EMAIL = `qa-sync-${Date.now()}@example.com`;   // example.com nunca entrega
const SENHA = "qa-" + Math.random().toString(36).slice(2) + "-Z9";

let ok = 0; const falhas = [];
const checa = (n, obtido, esperado) => {
  const bom = JSON.stringify(obtido) === JSON.stringify(esperado);
  if (bom) { ok++; console.log(`  ✓ ${n}`); }
  else { falhas.push(n); console.log(`  ✗ ${n}\n      esperado: ${JSON.stringify(esperado)}\n      obtido:   ${JSON.stringify(obtido)}`); }
};
const fase = t => console.log(`\n${t}`);

/* ---------- REST do Firebase ---------- */
const api = async (m, body) => {
  const r = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:${m}?key=${CHAVE}`,
    { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
  const j = await r.json();
  if (!r.ok) throw new Error(m + ": " + JSON.stringify(j));
  return j;
};
const lerNuvem = async tok => {
  const r = await fetch(`${DB}/progresso/${uid}.json?auth=${tok}`);
  if (!r.ok) throw new Error("leitura RTDB: " + r.status + " " + await r.text());
  return r.json();
};

/* ---------- CDP ---------- */
class Aba {
  constructor(porta, proc){ this.porta = porta; this.proc = proc; this.id = 0; }
  static async abrir(nome, porta){
    const proc = spawn("google-chrome", ["--headless=new","--disable-gpu","--no-sandbox",
      `--remote-debugging-port=${porta}`, `--user-data-dir=${TMP}/e2e-${nome}`,
      "--window-size=1200,860","about:blank"], { stdio: "ignore", detached: true });
    const a = new Aba(porta, proc);
    for (let i = 0; i < 40; i++){ try{ await fetch(`http://127.0.0.1:${porta}/json/version`); break; }catch(e){ await dorme(250); } }
    const t = await (await fetch(`http://127.0.0.1:${porta}/json/new?about:blank`, { method:"PUT" })).json();
    a.ws = new WebSocket(t.webSocketDebuggerUrl);
    await new Promise(r => a.ws.onopen = r);
    a.erros = [];
    a.ws.addEventListener("message", e => {
      const m = JSON.parse(e.data);
      if (m.method === "Runtime.exceptionThrown"){
        const d = m.params.exceptionDetails;
        a.erros.push((d.exception?.description || d.text).split("\n")[0]);
      }
    });
    await a.cmd("Runtime.enable"); await a.cmd("Page.enable");
    return a;
  }
  cmd(method, params = {}){
    const i = ++this.id;
    this.ws.send(JSON.stringify({ id: i, method, params }));
    return new Promise(res => {
      const h = e => { const m = JSON.parse(e.data); if (m.id === i){ this.ws.removeEventListener("message", h); res(m.result); } };
      this.ws.addEventListener("message", h);
    });
  }
  async av(expr){
    const r = await this.cmd("Runtime.evaluate", { expression: expr, returnByValue: true, awaitPromise: true });
    if (r?.exceptionDetails) throw new Error("eval: " + (r.exceptionDetails.exception?.description || r.exceptionDetails.text));
    return r?.result?.value;
  }
  async ir(url){ await this.cmd("Page.navigate", { url }); await dorme(3500); }
  async ate(expr, seg = 20){
    for (let i = 0; i < seg * 4; i++){ if (await this.av(expr)) return true; await dorme(250); }
    throw new Error("tempo esgotado esperando: " + expr);
  }
  fim(){ try{ this.ws.close(); process.kill(-this.proc.pid); }catch(e){} }
}

const entrar = async (a, email, senha) => {
  await a.av(`window.__onuOpenGate('login')`);
  await a.av(`(()=>{const e=document.getElementById('gate-email'),p=document.getElementById('gate-pass');
    e.value=${JSON.stringify(email)}; e.dispatchEvent(new Event('input',{bubbles:true}));
    p.value=${JSON.stringify(senha)}; p.dispatchEvent(new Event('input',{bubbles:true}));
    document.getElementById('gate-form').requestSubmit(); return 1;})()`);
  await a.ate(`document.body.classList.contains('authed')`, 25);
};
const CAMPO = "pp_contexto";
const editar = async (a, texto) => {
  await a.av(`(()=>{const n=document.querySelector('[data-save="${CAMPO}"]');
    n.value=${JSON.stringify(texto)}; n.dispatchEvent(new Event('input',{bubbles:true})); return 1;})()`);
  await dorme(2600);   // debounce de 1,2s + folga de rede
};
const revLocal = a => a.av(`localStorage.getItem('aluizio_onu_mun_v1_rev')`);
const sujo     = a => a.av(`localStorage.getItem('aluizio_onu_mun_v1_dirty')`);

let uid, tok, A, B;
try {
  fase("0. Conta descartável");
  const nova = await api("signUp", { email: EMAIL, password: SENHA, returnSecureToken: true });
  uid = nova.localId; tok = nova.idToken;
  console.log(`  conta ${EMAIL}  uid=${uid}`);
  checa("nuvem começa vazia", await lerNuvem(tok), null);

  A = await Aba.abrir("A", 9301);
  B = await Aba.abrir("B", 9302);

  fase("1. Aparelho A cria conteúdo → revisão 1");
  await A.ir(SITE); await entrar(A, EMAIL, SENHA);
  await editar(A, "Texto escrito no aparelho A.");
  let nuvem = await lerNuvem(tok);
  checa("transação gravou (regras aceitam o campo rev)", nuvem?.rev, 1);
  checa("conteúdo chegou à nuvem", nuvem?.data?.[CAMPO], "Texto escrito no aparelho A.");
  checa("A registrou a revisão 1", await revLocal(A), "1");
  checa("A não tem edição pendente", await sujo(A), null);

  fase("2. Aparelho B entra sem nada local → adota a nuvem");
  await B.ir(SITE); await entrar(B, EMAIL, SENHA);
  await dorme(2500);
  checa("B recebeu o conteúdo de A",
    await B.av(`document.querySelector('[data-save="${CAMPO}"]').value`), "Texto escrito no aparelho A.");
  checa("B registrou a revisão 1", await revLocal(B), "1");

  fase("3. B edita → revisão 2");
  await editar(B, "Texto reescrito no aparelho B.");
  nuvem = await lerNuvem(tok);
  checa("revisão avançou para 2", nuvem?.rev, 2);
  checa("B registrou a revisão 2", await revLocal(B), "2");

  fase("4. A volta desatualizado (o cenário do relógio adiantado)");
  // A está na revisão 1, sem edição pendente. Pela lógica antiga, o carimbo
  // local de A poderia parecer mais novo e sobrescrever o trabalho de B.
  await A.ir(SITE); await entrar(A, EMAIL, SENHA);
  await dorme(2500);
  checa("A adotou o texto de B, sem sobrescrever",
    await A.av(`document.querySelector('[data-save="${CAMPO}"]').value`), "Texto reescrito no aparelho B.");
  checa("A avançou para a revisão 2", await revLocal(A), "2");
  checa("nuvem intacta na revisão 2", (await lerNuvem(tok))?.rev, 2);

  fase("5. Conflito real → modal aparece e a escolha é respeitada");
  // Simula o estado em que as duas pontas avançaram: A tem edição local
  // pendente e a nuvem andou sem ele. A escolha do ramo já é coberta pelos
  // testes unitários; aqui verifica-se o modal e a gravação resultante.
  await editar(B, "Terceira versão, feita em B.");
  checa("nuvem na revisão 3", (await lerNuvem(tok))?.rev, 3);
  await A.av(`(()=>{const k='aluizio_onu_mun_v1';
    const s=JSON.parse(localStorage.getItem(k)||'{}'); s['${CAMPO}']='Versão local de A, ainda não enviada.';
    localStorage.setItem(k, JSON.stringify(s));
    localStorage.setItem(k+'_rev','2'); localStorage.setItem(k+'_dirty','1'); return 1;})()`);
  await A.ir(SITE); await entrar(A, EMAIL, SENHA);
  await A.ate(`document.body.classList.contains('conflito-open')`, 20);
  checa("modal de conflito abriu", true, true);
  const det = await A.av(`document.getElementById('conflito-det-local').textContent`);
  checa("resumo do lado local foi preenchido", det.length > 0, true);
  await A.av(`document.getElementById('conflito-local').click(); 1`);
  await dorme(3000);
  nuvem = await lerNuvem(tok);
  checa("escolha do aluno foi para a nuvem", nuvem?.data?.[CAMPO], "Versão local de A, ainda não enviada.");
  checa("revisão avançou para 4", nuvem?.rev, 4);
  const bak = await A.av(`JSON.parse(localStorage.getItem('aluizio_onu_mun_v1_conflito')||'null')?.data?.['${CAMPO}']`);
  checa("versão preterida ficou guardada", bak, "Terceira versão, feita em B.");
  checa("modal fechou", await A.av(`document.body.classList.contains('conflito-open')`), false);

  fase("6. Erros de JavaScript durante todo o percurso");
  checa("aparelho A sem exceções", A.erros, []);
  checa("aparelho B sem exceções", B.erros, []);

} catch (e) {
  falhas.push("execução: " + e.message);
  console.log("\n✗ ERRO: " + e.message);
} finally {
  fase("Limpeza");
  try{
    if (uid && tok){
      await fetch(`${DB}/progresso/${uid}.json?auth=${tok}`, { method: "DELETE" });
      const r = await lerNuvem(tok);
      console.log("  progresso/" + uid + " apagado:", r === null ? "sim" : "NÃO (" + JSON.stringify(r).slice(0,80) + ")");
      await api("delete", { idToken: tok });
      console.log("  conta " + EMAIL + " apagada: sim");
    }
  }catch(e){ console.log("  ⚠ limpeza incompleta: " + e.message + "  → conferir no console do Firebase"); }
  A?.fim(); B?.fim();
}

console.log("\n" + "─".repeat(58));
if (falhas.length){ console.log(`FALHOU — ${ok} passaram, ${falhas.length} falharam:`); falhas.forEach(f => console.log("   · " + f)); process.exit(1); }
console.log(`OK — ${ok} verificações ponta a ponta passaram.`);
