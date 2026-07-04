/* ============================================================
   ONU / Model UN — Aluizio Educação
   Conteúdo + interatividade (sem backend; salva em localStorage).
   ============================================================ */
"use strict";

/* ----------------------------- CONTEÚDO ----------------------------- */
const LESSONS = [
  { n:"1", t:"O sistema ONU: arquitetura e lógica de funcionamento", dur:"2h (120 min)",
    obj:"Compreender origem, princípios e órgãos da ONU e como cada um vira um comitê de simulação.",
    blocks:[
      ["0–10 min","Abertura, diagnóstico e objetivos da aula."],
      ["10–40 min","A Carta de São Francisco (1945): propósitos e princípios (soberania, não-intervenção, segurança coletiva)."],
      ["40–80 min","Órgãos principais e competências: AGNU, CSNU (P5/veto), ECOSOC, Secretariado, CIJ, Conselho de Tutela."],
      ["80–105 min","Da estrutura ao comitê: como cada órgão vira um comitê de MUN."],
      ["105–120 min","Prática: mapa “qual órgão para qual problema”."]],
    pratica:"Mapa do sistema ONU: para cada problema, indicar o órgão competente e justificar.",
    entrega:"Quadro-resumo “qual órgão para qual problema”." },
  { n:"2", t:"Órgãos, agências e mecanismos de financiamento", dur:"2h (120 min)",
    obj:"Distinguir órgãos, programas, fundos e agências; entender como a ONU se financia e como obter recursos.",
    blocks:[
      ["0–10 min","Revisão e conexão com o tema."],
      ["10–35 min","Programas e fundos (PNUD, UNICEF, ACNUR, PMA) × agências especializadas (OMS, FAO, UNESCO) e Bretton Woods."],
      ["35–75 min","Como a ONU se financia: contribuições obrigatórias × voluntárias, trust funds, pooled funds (CERF)."],
      ["75–105 min","Obter fundos na simulação: fonte certa, cláusula, doadores, prestação de contas."],
      ["105–120 min","Prática: plano de financiamento de uma crise."]],
    pratica:"Desenhar o plano de financiamento de uma crise humanitária fictícia.",
    entrega:"Rascunho de cláusula operativa de financiamento." },
  { n:"3", t:"Regras de procedimento e dinâmica de comitê", dur:"2h (120 min)",
    obj:"Dominar as Rules of Procedure e o fluxo de uma sessão.",
    blocks:[
      ["0–10 min","Revisão e aquecimento."],
      ["10–45 min","Rules of Procedure: quórum, GSL, moções e pontos."],
      ["45–75 min","Fluxo da sessão: roll call → agenda → debate → caucus → redação → votação."],
      ["75–100 min","Papéis, mesa, etiqueta e tipos de comitê (incl. crise)."],
      ["100–120 min","Mini-simulação de procedimento."]],
    pratica:"Conduzir uma rodada com abertura de agenda, moções de caucus e votação.",
    entrega:"“Cola” pessoal de moções." },
  { n:"4", t:"Documentos, redação de resoluções e negociação", dur:"2h (120 min)",
    obj:"Redigir documentos corretos e negociar para construir consenso.",
    blocks:[
      ["0–10 min","Revisão e exemplos comentados."],
      ["10–35 min","Position paper, working paper, draft resolution e emendas."],
      ["35–70 min","Anatomia da resolução: cláusulas preambulares × operativas."],
      ["70–95 min","Cláusula operativa exequível: mecanismos, financiamento, prazos, monitoramento."],
      ["95–120 min","Redação assistida e negociação simulada."]],
    pratica:"Redigir uma draft resolution com mecanismo de financiamento e defendê-la.",
    entrega:"Draft resolution revisada com feedback." },
  { n:"5", t:"Simulação integrada, oratória e feedback", dur:"2h (120 min)",
    obj:"Integrar tudo numa simulação completa, com oratória e resposta a crises.",
    blocks:[
      ["0–15 min","Oratória diplomática: discurso de abertura, GSL, direito de resposta."],
      ["15–30 min","Postura, protocolo e comitês de crise."],
      ["30–100 min","Simulação completa cronometrada (cenário com captação de recursos)."],
      ["100–115 min","Feedback individualizado por rubrica."],
      ["115–120 min","Plano de evolução pós-curso."]],
    pratica:"Simulação integrada cronometrada, avaliada por rubrica.",
    entrega:"Ficha de feedback + plano de estudos personalizado." },
];

const GLOSSARY = [
  ["AGNU","Assembleia Geral — deliberação universal; recomendações e orçamento."],
  ["CSNU","Conselho de Segurança — paz e segurança; resoluções vinculantes; veto dos P5."],
  ["ECOSOC","Conselho Econômico e Social — coordena temas econômicos, sociais e agências."],
  ["Secretariado","Órgão administrativo da ONU, chefiado pelo Secretário-Geral."],
  ["CIJ","Corte Internacional de Justiça — contencioso entre Estados e pareceres."],
  ["Caucus","Debate informal: moderado (falas curtas por tema) ou não-moderado (negociação livre)."],
  ["GSL","General Speakers' List — lista oficial de oradores do comitê."],
  ["Quórum","Número mínimo de delegações para iniciar os trabalhos."],
  ["Position paper","Documento que apresenta a posição do país sobre o tema."],
  ["Working paper","Esboço de ideias antes da resolução formal."],
  ["Draft resolution","Projeto de resolução em negociação no comitê."],
  ["Sponsors","Patrocinadores: autores principais de uma resolução."],
  ["Cláusula preambular","Item de contexto/justificativa (em itálico)."],
  ["Cláusula operativa","Item que determina ações concretas (numerado)."],
  ["Trust fund","Fundo fiduciário; recebe contribuições voluntárias com finalidade definida."],
  ["Pooled fund","Fundo comum (ex.: CERF) que reúne recursos para resposta rápida."],
  ["Contribuição obrigatória","Cota anual devida pelos Estados-membros (orçamento regular/paz)."],
  ["Contribuição voluntária","Doação adicional, livre, de Estados ou parceiros."],
];

const ORGANS = [
  ["Conflito armado, ameaça à paz","Conselho de Segurança (CSNU)"],
  ["Tema global amplo, recomendação","Assembleia Geral (AGNU)"],
  ["Crise humanitária / refugiados","ECOSOC, ACNUR, OCHA, PMA"],
  ["Saúde / epidemia","OMS"],
  ["Desenvolvimento / pobreza","PNUD, ECOSOC"],
  ["Infância","UNICEF"],
  ["Alimentação e agricultura","FAO, PMA"],
  ["Disputa jurídica entre Estados","Corte Internacional de Justiça (CIJ)"],
];

const MOTIONS = [
  ["Abrir o debate","No início, para começar a sessão."],
  ["Caucus moderado","Debater um subtema com falas curtas e ordenadas."],
  ["Caucus não-moderado","Negociar livremente e redigir documentos."],
  ["Encerrar o debate","Quando o tema está maduro para votação."],
  ["Ponto de ordem","Apontar erro de procedimento da mesa."],
  ["Ponto de informação","Fazer pergunta (à mesa ou a um orador)."],
  ["Ponto de privilégio pessoal","Resolver desconforto (não escuta, sala, etc.)."],
];

const VERBS = [
  ["Reafirmando, Reconhecendo","Decide, Solicita"],
  ["Profundamente preocupado(a) com","Recomenda, Encoraja"],
  ["Tendo examinado, Observando","Convoca, Estabelece"],
  ["Guiado(a) pelos princípios de","Apela para, Insta"],
  ["Levando em conta","Autoriza, Solicita financiamento de"],
];

const FUNDING = [
  "Defina o objetivo e estime o custo da iniciativa.",
  "Identifique a fonte: orçamento regular, contribuições voluntárias, trust fund ou pooled fund (ex.: CERF).",
  "Escolha a agência/fundo gestor (PNUD, ACNUR, PMA, UNICEF, OMS…).",
  "Mapeie doadores plausíveis (Estados, blocos, fundações, setor privado).",
  "Redija a cláusula operativa que cria/solicita o financiamento.",
  "Preveja prestação de contas e monitoramento (quem fiscaliza e quando).",
];

const CHECKLIST = [
  "Position paper pronto e revisado.",
  "Pesquisa do país e do tema concluída.",
  "Cheat sheet de moções à mão.",
  "Pelo menos 2 propostas de solução definidas.",
  "Estratégia de financiamento esboçada.",
  "Discurso de abertura ensaiado.",
  "Aliados e oposição mapeados.",
];

const RUBRIC = [
  "Domínio das estruturas da ONU",
  "Uso correto do procedimento",
  "Qualidade dos documentos",
  "Negociação e construção de consenso",
  "Oratória e postura",
  "Estratégia de financiamento",
];

const EXAMPLE = {
  pp_pais:"República Federativa do Brasil",
  pp_contexto:"A seca prolongada no Chifre da África provocou quebra de safra, fome aguda e o deslocamento de milhões de pessoas, ameaçando a estabilidade regional.",
  pp_posicao:"O Brasil defende uma resposta humanitária coordenada e financiada de forma previsível, com respeito à soberania dos Estados afetados e protagonismo das agências da ONU.",
  pp_propostas:"1) Criar um fundo fiduciário voluntário gerido pelo PMA; 2) Estabelecer um corredor humanitário; 3) Programa de cooperação técnica agrícola (apoio da FAO/Embrapa).",
  pp_aliancas:"Aliados: países do G77, União Africana, doadores tradicionais. Diálogo com P5 para garantir acesso humanitário.",
  dr_cabecalho:"ECOSOC — Resposta à crise alimentar no Chifre da África — Sponsors: Brasil, Quênia, Noruega",
  dr_pre:"Profundamente preocupado(a) com a fome aguda que afeta milhões de pessoas na região;\nReafirmando os princípios humanitários de neutralidade e imparcialidade;\nReconhecendo o papel central das agências da ONU na resposta.",
  dr_op:"1. Decide criar um fundo fiduciário voluntário, administrado pelo PMA, para resposta emergencial;\n2. Solicita aos Estados-membros e parceiros contribuições voluntárias e metas de doação;\n3. Convoca a FAO a coordenar cooperação técnica agrícola;\n4. Solicita prestação de contas semestral ao ECOSOC.",
  fin_estrategia:"Combinar liberação imediata do CERF (resposta rápida) com um trust fund de médio prazo gerido pelo PMA, mobilizando doadores em conferência de promessas.",
  fin_fonte:"Pooled fund (CERF) + trust fund voluntário gerido pelo PMA",
  fin_doadores:"União Europeia, Noruega, países do Golfo, fundações privadas e cooperação Sul-Sul (Brasil/Embrapa).",
  blocos_aliados:"G77 e China (apoio à cooperação); União Africana (legitimidade regional); Noruega e UE (financiamento).",
  blocos_oposicao:"Resistência de alguns doadores a compromissos vinculantes — contornar com metas voluntárias e prestação de contas.",
  discurso:"Senhora Presidente, distintas delegações: o Brasil vê com profunda preocupação a fome que avança no Chifre da África. Defendemos um fundo humanitário gerido pelo PMA e cooperação agrícola via FAO. Convidamos todas as delegações a transformar solidariedade em recursos concretos. Obrigado.",
};

/* ----------------------------- RENDER ----------------------------- */
function el(tag, cls, html){ const e=document.createElement(tag); if(cls)e.className=cls; if(html!=null)e.innerHTML=html; return e; }

function renderLessons(){
  const root=document.getElementById("lessons");
  LESSONS.forEach(L=>{
    const d=el("details","lesson"); if(L.n==="1")d.open=true;
    const tl=L.blocks.map(b=>`<li><span class="t">${b[0]}</span><span>${b[1]}</span></li>`).join("");
    d.innerHTML=`<summary><span class="num">${L.n}</span><span>${L.t}</span><span class="dur">${L.dur}</span></summary>
      <div class="body">
        <div class="obj"><b>Objetivo:</b> ${L.obj}</div>
        <ul class="timeline">${tl}</ul>
        <div class="callout"><b>Prática:</b> ${L.pratica}</div>
        <div class="callout blue"><b>Entregável:</b> ${L.entrega}</div>
      </div>`;
    root.appendChild(d);
  });
}
function rows(tbodyId, data){
  const tb=document.getElementById(tbodyId);
  data.forEach(r=> tb.appendChild(el("tr",null,r.map(c=>`<td>${c}</td>`).join(""))));
}
function renderGlossary(){ rows("glossBody",GLOSSARY); }
function filterGlossary(q){
  q=(q||"").toLowerCase();
  document.querySelectorAll("#glossBody tr").forEach(tr=>{
    tr.style.display = tr.textContent.toLowerCase().includes(q) ? "" : "none";
  });
}
function renderFunding(){
  const ol=document.getElementById("fundingSteps");
  FUNDING.forEach(s=> ol.appendChild(el("li",null,s)));
}
function renderChecklist(){
  const ul=document.getElementById("checklistBody");
  CHECKLIST.forEach((c,i)=>{
    const id="chk_"+i;
    const li=el("li");
    li.innerHTML=`<input type="checkbox" id="${id}" data-save="${id}"><span>${c}</span>`;
    ul.appendChild(li);
  });
}
function renderRubric(){
  const tb=document.getElementById("rubricBody");
  RUBRIC.forEach((c,i)=>{
    const id="rub_"+i;
    const tr=el("tr");
    let opts='<option value="">—</option>';
    for(let n=1;n<=5;n++) opts+=`<option value="${n}">${n}</option>`;
    tr.innerHTML=`<td>${c}</td><td><select class="rubric" data-save="${id}">${opts}</select></td>`;
    tb.appendChild(tr);
  });
}
function renderExample(){
  const root=document.getElementById("exampleBody");
  const items=[
    ["Position Paper — Brasil", EXAMPLE.pp_contexto+"<br><br><b>Posição:</b> "+EXAMPLE.pp_posicao+"<br><br><b>Propostas:</b> "+EXAMPLE.pp_propostas],
    ["Draft Resolution", "<b>"+EXAMPLE.dr_cabecalho+"</b><br><br><em>"+EXAMPLE.dr_pre.replace(/\n/g,"<br>")+"</em><br><br>"+EXAMPLE.dr_op.replace(/\n/g,"<br>")],
    ["Estratégia de financiamento", EXAMPLE.fin_estrategia+"<br><br><b>Fonte:</b> "+EXAMPLE.fin_fonte+"<br><b>Doadores:</b> "+EXAMPLE.fin_doadores],
    ["Discurso de abertura", EXAMPLE.discurso],
  ];
  items.forEach(it=> root.appendChild(el("div","card",`<span class="tag">Gabarito</span><h3>${it[0]}</h3><p style="font-size:.92rem">${it[1]}</p>`)));
}

/* ----------------------------- PERSISTÊNCIA ----------------------------- */
const KEY="aluizio_onu_mun_v1";
function loadState(){ try{ return JSON.parse(localStorage.getItem(KEY))||{}; }catch(e){ return {}; } }
function saveState(s){
  try{ localStorage.setItem(KEY, JSON.stringify(s)); localStorage.setItem(KEY+"_ts", String(Date.now())); }catch(e){}
  if(window.__cloudSave) window.__cloudSave(s);
  updateProgress(s);
}
let _saveTimer;
function flashSaved(){
  let h=document.getElementById("globalSaveHint");
  if(!h){ h=el("div","savehint","✓ salvo"); h.id="globalSaveHint";
    h.style.cssText="position:fixed;bottom:18px;right:18px;background:#1E8E5A;color:#fff;padding:8px 14px;border-radius:999px;z-index:99;font-size:.85rem;font-weight:700";
    document.body.appendChild(h);}
  h.textContent = window.__cloudOk ? "✓ salvo na nuvem" : "✓ salvo";
  h.classList.add("show"); clearTimeout(_saveTimer);
  _saveTimer=setTimeout(()=>h.classList.remove("show"),1100);
}
/* Preenche todos os campos [data-save] a partir de um objeto de estado
   (usado no carregamento local e na sincronização com a nuvem). */
function applyState(state){
  document.querySelectorAll("[data-save]").forEach(node=>{
    const k=node.getAttribute("data-save");
    if(node.type==="checkbox"){ node.checked=!!state[k]; toggleDone(node); }
    else node.value = state[k]!=null ? state[k] : "";
  });
  updateProgress(state);
}
function bindPersistence(){
  const state=loadState();
  applyState(state);
  document.querySelectorAll("[data-save]").forEach(node=>{
    const k=node.getAttribute("data-save");
    const ev = (node.tagName==="SELECT"||node.type==="checkbox") ? "change":"input";
    node.addEventListener(ev,()=>{
      const s=loadState();
      s[k] = node.type==="checkbox" ? node.checked : node.value;
      saveState(s); flashSaved();
      if(node.type==="checkbox") toggleDone(node);
    });
  });
}
function toggleDone(cb){ const li=cb.closest("li"); if(li) li.classList.toggle("done", cb.checked); }

/* ----------------------------- MEU PROGRESSO ----------------------------- */
const PROGRESS_GROUPS = [
  { nome:"Position Paper",  chaves:["pp_pais","pp_contexto","pp_posicao","pp_propostas","pp_aliancas"] },
  { nome:"Draft Resolution",chaves:["dr_cabecalho","dr_pre","dr_op"] },
  { nome:"Financiamento",   chaves:["fin_estrategia","fin_fonte","fin_doadores"] },
  { nome:"Blocos & discurso",chaves:["blocos_aliados","blocos_oposicao","discurso"] },
  { nome:"Checklist",       chaves:["chk_0","chk_1","chk_2","chk_3","chk_4","chk_5","chk_6"] },
  { nome:"Autoavaliação",   chaves:["rub_0","rub_1","rub_2","rub_3","rub_4","rub_5"] },
];
function filled(v){ return v===true || (typeof v==="string" && v.trim()!==""); }
function updateProgress(state){
  const root=document.getElementById("progressoBody");
  if(!root) return;
  const s = state || loadState();
  let done=0, total=0, cards="";
  PROGRESS_GROUPS.forEach(g=>{
    const ok = g.chaves.filter(k=>filled(s[k])).length;
    done+=ok; total+=g.chaves.length;
    const pct = Math.round(ok/g.chaves.length*100);
    cards += `<div class="pitem"><div class="plabel"><span>${g.nome}</span><b>${ok}/${g.chaves.length}</b></div>`+
             `<div class="pbar"><i style="width:${pct}%"></i></div></div>`;
  });
  const pctAll = Math.round(done/total*100);
  root.innerHTML =
    `<div class="pitem ptotal"><div class="plabel"><span>Preparação geral</span><b>${pctAll}%</b></div>`+
    `<div class="pbar big"><i style="width:${pctAll}%"></i></div></div>${cards}`;
}

function exportTool(slug, title, keys){
  const s=loadState();
  let txt=title.toUpperCase()+"\n"+"=".repeat(title.length)+"\n\n";
  const labels={pp_pais:"País",pp_contexto:"Contexto",pp_posicao:"Posição",pp_propostas:"Propostas",pp_aliancas:"Alianças",
    dr_cabecalho:"Cabeçalho",dr_pre:"Cláusulas preambulares",dr_op:"Cláusulas operativas",
    fin_estrategia:"Estratégia",fin_fonte:"Fonte",fin_doadores:"Doadores"};
  keys.forEach(k=>{ txt += (labels[k]||k)+":\n"+((s[k]||"—"))+"\n\n"; });
  const blob=new Blob([txt],{type:"text/plain;charset=utf-8"});
  const a=document.createElement("a"); a.href=URL.createObjectURL(blob);
  a.download=`${slug}-aluizio-onu.txt`; a.click(); URL.revokeObjectURL(a.href);
}

function loadExample(){
  const s=loadState();
  Object.keys(EXAMPLE).forEach(k=> s[k]=EXAMPLE[k]);
  saveState(s);
  Object.keys(EXAMPLE).forEach(k=>{ const n=document.querySelector(`[data-save="${k}"]`); if(n) n.value=EXAMPLE[k]; });
  flashSaved();
  document.getElementById("documentos").scrollIntoView();
}

function resetAll(){
  if(!confirm("Isso apaga todo o seu trabalho salvo (neste navegador e na nuvem). Continuar?")) return;
  localStorage.removeItem(KEY);
  document.querySelectorAll("[data-save]").forEach(n=>{
    if(n.type==="checkbox"){ n.checked=false; toggleDone(n); } else n.value="";
  });
  saveState({});
  flashSaved();
}

/* ----------------------- SITUAÇÕES PARA RESOLVER ----------------------- */
const CASOS = [
  { titulo:"Invasão e ameaça à paz",
    situacao:"O país A invade militarmente o território do país B e há risco de escalada regional, com pedido urgente de ajuda internacional.",
    pergunta:"Qual órgão pode agir com medidas obrigatórias?",
    opcoes:[{orgao:"Conselho de Segurança (CSNU)",correta:true},{orgao:"Assembleia Geral",correta:false},{orgao:"ECOSOC",correta:false},{orgao:"Corte Internacional de Justiça",correta:false}],
    resposta:"É o Conselho de Segurança — o único órgão que toma decisões vinculantes para manter a paz (Carta da ONU, Cap. VII): cessar-fogo, sanções e até autorização do uso da força ou de uma operação de paz. A Assembleia Geral apenas recomenda; a CIJ julga disputas jurídicas, não emergências de segurança." },
  { titulo:"Corrida armamentista",
    situacao:"Vários Estados anunciam novos arsenais e há impasse sobre um tratado de controle de armas convencionais e nucleares.",
    pergunta:"Em qual comitê esse debate é conduzido?",
    opcoes:[{orgao:"DISEC (1ª Comissão)",correta:true},{orgao:"Conselho de Segurança",correta:false},{orgao:"ECOFIN",correta:false},{orgao:"PNUMA",correta:false}],
    resposta:"É a DISEC, a 1ª Comissão da Assembleia Geral, foro para desarmamento e segurança internacional. Produz resoluções de recomendação (não vinculantes) e prepara tratados. O Conselho de Segurança trataria de uma ameaça concreta e imediata, não do debate normativo sobre armamentos." },
  { titulo:"Dívida insustentável",
    situacao:"Um país em desenvolvimento está sobreendividado e propõe um mecanismo internacional de reestruturação da dívida soberana.",
    pergunta:"Qual comitê é o competente?",
    opcoes:[{orgao:"ECOFIN (2ª Comissão)",correta:true},{orgao:"Conselho de Segurança",correta:false},{orgao:"DISEC",correta:false},{orgao:"UNCLOS",correta:false}],
    resposta:"É a ECOFIN (2ª Comissão), que cuida de questões econômicas e financeiras — desenvolvimento, comércio, finanças e dívida. O ECOSOC coordena a agenda econômico-social de forma mais ampla e seria aceitável, mas o foro específico do tema é a ECOFIN." },
  { titulo:"Surto sanitário e trabalho infantil",
    situacao:"Uma região enfrenta um surto de doença somado a denúncias de trabalho infantil em cadeias produtivas.",
    pergunta:"Qual órgão coordena a resposta econômico-social?",
    opcoes:[{orgao:"ECOSOC",correta:true},{orgao:"Conselho de Segurança",correta:false},{orgao:"UNCLOS",correta:false},{orgao:"Corte Internacional de Justiça",correta:false}],
    resposta:"É o ECOSOC, que coordena o trabalho econômico, social e ambiental do sistema ONU e articula as agências especializadas — OMS para a saúde, OIT e UNICEF para o trabalho infantil. Atua por recomendações e diretrizes de cooperação." },
  { titulo:"Poluição transfronteiriça",
    situacao:"Um grande derramamento químico cruza a fronteira de três países e ameaça um bioma compartilhado.",
    pergunta:"Qual programa lidera a agenda ambiental?",
    opcoes:[{orgao:"PNUMA",correta:true},{orgao:"ECOFIN",correta:false},{orgao:"Conselho de Segurança",correta:false},{orgao:"DISEC",correta:false}],
    resposta:"É o PNUMA (UNEP), que conduz a agenda ambiental global — clima, biodiversidade, poluição e sustentabilidade — promovendo acordos e cooperação. A responsabilização jurídica entre os Estados poderia, em paralelo, ser levada à CIJ." },
  { titulo:"Disputa marítima",
    situacao:"Dois Estados costeiros disputam a delimitação de suas Zonas Econômicas Exclusivas e o direito de explorar recursos no leito marinho.",
    pergunta:"Qual marco jurídico rege a questão?",
    opcoes:[{orgao:"UNCLOS (Direito do Mar)",correta:true},{orgao:"PNUMA",correta:false},{orgao:"ECOFIN",correta:false},{orgao:"Assembleia Geral",correta:false}],
    resposta:"É a UNCLOS, a Convenção das Nações Unidas sobre o Direito do Mar, que define zonas marítimas (mar territorial, ZEE, plataforma continental) e regras de navegação e recursos. As controvérsias podem ir ao Tribunal Internacional do Direito do Mar (ITLOS) ou à CIJ." },
  { titulo:"Controvérsia jurídica entre Estados",
    situacao:"Dois países discordam sobre a interpretação de um tratado de fronteira e aceitam submeter a disputa a uma decisão jurídica vinculante.",
    pergunta:"Para qual órgão a disputa deve ir?",
    opcoes:[{orgao:"Corte Internacional de Justiça (CIJ)",correta:true},{orgao:"Conselho de Segurança",correta:false},{orgao:"ECOSOC",correta:false},{orgao:"DISEC",correta:false}],
    resposta:"É a CIJ, principal órgão judicial da ONU, que decide controvérsias jurídicas entre Estados (quando ambos aceitam sua jurisdição) e emite pareceres consultivos. Diferente das comissões, sua sentença é vinculante para as partes." },
  { titulo:"Crise de refugiados",
    situacao:"Um conflito provoca o deslocamento em massa de civis para países vizinhos, que pedem apoio para acolhê-los.",
    pergunta:"Qual agência é central na resposta humanitária?",
    opcoes:[{orgao:"ACNUR (Refugiados)",correta:true},{orgao:"Conselho de Segurança",correta:false},{orgao:"ECOFIN",correta:false},{orgao:"UNCLOS",correta:false}],
    resposta:"É o ACNUR, agência que protege e assiste refugiados e deslocados, sob orientação da Assembleia Geral e do ECOSOC. O Conselho de Segurança pode atuar sobre a causa do conflito, mas a resposta ao deslocamento cabe ao ACNUR e parceiros." },
];
function renderCasos(){
  const root=document.getElementById("casosBody");
  if(!root) return;
  root.innerHTML=CASOS.map((c,i)=>{
    const opts=c.opcoes.map(o=>`<button type="button" class="caso-opt" data-ok="${o.correta?1:0}">${o.orgao}</button>`).join("");
    return `<div class="caso"><div class="caso-num">CASO ${String(i+1).padStart(2,"0")}</div>`+
      `<h3>${c.titulo}</h3><p class="caso-sit">${c.situacao}</p><p class="caso-q">${c.pergunta}</p>`+
      `<div class="caso-opts">${opts}</div><div class="caso-fb" hidden></div></div>`;
  }).join("");
  root.addEventListener("click",e=>{
    const b=e.target.closest(".caso-opt"); if(!b||b.disabled) return;
    const card=b.closest(".caso"); const i=[...root.children].indexOf(card);
    card.querySelectorAll(".caso-opt").forEach(o=>{
      o.disabled=true; o.classList.add("revealed");
      if(o.getAttribute("data-ok")==="1") o.classList.add("ok");
      else if(o===b) o.classList.add("no");
    });
    const fb=card.querySelector(".caso-fb"); fb.hidden=false;
    fb.innerHTML=(b.getAttribute("data-ok")==="1"?"<b>Correto.</b> ":"<b>Não exatamente.</b> ")+CASOS[i].resposta;
  });
}

/* ----------------------------- NAV ATIVA ----------------------------- */
function setupScrollSpy(){
  const links=[...document.querySelectorAll(".nav a")]
    .filter(a=>{ const h=a.getAttribute("href"); return h && h.startsWith("#") && h.length>1; });
  const map={}; links.forEach(a=> map[a.getAttribute("href").slice(1)]=a);
  const obs=new IntersectionObserver(es=>{
    es.forEach(e=>{ if(e.isIntersecting){ links.forEach(l=>l.classList.remove("active")); if(map[e.target.id]) map[e.target.id].classList.add("active"); }});
  },{rootMargin:"-45% 0px -50% 0px"});
  document.querySelectorAll("section.block").forEach(s=>obs.observe(s));
  document.getElementById("nav").addEventListener("click",e=>{ if(e.target.tagName==="A") document.getElementById("nav").classList.remove("open"); });
}

/* ---- expõe handlers usados em atributos inline (onclick/oninput) ---- */
Object.assign(window,{ filterGlossary, exportTool, loadExample, resetAll });
/* ---- ganchos para a sincronização com a nuvem (módulo Firebase no index) ---- */
Object.assign(window,{ __applyState:applyState, __getState:loadState, __updateProgress:updateProgress });

/* ----------------------------- INIT ----------------------------- */
document.addEventListener("DOMContentLoaded",()=>{
  document.getElementById("year").textContent=new Date().getFullYear();
  renderLessons(); renderGlossary(); rows("organsBody",ORGANS); rows("motionsBody",MOTIONS);
  rows("verbsBody",VERBS); renderFunding(); renderChecklist(); renderRubric(); renderExample();
  renderCasos();
  bindPersistence(); setupScrollSpy();
});
