// Materiais do curso — biblioteca de arquivos com 3 níveis de visibilidade:
//   publico  → qualquer aluno logado
//   turma    → só alunos aprovados (autorizados/)
//   restrito → só alunos escolhidos pelo professor (espelhado em materiais/alunos/<uid>)
// Segue o padrão de delegacao.js/turma.js (módulo independente, RTDB ao vivo).
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";
import { getDatabase, ref, set, update, remove, onValue, push } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-database.js";

const auth = getAuth();
const db = getDatabase();
const TEACHER_EMAIL = "aluizio@aluizio.education";

const he = s => String(s == null ? "" : s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const fmt = ms => ms ? new Date(ms).toLocaleDateString("pt-BR") : "";
const TIPOS = ["Guia", "Slides", "Apostila", "Crise", "Kit", "Vídeo", "Outro"];
const VIS = {
  publico:  { rot: "🔓 público",      dica: "qualquer aluno logado vê" },
  turma:    { rot: "👥 turma",        dica: "só alunos aprovados veem" },
  restrito: { rot: "🔒 restrito",     dica: "só os alunos marcados veem" },
};

// URLs http(s) apenas — evita javascript: e afins no href.
const urlOk = u => /^https?:\/\//i.test((u || "").trim());

let IS_TEACHER = false, INIT = false, UID = null;
// aluno: fatias que o aluno consegue ler
let M_PUB = {}, M_TURMA = {}, M_MEUS = {};
// professor: tudo + espelho de restritos + alunos aprovados
let M_RESTR = {}, AUTORIZADOS = {};
// caixas "quem vê" abertas no painel (sobrevivem ao re-render do onValue)
const QUEM_VE_ABERTAS = new Set();

onAuthStateChanged(auth, user => {
  if (!user) return;
  UID = user.uid;
  IS_TEACHER = (user.email || "").toLowerCase() === TEACHER_EMAIL;
  if (INIT) return; INIT = true;

  onValue(ref(db, "materiais/publico"), s => { M_PUB = s.val() || {}; render(); }, () => {});
  onValue(ref(db, "materiais/turma"), s => { M_TURMA = s.val() || {}; render(); }, () => { M_TURMA = {}; render(); });
  if (IS_TEACHER) {
    onValue(ref(db, "materiais/restrito"), s => { M_RESTR = s.val() || {}; renderProf(); }, () => {});
    onValue(ref(db, "autorizados"), s => { AUTORIZADOS = s.val() || {}; renderProf(); }, () => {});
  } else {
    onValue(ref(db, "materiais/alunos/" + UID), s => { M_MEUS = s.val() || {}; render(); }, () => {});
  }
});

function render() { renderAluno(); renderProf(); }

/* =====================  ALUNO  ===================== */
function renderAluno() {
  const root = document.getElementById("materiais-body");
  if (!root) return;
  if (IS_TEACHER) { root.innerHTML = '<p class="section-sub">Você é o professor — gerencie os arquivos na seção <a href="#painel-materiais">Materiais (painel)</a>.</p>'; return; }

  // Junta as três origens numa lista só, com o selo de visibilidade.
  const itens = [];
  Object.entries(M_PUB).forEach(([id, m]) => itens.push({ id, vis: "publico", ...m }));
  Object.entries(M_TURMA).forEach(([id, m]) => itens.push({ id, vis: "turma", ...m }));
  Object.entries(M_MEUS).forEach(([id, m]) => itens.push({ id, vis: "restrito", ...m }));
  if (!itens.length) {
    root.innerHTML = '<p class="section-sub">Nenhum material publicado ainda. Quando o professor liberar arquivos, eles aparecem aqui.</p>';
    return;
  }

  // Agrupa por assunto (ex.: CND, UNEA, Geral), em ordem alfabética.
  const grupos = {};
  itens.forEach(m => { const g = (m.assunto || "Geral").trim() || "Geral"; (grupos[g] = grupos[g] || []).push(m); });
  root.innerHTML = Object.keys(grupos).sort((a, b) => a.localeCompare(b)).map(g => {
    const cards = grupos[g]
      .sort((a, b) => (b.ts || 0) - (a.ts || 0))
      .map(m => {
        const v = VIS[m.vis] || VIS.publico;
        return '<div class="mt-card">' +
          '<div class="mt-top"><span class="mt-tipo">' + he(m.tipo || "Arquivo") + '</span>' +
          '<span class="mt-vis" title="' + he(v.dica) + '">' + v.rot + "</span></div>" +
          "<h4>" + he(m.titulo || "(sem título)") + "</h4>" +
          (m.desc ? '<p class="mt-desc">' + he(m.desc) + "</p>" : "") +
          '<div class="mt-foot"><span class="mt-ts">' + fmt(m.ts) + "</span>" +
          (urlOk(m.url) ? '<a class="btn primary mt-abrir" href="' + he(m.url) + '" target="_blank" rel="noopener">Abrir ↗</a>' : '<span class="hint">link inválido</span>') +
          "</div></div>";
      }).join("");
    return '<h3 class="mt-grupo">' + he(g) + '</h3><div class="mt-grid">' + cards + "</div>";
  }).join("");
}

/* =====================  PROFESSOR  ===================== */
const emailDe = uid => (AUTORIZADOS[uid] && AUTORIZADOS[uid].email) || uid;

function todosMateriais() {
  const l = [];
  Object.entries(M_PUB).forEach(([id, m]) => l.push({ id, vis: "publico", ...m }));
  Object.entries(M_TURMA).forEach(([id, m]) => l.push({ id, vis: "turma", ...m }));
  Object.entries(M_RESTR).forEach(([id, m]) => l.push({ id, vis: "restrito", ...m }));
  return l.sort((a, b) => (b.ts || 0) - (a.ts || 0));
}

function renderProf() {
  const root = document.getElementById("mt-prof");
  if (!root || !IS_TEACHER) return;

  const form =
    '<div class="mt-form">' +
    '<div class="mt-linha"><input type="text" id="mt-titulo" placeholder="Título (ex.: Kit da crise — confidencial)">' +
    '<input type="text" id="mt-assunto" placeholder="Assunto (ex.: CND, UNEA, Geral)" list="mt-assuntos">' +
    '<datalist id="mt-assuntos"><option>CND</option><option>UNEA</option><option>Geral</option></datalist>' +
    '<select id="mt-tipo">' + TIPOS.map(t => "<option>" + t + "</option>").join("") + "</select></div>" +
    '<div class="mt-linha"><input type="text" id="mt-url" placeholder="Link do arquivo (https://…)">' +
    '<select id="mt-vis"><option value="publico">🔓 Público (qualquer logado)</option>' +
    '<option value="turma">👥 Turma (só aprovados)</option>' +
    '<option value="restrito">🔒 Restrito (alunos escolhidos)</option></select></div>' +
    '<div class="mt-linha"><input type="text" id="mt-desc" placeholder="Descrição curta (opcional)">' +
    '<button class="btn primary" id="mt-add">➕ Publicar material</button><span id="mt-status" class="dg-status"></span></div>' +
    '<p class="section-sub" id="mt-restr-dica" style="margin:4px 0 0;display:none">🔒 O material restrito nasce <b>sem nenhum aluno</b> — publique e depois marque quem vê no botão "quem vê" da lista abaixo.</p>' +
    "</div>";

  const lista = todosMateriais();
  const rows = lista.length ? lista.map(m => {
    const v = VIS[m.vis];
    const nVe = m.vis === "restrito" ? Object.keys(m.uids || {}).length : null;
    const quem = m.vis === "restrito"
      ? ' <button class="btn ghost mt-quem" data-id="' + m.id + '">👁 quem vê (' + nVe + ")</button>"
      : "";
    return '<div class="prof-item"><div class="prof-head"><b>' + he(m.titulo || "(sem título)") + "</b> " +
      '<span class="mt-vis">' + v.rot + "</span> " +
      '<span class="hint">' + he(m.assunto || "Geral") + " · " + he(m.tipo || "Arquivo") + " · " + fmt(m.ts) + "</span>" +
      (urlOk(m.url) ? ' <a class="hint" href="' + he(m.url) + '" target="_blank" rel="noopener">abrir ↗</a>' : "") +
      quem +
      ' <button class="btn ghost mt-del" data-id="' + m.id + '" data-vis="' + m.vis + '">Excluir</button></div>' +
      (m.vis === "restrito" ? '<div class="mt-quem-box" id="mt-quem-' + m.id + '" hidden></div>' : "") +
      "</div>";
  }).join("") : '<p class="section-sub">Nenhum material publicado ainda.</p>';

  root.innerHTML = form + '<h3 style="margin-top:22px">Materiais publicados</h3>' + rows;

  // repõe estado do select restrito e das caixas "quem vê" abertas
  const visSel = document.getElementById("mt-vis");
  if (visSel) visSel.addEventListener("change", () => {
    document.getElementById("mt-restr-dica").style.display = visSel.value === "restrito" ? "block" : "none";
  });
  QUEM_VE_ABERTAS.forEach(id => {
    const box = document.getElementById("mt-quem-" + id);
    if (!box) { QUEM_VE_ABERTAS.delete(id); return; }
    box.hidden = false; box.innerHTML = boxQuemVe(id);
  });
}

// Caixa de gestão de acesso de um material restrito: checkbox por aluno aprovado.
function boxQuemVe(id) {
  const m = M_RESTR[id] || {};
  const uids = m.uids || {};
  const alunos = Object.keys(AUTORIZADOS);
  if (!alunos.length) return '<p class="section-sub">Nenhum aluno aprovado ainda.</p>';
  return '<p class="section-sub" style="margin:8px 0 4px">Marque quem pode ver <b>' + he(m.titulo || id) + "</b>:</p>" +
    alunos.map(uid =>
      '<label class="mt-aluno"><input type="checkbox" class="mt-toggle" data-id="' + id + '" data-uid="' + uid + '"' +
      (uids[uid] ? " checked" : "") + "> " + he(emailDe(uid)) + "</label>").join("");
}

/* =====================  AÇÕES DO PROFESSOR  ===================== */
document.addEventListener("click", async e => {
  // publicar material novo
  if (e.target.id === "mt-add") {
    const g = id => (document.getElementById(id) || {}).value || "";
    const titulo = g("mt-titulo").trim(), url = g("mt-url").trim(), vis = g("mt-vis") || "publico";
    const st = document.getElementById("mt-status");
    const diga = (t, cor) => { if (st) { st.textContent = t; st.style.color = cor; } };
    if (!titulo) { diga("Dê um título ao material.", "#b3261e"); return; }
    if (!urlOk(url)) { diga("O link precisa começar com https://", "#b3261e"); return; }
    const dado = { titulo, desc: g("mt-desc").trim(), assunto: g("mt-assunto").trim() || "Geral", tipo: g("mt-tipo") || "Outro", url, ts: Date.now() };
    try {
      if (vis === "restrito") {
        await set(push(ref(db, "materiais/restrito")), { ...dado, uids: {} });
      } else {
        await set(push(ref(db, "materiais/" + vis)), dado);
      }
      ["mt-titulo", "mt-url", "mt-desc"].forEach(i => { const el = document.getElementById(i); if (el) el.value = ""; });
      diga("Publicado ✓" + (vis === "restrito" ? " — agora marque quem vê na lista abaixo." : ""), "#1E8E5A");
    } catch (err) { diga("Erro: " + (err.code || err.message), "#b3261e"); }
    return;
  }
  // abrir/fechar caixa "quem vê"
  const quem = e.target.closest(".mt-quem");
  if (quem) {
    const id = quem.dataset.id, box = document.getElementById("mt-quem-" + id);
    if (!box) return;
    if (!box.hidden) { box.hidden = true; QUEM_VE_ABERTAS.delete(id); return; }
    box.hidden = false; box.innerHTML = boxQuemVe(id); QUEM_VE_ABERTAS.add(id);
    return;
  }
  // excluir material (e, se restrito, o espelho de cada aluno)
  const del = e.target.closest(".mt-del");
  if (del) {
    const id = del.dataset.id, vis = del.dataset.vis;
    if (!confirm("Excluir este material? (o arquivo em si não é apagado — só some da lista dos alunos)")) return;
    try {
      if (vis === "restrito") {
        const uids = Object.keys((M_RESTR[id] || {}).uids || {});
        for (const uid of uids) await remove(ref(db, "materiais/alunos/" + uid + "/" + id));
        await remove(ref(db, "materiais/restrito/" + id));
      } else {
        await remove(ref(db, "materiais/" + vis + "/" + id));
      }
      QUEM_VE_ABERTAS.delete(id);
    } catch (err) { alert("Erro ao excluir: " + (err.code || err.message)); }
    return;
  }
});

// marcar/desmarcar aluno num material restrito → grava no mestre e no espelho do aluno
document.addEventListener("change", async e => {
  const t = e.target.closest(".mt-toggle");
  if (!t) return;
  const id = t.dataset.id, uid = t.dataset.uid, marcado = t.checked;
  const m = M_RESTR[id];
  if (!m) return;
  t.disabled = true;
  try {
    if (marcado) {
      const { uids, ...dado } = m;
      await update(ref(db, "materiais/restrito/" + id + "/uids"), { [uid]: true });
      await set(ref(db, "materiais/alunos/" + uid + "/" + id), dado);
    } else {
      await remove(ref(db, "materiais/restrito/" + id + "/uids/" + uid));
      await remove(ref(db, "materiais/alunos/" + uid + "/" + id));
    }
  } catch (err) { alert("Não consegui atualizar o acesso: " + (err.code || err.message)); t.checked = !marcado; }
  t.disabled = false;
});
