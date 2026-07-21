// Área da delegação — war-room privado + submissão do position paper (Firebase RTDB).
// Fase 1 da plataforma de simulação. Segue o mesmo padrão de crises.js/turma.js.
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";
import { getDatabase, ref, get, set, update, remove, onValue } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-database.js";

const auth = getAuth();
const db = getDatabase();
const TEACHER_EMAIL = "aluizio@aluizio.education";

// Comitê ativo (Fase 1: um só). Trocar/estender quando houver mais de um.
const COMITE = "unea-ymunb-2026";
const COMITE_NOME = "UNEA — YMUN Brasil 2026";
const TOPICOS = ["Margem Equatorial da Foz do Amazonas", "Terras Raras / Minerais Críticos (Serra Verde)"];
const PP = "positionPaper"; // docId do deliverable principal da delegação

// Aviso de salvamento do aluno. Fica no módulo (e não só no DOM) porque o
// onValue do documento re-renderiza a seção e recriaria o <span> vazio,
// apagando tanto o "Salvo ✓" quanto a mensagem de erro.
let STATUS = null, STATUS_TIMER = null;
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

let IS_TEACHER = false, INIT = false;
// aluno
let MINHA = null, SUB_DEL = null, DOC = null, FB = null;
// professor
let DELEGACOES = {}, AUTORIZADOS = {}, ATRIBUICOES = {}, DOCS_ALL = {}, FB_ALL = {};

onAuthStateChanged(auth, user => {
  if (!user) return;
  IS_TEACHER = (user.email || "").toLowerCase() === TEACHER_EMAIL;
  document.body.classList.toggle("teacher", IS_TEACHER);
  if (INIT) return; INIT = true;

  if (IS_TEACHER) {
    const _err = (id, node) => e => { const r = document.getElementById(id); if (r) r.innerHTML = '<p class="section-sub" style="color:#f7a">Não foi possível ler <b>' + node + '</b>: ' + (e && (e.code || e.message)) + "</p>"; };
    onValue(ref(db, "delegacoes/" + COMITE), s => { DELEGACOES = s.val() || {}; renderProf(); }, _err("dg-prof-delegacoes", "delegacoes"));
    onValue(ref(db, "minhaDelegacao"), s => { ATRIBUICOES = s.val() || {}; renderProf(); }, _err("dg-prof-atribuir", "minhaDelegacao"));
    onValue(ref(db, "autorizados"), s => { AUTORIZADOS = s.val() || {}; renderProf(); }, _err("dg-prof-atribuir", "autorizados"));
    onValue(ref(db, "docsDelegacao/" + COMITE), s => { DOCS_ALL = s.val() || {}; renderProf(); }, _err("dg-prof-correcao", "docsDelegacao"));
    onValue(ref(db, "feedback/" + COMITE), s => { FB_ALL = s.val() || {}; renderProf(); }, _err("dg-prof-correcao", "feedback"));
  } else {
    onValue(ref(db, "delegacoes/" + COMITE), s => { DELEGACOES = s.val() || {}; renderAluno(); }, () => {});
    onValue(ref(db, "minhaDelegacao/" + user.uid), s => { MINHA = s.val(); abrirWarRoom(); }, () => { MINHA = null; renderAluno(); });
  }
});

/* =====================  ALUNO — war-room  ===================== */
function abrirWarRoom() {
  const delId = MINHA && MINHA.delegacaoId;
  if (!delId) { renderAluno(); return; }
  if (SUB_DEL === delId) { renderAluno(); return; } // já assinado
  SUB_DEL = delId;
  onValue(ref(db, "docsDelegacao/" + COMITE + "/" + delId + "/" + PP), s => { DOC = s.val(); renderAluno(); }, () => {});
  onValue(ref(db, "feedback/" + COMITE + "/" + delId + "/" + PP), s => { FB = s.val(); renderAluno(); }, () => {});
}

function renderEscolha(root) {
  const list = Object.entries(DELEGACOES).sort((a, b) => (a[1].pais || "").localeCompare(b[1].pais || ""));
  if (!list.length) {
    root.innerHTML = '<div class="dg-card"><p class="section-sub" style="margin:0">O professor ainda não abriu as delegações do comitê. Assim que a lista de países for liberada, ela aparece aqui para você escolher a sua.</p></div>';
    return;
  }
  const itens = list.map(([id, d]) => {
    const ocupado = d.membros && Object.keys(d.membros).length > 0;
    return '<div class="dg-pais' + (ocupado ? " ocupado" : "") + '"><span class="dg-pais-nome">' + he(d.pais || id) + "</span>" +
      (ocupado
        ? '<span class="dg-pais-tag">já tem delegado</span>'
        : '<button class="btn primary dg-escolher" data-del="' + id + '">Escolher</button>') + "</div>";
  }).join("");
  root.innerHTML =
    '<div class="dg-card"><h3 style="margin:.2rem 0 .4rem">Escolha seu país</h3>' +
    '<p class="section-sub">Clique no país que você vai representar em <b>' + he(COMITE_NOME) + '</b>. Um delegado por país.</p>' +
    '<div class="dg-lista-paises">' + itens + "</div></div>";
}

function renderAluno() {
  const root = document.getElementById("delegacao-body");
  if (!root || IS_TEACHER) return;

  if (!MINHA || !MINHA.delegacaoId) {
    renderEscolha(root);
    return;
  }
  const del = DELEGACOES[MINHA.delegacaoId] || {};
  const pais = del.pais || MINHA.delegacaoId;
  const est = estadoDe(DOC);
  const travado = est !== "rascunho";
  const badge = ESTADO[est] || ESTADO.rascunho;

  const campo = (id, rot, dica, val) =>
    '<div class="field"><label>' + rot + (dica ? ' <span class="hint">— ' + dica + "</span>" : "") + "</label>" +
    '<textarea class="dg-ta" data-pp="' + id + '" rows="5"' + (travado ? " disabled" : "") + ">" + he(val || "") + "</textarea></div>";

  let fbHtml = "";
  if (est === "corrigido" && FB) {
    fbHtml = '<div class="dg-fb"><b>Correção do professor — nota ' + notaTotal(FB) + "/100</b>" +
      '<table class="dg-rub"><tbody>' +
      RUBRICA.map(r => "<tr><td>" + r.rot + "</td><td>" + (Number(FB[r.k]) || 0) + "/" + r.max + "</td></tr>").join("") +
      "</tbody></table>" +
      (FB.comentario ? '<p class="dg-coment">' + he(FB.comentario) + "</p>" : "") + "</div>";
  }

  root.innerHTML =
    '<div class="dg-card">' +
      '<div class="dg-head"><div><span class="tag">' + he(COMITE_NOME) + '</span>' +
        '<h3 style="margin:.4rem 0 .2rem">Delegação: ' + he(pais) + "</h3>" +
        '<p class="section-sub" style="margin:.2rem 0">Tópicos: ' + TOPICOS.map(he).join(" · ") + "</p></div>" +
        '<span class="dg-badge ' + badge.cls + '">' + badge.rot + "</span></div>" +
      (travado ? "" : '<p style="margin:2px 0 0"><a href="#" class="dg-trocar" style="color:#8ea3bf;font-size:.82rem">não é seu país? trocar</a></p>') +
      (travado ? '<p class="dg-lock">📄 Position paper entregue em ' + fmt(DOC && DOC.submittedAt) + ". Ele fica travado para edição — fale com o professor se precisar reabrir.</p>" : "") +
      '<h4 style="margin:18px 0 4px">Position paper</h4>' +
      campo("passadoAtual", "1. Ações internacionais (passado/presente)", "o histórico do tema no sistema ONU", DOC && DOC.passadoAtual) +
      campo("posicao", "2. Posição do país (Country Position)", "o que a delegação defende e por quê", DOC && DOC.posicao) +
      campo("solucoes", "3. Soluções propostas (Proposed Solutions)", "iniciativas com nome próprio", DOC && DOC.solucoes) +
      (travado ? "" :
        '<div class="toolbar"><button class="btn primary" id="dg-salvar">💾 Salvar rascunho</button>' +
        '<button class="btn gold" id="dg-entregar">📨 Entregar ao professor</button>' +
        '<span id="dg-status" class="dg-status"></span></div>') +
      fbHtml +
    "</div>";
  paintStatus(); // repõe o aviso que o re-render acabou de apagar
}

function coletarPP() {
  const g = id => { const t = document.querySelector('.dg-ta[data-pp="' + id + '"]'); return t ? t.value : ""; };
  return { passadoAtual: g("passadoAtual"), posicao: g("posicao"), solucoes: g("solucoes") };
}
function docPath() { return "docsDelegacao/" + COMITE + "/" + MINHA.delegacaoId + "/" + PP; }

// Aluno escolhe / troca de país (auto-atendimento)
document.addEventListener("click", async e => {
  const esc = e.target.closest(".dg-escolher");
  if (esc) {
    const del = esc.dataset.del, uid = auth.currentUser && auth.currentUser.uid;
    if (!uid) return;
    esc.disabled = true; esc.textContent = "Entrando…";
    try {
      await set(ref(db, "delegacoes/" + COMITE + "/" + del + "/membros/" + uid), true);
      await set(ref(db, "minhaDelegacao/" + uid), { comiteId: COMITE, delegacaoId: del });
    } catch (err) {
      alert("Não consegui entrar (" + (err.code || err.message) + "). Esse país pode já ter sido escolhido — a lista vai atualizar.");
      esc.disabled = false; esc.textContent = "Escolher";
    }
    return;
  }
  const troc = e.target.closest(".dg-trocar");
  if (troc) {
    e.preventDefault();
    if (!MINHA || !confirm("Sair da delegação " + ((DELEGACOES[MINHA.delegacaoId] || {}).pais || "atual") + " e escolher outro país?")) return;
    const del = MINHA.delegacaoId, uid = auth.currentUser.uid;
    try {
      await remove(ref(db, "delegacoes/" + COMITE + "/" + del + "/membros/" + uid));
      await remove(ref(db, "minhaDelegacao/" + uid));
    } catch (err) { alert("Não consegui trocar: " + (err.code || err.message)); }
    return;
  }
});

document.addEventListener("click", async e => {
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
  renderProfDelegacoes();
  renderProfAtribuir();
  renderProfCorrecao();
}

// (a) criar / listar delegações
function renderProfDelegacoes() {
  const root = document.getElementById("dg-prof-delegacoes"); if (!root) return;
  const list = Object.entries(DELEGACOES).sort((a, b) => (a[1].pais || "").localeCompare(b[1].pais || ""));
  root.innerHTML =
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
  root.innerHTML = '<table class="prof-tab"><thead><tr><th>Aluno</th><th>Delegação</th></tr></thead><tbody>' +
    alunos.map(([uid, v]) => {
      const atual = ATRIBUICOES[uid] && ATRIBUICOES[uid].delegacaoId;
      const sel = '<select class="dg-atribui" data-uid="' + uid + '"><option value="">— sem delegação —</option>' +
        opcoes.map(([id, d]) => '<option value="' + id + '"' + (id === atual ? " selected" : "") + ">" + he(d.pais || id) + "</option>").join("") + "</select>";
      return "<tr><td>" + he((v && v.email) || uid) + "</td><td>" + sel + "</td></tr>";
    }).join("") + "</tbody></table>";
}

// (c) correção dos position papers entregues
function renderProfCorrecao() {
  const root = document.getElementById("dg-prof-correcao"); if (!root) return;
  const list = Object.entries(DELEGACOES).filter(([id]) => DOCS_ALL[id] && DOCS_ALL[id][PP])
    .sort((a, b) => (a[1].pais || "").localeCompare(b[1].pais || ""));
  if (!list.length) { root.innerHTML = '<p class="section-sub">Nenhum position paper entregue/rascunhado ainda.</p>'; return; }
  root.innerHTML = list.map(([id, d]) => {
    const doc = DOCS_ALL[id][PP], est = estadoDe(doc), badge = ESTADO[est] || ESTADO.rascunho;
    const fb = (FB_ALL[id] && FB_ALL[id][PP]) || null;
    const nota = fb ? " · nota " + notaTotal(fb) + "/100" : "";
    return '<div class="prof-item"><div class="prof-head"><b>' + he(d.pais || id) + '</b> ' +
      '<span class="dg-badge ' + badge.cls + '">' + badge.rot + nota + "</span> " +
      '<button class="btn ghost dg-corrigir" data-id="' + id + '">Abrir / corrigir</button></div>' +
      '<div class="dg-corr-box" id="dg-corr-' + id + '" hidden></div></div>';
  }).join("");
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

// Lista de delegações do comitê UNEA/YMUNB (da matriz do material). Professor cria todas de uma vez.
const DELEGACOES_UNEA = [
  "Estados Unidos", "Brasil", "Guiana", "Suriname", "Venezuela", "Equador", "Colômbia", "Peru", "Bolívia",
  "Nigéria", "Angola", "Arábia Saudita", "Emirados Árabes Unidos", "Kuwait", "Irã", "Argélia", "Omã",
  "China", "Índia", "Japão", "Coreia do Sul", "Indonésia",
  "União Europeia", "França", "Alemanha", "Reino Unido", "Noruega", "Austrália", "Canadá",
  "RDC (Congo)", "Chile", "Argentina", "África do Sul", "Namíbia", "Zâmbia", "Tanzânia", "Guiné", "Moçambique",
  "Maldivas", "Tuvalu", "Fiji", "Kiribati", "Bangladesh", "Filipinas",
];
function slugPais(pais) {
  return pais.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}
async function carregarDelegacoesUNEA() {
  if (!confirm("Criar as " + DELEGACOES_UNEA.length + " delegações do comitê UNEA? (não apaga as que já existem nem os alunos já atribuídos)")) return;
  try {
    for (const pais of DELEGACOES_UNEA) {
      await update(ref(db, "delegacoes/" + COMITE + "/" + slugPais(pais)), { pais });
    }
    alert(DELEGACOES_UNEA.length + " delegações criadas! Elas já aparecem na lista abaixo e para os alunos escolherem.");
  } catch (err) { alert("Erro: " + (err.code || err.message)); }
}
document.addEventListener("click", e => { if (e.target.id === "dg-seed-unea") carregarDelegacoesUNEA(); });

document.addEventListener("submit", async e => {
  if (e.target.id === "dg-add-form") {
    e.preventDefault();
    const inp = document.getElementById("dg-add-pais"), pais = inp.value.trim();
    if (!pais) return;
    const id = pais.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    try { await update(ref(db, "delegacoes/" + COMITE + "/" + id), { pais }); inp.value = ""; }
    catch (err) { alert("Erro ao adicionar: " + (err.code || err.message)); }
  }
});

document.addEventListener("change", async e => {
  const sel = e.target.closest(".dg-atribui");
  if (sel) {
    const uid = sel.dataset.uid, novo = sel.value, antigo = ATRIBUICOES[uid] && ATRIBUICOES[uid].delegacaoId;
    try {
      if (antigo && antigo !== novo) await remove(ref(db, "delegacoes/" + COMITE + "/" + antigo + "/membros/" + uid));
      if (novo) {
        await set(ref(db, "delegacoes/" + COMITE + "/" + novo + "/membros/" + uid), true);
        await set(ref(db, "minhaDelegacao/" + uid), { comiteId: COMITE, delegacaoId: novo });
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
    if (confirm("Remover esta delegação? (não apaga os documentos já gravados)")) {
      try { await remove(ref(db, "delegacoes/" + COMITE + "/" + id)); } catch (err) { alert(err.message); }
    }
    return;
  }
  const corr = e.target.closest(".dg-corrigir");
  if (corr) {
    const id = corr.dataset.id, box = document.getElementById("dg-corr-" + id);
    if (!box) return;
    if (!box.hidden) { box.hidden = true; return; }
    box.hidden = false; box.innerHTML = boxCorrecao(id);
    // ao abrir, marca em correção (se estava só entregue)
    if (estadoDe(DOCS_ALL[id] && DOCS_ALL[id][PP]) === "entregue") {
      update(ref(db, "docsDelegacao/" + COMITE + "/" + id + "/" + PP), { estado: "em_correcao" }).catch(() => {});
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
      await set(ref(db, "feedback/" + COMITE + "/" + id + "/" + PP), notas);
      await update(ref(db, "docsDelegacao/" + COMITE + "/" + id + "/" + PP), { estado: "corrigido" });
      if (st) { st.textContent = "Nota lançada ✓"; st.style.color = "#1E8E5A"; }
    } catch (err) { if (st) { st.textContent = "Erro (" + (err.code || err.message) + ")"; st.style.color = "#b3261e"; } }
    return;
  }
  const reab = e.target.closest(".dg-reabrir");
  if (reab) {
    const id = reab.dataset.id;
    if (confirm("Reabrir o position paper para o aluno editar de novo?")) {
      try { await update(ref(db, "docsDelegacao/" + COMITE + "/" + id + "/" + PP), { estado: "rascunho" }); } catch (err) { alert(err.message); }
    }
    return;
  }
});
