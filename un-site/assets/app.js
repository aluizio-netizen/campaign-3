/* ============================================================
   United Nations / Model UN — Aluizio Pires Education
   Content + interactivity (no backend; saved in localStorage).
   ============================================================ */
"use strict";

/* ----------------------------- CONTENT ----------------------------- */
const LESSONS = [
  { n:"1", t:"The UN system: architecture and how it works", dur:"2h (120 min)",
    obj:"Understand the origin, principles and bodies of the UN and how each one becomes a simulation committee.",
    blocks:[
      ["0–10 min","Opening, student diagnosis and goals of the session."],
      ["10–40 min","The Charter of San Francisco (1945): purposes and principles — sovereignty, non-intervention, collective security."],
      ["40–80 min","Main bodies and their mandates: UNGA, UNSC (P5/veto), ECOSOC, Secretariat, ICJ, Trusteeship Council."],
      ["80–105 min","From structure to committee: how each body becomes a MUN committee."],
      ["105–120 min","Practice: map of “which body for which problem”."]],
    pratica:"UN system map: for each problem, name the competent body and justify it.",
    entrega:"Summary table “which body for which problem”." },
  { n:"2", t:"Bodies, agencies and funding mechanisms", dur:"2h (120 min)",
    obj:"Tell bodies, programmes, funds and agencies apart; understand how the UN is financed and how to secure resources.",
    blocks:[
      ["0–10 min","Recap and link to the topic."],
      ["10–35 min","Programmes and funds (UNDP, UNICEF, UNHCR, WFP) vs. specialized agencies (WHO, FAO, UNESCO) and Bretton Woods."],
      ["35–75 min","How the UN is financed: assessed vs. voluntary contributions, trust funds, pooled funds (e.g., CERF)."],
      ["75–105 min","Securing funding in a simulation: the right source, the clause, donors, accountability."],
      ["105–120 min","Practice: funding plan for a crisis."]],
    pratica:"Design the funding plan for a fictional humanitarian crisis.",
    entrega:"Draft of an operative funding clause." },
  { n:"3", t:"Rules of procedure and committee dynamics", dur:"2h (120 min)",
    obj:"Master the Rules of Procedure and the flow of a session.",
    blocks:[
      ["0–10 min","Recap and warm-up."],
      ["10–45 min","Rules of Procedure: quorum, GSL, motions and points."],
      ["45–75 min","Session flow: roll call → setting the agenda → formal debate → caucus → drafting → voting."],
      ["75–100 min","Roles, the dais, etiquette and committee types (incl. crisis)."],
      ["100–120 min","Mini-simulation of procedure."]],
    pratica:"Run a round with setting the agenda, caucus motions and voting.",
    entrega:"A personal motions “cheat sheet”." },
  { n:"4", t:"Documents, drafting resolutions and negotiation", dur:"2h (120 min)",
    obj:"Write technically correct documents and negotiate to build consensus.",
    blocks:[
      ["0–10 min","Recap and annotated examples."],
      ["10–35 min","Position paper, working paper, draft resolution and amendments."],
      ["35–70 min","Anatomy of a resolution: preambular vs. operative clauses."],
      ["70–95 min","Workable operative clause: mechanisms, funding, deadlines, monitoring."],
      ["95–120 min","Guided drafting and simulated negotiation."]],
    pratica:"Write a full draft resolution — including a funding mechanism — and defend it.",
    entrega:"A draft resolution revised with feedback." },
  { n:"5", t:"Integrated simulation, public speaking and feedback", dur:"2h (120 min)",
    obj:"Bring it all together in a full simulation, with public speaking and crisis response.",
    blocks:[
      ["0–15 min","Diplomatic speaking: opening speech, GSL, right of reply."],
      ["15–30 min","Posture, protocol and how crisis committees work."],
      ["30–100 min","Full timed simulation (a scenario involving fundraising)."],
      ["100–115 min","Individual feedback against the rubric."],
      ["115–120 min","Post-course growth plan."]],
    pratica:"A full timed simulation, assessed by rubric.",
    entrega:"Feedback sheet + a personalized study plan." },
];

const GLOSSARY = [
  ["UNGA","UN General Assembly — universal deliberation; recommendations and budget."],
  ["UNSC","UN Security Council — peace and security; binding resolutions; P5 veto."],
  ["ECOSOC","Economic and Social Council — coordinates economic and social matters and agencies."],
  ["Secretariat","The UN's administrative body, led by the Secretary-General."],
  ["ICJ","International Court of Justice — disputes between States and advisory opinions."],
  ["Caucus","Informal debate: moderated (short speeches by sub-topic) or unmoderated (free negotiation)."],
  ["GSL","General Speakers' List — the committee's official list of speakers."],
  ["Quorum","Minimum number of delegations needed to begin proceedings."],
  ["Position paper","Document presenting the country's position on the topic."],
  ["Working paper","A draft of ideas before the formal resolution."],
  ["Draft resolution","A resolution project under negotiation in committee."],
  ["Sponsors","The main authors of a resolution."],
  ["Preambular clause","A context/justification item (in italics)."],
  ["Operative clause","An item setting concrete actions (numbered)."],
  ["Trust fund","Receives voluntary contributions for a defined purpose."],
  ["Pooled fund","A common fund (e.g., CERF) that gathers resources for rapid response."],
  ["Assessed contribution","Annual dues owed by Member States (regular/peacekeeping budget)."],
  ["Voluntary contribution","An additional, free donation by States or partners."],
];

const ORGANS = [
  ["Armed conflict, threat to peace","Security Council (UNSC)"],
  ["Broad global topic, recommendation","General Assembly (UNGA)"],
  ["Humanitarian crisis / refugees","ECOSOC, UNHCR, OCHA, WFP"],
  ["Health / epidemic","WHO"],
  ["Development / poverty","UNDP, ECOSOC"],
  ["Children","UNICEF"],
  ["Food and agriculture","FAO, WFP"],
  ["Legal dispute between States","International Court of Justice (ICJ)"],
];

const MOTIONS = [
  ["Open the debate","At the start, to begin the session."],
  ["Moderated caucus","Debate a sub-topic with short, ordered speeches."],
  ["Unmoderated caucus","Negotiate freely and draft documents."],
  ["Close the debate","When the topic is ripe for voting."],
  ["Point of order","Flag a procedural error by the dais."],
  ["Point of inquiry","Ask a question (to the dais or a speaker)."],
  ["Point of personal privilege","Address a discomfort (can't hear, room, etc.)."],
];

const VERBS = [
  ["Reaffirming, Recognizing","Decides, Requests"],
  ["Deeply concerned by","Recommends, Encourages"],
  ["Having examined, Noting","Calls upon, Establishes"],
  ["Guided by the principles of","Appeals to, Urges"],
  ["Bearing in mind","Authorizes, Requests funding for"],
];

const FUNDING = [
  "Define the objective and estimate the cost of the initiative.",
  "Identify the source: regular budget, voluntary contributions, trust fund or pooled fund (e.g., CERF).",
  "Choose the managing agency/fund (UNDP, UNHCR, WFP, UNICEF, WHO…).",
  "Map plausible donors (States, blocs, foundations, private sector).",
  "Draft the operative clause that creates/requests the funding.",
  "Plan accountability and monitoring (who oversees it, and when).",
];

const CHECKLIST = [
  "Position paper ready and proofread.",
  "Country and topic research complete.",
  "Motions cheat sheet at hand.",
  "At least 2 proposed solutions defined.",
  "Funding strategy outlined.",
  "Opening speech rehearsed.",
  "Allies and opposition mapped.",
];

const RUBRIC = [
  "Command of UN structures",
  "Correct use of procedure",
  "Quality of documents",
  "Negotiation and consensus-building",
  "Public speaking and posture",
  "Funding strategy",
];

const EXAMPLE = {
  pp_pais:"Federative Republic of Brazil",
  pp_contexto:"A prolonged drought in the Horn of Africa has caused crop failure, acute hunger and the displacement of millions, threatening regional stability.",
  pp_posicao:"Brazil calls for a coordinated, predictably financed humanitarian response, respecting the sovereignty of affected States and the leading role of UN agencies.",
  pp_propostas:"1) Create a voluntary trust fund managed by the WFP; 2) Establish a humanitarian corridor; 3) An agricultural technical-cooperation programme (support from FAO/Embrapa).",
  pp_aliancas:"Allies: the G77, the African Union, traditional donors. Dialogue with the P5 to secure humanitarian access.",
  dr_cabecalho:"ECOSOC — Response to the food crisis in the Horn of Africa — Sponsors: Brazil, Kenya, Norway",
  dr_pre:"Deeply concerned by the acute hunger affecting millions across the region;\nReaffirming the humanitarian principles of neutrality and impartiality;\nRecognizing the central role of UN agencies in the response.",
  dr_op:"1. Decides to create a voluntary trust fund, administered by the WFP, for emergency response;\n2. Requests Member States and partners to make voluntary contributions and pledge targets;\n3. Calls upon the FAO to coordinate agricultural technical cooperation;\n4. Requests semi-annual reporting to ECOSOC.",
  fin_estrategia:"Combine an immediate CERF allocation (rapid response) with a medium-term trust fund managed by the WFP, mobilizing donors at a pledging conference.",
  fin_fonte:"Pooled fund (CERF) + voluntary trust fund managed by the WFP",
  fin_doadores:"European Union, Norway, Gulf states, private foundations and South-South cooperation (Brazil/Embrapa).",
  blocos_aliados:"G77 and China (support for cooperation); African Union (regional legitimacy); Norway and the EU (funding).",
  blocos_oposicao:"Some donors resist binding commitments — work around it with voluntary targets and accountability.",
  discurso:"Madam Chair, distinguished delegates: Brazil is deeply concerned by the hunger spreading across the Horn of Africa. We call for a humanitarian fund managed by the WFP and agricultural cooperation through the FAO. We invite every delegation to turn solidarity into concrete resources. Thank you.",
};

/* ---- UN Security Council ---- */
const UNSC_FACTS = [
  ["Members","15 — five permanent (China, France, Russia, the United Kingdom, the United States) plus ten elected for two-year terms (the E10)."],
  ["To pass","9 of 15 votes in favour — and no veto cast by any permanent member."],
  ["The veto","Held only by the P5, and only on substantive (non-procedural) matters."],
  ["Force of decisions","Binding on all Member States under Article 25 of the Charter."],
  ["Presidency","Rotates monthly, in the English alphabetical order of member names."],
];
const UNSC_POWERS = [
  ["Pacific settlement (Ch. VI)","Recommends negotiation, mediation, arbitration or referral to the ICJ."],
  ["Sanctions (Art. 41)","Arms embargoes, asset freezes, travel bans, trade limits — measures short of force."],
  ["Use of force (Art. 42)","Authorizes “all necessary measures”, including military action, when other steps fail."],
  ["Peacekeeping","Creates and mandates peace operations — mission, size and rules of engagement."],
  ["Referrals & tribunals","Refers situations to the ICC or establishes special tribunals."],
];
const UNSC_VERBS = [
  ["Recalling its resolution …","Demands"],
  ["Reaffirming its primary responsibility for peace and security","Decides"],
  ["Expressing grave concern at","Authorizes"],
  ["Determining that the situation constitutes a threat to international peace","Imposes"],
  ["Condemning in the strongest terms","Calls upon, Urges"],
  ["Acting under Chapter VII of the Charter","Decides to remain seized of the matter"],
];
const UNSC_EXAMPLE = {
  unsc_header:"The Security Council, on the protection of civilians in Region X — Sponsors: France, Ghana, Republic of Korea",
  unsc_pre:"Recalling its previous resolutions on the situation in Region X;\nReaffirming its primary responsibility for the maintenance of international peace and security;\nExpressing grave concern at the deteriorating humanitarian situation and at attacks against civilians;\nDetermining that the situation in Region X constitutes a threat to international peace and security;",
  unsc_op:"Acting under Chapter VII of the Charter of the United Nations,\n1. Demands the immediate cessation of hostilities by all parties;\n2. Authorizes Member States, in cooperation with the United Nations, to take all necessary measures to protect civilians and ensure humanitarian access;\n3. Decides to impose an arms embargo on all non-State armed groups operating in Region X;\n4. Requests the Secretary-General to report on implementation within 60 days;\n5. Decides to remain seized of the matter.",
};

/* ---- Crisis committees ---- */
const CRISIS_DIFF = [
  ["Large room, long debate","Small room, fast pace"],
  ["One topic, one resolution","An evolving scenario, many directives"],
  ["You represent a country","You hold a character's portfolio powers"],
  ["Updates are rare","Crisis updates arrive constantly"],
  ["Public, formal speeches","Public moves plus private crisis notes"],
];
const CRISIS_TOOLS = [
  ["Committee directive","A collective action voted by the room — like a short, immediate mini-resolution."],
  ["Personal / private directive","An action you take alone using your character's powers, sent secretly to the crisis staff."],
  ["Crisis note","A private message to the backroom to gather intel, move assets or advance your arc."],
  ["Press release / communiqué","A public statement that shapes the narrative and pressures other actors."],
  ["Portfolio powers","The real resources your character controls — troops, budget, media, contacts."],
];
const CRISIS_TIPS = [
  ["Be fast, be specific","A directive that names who, what and when beats an eloquent speech. Crisis rewards decisions."],
  ["Stay in character","Use only the powers your portfolio plausibly has — overreach gets struck down by the crisis staff."],
  ["Build an arc","Chain your private notes into a storyline; small early moves set up big payoffs later."],
];

/* ----------------------------- RENDER ----------------------------- */
function el(tag, cls, html){ const e=document.createElement(tag); if(cls)e.className=cls; if(html!=null)e.innerHTML=html; return e; }

function renderLessons(){
  const root=document.getElementById("lessons");
  LESSONS.forEach(L=>{
    const d=el("details","lesson"); if(L.n==="1")d.open=true;
    const tl=L.blocks.map(b=>`<li><span class="t">${b[0]}</span><span>${b[1]}</span></li>`).join("");
    d.innerHTML=`<summary><span class="num">${L.n}</span><span>${L.t}</span><span class="dur">${L.dur}</span></summary>
      <div class="body">
        <div class="obj"><b>Objective:</b> ${L.obj}</div>
        <ul class="timeline">${tl}</ul>
        <div class="callout"><b>Practice:</b> ${L.pratica}</div>
        <div class="callout blue"><b>Deliverable:</b> ${L.entrega}</div>
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
    ["Position Paper — Brazil", EXAMPLE.pp_contexto+"<br><br><b>Position:</b> "+EXAMPLE.pp_posicao+"<br><br><b>Proposals:</b> "+EXAMPLE.pp_propostas],
    ["Draft Resolution", "<b>"+EXAMPLE.dr_cabecalho+"</b><br><br><em>"+EXAMPLE.dr_pre.replace(/\n/g,"<br>")+"</em><br><br>"+EXAMPLE.dr_op.replace(/\n/g,"<br>")],
    ["Funding strategy", EXAMPLE.fin_estrategia+"<br><br><b>Source:</b> "+EXAMPLE.fin_fonte+"<br><b>Donors:</b> "+EXAMPLE.fin_doadores],
    ["Opening speech", EXAMPLE.discurso],
  ];
  items.forEach(it=> root.appendChild(el("div","card",`<span class="tag">Example</span><h3>${it[0]}</h3><p style="font-size:.92rem">${it[1]}</p>`)));
}

function renderCrisisTips(){
  const root=document.getElementById("crisisTips");
  if(!root) return;
  CRISIS_TIPS.forEach(t=> root.appendChild(el("div","card",`<span class="tag">Tip</span><h3>${t[0]}</h3><p style="font-size:.92rem">${t[1]}</p>`)));
}
function loadUnscExample(){
  const s=loadState();
  Object.keys(UNSC_EXAMPLE).forEach(k=>{
    s[k]=UNSC_EXAMPLE[k];
    const n=document.querySelector(`[data-save="${k}"]`); if(n) n.value=UNSC_EXAMPLE[k];
  });
  saveState(s); flashSaved();
  document.getElementById("unsc").scrollIntoView();
}

/* ----------------------------- NETLIFY FORMS ----------------------------- */
/* Static site: submissions are captured by Netlify Forms (panel) once deployed.
   We POST via fetch so the student stays on the page and sees a confirmation. */
function bindNetlifyForm(formId, doneId){
  const form=document.getElementById(formId);
  if(!form) return;
  form.addEventListener("submit",e=>{
    e.preventDefault();
    const btn=form.querySelector('button[type="submit"]');
    if(btn){ btn.disabled=true; btn.textContent="Sending…"; }
    const body=new URLSearchParams(new FormData(form)).toString();
    fetch("/",{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},body})
      .then(r=>{ if(!r.ok) throw new Error("net");
        form.hidden=true;
        const done=document.getElementById(doneId);
        if(done){ done.hidden=false; done.scrollIntoView({behavior:"smooth",block:"center"}); }
      })
      .catch(()=>{ if(btn){ btn.disabled=false; btn.textContent="Try again"; }
        alert("We couldn't send your form right now. Please check your connection and try again."); });
  });
}

/* ----------------------------- PERSISTENCE ----------------------------- */
const KEY="aluizio_un_mun_en_v1";
function loadState(){ try{ return JSON.parse(localStorage.getItem(KEY))||{}; }catch(e){ return {}; } }
function saveState(s){ try{ localStorage.setItem(KEY, JSON.stringify(s)); }catch(e){} }
let _saveTimer;
function flashSaved(){
  let h=document.getElementById("globalSaveHint");
  if(!h){ h=el("div","savehint","✓ saved"); h.id="globalSaveHint";
    h.style.cssText="position:fixed;bottom:18px;right:18px;background:#1E8E5A;color:#fff;padding:8px 14px;border-radius:999px;z-index:99;font-size:.85rem;font-weight:700";
    document.body.appendChild(h);}
  h.classList.add("show"); clearTimeout(_saveTimer);
  _saveTimer=setTimeout(()=>h.classList.remove("show"),1100);
}
function bindPersistence(){
  const state=loadState();
  document.querySelectorAll("[data-save]").forEach(node=>{
    const k=node.getAttribute("data-save");
    if(k in state){
      if(node.type==="checkbox"){ node.checked=!!state[k]; toggleDone(node); }
      else node.value=state[k];
    }
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

function exportTool(slug, title, keys){
  const s=loadState();
  let txt=title.toUpperCase()+"\n"+"=".repeat(title.length)+"\n\n";
  const labels={pp_pais:"Country",pp_contexto:"Context",pp_posicao:"Position",pp_propostas:"Proposals",pp_aliancas:"Alliances",
    dr_cabecalho:"Header",dr_pre:"Preambular clauses",dr_op:"Operative clauses",
    fin_estrategia:"Strategy",fin_fonte:"Source",fin_doadores:"Donors",
    unsc_header:"Header",unsc_pre:"Preambular clauses",unsc_op:"Operative clauses",
    crisis_type:"Type",crisis_title:"Title",crisis_actions:"Actions",crisis_resources:"Resources / actors",crisis_rationale:"Rationale & expected outcome"};
  keys.forEach(k=>{ txt += (labels[k]||k)+":\n"+((s[k]||"—"))+"\n\n"; });
  const blob=new Blob([txt],{type:"text/plain;charset=utf-8"});
  const a=document.createElement("a"); a.href=URL.createObjectURL(blob);
  a.download=`${slug}-aluizio-un.txt`; a.click(); URL.revokeObjectURL(a.href);
}

function loadExample(){
  const s=loadState();
  Object.keys(EXAMPLE).forEach(k=> s[k]=EXAMPLE[k]);
  saveState(s);
  Object.keys(EXAMPLE).forEach(k=>{ const n=document.querySelector(`[data-save="${k}"]`); if(n) n.value=EXAMPLE[k]; });
  flashSaved();
  document.getElementById("documents").scrollIntoView();
}

function resetAll(){
  if(!confirm("This clears all the work saved in this browser. Continue?")) return;
  localStorage.removeItem(KEY);
  document.querySelectorAll("[data-save]").forEach(n=>{
    if(n.type==="checkbox"){ n.checked=false; toggleDone(n); } else n.value="";
  });
  flashSaved();
}

/* ----------------------------- ACTIVE NAV ----------------------------- */
function setupScrollSpy(){
  const links=[...document.querySelectorAll(".nav a")];
  const map={}; links.forEach(a=> map[a.getAttribute("href").slice(1)]=a);
  const obs=new IntersectionObserver(es=>{
    es.forEach(e=>{ if(e.isIntersecting){ links.forEach(l=>l.classList.remove("active")); if(map[e.target.id]) map[e.target.id].classList.add("active"); }});
  },{rootMargin:"-45% 0px -50% 0px"});
  document.querySelectorAll("section.block").forEach(s=>obs.observe(s));
  document.getElementById("nav").addEventListener("click",e=>{ if(e.target.tagName==="A") document.getElementById("nav").classList.remove("open"); });
}

/* ---- expose handlers used in inline attributes (onclick/oninput) ---- */
Object.assign(window,{ filterGlossary, exportTool, loadExample, resetAll, loadUnscExample });

/* ----------------------------- INIT ----------------------------- */
document.addEventListener("DOMContentLoaded",()=>{
  document.getElementById("year").textContent=new Date().getFullYear();
  renderLessons(); renderGlossary(); rows("organsBody",ORGANS); rows("motionsBody",MOTIONS);
  rows("verbsBody",VERBS); renderFunding(); renderChecklist(); renderRubric(); renderExample();
  rows("unscFactsBody",UNSC_FACTS); rows("unscPowersBody",UNSC_POWERS); rows("unscVerbsBody",UNSC_VERBS);
  rows("crisisDiffBody",CRISIS_DIFF); rows("crisisToolsBody",CRISIS_TOOLS); renderCrisisTips();
  bindPersistence(); setupScrollSpy();
  bindNetlifyForm("registerForm","registerDone");
  bindNetlifyForm("tutoringForm","tutoringDone");
});
