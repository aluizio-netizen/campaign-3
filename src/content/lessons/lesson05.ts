import type { LessonSeed } from "@/content/types";

export const lesson05: LessonSeed = {
  slug: "pedidos-no-refeitorio",
  title: "Pedidos no refeitório",
  order: 5,
  levelCode: "A1",
  objective:
    "Pedir comida, bebida e informações simples no refeitório usando 'Can I have...?' e 'I'd like...'.",
  durationMin: 12,
  summary:
    "Missão alimentação: aprenda a se virar no mess hall, pedir o que você precisa e agradecer — tudo em inglês.",
  content: {
    warmup:
      "Você chegou ao refeitório da base (em inglês: **mess hall** ou **canteen**) depois de um longo turno. Precisa pedir comida, uma bebida e descobrir onde fica o açúcar. Sem saber como pedir em inglês, você fica na fila sem comer! Vamos aprender as frases essenciais para não passar fome na missão.",
    grammar:
      "Para fazer pedidos educados, o inglês usa duas estruturas principais:\n\n**1. Can I have...?** — 'Posso ter...?' / 'Você me dá...?'\nÉ a forma mais simples e direta:\n- *Can I have some coffee, please?* (Posso tomar um café, por favor?)\n- *Can I have the menu?* (Pode me dar o cardápio?)\n\n**2. I'd like...** — 'Eu gostaria de...' (forma mais educada)\n'I'd like' é a contração de *I would like*. Use quando quiser soar mais formal ou educado:\n- *I'd like a sandwich, please.* (Gostaria de um sanduíche, por favor.)\n- *I'd like some water.* (Gostaria de um pouco de água.)\n\nAmbas funcionam no cotidiano; 'I'd like' é ligeiramente mais elegante.",
    comparison:
      "Em português dizemos 'Me dá um café?' (informal) ou 'Eu queria um café' (educado). O inglês funciona igual: **Can I have...?** é o informal do dia a dia, e **I'd like...** é o mais cortês. Evite dizer apenas *'I want...'* (Eu quero...) em pedidos — funciona, mas pode soar rude para falantes nativos, como dizer 'me dá' sem nenhuma suavização.",
    falseFriends: [
      {
        en: "Menu",
        pt: "Menú (cardápio completo)",
        note: "'Menu' em inglês é o **cardápio**, igual ao português. Mas 'entrée' em inglês americano significa **prato principal**, não entrada — cuidado na hora de pedir!",
      },
      {
        en: "Juice",
        pt: "Jus (francês) / 'Djus'",
        note: "'Juice' (suco) se pronuncia **'djúss'**, não 'juss'. O 'j' inglês é como o 'dj' de 'djinn'.",
      },
    ],
    dialogue: [
      { speaker: "You", en: "Good morning. Can I have some coffee, please?", pt: "Bom dia. Posso tomar um café, por favor?" },
      { speaker: "Staff", en: "Sure! Anything else?", pt: "Claro! Mais alguma coisa?" },
      { speaker: "You", en: "I'd like a sandwich, please.", pt: "Gostaria de um sanduíche, por favor." },
      { speaker: "Staff", en: "Chicken or tuna?", pt: "Frango ou atum?" },
      { speaker: "You", en: "Chicken, please. Where is the sugar?", pt: "Frango, por favor. Onde fica o açúcar?" },
      { speaker: "Staff", en: "It's on the table, next to the salt.", pt: "Está na mesa, ao lado do sal." },
    ],
    phrases: [
      { en: "Can I have...?", pt: "Posso ter...? / Você me dá...?", tip: "Use para pedir qualquer coisa de forma educada e simples." },
      { en: "I'd like..., please.", pt: "Eu gostaria de..., por favor.", tip: "'I'd' = I would — forma contraída; soa mais educado." },
      { en: "Where is the...?", pt: "Onde fica o/a...?", tip: "Pergunte sobre qualquer item ou lugar." },
      { en: "Anything else?", pt: "Mais alguma coisa?", tip: "O atendente vai perguntar isso — responda 'No, thank you.' ou faça outro pedido." },
      { en: "That's all, thank you.", pt: "É só isso, obrigado.", tip: "Encerrando o pedido educadamente." },
      { en: "How much is it?", pt: "Quanto custa?", tip: "Útil se houver cobrança no refeitório." },
    ],
    guidedExercise:
      "Pratique completando as frases abaixo em voz alta ou por escrito:\n1. '_____ I have some water, please?' (use a forma simples)\n2. 'I'd _____ a soup, please.' (forma mais educada)\n3. '_____ is the bread?' (perguntar onde está)\n4. Responda a 'Anything else?' com uma frase completa em inglês.",
    writingExercise:
      "Escreva um mini-diálogo de 4 falas: você entra no refeitório, pede uma refeição e uma bebida, pergunta onde fica o ketchup e agradece ao atendente. Use 'Can I have' numa fala e 'I'd like' em outra.",
    speakingExercise:
      "Grave-se fazendo o pedido completo do diálogo desta aula (papel de 'You'). Preste atenção na pronúncia de 'I'd like' — o 'd' de 'I'd' é quase silencioso; soa como 'ái laik'.",
    listeningExercise:
      "Ouça as frases 'Can I have some coffee?' e 'I'd like a sandwich' usando o botão de pronúncia. Note como 'can' em pedidos é pronunciado fraco ('k'n'), diferente de 'CAN' enfático.",
    mission:
      "MISSÃO REFEITÓRIO: escreva ou grave seu pedido completo para o almoço de hoje — use 'Can I have' para a comida, 'I'd like' para a bebida e faça uma pergunta com 'Where is...?'. Mínimo de 4 frases.",
    checklist: [
      "Sei usar 'Can I have...?' para fazer um pedido simples",
      "Sei usar 'I'd like...' para um pedido mais educado",
      "Conheço pelo menos 5 itens de comida e bebida em inglês",
      "Sei perguntar onde fica algo com 'Where is...?'",
    ],
  },
  vocabulary: [
    { term: "Coffee", translation: "Café", example: "Can I have some coffee?", pronunciation: "cófi", category: "Bebidas" },
    { term: "Water", translation: "Água", example: "I'd like some water, please.", pronunciation: "uóter", category: "Bebidas" },
    { term: "Juice", translation: "Suco", example: "Can I have orange juice?", pronunciation: "djúss", category: "Bebidas" },
    { term: "Sandwich", translation: "Sanduíche", example: "I'd like a chicken sandwich.", pronunciation: "sênduitchi", category: "Comida" },
    { term: "Soup", translation: "Sopa", example: "Can I have some soup?", pronunciation: "súp", category: "Comida" },
    { term: "Bread", translation: "Pão", example: "Where is the bread?", pronunciation: "brêd", category: "Comida" },
    { term: "Sugar", translation: "Açúcar", example: "Where is the sugar?", pronunciation: "shúguer", category: "Condimentos" },
    { term: "Menu", translation: "Cardápio", example: "Can I have the menu, please?", pronunciation: "méniu", category: "Refeitório" },
  ],
  flashcards: [
    { front: "Can I have...?", back: "Posso ter...? / Você me dá...?", example: "Can I have some coffee?", pronunciationTip: "k'n ái rév", category: "Pedidos" },
    { front: "I'd like...", back: "Eu gostaria de...", example: "I'd like a sandwich, please.", pronunciationTip: "ái laik", category: "Pedidos" },
    { front: "Where is the...?", back: "Onde fica o/a...?", example: "Where is the sugar?", pronunciationTip: "uér iz de", category: "Perguntas" },
    { front: "Anything else?", back: "Mais alguma coisa?", example: "Anything else? — No, thank you.", pronunciationTip: "ênitin éls", category: "Refeitório" },
    { front: "Juice", back: "Suco", example: "Can I have some orange juice?", pronunciationTip: "djúss", category: "Bebidas" },
    { front: "Sandwich", back: "Sanduíche", example: "I'd like a tuna sandwich.", pronunciationTip: "sênduitchi", category: "Comida" },
  ],
  quiz: {
    title: "Quiz — Pedidos no refeitório",
    passScore: 70,
    questions: [
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Qual frase é a forma MAIS educada para pedir um café?",
        explanation: "'I'd like some coffee' usa 'would like', que é mais formal e educado que 'Can I have' ou 'I want'.",
        options: [
          { text: "I want coffee.", isCorrect: false },
          { text: "I'd like some coffee, please.", isCorrect: true },
          { text: "Give me coffee.", isCorrect: false },
          { text: "Coffee!", isCorrect: false },
        ],
      },
      {
        type: "FILL_BLANK",
        prompt: "Complete com a palavra certa: '_____ I have some water, please?' (pedido simples)",
        explanation: "'Can I have' é a estrutura padrão para pedidos simples e educados no cotidiano.",
        correctAnswer: "Can",
      },
      {
        type: "TRANSLATE_PT_EN",
        prompt: "Traduza para o inglês: 'Onde fica o açúcar?'",
        explanation: "'Where is the sugar?' é a pergunta correta. 'Sugar' = açúcar, pronunciado 'shúguer'.",
        correctAnswer: "Where is the sugar?",
      },
      {
        type: "WORD_ORDER",
        prompt: "Ordene as palavras: 'like / sandwich / I'd / a / please'",
        explanation: "A ordem correta é 'I'd like a sandwich, please.' — sujeito + verbo + objeto.",
        correctAnswer: "I'd like a sandwich please",
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Como você responde a 'Anything else?' quando não quer mais nada?",
        explanation: "'No, thank you' é a resposta padrão e educada para encerrar o pedido.",
        options: [
          { text: "Yes, please.", isCorrect: false },
          { text: "No, thank you.", isCorrect: true },
          { text: "Where is it?", isCorrect: false },
          { text: "I don't know.", isCorrect: false },
        ],
      },
      {
        type: "TRANSLATE_EN_PT",
        prompt: "Traduza para o português: 'Can I have the menu, please?'",
        explanation: "'Can I have' = posso ter/você me dá; 'menu' = cardápio.",
        correctAnswer: "Posso ver o cardápio, por favor?",
      },
    ],
  },
};
