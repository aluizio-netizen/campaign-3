// Crises do professor — lado do aluno + painel do professor (Firebase RTDB).
// Reaproveita o app Firebase já inicializado pelo módulo inline do index.html.
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";
import { getDatabase, ref, get, set, push, remove, onValue } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-database.js";

const auth = getAuth();
const db = getDatabase();
const TEACHER_EMAIL = "aluizio@aluizio.education";

let IS_TEACHER = false, INIT = false, DATA = {};
const he = s => String(s == null ? "" : s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const tipoTag = t => t === "orgao" ? "órgão competente" : (t === "mocao" ? "qual moção" : "resposta aberta");

onAuthStateChanged(auth, user => {
  if (!user) return;
  IS_TEACHER = (user.email || "").toLowerCase() === TEACHER_EMAIL;
  document.body.classList.toggle("teacher", IS_TEACHER);
  if (INIT) return; INIT = true;
  onValue(ref(db, "crises"), snap => {
    DATA = snap.val() || {};
    renderAluno();
    if (IS_TEACHER) renderProfList();
  });
  if (IS_TEACHER) setupForm();
});

const ativas = () => Object.entries(DATA).filter(([, c]) => c && c.ativa).sort((a, b) => (a[1].criadaEm || 0) - (b[1].criadaEm || 0));

async function renderAluno() {
  const root = document.getElementById("crises-aluno"); if (!root) return;
  const list = ativas();
  if (!list.length) { root.innerHTML = '<p class="section-sub">Nenhuma crise ativa agora. Volte mais tarde.</p>'; return; }
  const uid = auth.currentUser && auth.currentUser.uid;
  const parts = [];
  for (const [id, c] of list) {
    let mine = null;
    if (uid) { try { mine = (await get(ref(db, "respostas/" + id + "/" + uid))).val(); } catch (e) {} }
    parts.push(cardAluno(id, c, mine));
  }
  root.innerHTML = parts.join("");
}

function cardAluno(id, c, mine) {
  let body = "";
  if (c.tipo === "aberta") {
    if (mine) body = '<div class="caso-fb">Resposta enviada ✓ — o professor vai avaliar.</div><div class="crise-mine">' + he(mine.texto) + "</div>";
    else body = '<textarea class="crise-ta" data-cid="' + id + '" rows="5" placeholder="Escreva sua resposta..."></textarea>' +
      '<div class="toolbar"><button class="btn primary crise-send" data-cid="' + id + '">Enviar</button></div>';
  } else {
    const opts = (c.opcoes || []).map((o, i) => {
      let cls = "caso-opt";
      if (mine) { if (o.correta) cls += " ok"; else if (mine.escolhaIdx === i) cls += " no"; }
      return '<button type="button" class="' + cls + '" data-cid="' + id + '" data-idx="' + i + '"' + (mine ? " disabled" : "") + ">" + he(o.texto) + "</button>";
    }).join("");
    body = '<div class="caso-opts">' + opts + "</div>";
    if (mine) body += '<div class="caso-fb">' + (mine.correto ? "<b>Correto.</b>" : "<b>Não exatamente.</b> A resposta certa está destacada.") + "</div>";
  }
  return '<div class="caso"><div class="caso-num">CRISE · ' + tipoTag(c.tipo) + '</div><h3>' + he(c.titulo) + "</h3>" +
    '<p class="caso-sit">' + he(c.enunciado) + "</p>" + body + "</div>";
}

document.addEventListener("click", async e => {
  const opt = e.target.closest("#crises-aluno .caso-opt");
  if (opt && !opt.disabled) {
    const id = opt.dataset.cid, idx = +opt.dataset.idx, c = DATA[id];
    const correto = !!(c.opcoes && c.opcoes[idx] && c.opcoes[idx].correta);
    try { await set(ref(db, "respostas/" + id + "/" + auth.currentUser.uid), { email: auth.currentUser.email, escolhaIdx: idx, correto, enviadaEm: Date.now() }); }
    catch (err) { alert("Nao consegui salvar: " + (err.code || err.message)); }
    renderAluno(); return;
  }
  const send = e.target.closest("#crises-aluno .crise-send");
  if (send) {
    const id = send.dataset.cid;
    const ta = document.querySelector('.crise-ta[data-cid="' + id + '"]');
    const txt = ((ta && ta.value) || "").trim();
    if (!txt) { alert("Escreva sua resposta antes de enviar."); return; }
    try { await set(ref(db, "respostas/" + id + "/" + auth.currentUser.uid), { email: auth.currentUser.email, texto: txt, enviadaEm: Date.now() }); }
    catch (err) { alert("Nao consegui salvar: " + (err.code || err.message)); }
    renderAluno();
  }
});

/* -------- Painel do professor -------- */
function setupForm() {
  const f = document.getElementById("prof-form"); if (!f || f.dataset.ready) return; f.dataset.ready = "1";
  const tipoSel = document.getElementById("prof-tipo");
  const optsWrap = document.getElementById("prof-opts");
  const toggle = () => { optsWrap.style.display = tipoSel.value === "aberta" ? "none" : "block"; };
  tipoSel.addEventListener("change", toggle); toggle();
  f.addEventListener("submit", async e => {
    e.preventDefault();
    const tipo = tipoSel.value;
    const titulo = document.getElementById("prof-titulo").value.trim();
    const enunciado = document.getElementById("prof-enunciado").value.trim();
    if (!titulo || !enunciado) { alert("Preencha titulo e enunciado."); return; }
    const crise = { tipo, titulo, enunciado, ativa: true, criadaEm: Date.now() };
    if (tipo !== "aberta") {
      const opcoes = [];
      const corretaIdx = document.querySelector('input[name="prof-correta"]:checked');
      const ci = corretaIdx ? +corretaIdx.value : -1;
      document.querySelectorAll(".prof-opt").forEach((inp, i) => {
        const t = inp.value.trim(); if (t) opcoes.push({ texto: t, correta: i === ci });
      });
      if (opcoes.length < 2) { alert("De pelo menos 2 opcoes."); return; }
      if (!opcoes.some(o => o.correta)) { alert("Marque a opcao correta (o circulo a esquerda)."); return; }
      crise.opcoes = opcoes;
    }
    try { await push(ref(db, "crises"), crise); f.reset(); toggle(); }
    catch (err) { alert("Erro ao criar: " + (err.code || err.message)); }
  });
}

function renderProfList() {
  const root = document.getElementById("prof-lista"); if (!root) return;
  const list = Object.entries(DATA).sort((a, b) => (b[1].criadaEm || 0) - (a[1].criadaEm || 0));
  if (!list.length) { root.innerHTML = '<p class="section-sub">Nenhuma crise criada ainda.</p>'; return; }
  root.innerHTML = list.map(([id, c]) =>
    '<div class="prof-item"><div class="prof-head"><b>' + he(c.titulo) + '</b> <span class="tag">' + tipoTag(c.tipo) + "</span>" +
    (c.ativa ? "" : ' <span class="tag tag-off">inativa</span>') + "</div>" +
    '<div class="toolbar">' +
    '<button class="btn ghost prof-resp" data-cid="' + id + '">Ver respostas</button>' +
    '<button class="btn ghost prof-toggle" data-cid="' + id + '">' + (c.ativa ? "Desativar" : "Ativar") + "</button>" +
    '<button class="btn ghost prof-del" data-cid="' + id + '">Excluir</button>' +
    '</div><div class="prof-resp-box" id="resp-' + id + '" hidden></div></div>').join("");
}

document.addEventListener("click", async e => {
  const tog = e.target.closest(".prof-toggle");
  if (tog) { const id = tog.dataset.cid; try { await set(ref(db, "crises/" + id + "/ativa"), !DATA[id].ativa); } catch (err) { alert(err.message); } return; }
  const del = e.target.closest(".prof-del");
  if (del) { const id = del.dataset.cid; if (confirm("Excluir esta crise e suas respostas?")) { await remove(ref(db, "crises/" + id)); await remove(ref(db, "respostas/" + id)); } return; }
  const rb = e.target.closest(".prof-resp");
  if (rb) {
    const id = rb.dataset.cid, box = document.getElementById("resp-" + id);
    if (!box.hidden) { box.hidden = true; return; }
    box.hidden = false; box.innerHTML = "carregando…";
    onValue(ref(db, "respostas/" + id), snap => {
      const r = snap.val() || {}, rows = Object.values(r);
      if (!rows.length) { box.innerHTML = '<p class="section-sub">Ninguem respondeu ainda.</p>'; return; }
      box.innerHTML = '<table class="prof-tab"><thead><tr><th>Aluno</th><th>Resposta</th></tr></thead><tbody>' +
        rows.map(x => "<tr><td>" + he(x.email) + "</td><td>" +
          (x.texto != null ? he(x.texto) : (x.correto ? "✔ acertou" : "✗ errou") + " (opção " + (x.escolhaIdx + 1) + ")") +
          "</td></tr>").join("") + "</tbody></table>";
    });
  }
});
