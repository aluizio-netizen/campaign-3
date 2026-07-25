// Sala de Crise ao vivo — Fase 3 da plataforma (simulação com Zoom).
// Fluxo: professor lança crise (título/narrativa/prazo) → alunos do comitê veem
// na hora com cronômetro → deliberam em salas do Zoom (delegação = grupo) e
// registram a solução da delegação → professor abre o PLENÁRIO (todas as
// soluções ficam visíveis a todos) → encerra e arquiva a rodada.
// Dados: simulacao/<comiteId>/{crise, solucoes/<delegacaoId>, historico/<hid>}
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";
import { getDatabase, ref, get, set, update, remove, onValue, push } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-database.js";

const auth = getAuth();
const db = getDatabase();
const TEACHER_EMAIL = "aluizio@aluizio.education";
const COMITES = {
  "unea-ymunb-2026": { sigla: "UNEA", nome: "UNEA — YMUN Brasil 2026" },
  "cnd-ymunb-2026":  { sigla: "CND",  nome: "CND — YMUN Brasil 2026" },
};
const COMITE_PADRAO = "unea-ymunb-2026";

const he = s => String(s == null ? "" : s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const fmtHora = ms => ms ? new Date(ms).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }) : "—";

let IS_TEACHER = false, INIT = false, UID = null;
let CRISE = {};      // crise ao vivo por comitê: { cid: {...} }
let SOLUCOES = {};   // soluções por comitê (registra o que der para ler)
let DELEG = {};      // delegações por comitê (nomes dos países)
let HIST = {};       // histórico por comitê (só professor)
let MINHA = null;    // { comiteId, delegacaoId } do aluno
let SIM_COMITE = COMITE_PADRAO; // aba ativa do professor
let TICK = null;     // timer do cronômetro

onAuthStateChanged(auth, user => {
  if (!user) return;
  UID = user.uid;
  IS_TEACHER = (user.email || "").toLowerCase() === TEACHER_EMAIL;
  if (INIT) return; INIT = true;

  Object.keys(COMITES).forEach(cid => {
    onValue(ref(db, "simulacao/" + cid + "/crise"), s => { CRISE[cid] = s.val(); render(); }, () => {});
    onValue(ref(db, "delegacoes/" + cid), s => { DELEG[cid] = s.val() || {}; render(); }, () => {});
    // Soluções: o aluno só consegue ler no plenário (ou a da própria delegação,
    // assinada em separado); o professor lê sempre. Erro de permissão é normal.
    onValue(ref(db, "simulacao/" + cid + "/solucoes"), s => { SOLUCOES[cid] = s.val() || {}; render(); }, () => { SOLUCOES[cid] = SOLUCOES[cid] || {}; });
    if (IS_TEACHER) onValue(ref(db, "simulacao/" + cid + "/historico"), s => { HIST[cid] = s.val() || {}; renderProf(); }, () => {});
  });
  if (!IS_TEACHER) {
    onValue(ref(db, "minhaDelegacao/" + UID), s => { MINHA = s.val(); assinaMinhaSolucao(); render(); }, () => {});
  }

  // cronômetro global: re-renderiza a cada segundo enquanto houver crise no ar
  TICK = setInterval(() => {
    const rodando = Object.values(CRISE).some(c => c && c.status === "no_ar");
    if (rodando) atualizaRelogios();
  }, 1000);
});

// Aluno assina a solução da própria delegação (para ver o texto salvo do grupo
// mesmo fora do plenário — a regra do banco permite ao membro).
let SUB_SOL = null, MINHA_SOL = null;
function assinaMinhaSolucao() {
  const cid = MINHA && MINHA.comiteId, del = MINHA && MINHA.delegacaoId;
  if (!cid || !del) { MINHA_SOL = null; return; }
  const chave = cid + "/" + del;
  if (SUB_SOL === chave) return;
  SUB_SOL = chave;
  onValue(ref(db, "simulacao/" + cid + "/solucoes/" + del), s => { MINHA_SOL = s.val(); render(); }, () => {});
}

function render() { renderAluno(); renderProf(); }

/* ---------- cronômetro ---------- */
function restante(c) {
  if (!c || !c.fimEm) return null;
  return Math.max(0, Math.floor((c.fimEm - Date.now()) / 1000));
}
function relogio(seg) {
  if (seg == null) return "";
  const m = Math.floor(seg / 60), s = seg % 60;
  return String(m).padStart(2, "0") + ":" + String(s).padStart(2, "0");
}
function atualizaRelogios() {
  document.querySelectorAll("[data-relogio]").forEach(el => {
    const c = CRISE[el.dataset.relogio];
    const r = restante(c);
    if (r == null) return;
    el.textContent = r > 0 ? relogio(r) : "TEMPO ESGOTADO";
    el.classList.toggle("sc-zero", r === 0);
    el.classList.toggle("sc-final", r > 0 && r <= 120);
  });
}

/* =====================  ALUNO  ===================== */
function renderAluno() {
  const root = document.getElementById("sala-crise-body");
  if (!root || IS_TEACHER) return;

  const meuCid = (MINHA && MINHA.comiteId) || null;
  // mostra a crise do comitê do aluno; sem delegação, mostra o que estiver no ar
  const cids = meuCid ? [meuCid] : Object.keys(COMITES);
  const vivas = cids.filter(cid => CRISE[cid] && CRISE[cid].status !== "encerrada" && CRISE[cid].status);
  if (!vivas.length) {
    root.innerHTML = '<p class="section-sub">Nenhuma crise ao vivo agora. Quando o professor lançar uma, ela aparece aqui em tempo real — fique de olho durante a simulação.</p>';
    return;
  }
  root.innerHTML = vivas.map(cid => {
    const c = CRISE[cid], com = COMITES[cid] || { sigla: cid, nome: cid };
    const plenario = c.status === "plenario";
    const cab =
      '<div class="sc-head"><span class="sc-badge' + (plenario ? " sc-badge-plen" : "") + '">' +
      (plenario ? "📣 PLENÁRIO ABERTO" : "🚨 CRISE AO VIVO") + "</span>" +
      '<span class="tag">' + he(com.sigla) + "</span>" +
      (c.status === "no_ar" ? '<span class="sc-relogio" data-relogio="' + cid + '">' + relogio(restante(c)) + "</span>" : "") +
      "</div>" +
      "<h3>" + he(c.titulo) + '</h3><p class="sc-texto">' + he(c.texto) + "</p>";

    let corpo = "";
    if (!plenario) {
      corpo += '<div class="sc-instrucao">👥 Vocês serão divididos em <b>salas no Zoom</b> por delegação. Discutam a crise no grupo e registrem abaixo a solução da delegação <b>antes de voltar ao plenário</b> (prazo: ' + (c.prazoMin || "—") + " min, até " + fmtHora(c.fimEm) + ").</div>";
      if (MINHA && MINHA.delegacaoId && meuCid === cid) {
        const pais = ((DELEG[cid] || {})[MINHA.delegacaoId] || {}).pais || MINHA.delegacaoId;
        corpo +=
          '<h4 style="margin:14px 0 4px">Solução da delegação: ' + he(pais) + "</h4>" +
          '<textarea id="sc-sol-ta" rows="6" placeholder="A posição e a proposta do grupo para gerenciar esta crise...">' + he((MINHA_SOL && MINHA_SOL.texto) || "") + "</textarea>" +
          '<div class="toolbar"><button class="btn gold" id="sc-sol-salvar" data-cid="' + cid + '">💾 Registrar solução do grupo</button>' +
          '<span id="sc-sol-status" class="dg-status"></span></div>' +
          (MINHA_SOL && MINHA_SOL.ts ? '<p class="hint">Última gravação: ' + fmtHora(MINHA_SOL.ts) + " — qualquer membro da delegação pode atualizar até o professor abrir o plenário.</p>" : "");
      } else if (meuCid === cid) {
        corpo += '<p class="hint">Você ainda não tem delegação — escolha seu país na aba <a href="#delegacao">Delegação</a> para registrar solução.</p>';
      } else {
        corpo += '<p class="hint">Crise do comitê ' + he(com.sigla) + ". Escolha sua delegação na aba <a href=\"#delegacao\">Delegação</a> para participar.</p>";
      }
    } else {
      const sols = Object.entries(SOLUCOES[cid] || {});
      corpo += '<div class="sc-instrucao">📣 O plenário está aberto: estas são as soluções que as delegações trouxeram das salas. Acompanhe a discussão.</div>';
      corpo += sols.length
        ? sols.sort((a, b) => (a[1].ts || 0) - (b[1].ts || 0)).map(([del, s]) => {
            const pais = ((DELEG[cid] || {})[del] || {}).pais || del;
            return '<div class="sc-solucao"><b>' + he(pais) + "</b><p>" + he(s.texto) + "</p></div>";
          }).join("")
        : '<p class="section-sub">Nenhuma solução registrada.</p>';
    }
    return '<div class="sc-card' + (plenario ? " sc-card-plen" : "") + '">' + cab + corpo + "</div>";
  }).join("");
}

document.addEventListener("click", async e => {
  if (e.target.id !== "sc-sol-salvar") return;
  const cid = e.target.dataset.cid, del = MINHA && MINHA.delegacaoId;
  if (!del) return;
  const ta = document.getElementById("sc-sol-ta");
  const texto = ((ta && ta.value) || "").trim();
  const st = document.getElementById("sc-sol-status");
  const diga = (t, cor) => { if (st) { st.textContent = t; st.style.color = cor; } };
  if (!texto) { diga("Escreva a solução antes de registrar.", "#b3261e"); return; }
  try {
    await set(ref(db, "simulacao/" + cid + "/solucoes/" + del), { texto, autorUid: UID, ts: Date.now() });
    diga("Solução registrada ✓ — o grupo pode atualizar até o plenário abrir.", "#1E8E5A");
  } catch (err) {
    diga(/permission/i.test(err.code || err.message || "")
      ? "⚠ Não deu — o plenário já abriu (ou o prazo da crise acabou). Traga a solução de viva voz."
      : "⚠ Erro: " + (err.code || err.message), "#b3261e");
  }
});

/* =====================  PROFESSOR  ===================== */
function renderProf() {
  const root = document.getElementById("sim-prof");
  if (!root || !IS_TEACHER) return;
  const cid = SIM_COMITE, com = COMITES[cid], c = CRISE[cid];

  const tabs = '<div class="sc-tabs">' + Object.entries(COMITES).map(([id, x]) =>
    '<button class="dg-tab' + (id === cid ? " ativa" : "") + '" data-simtab="' + id + '">' + he(x.sigla) + "</button>").join("") + "</div>";

  let corpo = "";
  if (!c || c.status === "encerrada" || !c.status) {
    corpo =
      '<div class="mt-form"><h3 style="margin:.2rem 0 .6rem">🚨 Lançar crise ao vivo — ' + he(com.sigla) + "</h3>" +
      '<div class="mt-linha"><input type="text" id="sc-titulo" placeholder="Título da crise (ex.: Derramamento na Margem Equatorial)"></div>' +
      '<div class="mt-linha"><textarea id="sc-texto" rows="5" style="flex:1 1 100%;padding:10px;border-radius:8px;border:1px solid #2c3e5c;background:#0d1626;color:#eaf1fb" placeholder="Narrativa da crise: o que aconteceu, dados-chave, o que se espera das delegações..."></textarea></div>' +
      '<div class="mt-linha"><label class="sc-prazo">Prazo de deliberação: <input type="number" id="sc-prazo" min="3" max="120" value="20" style="width:80px"> min</label>' +
      '<button class="btn primary" id="sc-lancar">🚨 Lançar para a turma</button><span id="sc-prof-status" class="dg-status"></span></div></div>';
  } else {
    const sols = SOLUCOES[cid] || {};
    const dels = DELEG[cid] || {};
    // delegações com delegado (as que de fato têm gente para deliberar)
    const ativas = Object.entries(dels).filter(([, d]) => d.membros && Object.keys(d.membros).length);
    const linhas = ativas.sort((a, b) => (a[1].pais || "").localeCompare(b[1].pais || "")).map(([del, d]) => {
      const s = sols[del];
      return "<tr><td><b>" + he(d.pais || del) + "</b></td><td>" +
        (s ? '<span class="dg-badge st-ok">entregue ' + fmtHora(s.ts) + "</span>" : '<span class="dg-badge">aguardando</span>') +
        "</td><td>" + (s ? he((s.texto || "").slice(0, 90)) + ((s.texto || "").length > 90 ? "…" : "") : "—") + "</td></tr>";
    }).join("");
    const extras = Object.keys(sols).filter(del => !dels[del]).map(del =>
      "<tr><td><b>" + he(del) + '</b> <span class="dg-badge st-orfa">fora da lista</span></td><td>entregue</td><td>' + he((sols[del].texto || "").slice(0, 90)) + "</td></tr>").join("");

    corpo =
      '<div class="sc-card"><div class="sc-head">' +
      '<span class="sc-badge' + (c.status === "plenario" ? " sc-badge-plen" : "") + '">' + (c.status === "plenario" ? "📣 PLENÁRIO ABERTO" : "🚨 NO AR") + "</span>" +
      (c.status === "no_ar" ? '<span class="sc-relogio" data-relogio="' + cid + '">' + relogio(restante(c)) + "</span>" : "") +
      "</div><h3>" + he(c.titulo) + '</h3><p class="sc-texto">' + he(c.texto) + "</p>" +
      '<p class="hint">Lançada ' + fmtHora(c.lancadaEm) + " · prazo " + (c.prazoMin || "?") + " min (até " + fmtHora(c.fimEm) + ") · " + Object.keys(sols).length + "/" + ativas.length + " soluções entregues</p>" +
      '<div class="table-wrap"><table class="prof-tab"><thead><tr><th>Delegação</th><th>Solução</th><th>Prévia</th></tr></thead><tbody>' +
      (linhas + extras || '<tr><td colspan="3">Nenhuma delegação com delegado ainda.</td></tr>') + "</tbody></table></div>" +
      '<div class="toolbar" style="margin-top:12px">' +
      (c.status === "no_ar"
        ? '<button class="btn gold" id="sc-plenario">📣 Abrir plenário (todos veem as soluções)</button>'
        : "") +
      '<button class="btn ghost" id="sc-encerrar">🗄 Encerrar e arquivar</button>' +
      '<span id="sc-prof-status" class="dg-status"></span></div></div>';
  }

  // histórico
  const hist = Object.entries(HIST[cid] || {}).sort((a, b) => (b[1].encerradaEm || 0) - (a[1].encerradaEm || 0));
  const histHtml = hist.length
    ? '<h3 style="margin-top:22px">Rodadas arquivadas — ' + he(com.sigla) + "</h3>" + hist.map(([hid, h]) => {
        const n = Object.keys(h.solucoes || {}).length;
        return '<div class="prof-item"><div class="prof-head"><b>' + he((h.crise && h.crise.titulo) || hid) + "</b> " +
          '<span class="hint">' + (h.encerradaEm ? new Date(h.encerradaEm).toLocaleString("pt-BR") : "") + " · " + n + " soluções</span>" +
          ' <button class="btn ghost sc-hist-ver" data-hid="' + hid + '">Ver</button>' +
          ' <button class="btn ghost sc-hist-del" data-hid="' + hid + '">Excluir</button></div>' +
          '<div class="sc-hist-box" id="sc-hist-' + hid + '" hidden></div></div>';
      }).join("")
    : "";

  root.innerHTML = tabs + corpo + histHtml;
}

document.addEventListener("click", async e => {
  const tab = e.target.closest("[data-simtab]");
  if (tab) { SIM_COMITE = tab.dataset.simtab; renderProf(); return; }
  if (!IS_TEACHER) return;
  const cid = SIM_COMITE;
  const st = document.getElementById("sc-prof-status");
  const diga = (t, cor) => { if (st) { st.textContent = t; st.style.color = cor; } };

  if (e.target.id === "sc-lancar") {
    const titulo = (document.getElementById("sc-titulo") || {}).value || "";
    const texto = (document.getElementById("sc-texto") || {}).value || "";
    const prazoMin = Math.max(3, Math.min(120, Number((document.getElementById("sc-prazo") || {}).value) || 20));
    if (!titulo.trim() || !texto.trim()) { diga("Preencha título e narrativa.", "#b3261e"); return; }
    if (!confirm("Lançar a crise AO VIVO para o comitê " + COMITES[cid].sigla + "? Todos os alunos do comitê veem na hora.")) return;
    try {
      await remove(ref(db, "simulacao/" + cid + "/solucoes")); // limpa sobras
      await set(ref(db, "simulacao/" + cid + "/crise"), {
        titulo: titulo.trim(), texto: texto.trim(), prazoMin,
        lancadaEm: Date.now(), fimEm: Date.now() + prazoMin * 60000, status: "no_ar",
      });
    } catch (err) { diga("Erro: " + (err.code || err.message), "#b3261e"); }
    return;
  }
  if (e.target.id === "sc-plenario") {
    if (!confirm("Abrir o plenário? As soluções ficam visíveis para TODOS os alunos do comitê e as delegações não podem mais editar.")) return;
    try { await update(ref(db, "simulacao/" + cid + "/crise"), { status: "plenario" }); }
    catch (err) { diga("Erro: " + (err.code || err.message), "#b3261e"); }
    return;
  }
  if (e.target.id === "sc-encerrar") {
    if (!confirm("Encerrar a rodada e arquivar no histórico?")) return;
    try {
      const c = (await get(ref(db, "simulacao/" + cid + "/crise"))).val();
      const sols = (await get(ref(db, "simulacao/" + cid + "/solucoes"))).val() || {};
      if (c) await set(push(ref(db, "simulacao/" + cid + "/historico")), { crise: c, solucoes: sols, encerradaEm: Date.now() });
      await remove(ref(db, "simulacao/" + cid + "/crise"));
      await remove(ref(db, "simulacao/" + cid + "/solucoes"));
    } catch (err) { diga("Erro: " + (err.code || err.message), "#b3261e"); }
    return;
  }
  const ver = e.target.closest(".sc-hist-ver");
  if (ver) {
    const hid = ver.dataset.hid, box = document.getElementById("sc-hist-" + hid);
    if (!box) return;
    if (!box.hidden) { box.hidden = true; return; }
    const h = (HIST[cid] || {})[hid] || {};
    const dels = DELEG[cid] || {};
    box.hidden = false;
    box.innerHTML = '<p class="sc-texto" style="margin-top:8px">' + he((h.crise && h.crise.texto) || "") + "</p>" +
      Object.entries(h.solucoes || {}).map(([del, s]) =>
        '<div class="sc-solucao"><b>' + he((dels[del] || {}).pais || del) + "</b><p>" + he(s.texto) + "</p></div>").join("");
    return;
  }
  const hdel = e.target.closest(".sc-hist-del");
  if (hdel) {
    if (confirm("Excluir esta rodada do histórico? (não tem volta)")) {
      try { await remove(ref(db, "simulacao/" + cid + "/historico/" + hdel.dataset.hid)); } catch (err) { alert(err.message); }
    }
  }
});
