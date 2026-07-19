// Acompanhamento da turma — visão do professor (Firebase RTDB).
// Lê progresso/<uid> (espelho na nuvem do trabalho de cada aluno), respostas/ e autorizados/
// e monta uma tabela viva: progresso geral e por grupo, última atividade e crises.
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-database.js";

const auth = getAuth();
const db = getDatabase();
const TEACHER_EMAIL = "aluizio@aluizio.education";
const he = s => String(s == null ? "" : s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

// Reusa as definições globais do app.js (script clássico, carrega antes deste módulo);
// cópia local só como rede de segurança.
const GROUPS = (typeof PROGRESS_GROUPS !== "undefined") ? PROGRESS_GROUPS : [
  { nome:"Position Paper",   chaves:["pp_pais","pp_contexto","pp_posicao","pp_propostas","pp_aliancas"] },
  { nome:"Draft Resolution", chaves:["dr_cabecalho","dr_pre","dr_op"] },
  { nome:"Financiamento",    chaves:["fin_estrategia","fin_fonte","fin_doadores"] },
  { nome:"Blocos & discurso",chaves:["blocos_aliados","blocos_oposicao","discurso"] },
  { nome:"Checklist",        chaves:["chk_0","chk_1","chk_2","chk_3","chk_4","chk_5","chk_6"] },
  { nome:"Autoavaliação",    chaves:["rub_0","rub_1","rub_2","rub_3","rub_4","rub_5"] },
];
const SHORT = ["PP", "DR", "Fin.", "Blocos", "Check", "Autoav."];

const FIELD_LABELS = {
  pp_pais:"País", pp_contexto:"Contexto", pp_posicao:"Posição", pp_propostas:"Propostas", pp_aliancas:"Alianças",
  dr_cabecalho:"Cabeçalho", dr_pre:"Cláusulas preambulares", dr_op:"Cláusulas operativas",
  fin_estrategia:"Estratégia", fin_fonte:"Fonte", fin_doadores:"Doadores",
  blocos_aliados:"Aliados", blocos_oposicao:"Oposição", discurso:"Discurso de abertura",
};
function fieldLabel(k) {
  if (FIELD_LABELS[k]) return FIELD_LABELS[k];
  let m = k.match(/^chk_(\d+)$/);
  if (m && typeof CHECKLIST !== "undefined" && CHECKLIST[+m[1]]) return CHECKLIST[+m[1]];
  m = k.match(/^rub_(\d+)$/);
  if (m && typeof RUBRIC !== "undefined" && RUBRIC[+m[1]]) return RUBRIC[+m[1]];
  return k;
}

let PROG = {}, RESP = {}, AUT = {}, started = false, denied = false;
const openRows = new Set();

onAuthStateChanged(auth, user => {
  if (!user || (user.email || "").toLowerCase() !== TEACHER_EMAIL || started) return;
  started = true;
  onValue(ref(db, "progresso"), s => { denied = false; PROG = s.val() || {}; render(); },
    () => { denied = true; render(); });
  onValue(ref(db, "respostas"), s => { RESP = s.val() || {}; render(); }, () => {});
  onValue(ref(db, "autorizados"), s => { AUT = s.val() || {}; render(); }, () => {});
});

const filled = v => v === true || (typeof v === "string" && v.trim() !== "");

function fmtRel(ts) {
  if (!ts) return "—";
  const d = Date.now() - ts;
  const min = Math.round(d / 60000);
  if (min < 2) return "agora";
  if (min < 60) return "há " + min + " min";
  const h = Math.round(min / 60);
  if (h < 24) return "há " + h + " h";
  const dias = Math.round(h / 24);
  if (dias === 1) return "ontem";
  if (dias <= 30) return "há " + dias + " dias";
  return new Date(ts).toLocaleDateString("pt-BR");
}

function collectStudents() {
  const uids = new Set([...Object.keys(PROG), ...Object.keys(AUT)]);
  Object.values(RESP).forEach(porCrise => Object.keys(porCrise || {}).forEach(uid => uids.add(uid)));
  const alunos = [];
  uids.forEach(uid => {
    const p = PROG[uid] || {};
    const email = p.email || (AUT[uid] && AUT[uid].email) || respEmail(uid) || uid;
    if ((email || "").toLowerCase() === TEACHER_EMAIL) return;
    const data = p.data || {};
    let done = 0, total = 0;
    const grupos = GROUPS.map(g => {
      const ok = g.chaves.filter(k => filled(data[k])).length;
      done += ok; total += g.chaves.length;
      return { ok, total: g.chaves.length, pct: Math.round(ok / g.chaves.length * 100) };
    });
    let nResp = 0, nCerto = 0, nCorrig = 0;
    Object.values(RESP).forEach(porCrise => {
      const r = (porCrise || {})[uid];
      if (!r) return;
      nResp++;
      if ("correto" in r) { nCorrig++; if (r.correto === true) nCerto++; }
    });
    alunos.push({ uid, email, data, ts: p.ts || null, grupos,
      pct: total ? Math.round(done / total * 100) : 0, nResp, nCerto, nCorrig });
  });
  alunos.sort((a, b) => b.pct - a.pct || a.email.localeCompare(b.email));
  return alunos;
}
function respEmail(uid) {
  for (const porCrise of Object.values(RESP)) {
    const r = (porCrise || {})[uid];
    if (r && r.email) return r.email;
  }
  return null;
}

function miniBar(pct) {
  return '<div class="pbar" style="min-width:52px;margin-top:4px"><i style="width:' + pct + '%"></i></div>';
}

function detailHtml(a) {
  let html = '<div class="turma-det-grid">';
  GROUPS.forEach(g => {
    html += '<div class="turma-det-grupo"><h4>' + he(g.nome) + "</h4>";
    g.chaves.forEach(k => {
      const v = a.data[k];
      let shown;
      if (v === true) shown = "✓";
      else if (filled(v)) shown = he(String(v).length > 400 ? String(v).slice(0, 400) + "…" : String(v));
      else shown = '<span class="turma-vazio">— em branco</span>';
      html += '<div class="turma-campo"><b>' + he(fieldLabel(k)) + ":</b> " + shown + "</div>";
    });
    html += "</div>";
  });
  return html + "</div>";
}

function render() {
  const root = document.getElementById("prof-turma");
  if (!root) return;
  if (denied) {
    root.innerHTML = '<p style="color:#a33">Sem permissão para ler <code>progresso/</code> — falta a regra de leitura do professor no Firebase.</p>';
    return;
  }
  const alunos = collectStudents();
  if (!alunos.length) { root.innerHTML = "<p>Nenhum aluno com dados ainda.</p>"; return; }

  let rows = "";
  alunos.forEach(a => {
    const cells = a.grupos.map(g =>
      "<td><b>" + g.ok + "</b>/" + g.total + miniBar(g.pct) + "</td>").join("");
    const crises = a.nResp
      ? a.nResp + (a.nCorrig ? " · " + a.nCerto + "✓" : "")
      : "—";
    rows += '<tr class="turma-row' + (openRows.has(a.uid) ? " aberta" : "") + '" data-uid="' + he(a.uid) + '">' +
      '<td class="turma-aluno">' + he(a.email) + "</td>" +
      '<td><b>' + a.pct + "%</b>" + miniBar(a.pct) + "</td>" +
      cells +
      "<td>" + fmtRel(a.ts) + "</td>" +
      "<td>" + crises + "</td></tr>";
    if (openRows.has(a.uid))
      rows += '<tr class="turma-det"><td colspan="10">' + detailHtml(a) + "</td></tr>";
  });

  root.innerHTML =
    '<div class="toolbar" style="margin:10px 0"><button class="btn ghost" id="turma-csv">⬇ CSV da turma</button>' +
    '<span class="hint" style="align-self:center">Clique num aluno para ver o que ele preencheu. Atualiza em tempo real.</span></div>' +
    '<div class="table-wrap"><table class="turma-table"><thead><tr>' +
    "<th>Aluno</th><th>Geral</th>" + SHORT.map(s => "<th>" + s + "</th>").join("") +
    "<th>Última atividade</th><th>Crises</th></tr></thead><tbody>" + rows + "</tbody></table></div>";

  root.querySelectorAll(".turma-row").forEach(tr => tr.addEventListener("click", () => {
    const uid = tr.dataset.uid;
    openRows.has(uid) ? openRows.delete(uid) : openRows.add(uid);
    render();
  }));
  const csv = document.getElementById("turma-csv");
  if (csv) csv.addEventListener("click", () => exportCsv(alunos));
}

function exportCsv(alunos) {
  const esc = v => '"' + String(v == null ? "" : v).replace(/"/g, '""') + '"';
  const head = ["aluno", "geral_pct", ...GROUPS.map(g => g.nome), "ultima_atividade", "crises_respondidas", "acertos"];
  const lines = [head.map(esc).join(";")];
  alunos.forEach(a => lines.push([
    a.email, a.pct, ...a.grupos.map(g => g.ok + "/" + g.total),
    a.ts ? new Date(a.ts).toLocaleString("pt-BR") : "", a.nResp, a.nCerto,
  ].map(esc).join(";")));
  const blob = new Blob(["﻿" + lines.join("\n")], { type: "text/csv;charset=utf-8" });
  const aEl = document.createElement("a");
  aEl.href = URL.createObjectURL(blob);
  aEl.download = "acompanhamento-turma.csv";
  aEl.click();
  URL.revokeObjectURL(aEl.href);
}
