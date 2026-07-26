// Pesquisa de satisfação — curso preparatório + plataforma (comitê UNEA).
// Aluno: responde uma vez (pode revisar). Professor: abre/fecha, vê médias e exporta CSV.
// Respostas gravadas SEM nome/e-mail (só o uid como chave, para 1 resposta por aluno).
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";
import { getDatabase, ref, get, set, onValue } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-database.js";

const auth = getAuth();
const db = getDatabase();
const TEACHER_EMAIL = "aluizio@aluizio.education";
const CID = "unea-ymunb-2026";
const he = s => String(s == null ? "" : s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

const RECURSOS = [
  ["r_guia", "Guia do Delegado — UNEA (PDF)"],
  ["r_curso", "Curso preparatório UNEA (PDF) e slides"],
  ["r_briefing", "Briefing da UNEA na página (tópicos e documentos)"],
  ["r_progresso", "Meu progresso (etapas do curso)"],
  ["r_delegacao", "Sua delegação (war-room e envio de documentos)"],
  ["r_correcao", "Correção/feedback do Position Paper"],
  ["r_glossario", "Glossário essencial"],
  ["r_mocoes", "Cheat sheet de moções e pontos"],
  ["r_blocos", "Mapa de blocos e discurso de abertura"],
  ["r_checklist", "Checklist pré-simulação e rubrica de autoavaliação"],
];

// tipo: texto1 (linha), radio, likert (1-5), check2 (até 2), grade (recursos), nota10, texto (livre)
const BLOCOS = [
  { titulo: "Sobre você", nota: "Este bloco é opcional — a pesquisa não grava seu nome nem seu e-mail.", itens: [
    { id: "pais", tipo: "texto1", opcional: true, rotulo: "Qual país/delegação você representou na UNEA?" },
    { id: "exp", tipo: "radio", opcional: true, rotulo: "Você já tinha participado de alguma simulação Model UN antes deste curso?",
      opcoes: ["Não, esta foi a primeira", "Sim, 1 vez", "Sim, 2 vezes ou mais"] },
  ]},
  { titulo: "O curso preparatório", escala: true, itens: [
    { id: "c_preparo", tipo: "likert", rotulo: "As aulas do curso me prepararam bem para atuar como delegado(a) na UNEA." },
    { id: "c_unea", tipo: "likert", rotulo: "Entendi com clareza o que é a UNEA e como ela funciona dentro da ONU." },
    { id: "c_ritmo", tipo: "likert", rotulo: "O ritmo das aulas foi adequado (nem rápido demais, nem lento demais)." },
    { id: "c_topA", tipo: "likert", rotulo: "Ao final do curso, eu me sentia preparado(a) para debater o Tópico A — Extração de petróleo na Margem Equatorial (Foz do Amazonas)." },
    { id: "c_topB", tipo: "likert", rotulo: "Ao final do curso, eu me sentia preparado(a) para debater o Tópico B — Mineração responsável de minerais críticos e terras raras." },
    { id: "c_melhor", tipo: "check2", rotulo: "Qual parte do curso mais contribuiu para o seu preparo? (marque até 2)",
      opcoes: ["Fundamentos da ONU e da UNEA", "Estudo dos dois tópicos do comitê", "Como escrever o Position Paper", "Como escrever a Draft Resolution", "Moções, pontos e procedimento do debate", "Discurso de abertura e mapa de blocos"] },
    { id: "c_faltou", tipo: "texto", opcional: true, rotulo: "O que faltou ou poderia ter sido mais aprofundado no curso?" },
  ]},
  { titulo: "O professor e as aulas", escala: true, itens: [
    { id: "p_dominio", tipo: "likert", rotulo: "O professor demonstrou domínio do assunto (ONU, UNEA, geopolítica e os temas do comitê)." },
    { id: "p_conducao", tipo: "likert", rotulo: "O professor demonstrou domínio da aula (organização, uso do tempo e condução da turma)." },
    { id: "p_pertinencia", tipo: "likert", rotulo: "Os assuntos ministrados foram pertinentes — tudo o que foi ensinado serviu para o comitê e a simulação." },
    { id: "p_clareza", tipo: "likert", rotulo: "As explicações foram claras e os exemplos ajudaram a entender os temas." },
    { id: "p_duvidas", tipo: "likert", rotulo: "O professor respondeu às dúvidas de forma satisfatória e deu espaço para a turma participar." },
  ]},
  { titulo: "O site onu.aluizio.education", itens: [
    { id: "s_freq", tipo: "radio", rotulo: "Com que frequência você usou o site durante o curso?",
      opcoes: ["Quase todos os dias", "Algumas vezes por semana", "Só perto das entregas/simulação", "Quase não usei"] },
    { id: "s_grade", tipo: "grade", rotulo: "Avalie cada recurso do site que você usou:", legenda: "1 = não ajudou · 5 = ajudou muito · N/U = não usei" },
    { id: "s_facil", tipo: "likert", rotulo: "Foi fácil criar a conta e navegar pela Área do Delegado.", legenda: "1 = discordo totalmente · 5 = concordo totalmente" },
    { id: "s_disp", tipo: "radio", rotulo: "Você acessou o site principalmente por:",
      opcoes: ["Celular", "Computador/notebook", "Tablet", "Os dois (celular e computador)"] },
    { id: "s_problema", tipo: "texto", opcional: true, rotulo: "Teve alguma dificuldade técnica no site (login, envio de documentos etc.)? Se sim, conte o que aconteceu." },
  ]},
  { titulo: "Avaliação geral", itens: [
    { id: "g_notacurso", tipo: "nota10", rotulo: "Que nota geral você dá para o curso preparatório?" },
    { id: "g_notasite", tipo: "nota10", rotulo: "Que nota geral você dá para o site/plataforma do delegado?" },
    { id: "g_recomenda", tipo: "radio", rotulo: "Você recomendaria este curso a um(a) colega que vai participar de um Model UN?",
      opcoes: ["Com certeza sim", "Provavelmente sim", "Não sei", "Provavelmente não", "Com certeza não"] },
    { id: "g_manter", tipo: "texto", opcional: true, rotulo: "O que devemos MANTER nas próximas edições?" },
    { id: "g_mudar", tipo: "texto", opcional: true, rotulo: "O que devemos MUDAR ou acrescentar nas próximas edições?" },
    { id: "g_coment", tipo: "texto", opcional: true, rotulo: "Quer deixar algum comentário para o professor? (opcional)" },
  ]},
];
const ITENS = BLOCOS.flatMap(b => b.itens);
const rotuloDe = id => { const i = ITENS.find(x => x.id === id); return i ? i.rotulo : id; };

let IS_TEACHER = false, INIT = false, ATIVA = false, MINHA = undefined, MEU_CID = null, TODAS = {};

onAuthStateChanged(auth, user => {
  if (!user) return;
  IS_TEACHER = (user.email || "").toLowerCase() === TEACHER_EMAIL;
  if (INIT) return; INIT = true;
  onValue(ref(db, "config/pesquisaUNEA"), s => { ATIVA = s.val() === true; renderAluno(); if (IS_TEACHER) renderProf(); });
  // Comitê do aluno: registros antigos sem comiteId são da UNEA (padrão da Fase 1).
  onValue(ref(db, "minhaDelegacao/" + user.uid), s => { const v = s.val(); MEU_CID = v ? (v.comiteId || CID) : null; renderAluno(); }, () => { MEU_CID = null; renderAluno(); });
  onValue(ref(db, "pesquisa/" + CID + "/" + user.uid), s => { MINHA = s.val(); renderAluno(); }, () => { MINHA = null; renderAluno(); });
  if (IS_TEACHER) onValue(ref(db, "pesquisa/" + CID), s => { TODAS = s.val() || {}; renderProf(); });
});

/* ---------------- ALUNO: formulário ---------------- */
function renderAluno() {
  const root = document.getElementById("pesquisa-aluno"); if (!root || IS_TEACHER) return;
  if (MEU_CID && MEU_CID !== CID) { root.innerHTML = '<p class="section-sub">Esta pesquisa é para o comitê UNEA. A pesquisa do seu comitê será aberta em breve.</p>'; return; }
  if (!ATIVA && !MINHA) { root.innerHTML = '<p class="section-sub">A pesquisa ainda não está aberta. O professor libera aqui ao final do curso.</p>'; return; }
  if (MINHA && !root.dataset.editando) {
    root.innerHTML = '<div class="pq-ok">✅ <b>Resposta enviada — obrigado!</b> Suas respostas foram registradas' +
      (MINHA.enviadaEm ? " em " + new Date(MINHA.enviadaEm).toLocaleString("pt-BR") : "") + "." +
      (ATIVA ? ' <button class="btn ghost" id="pq-editar" style="margin-left:8px">Revisar respostas</button>' : "") + "</div>";
    return;
  }
  root.innerHTML = '<form id="pq-form">' + BLOCOS.map((b, bi) =>
    '<div class="pq-bloco"><div class="pq-bloco-num">Bloco ' + (bi + 1) + "</div><h3>" + he(b.titulo) + "</h3>" +
    (b.nota ? '<p class="pq-nota">' + he(b.nota) + "</p>" : "") +
    (b.escala ? '<p class="pq-nota">Escala: 1 = discordo totalmente · 5 = concordo totalmente</p>' : "") +
    b.itens.map(campo).join("") + "</div>").join("") +
    '<div class="toolbar"><button class="btn primary" type="submit">Enviar respostas</button> <span class="pq-status" id="pq-status"></span></div></form>';
  preencher();
  document.getElementById("pq-form").addEventListener("submit", enviar);
}

function campo(it) {
  const req = it.opcional ? "" : ' <span class="pq-req">*</span>';
  let body = "";
  if (it.tipo === "texto1") body = '<input type="text" maxlength="120" data-q="' + it.id + '">';
  else if (it.tipo === "texto") body = '<textarea rows="3" maxlength="2000" data-q="' + it.id + '"></textarea>';
  else if (it.tipo === "radio") body = '<div class="pq-opts">' + it.opcoes.map((o, i) =>
    '<label class="pq-opt"><input type="radio" name="' + it.id + '" value="' + i + '"> ' + he(o) + "</label>").join("") + "</div>";
  else if (it.tipo === "check2") body = '<div class="pq-opts">' + it.opcoes.map((o, i) =>
    '<label class="pq-opt"><input type="checkbox" name="' + it.id + '" value="' + i + '"> ' + he(o) + "</label>").join("") + "</div>";
  else if (it.tipo === "likert") body = escala(it.id, 1, 5);
  else if (it.tipo === "nota10") body = escala(it.id, 0, 10);
  else if (it.tipo === "grade") body = '<p class="pq-nota">' + he(it.legenda) + '</p><div class="pq-grade">' + RECURSOS.map(([rid, nome]) =>
    '<div class="pq-grade-row"><span class="pq-grade-nome">' + he(nome) + '</span><span class="pq-escala">' +
    [1, 2, 3, 4, 5].map(n => '<label><input type="radio" name="' + rid + '" value="' + n + '"><span>' + n + "</span></label>").join("") +
    '<label><input type="radio" name="' + rid + '" value="nu"><span>N/U</span></label></span></div>').join("") + "</div>";
  return '<div class="pq-item" data-item="' + it.id + '"><p class="pq-perg">' + he(it.rotulo) + req + "</p>" + (it.legenda && it.tipo !== "grade" ? '<p class="pq-nota">' + he(it.legenda) + "</p>" : "") + body + "</div>";
}
const escala = (id, de, ate) => { let h = '<span class="pq-escala">'; for (let n = de; n <= ate; n++) h += '<label><input type="radio" name="' + id + '" value="' + n + '"><span>' + n + "</span></label>"; return h + "</span>"; };

// Repõe respostas já enviadas quando o aluno clica em "Revisar".
function preencher() {
  const r = (MINHA && MINHA.respostas) || {};
  document.querySelectorAll("#pq-form [data-q]").forEach(el => { if (r[el.dataset.q] != null) el.value = r[el.dataset.q]; });
  document.querySelectorAll('#pq-form input[type=radio], #pq-form input[type=checkbox]').forEach(el => {
    const v = r[el.name];
    if (el.type === "radio") el.checked = String(v) === el.value;
    else el.checked = Array.isArray(v) && v.includes(+el.value);
  });
}

async function enviar(e) {
  e.preventDefault();
  const r = {}, faltam = [];
  for (const it of ITENS) {
    if (it.tipo === "texto1" || it.tipo === "texto") {
      const v = (document.querySelector('[data-q="' + it.id + '"]').value || "").trim();
      if (v) r[it.id] = v; else if (!it.opcional) faltam.push(it.id);
    } else if (it.tipo === "check2") {
      const sel = [...document.querySelectorAll('input[name="' + it.id + '"]:checked')].map(x => +x.value);
      if (sel.length > 2) { marcar([it.id]); alert("Na pergunta “" + it.rotulo + "”, marque no máximo 2 opções."); return; }
      if (sel.length) r[it.id] = sel; else if (!it.opcional) faltam.push(it.id);
    } else if (it.tipo === "grade") {
      const g = {};
      for (const [rid] of RECURSOS) { const s = document.querySelector('input[name="' + rid + '"]:checked'); if (s) g[rid] = s.value === "nu" ? "nu" : +s.value; }
      if (Object.keys(g).length) r[it.id] = g; else if (!it.opcional) faltam.push(it.id);
    } else {
      const s = document.querySelector('input[name="' + it.id + '"]:checked');
      if (s) r[it.id] = +s.value; else if (!it.opcional) faltam.push(it.id);
    }
  }
  if (faltam.length) { marcar(faltam); alert("Faltou responder " + faltam.length + " pergunta(s) obrigatória(s) — estão destacadas em dourado."); return; }
  const st = document.getElementById("pq-status"); st.textContent = "Enviando…";
  try {
    await set(ref(db, "pesquisa/" + CID + "/" + auth.currentUser.uid), { respostas: r, enviadaEm: Date.now() });
    const root = document.getElementById("pesquisa-aluno"); delete root.dataset.editando;
  } catch (err) { st.textContent = ""; alert("Não consegui enviar: " + (err.code || err.message)); }
}
function marcar(ids) {
  document.querySelectorAll(".pq-item").forEach(el => el.classList.toggle("pq-falta", ids.includes(el.dataset.item)));
  const alvo = document.querySelector(".pq-item.pq-falta"); if (alvo) alvo.scrollIntoView({ behavior: "smooth", block: "center" });
}
document.addEventListener("click", e => {
  if (e.target.id === "pq-editar") { const root = document.getElementById("pesquisa-aluno"); root.dataset.editando = "1"; renderAluno(); }
});

/* ---------------- PROFESSOR: resultados ---------------- */
function renderProf() {
  const root = document.getElementById("pesquisa-prof"); if (!root) return;
  const respostas = Object.values(TODAS).map(x => (x && x.respostas) || {});
  const n = respostas.length;
  const med = id => { const vs = respostas.map(r => r[id]).filter(v => typeof v === "number"); return vs.length ? (vs.reduce((a, b) => a + b, 0) / vs.length).toFixed(1) : "—"; };
  const dist = it => { const c = it.opcoes.map(() => 0); respostas.forEach(r => { const v = r[it.id]; if (typeof v === "number") c[v]++; else if (Array.isArray(v)) v.forEach(i => c[i]++); }); return it.opcoes.map((o, i) => "<tr><td>" + he(o) + "</td><td><b>" + c[i] + "</b></td></tr>").join(""); };
  const medRec = rid => { const vs = respostas.map(r => r.s_grade && r.s_grade[rid]).filter(v => typeof v === "number"); const nu = respostas.filter(r => r.s_grade && r.s_grade[rid] === "nu").length; return "<tr><td>" + he(RECURSOS.find(x => x[0] === rid)[1]) + "</td><td><b>" + (vs.length ? (vs.reduce((a, b) => a + b, 0) / vs.length).toFixed(1) : "—") + "</b></td><td>" + vs.length + "</td><td>" + nu + "</td></tr>"; };
  const abertas = id => { const vs = respostas.map(r => r[id]).filter(v => typeof v === "string" && v.trim()); return vs.length ? "<ul>" + vs.map(v => "<li>" + he(v) + "</li>").join("") + "</ul>" : '<p class="section-sub">Nenhuma resposta.</p>'; };
  const likerts = ITENS.filter(i => i.tipo === "likert" || i.tipo === "nota10");
  root.innerHTML =
    '<div class="prof-bar"><label class="prof-switch"><input type="checkbox" id="pq-toggle"' + (ATIVA ? " checked" : "") + "> Pesquisa aberta para os alunos</label>" +
    '<span><b>' + n + "</b> resposta(s) recebida(s) " +
    (n ? '<button class="btn ghost" id="pq-export" style="margin-left:8px">⬇ Exportar CSV</button>' : "") + "</span></div>" +
    (!n ? '<p class="section-sub">Nenhuma resposta ainda. Abra a pesquisa e avise a turma.</p>' :
      '<h3 style="margin-top:18px">Médias (escala 1–5 e notas 0–10)</h3><table class="prof-tab"><thead><tr><th>Pergunta</th><th>Média</th></tr></thead><tbody>' +
      likerts.map(i => "<tr><td>" + he(i.rotulo) + "</td><td><b>" + med(i.id) + "</b></td></tr>").join("") + "</tbody></table>" +
      '<h3 style="margin-top:18px">Recursos do site (média 1–5 · respostas · não usaram)</h3><table class="prof-tab"><thead><tr><th>Recurso</th><th>Média</th><th>Resp.</th><th>N/U</th></tr></thead><tbody>' +
      RECURSOS.map(([rid]) => medRec(rid)).join("") + "</tbody></table>" +
      ITENS.filter(i => i.tipo === "radio").map(i => '<h3 style="margin-top:18px">' + he(i.rotulo) + '</h3><table class="prof-tab"><tbody>' + dist(i) + "</tbody></table>").join("") +
      '<h3 style="margin-top:18px">' + he(rotuloDe("c_melhor")) + '</h3><table class="prof-tab"><tbody>' + dist(ITENS.find(i => i.id === "c_melhor")) + "</tbody></table>" +
      ITENS.filter(i => i.tipo === "texto" || i.tipo === "texto1").map(i => '<h3 style="margin-top:18px">' + he(i.rotulo) + "</h3>" + abertas(i.id)).join(""));
}

document.addEventListener("change", e => { if (e.target.id === "pq-toggle") set(ref(db, "config/pesquisaUNEA"), e.target.checked).catch(err => alert(err.message)); });

document.addEventListener("click", e => {
  if (e.target.id !== "pq-export") return;
  const cols = [];
  for (const it of ITENS) { if (it.tipo === "grade") RECURSOS.forEach(([rid, nome]) => cols.push([rid, "Recurso: " + nome])); else cols.push([it.id, it.rotulo]); }
  const rows = [["#", "Enviada em", ...cols.map(c => c[1])]];
  Object.values(TODAS).forEach((x, i) => {
    const r = (x && x.respostas) || {};
    rows.push([i + 1, x.enviadaEm ? new Date(x.enviadaEm).toLocaleString("pt-BR") : "", ...cols.map(([id]) => {
      const it = ITENS.find(q => q.id === id);
      let v = it ? r[id] : (r.s_grade || {})[id];
      if (v == null) return "";
      if (it && (it.tipo === "radio")) return it.opcoes[v] || v;
      if (it && it.tipo === "check2") return v.map(ix => it.opcoes[ix]).join(" | ");
      return v === "nu" ? "não usei" : v;
    })]);
  });
  const csv = rows.map(r => r.map(v => '"' + String(v == null ? "" : v).replace(/"/g, '""') + '"').join(",")).join("\r\n");
  const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob), a = document.createElement("a");
  a.href = url; a.download = "pesquisa-satisfacao-unea.csv"; document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 4000);
});
