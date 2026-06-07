import type { LessonSeed } from "@/content/types";

export const lesson03: LessonSeed = {
  slug: "verbos-essenciais",
  title: "Verbos essenciais e ordens básicas",
  order: 3,
  levelCode: "A1",
  objective:
    "Usar os verbos 'to be' e 'to have' no presente e compreender ordens básicas no imperativo para reagir corretamente em campo.",
  durationMin: 16,
  summary:
    "Missão de campo: entenda e execute ordens em inglês — quem domina os verbos essenciais nunca fica parado quando o comando é dado.",
  content: {
    warmup:
      "Em uma operação, ordens chegam rápido e em inglês. 'Stand by!', 'Move!', 'Hold!' — cada segundo conta. Mas para também fazer perguntas e obter o que precisa, você vai usar os verbos **to be** e **to have**. Nesta aula combinamos gramática prática com as ordens mais comuns do ambiente de missão.",
    grammar:
      "**Verbo TO HAVE (ter)** no presente:\n\n| Pronome | To have | Exemplo |\n|---|---|---|\n| I / You / We / They | have | I have a map. |\n| He / She / It | has | She has the radio. |\n\nForma contraída: **I've**, **you've**, **we've**, **they've** / **he's got**, **she's got** (inglês britânico usa muito 'have got').\n\n**Pergunta com 'Do/Does':**\n- Do you have a pen? (Você tem uma caneta?)\n- Does he have the report? (Ele tem o relatório?)\n\n**Imperativo (ordens):** use o verbo no infinitivo sem 'to' e sem pronome:\n- Move! (Mova-se!)\n- Stand by! (Fique de prontidão!)\n- Hold! (Segure / Pare!)\n- Take cover! (Abaixe-se / Busque cobertura!)\n\nNote: o imperativo em inglês não tem conjugação — é a mesma forma para uma ou cem pessoas.",
    comparison:
      "Em português, usamos 'ter' tanto para posse quanto para obrigação ('tenho que ir'). Em inglês, posse é **have** e obrigação é **have to** ou **must**: 'I have to go.' (Tenho que ir.). Não confunda!\n\nOutra diferença: em português a ordem pode vir suavizada ('Pode se mover?'); em inglês militar, o imperativo direto é a norma — 'Move!' não é grosseria, é clareza operacional.",
    falseFriends: [
      {
        en: "Hold",
        pt: "Holde (segurar no jogo de cartas)",
        note: "'Hold!' como ordem militar significa **pare / não avance / aguarde**. Não tem relação com o jogo de pôquer.",
      },
      {
        en: "Cover",
        pt: "Capa / cobertura de livro",
        note: "Em contexto de missão, 'Take cover!' significa **buscar proteção/abrigo**, não cobrir um objeto.",
      },
    ],
    dialogue: [
      { speaker: "Commander", en: "Stand by. Do you have your equipment?", pt: "Fique de prontidão. Você tem seu equipamento?" },
      { speaker: "You", en: "Yes, I have everything. I'm ready.", pt: "Sim, tenho tudo. Estou pronto." },
      { speaker: "Commander", en: "Does your partner have the radio?", pt: "Seu parceiro tem o rádio?" },
      { speaker: "You", en: "He has the radio and the map.", pt: "Ele tem o rádio e o mapa." },
      { speaker: "Commander", en: "Good. Move to sector two. Hold at the checkpoint.", pt: "Bom. Mova-se para o setor dois. Pare no posto de controle." },
      { speaker: "You", en: "Copy that. Moving now.", pt: "Entendido. Movendo agora." },
    ],
    phrases: [
      { en: "Stand by.", pt: "Fique de prontidão / Aguarde.", tip: "Uma das ordens mais comuns em rádio e em campo." },
      { en: "Move!", pt: "Mova-se! / Avance!", tip: "Curto e direto — imperativo sem pronome." },
      { en: "Hold!", pt: "Pare! / Segure! / Aguarde!", tip: "Pode significar 'não avance' ou 'segure a posição'." },
      { en: "Take cover!", pt: "Busque cobertura / abrigo!", tip: "Ordem para se proteger." },
      { en: "I have a question.", pt: "Tenho uma pergunta.", tip: "Use para interromper respeitosamente." },
      { en: "Do you have the report?", pt: "Você tem o relatório?", tip: "Com 'I/you/we/they' a pergunta usa 'Do'; com 'he/she/it' usa 'Does'." },
    ],
    guidedExercise:
      "Complete com **have**, **has**, **do** ou **does**:\n1. I ___ a question.\n2. She ___ the map.\n3. ___ you have your ID?\n4. ___ he have the radio?\n5. They ___ all the equipment.\n\nRespostas: 1. have | 2. has | 3. Do | 4. Does | 5. have.",
    writingExercise:
      "Escreva 4 frases: (1) uma ordem no imperativo para um colega se mover, (2) diga que você tem o equipamento, (3) pergunte se ela/ele tem o mapa, (4) diga para aguardar. Use as estruturas aprendidas nesta aula.",
    speakingExercise:
      "Pratique as ordens em voz alta com tom firme e claro: 'Stand by!', 'Move!', 'Hold!', 'Take cover!'. Depois, leia o diálogo inteiro no papel de 'You'. Atenção: o 'h' de 'Hold' e 'Have' é aspirado — sai ar pela boca.",
    listeningExercise:
      "Ouça (botão 'Ouvir pronúncia') a diferença entre 'have' (hæv, termina em 'v') e 'has' (hæz, termina em 'z'). São sons bem distintos no final. Repita cada um três vezes alternando: 'I have — she has — they have — he has'.",
    mission:
      "MISSÃO: imagine que você é o comandante. Escreva uma sequência de 5 ordens em inglês para um colega imaginário, usando o imperativo. Em seguida, escreva 2 perguntas com 'Do you have...?' para verificar se ele tem o equipamento necessário.",
    checklist: [
      "Sei conjugar 'to have' com todos os pronomes no presente",
      "Sei formar perguntas com 'Do you have...?' e 'Does he have...?'",
      "Conheço e entendo as 4 ordens básicas: Stand by, Move, Hold, Take cover",
      "Entendo a diferença entre imperativo em inglês e em português",
    ],
  },
  vocabulary: [
    { term: "Stand by", translation: "Fique de prontidão / Aguarde", example: "Stand by for orders.", pronunciation: "stænd bái", category: "Ordens" },
    { term: "Move", translation: "Mova-se / Avance", example: "Move to the next position.", pronunciation: "múuv", category: "Ordens" },
    { term: "Hold", translation: "Pare / Segure a posição", example: "Hold at the checkpoint.", pronunciation: "hôuld", category: "Ordens" },
    { term: "Take cover", translation: "Busque cobertura / abrigo", example: "Take cover behind the wall.", pronunciation: "têik cóver", category: "Ordens" },
    { term: "Equipment", translation: "Equipamento", example: "Do you have your equipment?", pronunciation: "ikuípment", category: "Básico" },
    { term: "Map", translation: "Mapa", example: "She has the map.", pronunciation: "mæp", category: "Básico" },
    { term: "Checkpoint", translation: "Posto de controle", example: "Hold at the checkpoint.", pronunciation: "tchékpoint", category: "Militares" },
    { term: "Report", translation: "Relatório / informe", example: "Does he have the report?", pronunciation: "ripórt", category: "Comunicação" },
  ],
  flashcards: [
    { front: "I have / He has", back: "Eu tenho / Ele tem", example: "I have a map. He has the radio.", pronunciationTip: "ái hæv / hi hæz", category: "Verbo to have" },
    { front: "Stand by", back: "Fique de prontidão / Aguarde", example: "Stand by for further instructions.", pronunciationTip: "stænd bái", category: "Ordens" },
    { front: "Hold!", back: "Pare! / Segure a posição!", example: "Hold! Do not advance.", pronunciationTip: "hôuld", category: "Ordens" },
    { front: "Do you have...?", back: "Você tem...?", example: "Do you have the ID?", pronunciationTip: "du iú hæv", category: "Perguntas" },
    { front: "Take cover", back: "Busque cobertura", example: "Take cover now!", pronunciationTip: "têik cóver", category: "Ordens" },
    { front: "Move!", back: "Mova-se! / Avance!", example: "Move to sector three.", pronunciationTip: "múuv", category: "Ordens" },
  ],
  quiz: {
    title: "Quiz — Verbos essenciais e ordens básicas",
    passScore: 70,
    questions: [
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Qual a forma correta com 'she' (ela)?",
        explanation: "Com 'he', 'she' e 'it', o verbo 'to have' vira 'has'. Com os demais pronomes, usa-se 'have'.",
        options: [
          { text: "She has the radio.", isCorrect: true },
          { text: "She have the radio.", isCorrect: false },
          { text: "She is have the radio.", isCorrect: false },
          { text: "She does has the radio.", isCorrect: false },
        ],
      },
      {
        type: "FILL_BLANK",
        prompt: "Complete: '___ you have the map?' (Você tem o mapa?)",
        explanation: "Perguntas com 'you', 'I', 'we', 'they' no presente usam 'Do' como auxiliar.",
        correctAnswer: "Do",
      },
      {
        type: "TRANSLATE_PT_EN",
        prompt: "Traduza para o inglês a ordem: 'Busque cobertura!'",
        explanation: "'Take cover!' é a ordem padrão para buscar proteção/abrigo.",
        correctAnswer: "Take cover",
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Qual frase está no imperativo correto?",
        explanation: "O imperativo em inglês usa o verbo base sem pronome e sem conjugação.",
        options: [
          { text: "Move!", isCorrect: true },
          { text: "You move!", isCorrect: false },
          { text: "Moving!", isCorrect: false },
          { text: "To move!", isCorrect: false },
        ],
      },
      {
        type: "WORD_ORDER",
        prompt: "Ordene as palavras: 'equipment / you / your / do / have'",
        explanation: "Pergunta com 'do': auxiliar + sujeito + verbo + objeto = 'Do you have your equipment?'",
        correctAnswer: "Do you have your equipment",
      },
      {
        type: "TRANSLATE_EN_PT",
        prompt: "Traduza para o português: 'Stand by for orders.'",
        explanation: "'Stand by' = fique de prontidão / aguarde; 'for orders' = para ordens/instruções.",
        correctAnswer: "Fique de prontidão para as ordens",
      },
    ],
  },
};
