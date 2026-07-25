// Área da delegação — war-room privado + submissão do position paper (Firebase RTDB).
// Fase 1 da plataforma de simulação. Segue o mesmo padrão de crises.js/turma.js.
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";
import { getDatabase, ref, get, set, update, remove, onValue } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-database.js";

const auth = getAuth();
const db = getDatabase();
const TEACHER_EMAIL = "aluizio@aluizio.education";

// Comitês da plataforma. As listas de países são só o ponto de partida do
// botão "carregar lista pronta" — o professor ajusta pela interface.
const DELEGACOES_UNEA = [
  "Estados Unidos", "Brasil", "Guiana", "Suriname", "Venezuela", "Equador", "Colômbia", "Peru", "Bolívia",
  "Nigéria", "Angola", "Arábia Saudita", "Emirados Árabes Unidos", "Kuwait", "Irã", "Argélia", "Omã",
  "China", "Índia", "Japão", "Coreia do Sul", "Indonésia",
  "União Europeia", "França", "Alemanha", "Reino Unido", "Noruega", "Austrália", "Canadá",
  "RDC (Congo)", "Chile", "Argentina", "África do Sul", "Namíbia", "Zâmbia", "Tanzânia", "Guiné", "Moçambique",
  "Maldivas", "Tuvalu", "Fiji", "Kiribati", "Bangladesh", "Filipinas",
];
// O guia oficial da CND (YMUN Brasil 2026) não traz matriz de países; esta
// lista foi montada com os países citados no guia (produção, trânsito, consumo).
const DELEGACOES_CND = [
  "Estados Unidos", "México", "Canadá", "Brasil", "Colômbia", "Peru", "Bolívia", "Equador", "Venezuela",
  "Panamá", "Guatemala",
  "Bélgica", "Países Baixos", "Itália", "França", "Alemanha", "Reino Unido", "Espanha", "Portugal",
  "Rússia", "Turquia",
  "China", "Índia", "Mianmar", "Tailândia", "Laos", "Afeganistão", "Paquistão", "Irã", "Filipinas", "Japão",
  "Emirados Árabes Unidos",
  "Nigéria", "Guiné-Bissau", "Gana", "África do Sul", "Quênia", "Marrocos", "Tanzânia",
  "Austrália", "Nova Zelândia",
];
const COMITES = {
  "unea-ymunb-2026": {
    sigla: "UNEA",
    nome: "UNEA — YMUN Brasil 2026",
    desc: "Assembleia da ONU para o Meio Ambiente",
    topicos: ["Margem Equatorial da Foz do Amazonas", "Terras Raras / Minerais Críticos (Serra Verde)"],
    briefing: "#unea-briefing",
    paises: DELEGACOES_UNEA,
  },
  "cnd-ymunb-2026": {
    sigla: "CND",
    nome: "CND — YMUN Brasil 2026",
    desc: "Commission on Narcotic Drugs (comitê em inglês)",
    topicos: ["Cooperação global contra o tráfico transnacional de drogas", "Transição de economias rurais para fora dos cultivos ilícitos"],
    briefing: "#cnd-briefing",
    paises: DELEGACOES_CND,
  },
};
const COMITE_PADRAO = "unea-ymunb-2026"; // comitê dos registros antigos (antes do multi-comitê)
const comInfo = cid => COMITES[cid] || { sigla: cid, nome: cid, desc: "", topicos: [], briefing: "#", paises: [] };
const PP = "positionPaper"; // docId do deliverable principal da delegação

// Aviso de salvamento do aluno. Fica no módulo (e não só no DOM) porque o
// onValue do documento re-renderiza a seção e recriaria o <span> vazio,
// apagando tanto o "Salvo ✓" quanto a mensagem de erro.
let STATUS = null, STATUS_TIMER = null;
// Caixas de correção abertas no painel do professor, preservadas entre re-renders.
const CORR_ABERTAS = new Set();
function paintStatus() {
  const st = document.getElementById("dg-status");
  if (!st) return;
  st.textContent = STATUS ? STATUS.texto : "";
  st.style.color = STATUS ? STATUS.cor : "";
}
function setStatus(texto, cor) {
  STATUS = { texto, cor };
  paintStatus();
  if (STATUS_TIMER) clearTimeout(STATUS_TIMER);
  STATUS_TIMER = setTimeout(() => { STATUS = null; paintStatus(); }, 8000);
}

const he = s => String(s == null ? "" : s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const fmt = ms => ms ? new Date(ms).toLocaleString("pt-BR") : "—";
const ESTADO = {
  rascunho:    { rot: "Rascunho",                       cls: "" },
  entregue:    { rot: "Entregue — aguardando correção", cls: "st-entregue" },
  em_correcao: { rot: "Em correção",                    cls: "st-corr" },
  corrigido:   { rot: "Corrigido",                      cls: "st-ok" },
};
const estadoDe = d => (d && d.estado) || "rascunho";
const RUBRICA = [
  { k: "conformidade", rot: "Conformidade formal", max: 20 },
  { k: "precisao",     rot: "Precisão factual",     max: 25 },
  { k: "coerencia",    rot: "Coerência c/ a política real", max: 25 },
  { k: "solucoes",     rot: "Qualidade das soluções", max: 30 },
];
const notaTotal = f => f ? RUBRICA.reduce((s, r) => s + (Number(f[r.k]) || 0), 0) : 0;

// Remover uma delegação da lista NÃO apaga o paper que o aluno já gravou — e o
// professor precisa continuar enxergando esse paper. Por isso os painéis do
// professor trabalham com a união "delegações da lista + ids que têm documento".
const ehOrfa = id => !DELEGACOES[id];
const paisDe = id => (DELEGACOES[id] && DELEGACOES[id].pais) || id;
const temDoc = id => !!(DOCS_ALL[id] && DOCS_ALL[id][PP]);
function idsDelegacoes() {
  const ids = new Set(Object.keys(DELEGACOES));
  Object.keys(DOCS_ALL).forEach(id => { if (temDoc(id)) ids.add(id); });
  return [...ids].sort((a, b) => paisDe(a).localeCompare(paisDe(b)));
}
const tagOrfa = id => ehOrfa(id)
  ? ' <span class="dg-badge st-orfa" title="O país foi removido da lista de delegações, mas o documento do aluno continua aqui.">delegação removida da lista</span>'
  : "";

// Rótulo de estado no painel do professor. Quando já existe nota mas o estado
// não é "corrigido", o paper foi corrigido e REABERTO para o aluno revisar —
// e o rótulo diz isso, em vez de mostrar só "Rascunho" (que parece não corrigido).
function badgeEstado(est, fb, comNota) {
  const b = ESTADO[est] || ESTADO.rascunho;
  if (fb && est !== "corrigido") {
    const n = comNota ? " (" + notaTotal(fb) + "/100)" : "";
    return '<span class="dg-badge st-corr" title="Você já corrigiu este paper (nota ' + notaTotal(fb) +
      "/100) e o reabriu para o aluno revisar. A nota anterior está guardada; o aluno vê a correção e reenvia.\">↺ reaberto · já corrigido" + n + "</span>";
  }
  return '<span class="dg-badge ' + b.cls + '">' + b.rot + (comNota && fb ? " · nota " + notaTotal(fb) + "/100" : "") + "</span>";
}

let IS_TEACHER = false, INIT = false;
let AVISO = null; // recado do comitê ATIVO (derivado de AVISO_C a cada render)
// Dados por comitê (as regras do banco já são por $comiteId; aqui espelhamos isso)
let DELEG_C = {}; // delegacoes/<cid>
let AVISO_C = {}; // avisos/<cid>
let DOCS_C = {}, FB_C = {}; // docsDelegacao/<cid>, feedback/<cid> (só professor)
// aluno
let MINHA = null, SUB_DEL = null, DOC = null, FB = null, MEU_PROG = null;
let COM_SEL = null; // comitê que o aluno está navegando ANTES de escolher país
let UNSUB_DOC = []; // unsubscribes do doc/feedback da delegação assinada

// Mapeia o rascunho da aba "Documentos" (progresso/<uid>) para as 3 seções
// do position paper daqui. É um ponto de partida — o aluno revisa depois.
function rascunhoDocsMapeado() {
  const p = MEU_PROG || {};
  const g = k => (p[k] || "").toString().trim();
  const propostas = g("pp_propostas"), aliancas = g("pp_aliancas");
  const solucoes = aliancas
    ? (propostas ? propostas + "\n\nAlianças e negociação:\n" + aliancas : "Alianças e negociação:\n" + aliancas)
    : propostas;
  const map = { passadoAtual: g("pp_contexto"), posicao: g("pp_posicao"), solucoes };
  return { map, temAlgo: !!(map.passadoAtual || map.posicao || map.solucoes) };
}
// professor — DELEGACOES/DOCS_ALL/FB_ALL são a fatia do comitê ATIVO (aba),
// preenchidas a partir de DELEG_C/DOCS_C/FB_C no início de cada renderProf().
let DELEGACOES = {}, AUTORIZADOS = {}, ATRIBUICOES = {}, DOCS_ALL = {}, FB_ALL = {}, PENDENTES = {}, PROGRESSO = {};
let PROF_COMITE = COMITE_PADRAO; // aba ativa do painel do professor

// Campos do editor "Documentos do delegado" (aba Documentos → progresso/<uid>).
// Se um aluno preencheu isto mas não entregou pela aba Delegação, o trabalho
// dele existe, só não chega ao painel de correção.
const PP_DOCS_CHAVES = ["pp_pais", "pp_contexto", "pp_posicao", "pp_propostas", "pp_aliancas"];
function ppDocsDoAluno(uid) {
  const p = uid && PROGRESSO[uid];
  if (!p) return 0;
  return PP_DOCS_CHAVES.filter(k => (p[k] || "").toString().trim()).length;
}

onAuthStateChanged(auth, user => {
  if (!user) return;
  IS_TEACHER = (user.email || "").toLowerCase() === TEACHER_EMAIL;
  document.body.classList.toggle("teacher", IS_TEACHER);
  if (INIT) return; INIT = true;

  if (IS_TEACHER) {
    const _err = (id, node) => e => { const r = document.getElementById(id); if (r) r.innerHTML = '<p class="section-sub" style="color:#f7a">Não foi possível ler <b>' + node + '</b>: ' + (e && (e.code || e.message)) + "</p>"; };
    Object.keys(COMITES).forEach(cid => {
      onValue(ref(db, "delegacoes/" + cid), s => { DELEG_C[cid] = s.val() || {}; renderProf(); }, _err("dg-prof-delegacoes", "delegacoes/" + cid));
      onValue(ref(db, "docsDelegacao/" + cid), s => { DOCS_C[cid] = s.val() || {}; renderProf(); }, _err("dg-prof-correcao", "docsDelegacao/" + cid));
      onValue(ref(db, "feedback/" + cid), s => { FB_C[cid] = s.val() || {}; renderProf(); }, _err("dg-prof-correcao", "feedback/" + cid));
      onValue(ref(db, "avisos/" + cid), s => { AVISO_C[cid] = s.val(); renderProf(); }, () => {});
    });
    onValue(ref(db, "minhaDelegacao"), s => { ATRIBUICOES = s.val() || {}; renderProf(); }, _err("dg-prof-atribuir", "minhaDelegacao"));
    onValue(ref(db, "autorizados"), s => { AUTORIZADOS = s.val() || {}; renderProf(); }, _err("dg-prof-atribuir", "autorizados"));
    onValue(ref(db, "pendentes"), s => { PENDENTES = s.val() || {}; renderProfPainel(); }, () => {});
    // Espelho do editor "Documentos do delegado" (progresso/<uid>). Só para
    // sinalizar quando um aluno escreveu o position paper na aba errada — o
    // paper que se corrige continua vindo de docsDelegacao.
    onValue(ref(db, "progresso"), s => { PROGRESSO = s.val() || {}; renderProf(); }, () => {});
  } else {
    Object.keys(COMITES).forEach(cid => {
      onValue(ref(db, "delegacoes/" + cid), s => { DELEG_C[cid] = s.val() || {}; renderAluno(); }, () => {});
      onValue(ref(db, "avisos/" + cid), s => { AVISO_C[cid] = s.val(); renderAluno(); }, () => {});
    });
    onValue(ref(db, "minhaDelegacao/" + user.uid), s => { MINHA = s.val(); abrirWarRoom(); }, () => { MINHA = null; renderAluno(); });
    onValue(ref(db, "progresso/" + user.uid), s => { MEU_PROG = s.val() || null; renderAluno(); }, () => {});
  }
});

// Comitê do aluno logado: o gravado na atribuição; registros antigos (sem
// comiteId) são da UNEA, que era o único comitê da Fase 1.
const cidDoAluno = () => (MINHA && MINHA.comiteId) || (MINHA ? COMITE_PADRAO : null);

/* =====================  ALUNO — war-room  ===================== */
function abrirWarRoom() {
  const delId = MINHA && MINHA.delegacaoId, cid = cidDoAluno();
  if (!delId || !cid) { renderAluno(); return; }
  const chave = cid + "/" + delId;
  if (SUB_DEL === chave) { renderAluno(); return; } // já assinado
  SUB_DEL = chave;
  // Desassina o doc/feedback anterior (troca de país OU de comitê) — senão o
  // listener velho continuaria sobrescrevendo DOC/FB com dados da outra delegação.
  UNSUB_DOC.forEach(f => { try { f(); } catch (_e) {} });
  DOC = null; FB = null;
  UNSUB_DOC = [
    onValue(ref(db, "docsDelegacao/" + chave + "/" + PP), s => { DOC = s.val(); renderAluno(); }, () => {}),
    onValue(ref(db, "feedback/" + chave + "/" + PP), s => { FB = s.val(); renderAluno(); }, () => {}),
  ];
}

// Banner do recado do professor — o aviso é por comitê.
function avisoBanner(cid) {
  const a = cid && AVISO_C[cid];
  if (!a || !(a.texto || "").trim()) return "";
  return '<div class="dg-aviso">📢 <b>Aviso do professor:</b> ' + he(a.texto) +
    '<span class="dg-aviso-ts">' + fmt(a.ts) + "</span></div>";
}

// Passo a passo do delegado. `passo` = etapa atual (1..4); 5 = tudo concluído.
function comoFunciona(passo, com) {
  const passos = [
    "Escolha seu comitê e o país que você vai representar",
    com
      ? 'Leia o <a href="' + com.briefing + '">briefing do comitê ' + he(com.sigla) + "</a> (tópicos e contexto)"
      : "Leia o briefing do seu comitê (tópicos e contexto)",
    "Escreva seu position paper nas 3 seções",
    "Entregue ao professor e aguarde a correção",
  ];
  return '<div class="dg-guia"><b>Como funciona</b><ol>' +
    passos.map((p, i) => {
      const n = i + 1, cls = n < passo ? "feito" : n === passo ? "ativo" : "";
      return '<li class="' + cls + '">' + p + "</li>";
    }).join("") + "</ol></div>";
}

// Passo 1a — escolher o comitê (cartões, um por comitê).
function renderEscolhaComite(root) {
  const cards = Object.entries(COMITES).map(([cid, c]) => {
    const dels = Object.values(DELEG_C[cid] || {});
    const livres = dels.filter(d => !(d.membros && Object.keys(d.membros).length)).length;
    const vagas = dels.length
      ? livres + " de " + dels.length + " países livres"
      : "delegações ainda não abertas pelo professor";
    return '<div class="dg-comite-card"><span class="tag">' + he(c.sigla) + "</span>" +
      '<h3 style="margin:.5rem 0 .2rem">' + he(c.nome) + "</h3>" +
      '<p class="section-sub" style="margin:.2rem 0">' + he(c.desc) + "</p>" +
      '<p class="section-sub" style="margin:.4rem 0">Tópicos: ' + c.topicos.map(he).join(" · ") + "</p>" +
      '<p class="section-sub" style="margin:.4rem 0"><a href="' + c.briefing + '">📖 Ver o briefing</a> · ' + he(vagas) + "</p>" +
      '<button class="btn primary dg-escolher-comite" data-cid="' + cid + '">Entrar neste comitê</button></div>';
  }).join("");
  root.innerHTML =
    comoFunciona(1, null) +
    '<div class="dg-card"><h3 style="margin:.2rem 0 .4rem">1. Escolha seu comitê</h3>' +
    '<p class="section-sub">A turma tem dois comitês na YMUN Brasil 2026. Entre no comitê em que você vai atuar — em caso de dúvida, pergunte ao professor.</p>' +
    '<div class="dg-comites">' + cards + "</div></div>";
}

// Passo 1b — escolher o país dentro do comitê escolhido.
function renderEscolha(root, cid) {
  const com = comInfo(cid);
  const dels = DELEG_C[cid] || {};
  const voltar = '<p style="margin:2px 0 10px"><a href="#" class="dg-voltar-comites" style="color:#8ea3bf;font-size:.82rem">← escolher outro comitê</a></p>';
  const list = Object.entries(dels).sort((a, b) => (a[1].pais || "").localeCompare(b[1].pais || ""));
  if (!list.length) {
    root.innerHTML = avisoBanner(cid) + comoFunciona(1, com) + '<div class="dg-card">' + voltar +
      '<p class="section-sub" style="margin:0">O professor ainda não abriu as delegações de <b>' + he(com.nome) + '</b>. Assim que a lista de países for liberada, ela aparece aqui para você escolher a sua.</p></div>';
    return;
  }
  const itens = list.map(([id, d]) => {
    const ocupado = d.membros && Object.keys(d.membros).length > 0;
    return '<div class="dg-pais' + (ocupado ? " ocupado" : "") + '"><span class="dg-pais-nome">' + he(d.pais || id) + "</span>" +
      (ocupado
        ? '<span class="dg-pais-tag">já tem delegado</span>'
        : '<button class="btn primary dg-escolher" data-del="' + id + '" data-cid="' + cid + '">Escolher</button>') + "</div>";
  }).join("");
  root.innerHTML =
    avisoBanner(cid) +
    comoFunciona(1, com) +
    '<div class="dg-card">' + voltar + '<h3 style="margin:.2rem 0 .4rem">2. Escolha seu país</h3>' +
    '<p class="section-sub">Clique no país que você vai representar em <b>' + he(com.nome) + '</b>. Um delegado por país.</p>' +
    '<div class="dg-lista-paises">' + itens + "</div></div>";
}

function renderAluno() {
  const root = document.getElementById("delegacao-body");
  if (!root || IS_TEACHER) return;

  if (!MINHA || !MINHA.delegacaoId) {
    if (!COM_SEL) renderEscolhaComite(root);
    else renderEscolha(root, COM_SEL);
    return;
  }
  const cid = cidDoAluno(), com = comInfo(cid);
  const del = (DELEG_C[cid] || {})[MINHA.delegacaoId] || {};
  const pais = del.pais || MINHA.delegacaoId;
  const est = estadoDe(DOC);
  const travado = est !== "rascunho";
  const badge = ESTADO[est] || ESTADO.rascunho;

  const campo = (id, rot, dica, val) =>
    '<div class="field"><label>' + rot + (dica ? ' <span class="hint">— ' + dica + "</span>" : "") + "</label>" +
    '<textarea class="dg-ta" data-pp="' + id + '" rows="5"' + (travado ? " disabled" : "") + ">" + he(val || "") + "</textarea></div>";

  // A devolutiva aparece sempre que existir — inclusive quando o professor
  // reabre o paper para revisão (estado volta a "rascunho"). Antes ela sumia
  // exatamente na hora em que o aluno mais precisava dela.
  let fbHtml = "";
  if (FB) {
    const reaberto = est !== "corrigido";
    fbHtml = '<div class="dg-fb" id="dg-correcao"><b>📝 Correção do professor — nota ' + notaTotal(FB) + "/100</b>" +
      (reaberto ? '<p class="dg-fb-reab">Seu position paper foi <b>reaberto para revisão</b>. Use a correção abaixo como guia, ajuste o texto e entregue de novo.</p>' : "") +
      '<table class="dg-rub"><tbody>' +
      RUBRICA.map(r => "<tr><td>" + r.rot + "</td><td>" + (Number(FB[r.k]) || 0) + "/" + r.max + "</td></tr>").join("") +
      "</tbody></table>" +
      (FB.comentario ? '<p class="dg-coment">' + he(FB.comentario) + "</p>" : "") + "</div>";
  }

  const passo = est === "corrigido" ? 5 : est === "rascunho" ? 3 : 4;
  root.innerHTML =
    avisoBanner(cid) +
    comoFunciona(passo, com) +
    '<div class="dg-card">' +
      '<div class="dg-head"><div><span class="tag">' + he(com.nome) + '</span>' +
        '<h3 style="margin:.4rem 0 .2rem">Delegação: ' + he(pais) + "</h3>" +
        '<p class="section-sub" style="margin:.2rem 0">Tópicos: ' + com.topicos.map(he).join(" · ") + "</p></div>" +
        '<span class="dg-badge ' + badge.cls + '">' + badge.rot + "</span></div>" +
      (travado ? "" : '<p style="margin:2px 0 0"><a href="#" class="dg-trocar" style="color:#8ea3bf;font-size:.82rem">não é seu país? trocar</a></p>') +
      (travado ? '<p class="dg-lock">📄 Position paper entregue em ' + fmt(DOC && DOC.submittedAt) + ". Ele fica travado para edição — fale com o professor se precisar reabrir.</p>" : "") +
      fbHtml + // no topo: a correção é a primeira coisa que o aluno precisa ver
      '<h4 style="margin:18px 0 4px">Position paper</h4>' +
      (!travado && rascunhoDocsMapeado().temAlgo
        ? '<div class="dg-puxar"><button class="btn ghost" id="dg-puxar-docs">⬇ Puxar meu rascunho da aba Documentos</button>' +
          '<span class="hint">preenche as 3 seções com o que você escreveu em <b>Documentos</b> — você revisa antes de entregar</span></div>'
        : "") +
      campo("passadoAtual", "1. Ações internacionais (passado/presente)", "o histórico do tema no sistema ONU", DOC && DOC.passadoAtual) +
      campo("posicao", "2. Posição do país (Country Position)", "o que a delegação defende e por quê", DOC && DOC.posicao) +
      campo("solucoes", "3. Soluções propostas (Proposed Solutions)", "iniciativas com nome próprio", DOC && DOC.solucoes) +
      (travado ? "" :
        '<div class="toolbar"><button class="btn primary" id="dg-salvar">💾 Salvar rascunho</button>' +
        '<button class="btn gold" id="dg-entregar">📨 Entregar ao professor</button>' +
        '<span id="dg-status" class="dg-status"></span></div>') +
    "</div>";
  paintStatus(); // repõe o aviso que o re-render acabou de apagar
}

function coletarPP() {
  const g = id => { const t = document.querySelector('.dg-ta[data-pp="' + id + '"]'); return t ? t.value : ""; };
  return { passadoAtual: g("passadoAtual"), posicao: g("posicao"), solucoes: g("solucoes") };
}
function docPath() { return "docsDelegacao/" + cidDoAluno() + "/" + MINHA.delegacaoId + "/" + PP; }

// Aluno escolhe comitê / país e troca (auto-atendimento)
document.addEventListener("click", async e => {
  const escCom = e.target.closest(".dg-escolher-comite");
  if (escCom) { COM_SEL = escCom.dataset.cid; renderAluno(); return; }
  const voltar = e.target.closest(".dg-voltar-comites");
  if (voltar) { e.preventDefault(); COM_SEL = null; renderAluno(); return; }
  const esc = e.target.closest(".dg-escolher");
  if (esc) {
    const del = esc.dataset.del, cid = esc.dataset.cid || COM_SEL || COMITE_PADRAO;
    const uid = auth.currentUser && auth.currentUser.uid;
    if (!uid) return;
    esc.disabled = true; esc.textContent = "Entrando…";
    try {
      await set(ref(db, "delegacoes/" + cid + "/" + del + "/membros/" + uid), true);
      await set(ref(db, "minhaDelegacao/" + uid), { comiteId: cid, delegacaoId: del });
    } catch (err) {
      alert("Não consegui entrar (" + (err.code || err.message) + "). Esse país pode já ter sido escolhido — a lista vai atualizar.");
      esc.disabled = false; esc.textContent = "Escolher";
    }
    return;
  }
  const troc = e.target.closest(".dg-trocar");
  if (troc) {
    e.preventDefault();
    if (!MINHA) return;
    const cid = cidDoAluno();
    const paisAtual = ((DELEG_C[cid] || {})[MINHA.delegacaoId] || {}).pais || "atual";
    if (!confirm("Sair da delegação " + paisAtual + " e escolher outro país ou comitê?")) return;
    const del = MINHA.delegacaoId, uid = auth.currentUser.uid;
    try {
      await remove(ref(db, "delegacoes/" + cid + "/" + del + "/membros/" + uid));
      await remove(ref(db, "minhaDelegacao/" + uid));
      COM_SEL = cid; // volta para a lista de países do mesmo comitê
    } catch (err) { alert("Não consegui trocar: " + (err.code || err.message)); }
    return;
  }
});

document.addEventListener("click", async e => {
  if (e.target.id === "dg-puxar-docs") {
    if (!MINHA || !MINHA.delegacaoId) return;
    const { map } = rascunhoDocsMapeado();
    const patch = {};
    Object.entries(map).forEach(([k, v]) => { if (v) patch[k] = v; });
    if (!Object.keys(patch).length) { setStatus("Nada para puxar — a aba Documentos está vazia.", "#b3261e"); return; }
    // Só avisa de substituição se o que o aluno já digitou for diferente do que virá.
    const atual = coletarPP();
    const vaiSubstituir = Object.keys(patch).some(k => (atual[k] || "").trim() && atual[k].trim() !== patch[k].trim());
    if (vaiSubstituir && !confirm("Puxar o rascunho vai substituir o texto que você já digitou nestas seções. Continuar?")) return;
    e.target.disabled = true;
    try {
      // Preserva o que já estava digitado nos campos não sobrescritos.
      await update(ref(db, docPath()), { ...atual, ...patch, estado: "rascunho", updatedBy: auth.currentUser.uid, updatedAt: Date.now() });
      setStatus("Rascunho puxado e salvo ✓ — revise as 3 seções e clique em 📨 Entregar quando estiver pronto.", "#1E8E5A");
    } catch (err) {
      const cod = err.code || err.message || "";
      setStatus(/permission/i.test(cod)
        ? "⚠ Não consegui puxar — o paper está travado. Peça ao professor para reabrir."
        : "⚠ Não consegui puxar (" + cod + ").", "#b3261e");
      e.target.disabled = false;
    }
    return;
  }
  if (e.target.id === "dg-salvar") {
    try {
      await update(ref(db, docPath()), { ...coletarPP(), estado: "rascunho", updatedBy: auth.currentUser.uid, updatedAt: Date.now() });
      setStatus("Salvo ✓", "#1E8E5A");
    } catch (err) {
      const cod = err.code || err.message || "";
      setStatus(/permission/i.test(cod)
        ? "⚠ NÃO SALVOU — o paper está travado (entregue ou já corrigido). Copie seu texto e peça ao professor para reabrir."
        : "⚠ NÃO SALVOU (" + cod + "). Copie seu texto antes de sair da página.", "#b3261e");
    }
    return;
  }
  if (e.target.id === "dg-entregar") {
    const pp = coletarPP();
    if (!(pp.passadoAtual + pp.posicao + pp.solucoes).trim()) { alert("Escreva o position paper antes de entregar."); return; }
    if (!confirm("Entregar o position paper ao professor? Depois de entregar você não poderá mais editá-lo (só o professor reabre).")) return;
    try {
      await update(ref(db, docPath()), { ...pp, estado: "entregue", updatedBy: auth.currentUser.uid, updatedAt: Date.now(), submittedAt: Date.now() });
    } catch (err) { alert("Não consegui entregar (" + (err.code || err.message) + ")."); }
    return;
  }
});

/* =====================  PROFESSOR  ===================== */
function nomeAluno(uid) {
  const a = AUTORIZADOS[uid];
  return (a && a.email) ? a.email : uid;
}

function renderProf() {
  if (!IS_TEACHER) return;
  // Fatia do comitê ativo — todo o painel abaixo trabalha sobre estas visões.
  DELEGACOES = DELEG_C[PROF_COMITE] || {};
  DOCS_ALL = DOCS_C[PROF_COMITE] || {};
  FB_ALL = FB_C[PROF_COMITE] || {};
  AVISO = AVISO_C[PROF_COMITE] || null;
  renderProfTabs();
  renderProfAviso();
  renderProfPainel();
  renderProfDelegacoes();
  renderProfAtribuir();
  renderProfCorrecao();
}

// Abas de comitê do painel (UNEA | CND). Tudo abaixo delas é por comitê.
function renderProfTabs() {
  const root = document.getElementById("dg-prof-comite-tabs"); if (!root) return;
  root.innerHTML = Object.entries(COMITES).map(([cid, c]) => {
    const dels = DELEG_C[cid] || {};
    const n = Object.keys(dels).length;
    return '<button class="dg-tab' + (cid === PROF_COMITE ? " ativa" : "") + '" data-cid="' + cid + '">' +
      he(c.sigla) + (n ? ' <span class="dg-tab-n">' + n + " países</span>" : "") + "</button>";
  }).join("");
}
document.addEventListener("click", e => {
  const tab = e.target.closest(".dg-tab");
  if (tab && tab.dataset.cid && tab.dataset.cid !== PROF_COMITE) {
    PROF_COMITE = tab.dataset.cid;
    CORR_ABERTAS.clear(); // caixas de correção abertas pertencem à outra aba
    renderProf();
  }
});

// (0a) Compositor do recado ao vivo — publica em avisos/<comite>, visível a todos.
function renderProfAviso() {
  const root = document.getElementById("dg-prof-aviso"); if (!root) return;
  const atual = (AVISO && AVISO.texto) ? AVISO.texto : "";
  root.innerHTML =
    '<div class="dg-inline"><input type="text" id="dg-aviso-in" maxlength="240" placeholder="Ex.: Comecem o position paper — entreguem até as 16h" value="' + he(atual) + '">' +
    '<button class="btn primary" id="dg-aviso-pub">📢 Publicar aviso</button>' +
    (atual ? '<button class="btn ghost" id="dg-aviso-clr">Limpar</button>' : "") + "</div>" +
    (atual
      ? '<p class="section-sub" style="margin:6px 0 0">No ar desde ' + fmt(AVISO.ts) + " — os alunos do <b>" + he(comInfo(PROF_COMITE).sigla) + "</b> veem no topo da aba <b>Delegação</b>.</p>"
      : '<p class="section-sub" style="margin:6px 0 0">Nenhum aviso no ar. O que você publicar aqui aparece ao vivo para os alunos do <b>' + he(comInfo(PROF_COMITE).sigla) + "</b>.</p>");
}

// (0b) Visão da turma ao vivo — pendentes + panorama de todas as delegações.
function renderProfPainel() {
  const root = document.getElementById("dg-prof-painel"); if (!root || !IS_TEACHER) return;

  // Alerta de aprovação sob pressão (item 4): aprovar todos sem sair desta tela.
  const pend = Object.entries(PENDENTES);
  const alerta = pend.length
    ? '<div class="dg-pend">⏳ <b>' + pend.length + " aluno(s) aguardando aprovação:</b> " +
        pend.map(([, v]) => he((v && v.email) || "sem e-mail")).join(", ") +
        ' <button class="btn primary" id="dg-aprovar-todos">Aprovar todos (' + pend.length + ")</button></div>"
    : "";

  const ids = idsDelegacoes();
  if (!ids.length) { root.innerHTML = alerta + '<p class="section-sub">Carregue as delegações do comitê para ver o panorama.</p>'; return; }

  // Só mostra delegações com delegado OU com paper; conta as vazias à parte.
  const ativas = ids.filter(id => {
    const d = DELEGACOES[id] || {};
    return (d.membros && Object.keys(d.membros).length) || temDoc(id);
  });
  const cont = { rascunho: 0, entregue: 0, em_correcao: 0, corrigido: 0 };
  const rows = ativas.map(id => {
    const d = DELEGACOES[id] || {};
    const doc = DOCS_ALL[id] && DOCS_ALL[id][PP];
    const membros = d.membros ? Object.keys(d.membros).map(nomeAluno).map(he).join(", ") : '<i style="color:#8ea3bf">sem delegado</i>';
    const est = doc ? estadoDe(doc) : null;
    if (est) cont[est] = (cont[est] || 0) + 1;
    const fb = (FB_ALL[id] && FB_ALL[id][PP]) || null;
    // Aluno escreveu na aba Documentos (progresso) mas não entregou pela Delegação?
    const nDocs = !doc && d.membros ? Math.max(...Object.keys(d.membros).map(ppDocsDoAluno), 0) : 0;
    const estCel = doc
      ? badgeEstado(est, fb, false)
      : (nDocs
        ? '<span class="dg-badge st-entregue" title="O aluno preencheu o Position Paper no editor da aba Documentos (' + nDocs + '/5 campos), mas não entregou pela aba Delegação. Peça que ele copie o texto para a aba Delegação e clique Entregar.">✏️ rascunho na aba Documentos (' + nDocs + '/5)</span>'
        : '<span style="color:#8ea3bf">— sem paper —</span>');
    const nota = fb ? notaTotal(fb) + "/100" : "—";
    const ult = doc && (doc.updatedAt || doc.submittedAt) ? fmt(doc.updatedAt || doc.submittedAt) : "—";
    return "<tr><td><b>" + he(paisDe(id)) + "</b>" + tagOrfa(id) + "</td><td>" + membros + "</td><td>" + estCel + "</td><td>" + nota + "</td><td>" + ult + "</td></tr>";
  }).join("");

  const vazias = Object.keys(DELEGACOES).filter(id => ativas.indexOf(id) === -1).length;
  const orfas = ativas.filter(ehOrfa).length;
  const chip = (n, rot, cls) => '<span class="dg-chip ' + (cls || "") + '">' + n + " " + rot + "</span>";
  const resumo =
    chip(ativas.length, "com delegado", "c-ok") +
    chip(cont.rascunho || 0, "rascunhando") +
    chip((cont.entregue || 0) + (cont.em_correcao || 0), "aguardando correção", "c-wait") +
    chip(cont.corrigido || 0, "corrigidos", "c-done") +
    (vazias ? chip(vazias, "países livres") : "") +
    (orfas ? chip(orfas, "fora da lista de delegações", "c-wait") : "");

  root.innerHTML = alerta +
    '<div class="dg-chips">' + resumo + "</div>" +
    (ativas.length
      ? '<div class="table-wrap"><table class="prof-tab dg-turma"><thead><tr><th>País</th><th>Delegado</th><th>Position paper</th><th>Nota</th><th>Última atividade</th></tr></thead><tbody>' + rows + "</tbody></table></div>"
      : '<p class="section-sub">Nenhum aluno escolheu país ainda.</p>');
}

// (a) criar / listar delegações
function renderProfDelegacoes() {
  const root = document.getElementById("dg-prof-delegacoes"); if (!root) return;
  const com = comInfo(PROF_COMITE);
  const list = Object.entries(DELEGACOES).sort((a, b) => (a[1].pais || "").localeCompare(b[1].pais || ""));
  root.innerHTML =
    '<div class="prof-bar"><button class="btn ghost" id="dg-seed">➕ Carregar as delegações do ' + he(com.sigla) + " (lista pronta, " + com.paises.length + " países)</button></div>" +
    '<form id="dg-add-form" class="dg-inline"><input type="text" id="dg-add-pais" placeholder="País (ex.: Estados Unidos)">' +
    '<button class="btn ghost" type="submit">➕ Adicionar delegação</button></form>' +
    (list.length ?
      '<table class="prof-tab"><thead><tr><th>País</th><th>Membros</th><th></th></tr></thead><tbody>' +
      list.map(([id, d]) => "<tr><td>" + he(d.pais || id) + "</td><td>" +
        (d.membros ? Object.keys(d.membros).map(nomeAluno).map(he).join(", ") : "<i>ninguém ainda</i>") +
        '</td><td><button class="btn ghost dg-del-delegacao" data-id="' + id + '">Remover</button></td></tr>').join("") +
      "</tbody></table>"
      : '<p class="section-sub">Nenhuma delegação criada ainda.</p>');
}

// (b) atribuir alunos autorizados a delegações
function renderProfAtribuir() {
  const root = document.getElementById("dg-prof-atribuir"); if (!root) return;
  const alunos = Object.entries(AUTORIZADOS);
  const opcoes = Object.entries(DELEGACOES).sort((a, b) => (a[1].pais || "").localeCompare(b[1].pais || ""));
  if (!alunos.length) { root.innerHTML = '<p class="section-sub">Nenhum aluno aprovado ainda — aprove na seção de crises/painel.</p>'; return; }
  root.innerHTML = '<p class="section-sub" style="margin:0 0 8px">Atribuindo dentro de <b>' + he(comInfo(PROF_COMITE).sigla) + "</b> — troque de aba para atribuir no outro comitê.</p>" +
    '<table class="prof-tab"><thead><tr><th>Aluno</th><th>Delegação</th></tr></thead><tbody>' +
    alunos.map(([uid, v]) => {
      const at = ATRIBUICOES[uid] || {};
      const atCid = at.delegacaoId ? (at.comiteId || COMITE_PADRAO) : null;
      const noOutro = atCid && atCid !== PROF_COMITE; // atribuído no outro comitê
      const atual = noOutro ? null : at.delegacaoId;
      const paisOutro = noOutro ? ((DELEG_C[atCid] || {})[at.delegacaoId] || {}).pais || at.delegacaoId : null;
      const sel = '<select class="dg-atribui" data-uid="' + uid + '"><option value="">— sem delegação —</option>' +
        opcoes.map(([id, d]) => '<option value="' + id + '"' + (id === atual ? " selected" : "") + ">" + he(d.pais || id) + "</option>").join("") + "</select>" +
        (noOutro ? ' <span class="hint" title="Escolher um país aqui MOVE o aluno para este comitê.">já está no ' + he(comInfo(atCid).sigla) + ": " + he(paisOutro) + "</span>" : "");
      return "<tr><td>" + he((v && v.email) || uid) + "</td><td>" + sel + "</td></tr>";
    }).join("") + "</tbody></table>";
}

// (c) correção dos position papers entregues
function renderProfCorrecao() {
  const root = document.getElementById("dg-prof-correcao"); if (!root) return;
  const list = idsDelegacoes().filter(temDoc);
  if (!list.length) { root.innerHTML = '<p class="section-sub">Nenhum position paper entregue/rascunhado ainda.</p>'; return; }
  root.innerHTML = list.map(id => {
    const doc = DOCS_ALL[id][PP], est = estadoDe(doc);
    const fb = (FB_ALL[id] && FB_ALL[id][PP]) || null;
    return '<div class="prof-item"><div class="prof-head"><b>' + he(paisDe(id)) + '</b> ' +
      badgeEstado(est, fb, true) + tagOrfa(id) + " " +
      '<button class="btn ghost dg-corrigir" data-id="' + id + '">Abrir / corrigir</button></div>' +
      '<div class="dg-corr-box" id="dg-corr-' + id + '" hidden></div></div>';
  }).join("");
  // Reabre as caixas que já estavam abertas. Abrir um paper "entregue" grava
  // estado "em_correcao", o que dispara este próprio render e recriaria a caixa
  // fechada e vazia — o professor via o nada e tinha de clicar duas vezes.
  CORR_ABERTAS.forEach(id => {
    const box = document.getElementById("dg-corr-" + id);
    if (!box) { CORR_ABERTAS.delete(id); return; }
    box.hidden = false;
    box.innerHTML = boxCorrecao(id);
  });
}

function boxCorrecao(id) {
  const d = DELEGACOES[id] || {}, doc = (DOCS_ALL[id] && DOCS_ALL[id][PP]) || {}, fb = (FB_ALL[id] && FB_ALL[id][PP]) || {};
  const secao = (rot, val) => "<h5 style=\"margin:12px 0 2px\">" + rot + '</h5><div class="dg-lido">' + (he(val) || "<i>(vazio)</i>") + "</div>";
  const inputs = RUBRICA.map(r =>
    '<label class="dg-nota">' + r.rot + ' (0–' + r.max + ')<input type="number" min="0" max="' + r.max + '" class="dg-nota-in" data-k="' + r.k + '" value="' + (fb[r.k] != null ? fb[r.k] : "") + '"></label>').join("");
  return secao("1. Ações internacionais", doc.passadoAtual) + secao("2. Posição do país", doc.posicao) + secao("3. Soluções propostas", doc.solucoes) +
    '<div class="dg-notas" data-id="' + id + '">' + inputs +
    '<label class="dg-nota" style="flex:1 1 100%">Comentário<textarea class="dg-coment-in" rows="3">' + he(fb.comentario || "") + "</textarea></label></div>" +
    '<div class="toolbar"><button class="btn primary dg-lancar" data-id="' + id + '">Lançar nota (marca como corrigido)</button>' +
    (estadoDe(doc) === "corrigido" ? '<button class="btn ghost dg-reabrir" data-id="' + id + '">↺ Reabrir para o aluno</button>' : "") +
    '<span class="dg-status dg-corr-status"></span></div>';
}

function slugPais(pais) {
  return pais.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}
// Cria de uma vez as delegações da lista pronta do comitê da aba ativa.
async function carregarDelegacoes(cid) {
  const com = comInfo(cid);
  if (!com.paises.length) { alert("Este comitê não tem lista pronta de países."); return; }
  if (!confirm("Criar as " + com.paises.length + " delegações do comitê " + com.sigla + "? (não apaga as que já existem nem os alunos já atribuídos)")) return;
  try {
    for (const pais of com.paises) {
      await update(ref(db, "delegacoes/" + cid + "/" + slugPais(pais)), { pais });
    }
    alert(com.paises.length + " delegações criadas no " + com.sigla + "! Elas já aparecem na lista abaixo e para os alunos escolherem.");
  } catch (err) { alert("Erro: " + (err.code || err.message)); }
}
document.addEventListener("click", e => { if (e.target.id === "dg-seed") carregarDelegacoes(PROF_COMITE); });

document.addEventListener("submit", async e => {
  if (e.target.id === "dg-add-form") {
    e.preventDefault();
    const inp = document.getElementById("dg-add-pais"), pais = inp.value.trim();
    if (!pais) return;
    const id = pais.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    try { await update(ref(db, "delegacoes/" + PROF_COMITE + "/" + id), { pais }); inp.value = ""; }
    catch (err) { alert("Erro ao adicionar: " + (err.code || err.message)); }
  }
});

document.addEventListener("change", async e => {
  const sel = e.target.closest(".dg-atribui");
  if (sel) {
    const uid = sel.dataset.uid, novo = sel.value, antigo = ATRIBUICOES[uid] && ATRIBUICOES[uid].delegacaoId;
    // O aluno pode estar atribuído no OUTRO comitê — remove de onde ele estava.
    const antigoCid = (ATRIBUICOES[uid] && ATRIBUICOES[uid].comiteId) || COMITE_PADRAO;
    try {
      if (antigo && (antigoCid !== PROF_COMITE || antigo !== novo)) await remove(ref(db, "delegacoes/" + antigoCid + "/" + antigo + "/membros/" + uid));
      if (novo) {
        await set(ref(db, "delegacoes/" + PROF_COMITE + "/" + novo + "/membros/" + uid), true);
        await set(ref(db, "minhaDelegacao/" + uid), { comiteId: PROF_COMITE, delegacaoId: novo });
      } else {
        await remove(ref(db, "minhaDelegacao/" + uid));
      }
    } catch (err) { alert("Não consegui atribuir: " + (err.code || err.message)); }
  }
});

document.addEventListener("click", async e => {
  const del = e.target.closest(".dg-del-delegacao");
  if (del) {
    const id = del.dataset.id;
    // Remover a delegação tira do aluno o acesso ao próprio paper (as regras do
    // banco dependem de delegacoes/<id>/membros/<uid>). Por isso o aviso é duro
    // quando já existe delegado ou documento gravado.
    const d = DELEGACOES[id] || {};
    const ocupada = (d.membros && Object.keys(d.membros).length) || temDoc(id);
    const aviso = ocupada
      ? "ATENÇÃO: " + paisDe(id) + " já tem delegado e/ou position paper gravado.\n\n" +
        "O documento NÃO é apagado e continua no seu painel de correção (marcado como “delegação removida da lista”), " +
        "mas o aluno perde o acesso ao próprio paper enquanto o país estiver fora da lista.\n\nRemover mesmo assim?"
      : "Remover esta delegação? (não apaga os documentos já gravados)";
    if (confirm(aviso)) {
      try { await remove(ref(db, "delegacoes/" + PROF_COMITE + "/" + id)); } catch (err) { alert(err.message); }
    }
    return;
  }
  const corr = e.target.closest(".dg-corrigir");
  if (corr) {
    const id = corr.dataset.id, box = document.getElementById("dg-corr-" + id);
    if (!box) return;
    if (!box.hidden) { box.hidden = true; CORR_ABERTAS.delete(id); return; }
    box.hidden = false; box.innerHTML = boxCorrecao(id);
    CORR_ABERTAS.add(id);
    // ao abrir, marca em correção (se estava só entregue)
    if (estadoDe(DOCS_ALL[id] && DOCS_ALL[id][PP]) === "entregue") {
      update(ref(db, "docsDelegacao/" + PROF_COMITE + "/" + id + "/" + PP), { estado: "em_correcao" }).catch(() => {});
    }
    return;
  }
  const lan = e.target.closest(".dg-lancar");
  if (lan) {
    const id = lan.dataset.id, box = document.getElementById("dg-corr-" + id);
    const notas = {};
    box.querySelectorAll(".dg-nota-in").forEach(inp => { notas[inp.dataset.k] = Math.max(0, Number(inp.value) || 0); });
    notas.comentario = (box.querySelector(".dg-coment-in").value || "").trim();
    notas.criadoEm = Date.now();
    const st = box.querySelector(".dg-corr-status");
    try {
      await set(ref(db, "feedback/" + PROF_COMITE + "/" + id + "/" + PP), notas);
      await update(ref(db, "docsDelegacao/" + PROF_COMITE + "/" + id + "/" + PP), { estado: "corrigido" });
      if (st) { st.textContent = "Nota lançada ✓"; st.style.color = "#1E8E5A"; }
    } catch (err) { if (st) { st.textContent = "Erro (" + (err.code || err.message) + ")"; st.style.color = "#b3261e"; } }
    return;
  }
  const reab = e.target.closest(".dg-reabrir");
  if (reab) {
    const id = reab.dataset.id;
    if (confirm("Reabrir o position paper para o aluno editar de novo?")) {
      try { await update(ref(db, "docsDelegacao/" + PROF_COMITE + "/" + id + "/" + PP), { estado: "rascunho" }); } catch (err) { alert(err.message); }
    }
    return;
  }
});

/* =====================  PROFESSOR — avisos & aprovação ao vivo  ===================== */
document.addEventListener("click", async e => {
  // Publicar recado ao vivo p/ todos os alunos
  if (e.target.id === "dg-aviso-pub") {
    const inp = document.getElementById("dg-aviso-in"), texto = (inp ? inp.value : "").trim();
    if (!texto) { alert("Escreva o aviso antes de publicar."); return; }
    e.target.disabled = true;
    try { await set(ref(db, "avisos/" + PROF_COMITE), { texto, ts: Date.now() }); }
    catch (err) { alert("Não consegui publicar (" + (err.code || err.message) + ")."); e.target.disabled = false; }
    return;
  }
  if (e.target.id === "dg-aviso-clr") {
    if (!confirm("Tirar o aviso do ar?")) return;
    try { await remove(ref(db, "avisos/" + PROF_COMITE)); } catch (err) { alert(err.message); }
    return;
  }
  // Aprovar todos os alunos pendentes sem sair do painel de delegações (item 4)
  if (e.target.id === "dg-aprovar-todos") {
    const alunos = Object.entries(PENDENTES).map(([uid, v]) => ({ uid, email: (v && v.email) || "" }));
    if (!alunos.length || !confirm("Aprovar todos os " + alunos.length + " alunos aguardando?")) return;
    e.target.disabled = true; e.target.textContent = "Aprovando…";
    for (const a of alunos) {
      try {
        await set(ref(db, "autorizados/" + a.uid), { email: a.email, aprovadoEm: Date.now() });
        await remove(ref(db, "pendentes/" + a.uid));
      } catch (err) { /* segue aprovando os demais */ }
    }
    return;
  }
});
