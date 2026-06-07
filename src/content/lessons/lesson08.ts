import type { LessonSeed } from "@/content/types";

export const lesson08: LessonSeed = {
  slug: "equipamento-e-suprimentos",
  title: "Equipamento, suprimentos e logística",
  order: 8,
  levelCode: "A2",
  objective:
    "Falar sobre equipamentos e suprimentos em inglês, fazer pedidos de logística e usar corretamente some/any com substantivos contáveis e incontáveis.",
  durationMin: 18,
  summary:
    "Missão de suprimentos: garanta que seu time tenha tudo o que precisa usando o vocabulário certo de equipamento e as estruturas de pedido em inglês.",
  content: {
    warmup:
      "Imagine que você está no depósito de suprimentos antes de uma operação. Seu sargento pede para conferir o estoque e solicitar o que falta. Para se comunicar em inglês nessa situação, você precisa saber perguntar 'temos suficiente?' e pedir o que falta. Vamos aprender as ferramentas linguísticas para essa missão de logística.",
    grammar:
      "Em inglês, os substantivos se dividem em **contáveis** (*countable*) e **incontáveis** (*uncountable*):\n\n**Contáveis** (*countable*): podem ser contados individualmente. Têm plural.\n- a radio → two radios\n- a battery → three batteries\n- Pergunta com **many**: 'How many radios do we have?'\n- Negação com **any**: 'We don't have any spare batteries.'\n\n**Incontáveis** (*uncountable*): não têm plural; referem-se a substâncias, materiais ou conceitos.\n- water, fuel, ammunition, equipment\n- Pergunta com **much**: 'How much fuel do we have?'\n- Negação com **any**: 'We don't have any water.'\n\n**Some** é usado em frases afirmativas e em pedidos/ofertas:\n- 'We need **some** rope.' / 'Do you have **some** time?'\n\n**Any** aparece em perguntas neutras e frases negativas:\n- 'Do we have **any** spare magazines?' / 'There isn't **any** fuel left.'\n\nPara fazer pedidos de logística:\n- **We need + substantivo**: 'We need more batteries.'\n- **Do we have enough + substantivo?**: 'Do we have enough water?'\n- **I prefer + substantivo/gerúndio**: 'I prefer the lighter vest.' (preferência de equipamento)",
    comparison:
      "Em português não distinguimos 'much' de 'many' — dizemos 'quanto' para tudo. Em inglês essa distinção é obrigatória: **much** para incontáveis, **many** para contáveis. Outro ponto: em português dizemos 'equipamento' tanto para um item quanto para vários; em inglês *equipment* é sempre incontável (sem plural). Não existe 'equipments'!\n\nA estrutura 'Do we have enough...?' corresponde ao nosso 'Temos suficiente...?' — muito útil para conferência de estoque.",
    falseFriends: [
      {
        en: "Ammunition",
        pt: "Animação",
        note: "'Ammunition' significa **munição**, não 'animação'. 'Animação' em inglês = animation ou excitement.",
      },
      {
        en: "Supply",
        pt: "Suplicar",
        note: "'Supply' significa **fornecimento/suprimento**, não 'suplicar'. 'Suplicar' = to beg/plead.",
      },
    ],
    dialogue: [
      {
        speaker: "Sergeant",
        en: "Before we move out, let's check the supplies. Do we have enough water for all personnel?",
        pt: "Antes de sairmos, vamos conferir os suprimentos. Temos água suficiente para todo o pessoal?",
      },
      {
        speaker: "You",
        en: "We have some water, but not enough. We need at least four more liters.",
        pt: "Temos um pouco de água, mas não o suficiente. Precisamos de pelo menos quatro litros a mais.",
      },
      {
        speaker: "Sergeant",
        en: "How many spare batteries do we have for the radios?",
        pt: "Quantas baterias reservas temos para os rádios?",
      },
      {
        speaker: "You",
        en: "We don't have any spare batteries, sir. I recommend we request a resupply before departure.",
        pt: "Não temos nenhuma bateria reserva, senhor. Recomendo que solicitemos reabastecimento antes da partida.",
      },
      {
        speaker: "Sergeant",
        en: "Good call. Do you prefer the standard kit or the lightweight version for this mission?",
        pt: "Boa decisão. Você prefere o kit padrão ou a versão leve para essa missão?",
      },
      {
        speaker: "You",
        en: "I prefer the lightweight version. There isn't much space in the vehicle.",
        pt: "Prefiro a versão leve. Não há muito espaço no veículo.",
      },
    ],
    phrases: [
      {
        en: "We need more ammunition / fuel / water.",
        pt: "Precisamos de mais munição / combustível / água.",
        tip: "Use 'more' antes do substantivo para indicar que falta quantidade.",
      },
      {
        en: "Do we have enough supplies?",
        pt: "Temos suprimentos suficientes?",
        tip: "'Enough' vem antes do substantivo: 'enough water', 'enough batteries'.",
      },
      {
        en: "There isn't any fuel left.",
        pt: "Não sobrou nenhum combustível.",
      },
      {
        en: "How many units do we have?",
        pt: "Quantas unidades temos?",
        tip: "Use 'many' com contáveis (units, radios, kits).",
      },
      {
        en: "I prefer the standard equipment.",
        pt: "Prefiro o equipamento padrão.",
        tip: "'Equipment' é incontável — nunca diga 'equipments'.",
      },
      {
        en: "We need some rope and a few carabiners.",
        pt: "Precisamos de um pouco de corda e alguns mosquetões.",
        tip: "'Some' para incontáveis; 'a few' para contáveis.",
      },
    ],
    guidedExercise:
      "Classifique os itens abaixo como contável (C) ou incontável (I) e forme uma pergunta com 'How many' ou 'How much':\n\n1. radio → (C) → 'How many radios do we have?'\n2. fuel → (I) → 'How much fuel do we have?'\n3. battery → ?\n4. water → ?\n5. vest → ?\n6. ammunition → ?\n\nDepois, forme frases negativas com 'any' para os itens 3, 4, 5 e 6.",
    writingExercise:
      "Você é o responsável de logística. Escreva um relatório curto (4-5 frases) em inglês informando:\n- O que você TEM (some)\n- O que está FALTANDO (don't have any / not enough)\n- O que PRECISA ser solicitado (we need)\nUse pelo menos dois contáveis e dois incontáveis.",
    speakingExercise:
      "Pratique em voz alta o diálogo acima, no papel de 'You'. Depois, invente uma situação onde você verifica o estoque de outros três itens (ex.: flashlights, rope, medical supplies) e diga as frases em voz alta usando some, any, much e many.",
    listeningExercise:
      "Ouça a pronúncia das palavras 'ammunition', 'equipment', 'supplies' e 'enough'. Repita três vezes cada uma. Preste atenção: 'enough' soa como 'inóff' — o 'gh' final vira som de 'f'.",
    mission:
      "MISSÃO LOGÍSTICA: você tem 5 minutos para fazer um inventário imaginário. Liste em inglês 6 itens de equipamento (3 contáveis, 3 incontáveis), indique a quantidade ou status de cada um com some/any/enough, e escreva 2 pedidos de reabastecimento usando 'We need...'.",
    checklist: [
      "Sei a diferença entre substantivos contáveis e incontáveis em inglês",
      "Uso 'much' com incontáveis e 'many' com contáveis corretamente",
      "Sei fazer pedidos de logística com 'We need...' e 'Do we have enough...?'",
      "Não uso 'equipments' (sei que 'equipment' é incontável e sem plural)",
    ],
  },
  vocabulary: [
    {
      term: "equipment",
      translation: "equipamento",
      example: "Check all the equipment before departure.",
      pronunciation: "iquípiment",
      category: "Logística",
    },
    {
      term: "supplies",
      translation: "suprimentos",
      example: "We are running low on supplies.",
      pronunciation: "saplâiz",
      category: "Logística",
    },
    {
      term: "ammunition",
      translation: "munição",
      example: "There isn't any ammunition left.",
      pronunciation: "amiuníchen",
      category: "Equipamento",
    },
    {
      term: "fuel",
      translation: "combustível",
      example: "How much fuel do we have?",
      pronunciation: "fiuol",
      category: "Logística",
    },
    {
      term: "spare",
      translation: "reserva / sobressalente",
      example: "Do you have any spare batteries?",
      pronunciation: "spér",
      category: "Equipamento",
    },
    {
      term: "enough",
      translation: "suficiente",
      example: "We don't have enough water.",
      pronunciation: "inóff",
      category: "Quantidades",
    },
    {
      term: "resupply",
      translation: "reabastecimento",
      example: "We need to request a resupply.",
      pronunciation: "rissaplâi",
      category: "Logística",
    },
    {
      term: "lightweight",
      translation: "leve / de peso reduzido",
      example: "I prefer the lightweight vest.",
      pronunciation: "lâitguêit",
      category: "Equipamento",
    },
  ],
  flashcards: [
    {
      front: "How much fuel do we have?",
      back: "Quanto combustível temos?",
      example: "How much fuel do we have for the convoy?",
      pronunciationTip: "hau mâtch fiuol du ui hév",
      category: "Quantidades",
    },
    {
      front: "How many batteries do we need?",
      back: "De quantas baterias precisamos?",
      example: "How many batteries do we need for the radios?",
      pronunciationTip: "hau méni bétteriz du ui níd",
      category: "Quantidades",
    },
    {
      front: "We don't have any spare parts.",
      back: "Não temos nenhuma peça reserva.",
      example: "We don't have any spare parts for this vehicle.",
      pronunciationTip: "ui dônt hév éni spér parts",
      category: "Negação",
    },
    {
      front: "equipment",
      back: "equipamento (incontável)",
      example: "The equipment is ready.",
      pronunciationTip: "iquípiment",
      category: "Vocabulário",
    },
    {
      front: "We need some rope.",
      back: "Precisamos de um pouco de corda.",
      example: "We need some rope to secure the load.",
      pronunciationTip: "ui níd sâm rôup",
      category: "Pedidos",
    },
    {
      front: "Do we have enough supplies?",
      back: "Temos suprimentos suficientes?",
      example: "Do we have enough supplies for three days?",
      pronunciationTip: "du ui hév inóff saplâiz",
      category: "Pedidos",
    },
  ],
  quiz: {
    title: "Quiz — Equipamento e suprimentos",
    passScore: 70,
    questions: [
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Qual frase está correta para perguntar sobre uma substância incontável?",
        explanation: "Com substantivos incontáveis como 'water', usamos 'How much', nunca 'How many'.",
        options: [
          { text: "How much water do we have?", isCorrect: true },
          { text: "How many water do we have?", isCorrect: false },
          { text: "How much waters do we have?", isCorrect: false },
          { text: "How many waters do we have?", isCorrect: false },
        ],
      },
      {
        type: "FILL_BLANK",
        prompt: "Complete com 'some' ou 'any': 'We don't have ____ spare batteries.'",
        explanation: "Em frases negativas, usamos 'any': 'We don't have any spare batteries.'",
        correctAnswer: "any",
      },
      {
        type: "TRANSLATE_PT_EN",
        prompt: "Traduza para o inglês: 'Precisamos de mais combustível.'",
        explanation: "'Fuel' é incontável; a frase correta é 'We need more fuel.' Sem plural.",
        correctAnswer: "We need more fuel",
      },
      {
        type: "FIND_ERROR",
        prompt: "Qual frase tem erro?",
        explanation: "'Equipment' é incontável em inglês — nunca recebe 's' no plural. A forma correta é 'The equipment is ready.'",
        options: [
          { text: "The equipments are ready.", isCorrect: true },
          { text: "The equipment is ready.", isCorrect: false },
          { text: "We have some equipment.", isCorrect: false },
        ],
      },
      {
        type: "TRANSLATE_EN_PT",
        prompt: "Traduza para o português: 'Do we have enough ammunition?'",
        explanation: "'Enough' = suficiente; 'ammunition' = munição. A frase pergunta se há munição suficiente.",
        correctAnswer: "Temos munição suficiente?",
      },
      {
        type: "WORD_ORDER",
        prompt: "Ordene as palavras: 'any / have / don't / fuel / we'",
        explanation: "A ordem correta é 'We don't have any fuel.' — sujeito + auxiliar negativo + verbo + complemento.",
        correctAnswer: "We don't have any fuel",
      },
    ],
  },
};
