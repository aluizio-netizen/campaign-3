// Crises do professor — alunos + painel (Firebase RTDB).
// Recursos: tipos (órgão/moção/MC geral/V-F/aberta), ranking, convite/aprovação, export CSV.
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";
import { getDatabase, ref, get, set, push, remove, onValue } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-database.js";

const auth = getAuth();
const db = getDatabase();
const TEACHER_EMAIL = "aluizio@aluizio.education";

let IS_TEACHER = false, INIT = false, DATA = {}, INVITE_ONLY = false, MY_AUTH = false, RESP = {};
const he = s => String(s == null ? "" : s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const TAG = { orgao: "órgão competente", mocao: "qual moção", mc: "múltipla escolha", vf: "verdadeiro/falso", aberta: "resposta aberta" };
const tipoTag = t => TAG[t] || t;

onAuthStateChanged(auth, user => {
  if (!user) return;
  IS_TEACHER = (user.email || "").toLowerCase() === TEACHER_EMAIL;
  document.body.classList.toggle("teacher", IS_TEACHER);
  if (INIT) return; INIT = true;
  onValue(ref(db, "config/inviteOnly"), s => { INVITE_ONLY = s.val() === true; applyAccess(); if (IS_TEACHER) renderInvite(); });
  onValue(ref(db, "autorizados/" + user.uid), s => { MY_AUTH = !!s.val(); applyAccess(); });
  onValue(ref(db, "crises"), s => { DATA = s.val() || {}; renderAluno(); if (IS_TEACHER) renderProfList(); });
  if (IS_TEACHER) {
    setupForm();
    onValue(ref(db, "pendentes"), s => renderPendentes(s.val() || {}));
    onValue(ref(db, "autorizados"), s => renderAprovados(s.val() || {}), () => renderAprovados(null));
    onValue(ref(db, "respostas"), s => { RESP = s.val() || {}; renderRanking(); });
  }
});

function applyAccess() {
  if (IS_TEACHER) { document.body.classList.remove("pending"); return; }
  const blocked = INVITE_ONLY && !MY_AUTH;
  document.body.classList.toggle("pending", blocked);
  if (blocked && auth.currentUser) {
    const pRef = ref(db, "pendentes/" + auth.currentUser.uid);
    get(pRef).then(s => {
      if (s.exists()) return;
      return set(pRef, { email: auth.currentUser.email, ts: Date.now() }).then(() => {
        // Aviso por e-mail ao professor (Netlify Forms; form "novo-delegado" no index.html)
        const body = new URLSearchParams({ "form-name": "novo-delegado", email: auth.currentUser.email, quando: new Date().toLocaleString("pt-BR") }).toString();
        return fetch("/", { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body }).catch(() => {});
      });
    }).catch(() => {});
  }
}

/* ---------------- ALUNO ---------------- */
const ativas = () => Object.entries(DATA).filter(([, c]) => c && c.ativa).sort((a, b) => (a[1].criadaEm || 0) - (b[1].criadaEm || 0));

async function renderAluno() {
  const root = document.getElementById("crises-aluno"); if (!root) return;
  const list = ativas();
  const uid = auth.currentUser && auth.currentUser.uid;
  let ok = 0, mc = 0;
  const parts = [];
  for (const [id, c] of list) {
    let mine = null;
    if (uid) { try { mine = (await get(ref(db, "respostas/" + id + "/" + uid))).val(); } catch (e) {} }
    if (mine && c.opcoes) { mc++; if (mine.correto) ok++; }
    parts.push(cardAluno(id, c, mine));
  }
  const score = mc ? '<p class="section-sub">Sua pontuação: <b>' + ok + "/" + mc + "</b> nas de múltipla escolha.</p>" : "";
  root.innerHTML = list.length ? (score + parts.join("")) : '<p class="section-sub">Nenhuma crise ativa agora. Volte mais tarde.</p>';
}

function cardAluno(id, c, mine) {
  let body = "";
  if (!c.opcoes) {
    if (mine) body = '<div class="caso-fb">Resposta enviada ✓ — o professor vai avaliar.</div><div class="crise-mine">' + he(mine.texto) + "</div>";
    else body = '<textarea class="crise-ta" data-cid="' + id + '" rows="5" placeholder="Escreva sua resposta..."></textarea><div class="toolbar"><button class="btn primary crise-send" data-cid="' + id + '">Enviar</button></div>';
  } else {
    const opts = (c.opcoes || []).map((o, i) => {
      let cls = "caso-opt";
      if (mine) { if (o.correta) cls += " ok"; else if (mine.escolhaIdx === i) cls += " no"; }
      return '<button type="button" class="' + cls + '" data-cid="' + id + '" data-idx="' + i + '"' + (mine ? " disabled" : "") + ">" + he(o.texto) + "</button>";
    }).join("");
    body = '<div class="caso-opts">' + opts + "</div>";
    if (mine) body += '<div class="caso-fb">' + (mine.correto ? "<b>Correto.</b>" : "<b>Não exatamente.</b> A resposta certa está destacada.") + "</div>";
  }
  return '<div class="caso"><div class="caso-num">CRISE · ' + tipoTag(c.tipo) + '</div><h3>' + he(c.titulo) + "</h3><p class=\"caso-sit\">" + he(c.enunciado) + "</p>" + body + "</div>";
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
    const id = send.dataset.cid, ta = document.querySelector('.crise-ta[data-cid="' + id + '"]'), txt = ((ta && ta.value) || "").trim();
    if (!txt) { alert("Escreva sua resposta antes de enviar."); return; }
    try { await set(ref(db, "respostas/" + id + "/" + auth.currentUser.uid), { email: auth.currentUser.email, texto: txt, enviadaEm: Date.now() }); }
    catch (err) { alert("Nao consegui salvar: " + (err.code || err.message)); }
    renderAluno();
  }
});

/* ---------------- PROFESSOR: criar crise ---------------- */
function setupForm() {
  const f = document.getElementById("prof-form"); if (!f || f.dataset.ready) return; f.dataset.ready = "1";
  const tipoSel = document.getElementById("prof-tipo"), opts = document.getElementById("prof-opts"), vf = document.getElementById("prof-vf");
  const toggle = () => { const t = tipoSel.value; opts.style.display = (t === "aberta" || t === "vf") ? "none" : "block"; vf.style.display = (t === "vf") ? "block" : "none"; };
  tipoSel.addEventListener("change", toggle); toggle();
  f.addEventListener("submit", async e => {
    e.preventDefault();
    const tipo = tipoSel.value;
    const titulo = document.getElementById("prof-titulo").value.trim();
    const enunciado = document.getElementById("prof-enunciado").value.trim();
    if (!titulo || !enunciado) { alert("Preencha titulo e enunciado."); return; }
    const crise = { tipo, titulo, enunciado, ativa: true, criadaEm: Date.now() };
    if (tipo === "vf") {
      const v = document.querySelector('input[name="prof-vf"]:checked');
      crise.opcoes = [{ texto: "Verdadeiro", correta: !!(v && v.value === "v") }, { texto: "Falso", correta: !!(v && v.value === "f") }];
    } else if (tipo !== "aberta") {
      const ci = document.querySelector('input[name="prof-correta"]:checked'); const cidx = ci ? +ci.value : -1;
      const op = []; document.querySelectorAll(".prof-opt").forEach((inp, i) => { const t = inp.value.trim(); if (t) op.push({ texto: t, correta: i === cidx }); });
      if (op.length < 2) { alert("De pelo menos 2 opcoes."); return; }
      if (!op.some(o => o.correta)) { alert("Marque a opcao correta."); return; }
      crise.opcoes = op;
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
    (c.ativa ? "" : ' <span class="tag tag-off">inativa</span>') + "</div><div class=\"toolbar\">" +
    '<button class="btn ghost prof-resp" data-cid="' + id + '">Ver respostas</button>' +
    '<button class="btn ghost prof-toggle" data-cid="' + id + '">' + (c.ativa ? "Desativar" : "Ativar") + "</button>" +
    '<button class="btn ghost prof-del" data-cid="' + id + '">Excluir</button>' +
    '</div><div class="prof-resp-box" id="resp-' + id + '" hidden></div></div>').join("");
}

document.addEventListener("click", async e => {
  const tog = e.target.closest(".prof-toggle"); if (tog) { const id = tog.dataset.cid; try { await set(ref(db, "crises/" + id + "/ativa"), !DATA[id].ativa); } catch (err) { alert(err.message); } return; }
  const del = e.target.closest(".prof-del"); if (del) { const id = del.dataset.cid; if (confirm("Excluir esta crise e suas respostas?")) { await remove(ref(db, "crises/" + id)); await remove(ref(db, "respostas/" + id)); } return; }
  const rb = e.target.closest(".prof-resp");
  if (rb) {
    const id = rb.dataset.cid, box = document.getElementById("resp-" + id);
    if (!box.hidden) { box.hidden = true; return; }
    box.hidden = false; box.innerHTML = "carregando…";
    onValue(ref(db, "respostas/" + id), s => {
      const r = s.val() || {}, rows = Object.values(r);
      if (!rows.length) { box.innerHTML = '<p class="section-sub">Ninguem respondeu ainda.</p>'; return; }
      box.innerHTML = '<table class="prof-tab"><thead><tr><th>Aluno</th><th>Resposta</th></tr></thead><tbody>' +
        rows.map(x => "<tr><td>" + he(x.email) + "</td><td>" + (x.texto != null ? he(x.texto) : (x.correto ? "✔ acertou" : "✗ errou") + " (opção " + (x.escolhaIdx + 1) + ")") + "</td></tr>").join("") + "</tbody></table>";
    });
  }
});

/* ---------------- PROFESSOR: convite / aprovação ---------------- */
function renderInvite() { const t = document.getElementById("prof-invite-toggle"); if (t) t.checked = INVITE_ONLY; }
document.addEventListener("change", e => { if (e.target.id === "prof-invite-toggle") set(ref(db, "config/inviteOnly"), e.target.checked).catch(err => alert(err.message)); });
function renderPendentes(p) {
  const root = document.getElementById("prof-pendentes"); if (!root) return;
  const list = Object.entries(p);
  if (!list.length) { root.innerHTML = '<div class="prof-item"><b>Aguardando aprovação (0)</b> <span class="tag">tudo em dia</span> — ninguém esperando no momento.</div>'; return; }
  root.innerHTML = '<div class="prof-item"><b>Aguardando aprovação (' + list.length + "):</b>" +
    ' <button class="btn primary prof-aprovar-todos" style="margin-left:8px">Aprovar TODOS (' + list.length + ")</button>" +
    list.map(([uid, v]) => '<div class="prof-head" style="margin-top:8px">' + he(v.email || uid) +
      ' <button class="btn primary prof-aprovar" data-uid="' + uid + '" data-email="' + he(v.email || "") + '" style="margin-left:8px">Aprovar</button>' +
      ' <button class="btn ghost prof-negar" data-uid="' + uid + '">Remover</button></div>').join("") + "</div>";
}
function renderAprovados(a) {
  let root = document.getElementById("prof-aprovados");
  if (!root) {
    const anchor = document.getElementById("prof-pendentes");
    if (!anchor) return;
    root = document.createElement("div"); root.id = "prof-aprovados";
    anchor.insertAdjacentElement("afterend", root);
  }
  if (a === null) { root.innerHTML = '<div class="prof-item"><b>Alunos aprovados:</b> sem permissão para listar (ajustar regras do banco).</div>'; return; }
  const list = Object.entries(a).sort((x, y) => ((y[1] && y[1].aprovadoEm) || 0) - ((x[1] && x[1].aprovadoEm) || 0));
  root.innerHTML = '<div class="prof-item"><b>Alunos aprovados (' + list.length + '):</b>' +
    (list.length ? list.map(([uid, v]) => '<div class="prof-head" style="margin-top:8px">' +
      he((v && v.email) ? v.email : "(aprovado antes desta atualização — sem e-mail registrado)") +
      ((v && v.aprovadoEm) ? ' <span class="tag">desde ' + new Date(v.aprovadoEm).toLocaleDateString("pt-BR") + "</span>" : "") +
      ' <button class="btn ghost prof-revogar" data-uid="' + uid + '" style="margin-left:8px">Revogar acesso</button></div>').join("")
     : " nenhum ainda.") + "</div>";
}

document.addEventListener("click", async e => {
  const apt = e.target.closest(".prof-aprovar-todos");
  if (apt) {
    const alunos = [...document.querySelectorAll(".prof-aprovar")].map(b => ({ uid: b.dataset.uid, email: b.dataset.email || "" }));
    if (!alunos.length || !confirm("Aprovar todos os " + alunos.length + " alunos aguardando?")) return;
    apt.disabled = true; apt.textContent = "Aprovando…";
    for (const a of alunos) {
      try { await set(ref(db, "autorizados/" + a.uid), { email: a.email, aprovadoEm: Date.now() }); await remove(ref(db, "pendentes/" + a.uid)); } catch (err) {}
    }
    return;
  }
  const ap = e.target.closest(".prof-aprovar"); if (ap) { const uid = ap.dataset.uid; await set(ref(db, "autorizados/" + uid), { email: ap.dataset.email || "", aprovadoEm: Date.now() }); await remove(ref(db, "pendentes/" + uid)); return; }
  const ng = e.target.closest(".prof-negar"); if (ng) { const uid = ng.dataset.uid; await remove(ref(db, "pendentes/" + uid)); return; }
  const rv = e.target.closest(".prof-revogar"); if (rv) { if (confirm("Revogar o acesso deste aluno? Ele voltará a depender de aprovação.")) { try { await remove(ref(db, "autorizados/" + rv.dataset.uid)); } catch (err) { alert(err.message); } } return; }
});

/* ---------------- PROFESSOR: ranking ---------------- */
function renderRanking() {
  const root = document.getElementById("prof-ranking"); if (!root) return;
  const agg = {};
  Object.values(RESP).forEach(byUid => Object.values(byUid || {}).forEach(r => {
    const k = r.email || "?"; agg[k] = agg[k] || { ok: 0, mc: 0, ab: 0 };
    if (r.texto != null) agg[k].ab++; else { agg[k].mc++; if (r.correto) agg[k].ok++; }
  }));
  const rows = Object.entries(agg).map(([email, a]) => ({ email, ...a })).sort((a, b) => b.ok - a.ok || b.mc - a.mc);
  if (!rows.length) { root.innerHTML = '<p class="section-sub">Sem respostas ainda.</p>'; return; }
  root.innerHTML = '<table class="prof-tab"><thead><tr><th>#</th><th>Aluno</th><th>Acertos</th><th>MC respondidas</th><th>Abertas</th></tr></thead><tbody>' +
    rows.map((r, i) => "<tr><td>" + (i + 1) + "</td><td>" + he(r.email) + "</td><td><b>" + r.ok + "</b></td><td>" + r.mc + "</td><td>" + r.ab + "</td></tr>").join("") + "</tbody></table>";
}

/* ---------------- PROFESSOR: bancos de exemplo ---------------- */
const vf = v => [{ texto: "Verdadeiro", correta: v }, { texto: "Falso", correta: !v }];
const mc = (arr, i) => arr.map((t, j) => ({ texto: t, correta: j === i }));

const BANCO_VF = [
  ["vf_ex1", "Poder de veto", "Apenas os cinco membros permanentes do Conselho de Segurança (China, EUA, França, Reino Unido e Rússia) têm poder de veto.", vf(true)],
  ["vf_ex2", "Resoluções da Assembleia Geral", "As resoluções da Assembleia Geral são juridicamente vinculantes para todos os Estados-membros.", vf(false)],
  ["vf_ex3", "Competência da CIJ", "A Corte Internacional de Justiça (CIJ) julga indivíduos por crimes de guerra.", vf(false)],
  ["vf_ex4", "Position paper (DPO)", "O position paper (DPO) apresenta a posição do país sobre o tema antes do debate.", vf(true)],
  ["vf_ex5", "Caucus moderado", "Num caucus moderado, os delegados circulam livremente pela sala e negociam sem ordem de oradores.", vf(false)],
  ["vf_ex6", "PNUMA", "O PNUMA é o órgão da ONU responsável pela agenda ambiental global.", vf(true)],
  ["vf_ex7", "Cláusulas da resolução", "As cláusulas preambulares determinam ações, e as operativas dão o contexto.", vf(false)],
  ["vf_ex8", "Uso da força", "O ECOSOC pode autorizar o uso da força para resolver uma crise.", vf(false)],
];
const BANCO_ORGAO = [
  ["org_ex1", "Invasão e ameaça à paz", "O país A invade militarmente o país B, com risco de escalada regional. Qual órgão pode agir com medidas obrigatórias?", mc(["Conselho de Segurança (CSNU)", "Assembleia Geral", "ECOSOC", "Corte Internacional de Justiça"], 0)],
  ["org_ex2", "Corrida armamentista", "Vários Estados anunciam novos arsenais e negociam um tratado de controle de armas. Qual comitê conduz o debate?", mc(["Conselho de Segurança", "DISEC (1ª Comissão)", "ECOFIN", "PNUMA"], 1)],
  ["org_ex3", "Dívida insustentável", "Um país em desenvolvimento propõe um mecanismo de reestruturação da dívida soberana. Qual comitê é competente?", mc(["ECOSOC", "ECOFIN (2ª Comissão)", "Conselho de Segurança", "DISEC"], 1)],
  ["org_ex4", "Surto sanitário e social", "Uma região enfrenta epidemia somada a trabalho infantil. Qual órgão coordena a resposta econômico-social?", mc(["Conselho de Segurança", "ECOSOC", "UNCLOS", "Corte Internacional de Justiça"], 1)],
  ["org_ex5", "Poluição transfronteiriça", "Um derramamento químico cruza a fronteira de três países. Qual programa lidera a agenda ambiental?", mc(["ECOFIN", "PNUMA", "Conselho de Segurança", "DISEC"], 1)],
  ["org_ex6", "Disputa marítima", "Dois Estados disputam a delimitação de suas Zonas Econômicas Exclusivas. Qual marco jurídico rege a questão?", mc(["Assembleia Geral", "PNUMA", "UNCLOS (Direito do Mar)", "ECOFIN"], 2)],
  ["org_ex7", "Controvérsia jurídica", "Dois países discordam sobre um tratado de fronteira e aceitam decisão vinculante. Para qual órgão a disputa vai?", mc(["Conselho de Segurança", "ECOSOC", "Corte Internacional de Justiça (CIJ)", "DISEC"], 2)],
  ["org_ex8", "Crise de refugiados", "Um conflito desloca milhares de civis para países vizinhos. Qual agência é central na resposta humanitária?", mc(["Conselho de Segurança", "ACNUR (Refugiados)", "ECOFIN", "UNCLOS"], 1)],
];
const BANCO_MOCAO = [
  ["moc_ex1", "Negociar em grupos", "As delegações querem negociar livremente em grupos menores, circulando pela sala, antes de qualquer votação. Qual moção propor?", mc(["Caucus moderado", "Caucus não-moderado (livre)", "Encerrar o debate", "Ponto de ordem"], 1)],
  ["moc_ex2", "Debater um subtema", "O comitê quer discutir um subtema específico com falas cronometradas, uma de cada vez. Qual moção?", mc(["Caucus moderado", "Caucus não-moderado (livre)", "Ponto de privilégio", "Encerrar o debate"], 0)],
  ["moc_ex3", "Erro de procedimento", "O presidente cometeu um erro nas regras de procedimento. Como o delegado intervém?", mc(["Ponto de privilégio pessoal", "Ponto de ordem", "Encerrar o debate", "Caucus moderado"], 1)],
  ["moc_ex4", "Não consigo ouvir", "Você não conseguiu ouvir o orador por causa de ruído/áudio. O que levanta?", mc(["Ponto de ordem", "Ponto de privilégio pessoal", "Dúvida parlamentar", "Caucus livre"], 1)],
  ["moc_ex5", "Hora de votar", "O debate se esgotou e é hora de votar as resoluções. Qual moção?", mc(["Caucus moderado", "Moção para encerrar o debate", "Caucus livre", "Ponto de ordem"], 1)],
  ["moc_ex6", "Apresentar a resolução", "Há um draft resolution pronto para ser apresentado ao comitê. Qual moção?", mc(["Encerrar o debate", "Moção para introduzir o draft resolution", "Caucus moderado", "Ponto de ordem"], 1)],
  ["moc_ex7", "Pausa para o intervalo", "É preciso pausar os trabalhos para o intervalo. Qual moção?", mc(["Encerrar o debate", "Moção para suspender a sessão", "Caucus livre", "Ponto de privilégio"], 1)],
  ["moc_ex8", "Dúvida sobre as regras", "Você tem uma dúvida sobre o procedimento/regras do comitê. O que usa?", mc(["Ponto de ordem", "Dúvida parlamentar (consulta sobre as regras)", "Ponto de privilégio", "Moção para votar"], 1)],
];

async function carregarBanco(label, tipo, items) {
  if (!confirm("Carregar (ou atualizar) " + items.length + " crises de '" + label + "'?")) return;
  let now = Date.now();
  try {
    for (const [k, titulo, enunciado, opcoes] of items) {
      await set(ref(db, "crises/" + k), { tipo, titulo, enunciado, ativa: true, criadaEm: now++, opcoes });
    }
    alert(items.length + " crises de '" + label + "' carregadas! Veja na lista 'Crises criadas'.");
  } catch (err) { alert("Erro: " + (err.code || err.message)); }
}
document.addEventListener("click", e => {
  if (e.target.id === "prof-load-vf") carregarBanco("Verdadeiro/Falso", "vf", BANCO_VF);
  else if (e.target.id === "prof-load-orgao") carregarBanco("Qual órgão?", "orgao", BANCO_ORGAO);
  else if (e.target.id === "prof-load-mocao") carregarBanco("Qual moção?", "mocao", BANCO_MOCAO);
});

/* ---------------- PROFESSOR: exportar CSV ---------------- */
document.addEventListener("click", e => {
  if (e.target.id !== "prof-export") return;
  const rows = [["Crise", "Tipo", "Aluno", "Resposta", "Correto", "Enviada em"]];
  Object.entries(RESP).forEach(([cid, byUid]) => {
    const c = DATA[cid] || {};
    Object.values(byUid || {}).forEach(r => {
      let resposta, correto = "";
      if (r.texto != null) resposta = r.texto;
      else { const op = (c.opcoes || [])[r.escolhaIdx]; resposta = op ? op.texto : "opção " + (r.escolhaIdx + 1); correto = r.correto ? "sim" : "nao"; }
      const dt = r.enviadaEm ? new Date(r.enviadaEm).toLocaleString("pt-BR") : "";
      rows.push([c.titulo || cid, tipoTag(c.tipo), r.email || "", resposta, correto, dt]);
    });
  });
  const csv = rows.map(r => r.map(v => '"' + String(v == null ? "" : v).replace(/"/g, '""') + '"').join(",")).join("\r\n");
  const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob), a = document.createElement("a");
  a.href = url; a.download = "respostas-onu.csv"; document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 4000);
});
