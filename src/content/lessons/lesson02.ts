import type { LessonSeed } from "@/content/types";

export const lesson02: LessonSeed = {
  slug: "apresentar-se",
  title: "Apresentar-se em missão",
  order: 2,
  levelCode: "A1",
  objective:
    "Apresentar-se em inglês em contexto de missão: dizer nome, posto, unidade e origem usando o verbo 'to be' no presente.",
  durationMin: 14,
  summary:
    "Nova missão: identifique-se ao chegar à base — nome, posto, unidade e procedência — para que ninguém duvide de quem você é.",
  content: {
    warmup:
      "Você acaba de ser transferido para uma base internacional. O oficial de plantão pergunta: 'Who are you with?' e 'What is your rank?'. Para responder com segurança, você precisa dominar as apresentações básicas em inglês. Nesta aula, vamos aprender a usar o verbo **to be** para nos identificar completamente — nome, posto, unidade e origem.",
    grammar:
      "O verbo **to be** (ser/estar) é o mais importante do inglês. No presente, ele tem três formas:\n\n| Pronome | To be | Exemplo |\n|---|---|---|\n| I | am | I am a sergeant. |\n| You / We / They | are | You are from Brazil. |\n| He / She / It | is | He is the officer. |\n\nNo inglês falado, usamos muito a forma contraída: **I'm**, **You're**, **He's**, **She's**, **We're**, **They're**.\n\nPara perguntas, invertemos a ordem: **Are you a medic?** (Você é médico?) — diferente do português, que usa entonação: 'Você é médico?'.",
    comparison:
      "Em português, muitas vezes omitimos o pronome sujeito: 'Sou sargento', 'Somos da 2ª unidade'. **Em inglês, o pronome NUNCA é omitido**: sempre diga 'I am a sergeant' e 'We are from the 2nd unit'. Omitir o 'I' soa estranho e confunde o interlocutor. Outra diferença: em português temos gênero nos artigos ('o soldado', 'a soldada'); em inglês, **'a soldier'** serve para qualquer gênero.",
    falseFriends: [
      {
        en: "Private",
        pt: "Privado (secreto)",
        note: "'Private' como substantivo significa **soldado raso** (mais baixa patente). 'Privado/secreto' em inglês é 'classified' ou 'confidential'.",
      },
      {
        en: "Rank",
        pt: "Ranco (ranço/cheiro ruim)",
        note: "'Rank' significa **posto/patente** (sargento, cabo etc.). Não confunda com 'ranço' em português.",
      },
    ],
    dialogue: [
      { speaker: "Officer", en: "Who are you? State your name and rank.", pt: "Quem é você? Diga seu nome e posto." },
      { speaker: "You", en: "I'm Sergeant Lima, sir. I'm from the 2nd unit.", pt: "Sou o Sargento Lima, senhor. Sou da 2ª unidade." },
      { speaker: "Officer", en: "Where are you from, Sergeant?", pt: "De onde você vem, Sargento?" },
      { speaker: "You", en: "I'm from Brazil, sir. I'm with the infantry team.", pt: "Sou do Brasil, senhor. Estou com o time de infantaria." },
      { speaker: "Officer", en: "Are you the new radio operator?", pt: "Você é o novo operador de rádio?" },
      { speaker: "You", en: "No, sir. I'm a medic.", pt: "Não, senhor. Sou médico/paramédico." },
    ],
    phrases: [
      { en: "My name is...", pt: "Meu nome é...", tip: "Forma completa e formal. Na fala casual: 'I'm [nome]'." },
      { en: "I'm a private / sergeant / corporal.", pt: "Sou soldado raso / sargento / cabo.", tip: "Não use artigo com o nome depois do posto: 'Sergeant Lima', não 'a Sergeant Lima'." },
      { en: "I'm with the 2nd unit.", pt: "Estou com a 2ª unidade." },
      { en: "Where are you from?", pt: "De onde você é?", tip: "Responda: 'I'm from Brazil / the US / Portugal.'" },
      { en: "I'm from Brazil.", pt: "Sou do Brasil." },
      { en: "Nice to be here.", pt: "É um prazer estar aqui.", tip: "Boa frase para o momento de chegada a uma nova base." },
    ],
    guidedExercise:
      "Complete as frases com a forma correta do verbo **to be**:\n1. I ___ Corporal Santos.\n2. She ___ from Portugal.\n3. We ___ with the 3rd unit.\n4. ___ you the new driver? (Você é o novo motorista?)\n5. He ___ a medic.\n\nRespostas: 1. am | 2. is | 3. are | 4. Are | 5. is.",
    writingExercise:
      "Escreva uma mini-apresentação com 4 frases sobre você mesmo (ou um personagem fictício): (1) diga seu nome, (2) diga seu posto ou função, (3) diga de onde você é, (4) diga a que unidade pertence. Use contrações quando possível.",
    speakingExercise:
      "Leia o diálogo em voz alta no papel de 'You'. Foque na diferença entre **I'm** (rápido, contraído) e **I am** (mais formal, com ênfase). Pratique também a entonação ascendente em 'Are you the new radio operator?' — a voz sobe no final das perguntas.",
    listeningExercise:
      "Use o botão 'Ouvir pronúncia' em cada frase do diálogo. Preste atenção na diferença de som entre **rank** (ræŋk, como 'rêngk') e **rang** (passado de 'ring'). Repita cada linha depois de ouvir.",
    mission:
      "MISSÃO: escreva ou grave sua apresentação completa em inglês como se estivesse chegando a uma base internacional. Inclua: nome, posto/função, unidade e país de origem. Mínimo 4 frases. Boa sorte, agente.",
    checklist: [
      "Sei conjugar 'to be' em I / you / he / we / they",
      "Consigo dizer meu nome, posto e unidade em inglês",
      "Sei perguntar e responder 'Where are you from?'",
      "Entendo a diferença entre 'private' (posto) e 'privado' (secreto)",
    ],
  },
  vocabulary: [
    { term: "Rank", translation: "Posto / patente", example: "What is your rank?", pronunciation: "rêngk", category: "Militares" },
    { term: "Private", translation: "Soldado raso", example: "Private Torres, report here.", pronunciation: "práivit", category: "Postos" },
    { term: "Sergeant", translation: "Sargento", example: "Sergeant Lima is on duty.", pronunciation: "sárdjent", category: "Postos" },
    { term: "Corporal", translation: "Cabo", example: "Corporal Silva, stand by.", pronunciation: "córporal", category: "Postos" },
    { term: "Unit", translation: "Unidade", example: "I'm with the 2nd unit.", pronunciation: "iúnit", category: "Militares" },
    { term: "Officer", translation: "Oficial", example: "The officer is waiting.", pronunciation: "ófisser", category: "Postos" },
    { term: "Medic", translation: "Médico / paramédico", example: "We need a medic now.", pronunciation: "médik", category: "Funções" },
    { term: "Infantry", translation: "Infantaria", example: "He's with the infantry team.", pronunciation: "ínfantri", category: "Militares" },
  ],
  flashcards: [
    { front: "I am / I'm", back: "Eu sou / Eu estou", example: "I'm Sergeant Lima.", pronunciationTip: "ái æm / áim", category: "Verbo to be" },
    { front: "Where are you from?", back: "De onde você é?", example: "Where are you from, soldier?", pronunciationTip: "wér ar iú fróm", category: "Perguntas" },
    { front: "Rank", back: "Posto / patente", example: "State your rank.", pronunciationTip: "rêngk", category: "Militares" },
    { front: "Private", back: "Soldado raso", example: "Private Santos, fall in.", pronunciationTip: "práivit", category: "Postos" },
    { front: "I'm with the 2nd unit.", back: "Estou com a 2ª unidade.", example: "I'm with the 2nd unit, sir.", pronunciationTip: "áim uid dê sékend iúnit", category: "Apresentação" },
    { front: "Medic", back: "Médico / paramédico", example: "Are you the medic?", pronunciationTip: "médik", category: "Funções" },
  ],
  quiz: {
    title: "Quiz — Apresentar-se em missão",
    passScore: 70,
    questions: [
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Qual a forma correta para dizer 'Sou do Brasil'?",
        explanation: "Com o pronome 'I', o verbo 'to be' é sempre 'am'. A forma contraída 'I'm' também é aceita.",
        options: [
          { text: "I am from Brazil.", isCorrect: true },
          { text: "I is from Brazil.", isCorrect: false },
          { text: "I are from Brazil.", isCorrect: false },
          { text: "Me from Brazil.", isCorrect: false },
        ],
      },
      {
        type: "FILL_BLANK",
        prompt: "Complete: 'I ___ a sergeant.' (Sou um sargento.)",
        explanation: "Com o pronome 'I', o verbo 'to be' é 'am'.",
        correctAnswer: "am",
      },
      {
        type: "TRANSLATE_PT_EN",
        prompt: "Traduza para o inglês: 'De onde você é?'",
        explanation: "A pergunta padrão é 'Where are you from?' — observe que 'from' vem no final.",
        correctAnswer: "Where are you from",
      },
      {
        type: "WORD_ORDER",
        prompt: "Ordene as palavras: 'unit / with / I'm / the / 2nd'",
        explanation: "A ordem correta é 'I'm with the 2nd unit', seguindo a estrutura Sujeito + Verbo + Complemento.",
        correctAnswer: "I'm with the 2nd unit",
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "O que significa 'private' em inglês militar?",
        explanation: "'Private' como posto militar significa soldado raso. Não confunda com 'privado/secreto' (classified).",
        options: [
          { text: "Soldado raso (mais baixa patente)", isCorrect: true },
          { text: "Secreto / confidencial", isCorrect: false },
          { text: "Sargento", isCorrect: false },
          { text: "Oficial", isCorrect: false },
        ],
      },
      {
        type: "TRANSLATE_EN_PT",
        prompt: "Traduza para o português: 'She is the new officer.'",
        explanation: "'She is' = 'Ela é'; 'new' = 'nova'; 'officer' = 'oficial'.",
        correctAnswer: "Ela é a nova oficial",
      },
    ],
  },
};
