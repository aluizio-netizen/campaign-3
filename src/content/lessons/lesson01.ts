import type { LessonSeed } from "@/content/types";

export const lesson01: LessonSeed = {
  slug: "primeiros-contatos",
  title: "Primeiros contatos e código fonético",
  order: 1,
  levelCode: "A1",
  objective:
    "Estabelecer o primeiro contato em inglês: cumprimentar, soletrar nomes com o alfabeto fonético (NATO) e confirmar mensagens com 'copy'/'roger'.",
  durationMin: 15,
  summary:
    "Sua primeira missão: dominar saudações básicas e o código fonético para se comunicar com clareza, mesmo em rádio com ruído.",
  content: {
    warmup:
      "Imagine que você acabou de chegar a uma base internacional. A primeira coisa que precisa fazer é se apresentar e entender o nome dos colegas. Em ambientes de operação, nomes são soletrados com o **código fonético** para evitar erros. Vamos começar pelo essencial: cumprimentar e ser entendido.",
    grammar:
      "Em inglês, os cumprimentos não mudam conforme a pessoa (não há 'tu/você/senhor' como em português). Use **Good morning** (bom dia), **Good afternoon** (boa tarde) e **Good evening** (boa noite, ao chegar). 'Hello' e 'Hi' servem para qualquer hora.\n\nPara confirmar que entendeu uma mensagem, usamos **Copy** ou **Roger** (= 'entendido'). Para pedir repetição: **Say again** (e não 'repeat', que em rádio pede para repetir um disparo). Note que o inglês não tem o som do 'lh'/'nh' do português; preste atenção no som do **H** aspirado em *Hello* (sai ar pela boca).",
    comparison:
      "No português dizemos 'Alô?' ao atender; em inglês de rádio dizemos **'Go ahead'** (pode falar) ou **'Send'**. Enquanto em português confirmamos com 'entendi/copiado', o inglês militar usa **'Copy that'** — daí o famoso 'copiado' do português, que é justamente uma tradução de *copy*.",
    falseFriends: [
      {
        en: "Actually",
        pt: "Atualmente",
        note: "'Actually' significa **na verdade**, não 'atualmente'. 'Atualmente' = currently.",
      },
      {
        en: "Push (no rádio: 'what's your push?')",
        pt: "Empurrar",
        note: "Em comunicação, 'push' pode significar a **frequência/canal** de rádio.",
      },
    ],
    dialogue: [
      { speaker: "Officer", en: "Good morning. Can you hear me?", pt: "Bom dia. Você consegue me ouvir?" },
      { speaker: "You", en: "Good morning. Yes, I copy you.", pt: "Bom dia. Sim, eu te ouço (entendido)." },
      { speaker: "Officer", en: "Spell your last name, please.", pt: "Soletre seu sobrenome, por favor." },
      { speaker: "You", en: "Sierra - Oscar - Uniform - Zulu - Alpha. Souza.", pt: "S - O - U - Z - A. Souza." },
      { speaker: "Officer", en: "Copy. Welcome aboard, Souza.", pt: "Entendido. Bem-vindo a bordo, Souza." },
      { speaker: "You", en: "Roger. Thank you.", pt: "Entendido. Obrigado." },
    ],
    phrases: [
      { en: "Good morning / Good afternoon / Good evening", pt: "Bom dia / Boa tarde / Boa noite", tip: "'Evening' é à noite ao chegar; 'night' só na despedida." },
      { en: "Nice to meet you.", pt: "Prazer em conhecer você.", tip: "Responda: 'Nice to meet you too.'" },
      { en: "Can you hear me?", pt: "Você consegue me ouvir?" },
      { en: "Copy that. / Roger.", pt: "Entendido.", tip: "Use no rádio para confirmar." },
      { en: "Say again, please.", pt: "Repita, por favor." },
      { en: "Spell it, please.", pt: "Soletre, por favor." },
    ],
    guidedExercise:
      "Complete soletrando com o código fonético:\n1. Seu primeiro nome, letra por letra.\n2. A palavra **BASE** (B-A-S-E → Bravo, Alpha, Sierra, Echo).\n3. A palavra **UNIT** (Uniform, November, India, Tango).\n\nDica: diga em voz alta cada letra como uma palavra inteira.",
    writingExercise:
      "Escreva 3 frases curtas em inglês: (1) cumprimente alguém de manhã, (2) diga 'prazer em conhecer você', (3) confirme que entendeu uma ordem. Depois, escreva seu sobrenome em código fonético.",
    speakingExercise:
      "Grave-se dizendo o diálogo acima no papel de 'You'. Foque no H aspirado de 'Hello/hear' e no som curto do 'i' em 'meet' (longo) vs 'it' (curto).",
    listeningExercise:
      "Ouça (use o botão 'Ouvir pronúncia' nas frases) 'Copy that' e 'Say again' três vezes. Tente identificar onde a voz sobe e desce. Repita imitando a entonação.",
    mission:
      "MISSÃO: apresente-se a um colega imaginário em inglês — cumprimente, diga seu nome, soletre o sobrenome em código fonético e confirme com 'Copy that'. Escreva ou grave o resultado.",
    checklist: [
      "Sei cumprimentar em 3 momentos do dia",
      "Conheço pelo menos 8 letras do código fonético",
      "Sei confirmar uma mensagem com 'Copy'/'Roger'",
      "Consigo soletrar meu sobrenome em inglês",
    ],
  },
  vocabulary: [
    { term: "Good morning", translation: "Bom dia", example: "Good morning, team.", pronunciation: "gúd mórning", category: "Saudações" },
    { term: "Nice to meet you", translation: "Prazer em conhecer você", example: "Nice to meet you, sir.", pronunciation: "náiss tchu mít iú", category: "Saudações" },
    { term: "Copy that", translation: "Entendido", example: "Copy that, moving now.", pronunciation: "cópi dét", category: "Rádio" },
    { term: "Roger", translation: "Entendido / certo", example: "Roger, on my way.", pronunciation: "rátcher", category: "Rádio" },
    { term: "Say again", translation: "Repita", example: "Say again, please.", pronunciation: "sêi ôguén", category: "Rádio" },
    { term: "Spell", translation: "Soletrar", example: "Spell your name.", pronunciation: "spél", category: "Comunicação" },
    { term: "Unit", translation: "Unidade", example: "What is your unit?", pronunciation: "iúnit", category: "Básico" },
    { term: "Base", translation: "Base", example: "Welcome to the base.", pronunciation: "bêis", category: "Básico" },
  ],
  flashcards: [
    { front: "Good morning", back: "Bom dia", example: "Good morning, team.", pronunciationTip: "gúd mórning", category: "Saudações" },
    { front: "Nice to meet you", back: "Prazer em conhecer você", example: "Nice to meet you too.", pronunciationTip: "náiss tchu mít iú", category: "Saudações" },
    { front: "Copy that", back: "Entendido", example: "Copy that, over.", pronunciationTip: "cópi dét", category: "Rádio" },
    { front: "Say again", back: "Repita", example: "Say again your last word.", pronunciationTip: "sêi ôguén", category: "Rádio" },
    { front: "Spell", back: "Soletrar", example: "Please spell it.", pronunciationTip: "spél", category: "Comunicação" },
    { front: "Unit", back: "Unidade", example: "Which unit are you with?", pronunciationTip: "iúnit", category: "Básico" },
  ],
  quiz: {
    title: "Quiz — Primeiros contatos",
    passScore: 70,
    questions: [
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Como se confirma que você entendeu uma mensagem no rádio?",
        explanation: "'Copy that' e 'Roger' significam 'entendido'. 'Say again' pede repetição.",
        options: [
          { text: "Copy that.", isCorrect: true },
          { text: "Say again.", isCorrect: false },
          { text: "Good night.", isCorrect: false },
          { text: "Spell it.", isCorrect: false },
        ],
      },
      {
        type: "TRANSLATE_PT_EN",
        prompt: "Traduza para o inglês: 'Prazer em conhecer você.'",
        explanation: "A forma padrão é 'Nice to meet you.'",
        correctAnswer: "Nice to meet you",
      },
      {
        type: "FILL_BLANK",
        prompt: "Complete: '____ again, please.' (peça para repetir)",
        explanation: "'Say again' é o pedido de repetição padrão no rádio.",
        correctAnswer: "Say",
      },
      {
        type: "TRANSLATE_EN_PT",
        prompt: "Traduza para o português: 'Spell your last name.'",
        explanation: "'Spell' = soletrar; 'last name' = sobrenome.",
        correctAnswer: "Soletre seu sobrenome",
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Qual saudação você usa ao chegar no fim da tarde/noite?",
        explanation: "'Good evening' é usado ao chegar à noite; 'Good night' é só na despedida.",
        options: [
          { text: "Good evening.", isCorrect: true },
          { text: "Good night.", isCorrect: false },
          { text: "Good afternoon.", isCorrect: false },
          { text: "Goodbye.", isCorrect: false },
        ],
      },
      {
        type: "WORD_ORDER",
        prompt: "Ordene as palavras: 'you / meet / to / nice'",
        explanation: "A ordem correta é 'Nice to meet you'.",
        correctAnswer: "Nice to meet you",
      },
    ],
  },
};
