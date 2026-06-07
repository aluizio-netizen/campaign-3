import type { LessonSeed } from "@/content/types";

export const lesson04: LessonSeed = {
  slug: "familia-e-funcao",
  title: "Família, nacionalidade e função",
  order: 4,
  levelCode: "A1",
  objective:
    "Falar sobre nacionalidade, ramos das forças armadas, funções operacionais e membros da família em inglês usando 'to be' e vocabulário essencial.",
  durationMin: 15,
  summary:
    "Missão de reconhecimento pessoal: apresente sua origem, seu ramo de atuação e sua equipe — porque conhecer o seu pessoal é tão importante quanto conhecer o terreno.",
  content: {
    warmup:
      "Durante uma operação multinacional, você vai conviver com pessoas de vários países e ramos. Alguém pode perguntar 'Are you Army or Navy?' ou 'Is your brother in the military too?'. Saber responder sobre sua nacionalidade, seu ramo e até sua família cria laços de confiança com a equipe. Nesta aula, vamos aprender esse vocabulário essencial de identidade.",
    grammar:
      "**Nacionalidade em inglês:** usamos o adjetivo de nacionalidade após o verbo 'to be':\n- I'm Brazilian. (Sou brasileiro/a.)\n- She's American. (Ela é americana.)\n- He's Portuguese. (Ele é português.)\n\nAtenção: em inglês, adjetivos de nacionalidade são sempre escritos com **letra maiúscula**: Brazilian, French, Italian, Japanese.\n\n**Profissão/função:** também usamos 'to be' + artigo indefinido:\n- I'm a driver. (Sou motorista.)\n- He's a radio operator. (Ele é operador de rádio.)\n\nExceção: quando menciona o ramo diretamente como pertencimento, usamos 'in the':\n- I'm in the Army. / She's in the Navy. / He's in the Air Force.\n\n**Família:** use 'My + familiar + is/are':\n- My father is a soldier. / My sister is a nurse.",
    comparison:
      "Em português, dizemos 'Sou brasileiro' sem artigo. Em inglês, quando falamos de **profissão**, usamos o artigo: 'I'm **a** driver.' Mas quando usamos o nome do ramo como pertencimento (Army, Navy), não há artigo antes da pessoa: 'I'm in the Army' (e não 'I'm an Army'). Além disso, os adjetivos de nacionalidade em português podem ser minúsculos ('brasileiro'), mas em inglês são **sempre maiúsculos** ('Brazilian').",
    falseFriends: [
      {
        en: "Army",
        pt: "Arma (como em 'arma de fogo')",
        note: "'Army' significa **Exército** (força terrestre), não 'arma/weapon'. 'Weapon' é a palavra para arma.",
      },
      {
        en: "Navy",
        pt: "Neve",
        note: "'Navy' significa **Marinha** (força naval). Neve em inglês é 'snow'. A semelhança sonora é uma armadilha.",
      },
    ],
    dialogue: [
      { speaker: "Teammate", en: "Hey, are you Army or Air Force?", pt: "Ei, você é do Exército ou da Força Aérea?" },
      { speaker: "You", en: "I'm in the Army. I'm a radio operator.", pt: "Sou do Exército. Sou operador de rádio." },
      { speaker: "Teammate", en: "Cool. I'm in the Navy. I'm Brazilian too.", pt: "Legal. Sou da Marinha. Também sou brasileiro." },
      { speaker: "You", en: "Really? Is your family here or back home?", pt: "Sério? Sua família está aqui ou lá em casa?" },
      { speaker: "Teammate", en: "Back home. My wife is a nurse and my brother is a driver.", pt: "Lá em casa. Minha esposa é enfermeira e meu irmão é motorista." },
      { speaker: "You", en: "My father is retired Army. It's in the family.", pt: "Meu pai é do Exército aposentado. É uma coisa da família." },
    ],
    phrases: [
      { en: "I'm Brazilian / American / Portuguese.", pt: "Sou brasileiro(a) / americano(a) / português(a).", tip: "Adjetivos de nacionalidade sempre com letra maiúscula em inglês." },
      { en: "I'm in the Army / Navy / Air Force.", pt: "Sou do Exército / da Marinha / da Força Aérea.", tip: "Use 'in the' para indicar pertencimento ao ramo." },
      { en: "I'm a medic / driver / radio operator.", pt: "Sou médico(a) / motorista / operador(a) de rádio.", tip: "Função/profissão pede artigo 'a' antes." },
      { en: "My father / mother / brother / sister is...", pt: "Meu pai / minha mãe / meu irmão / minha irmã é...", tip: "'My' não muda para masculino ou feminino em inglês." },
      { en: "Where is your family from?", pt: "De onde é a sua família?", tip: "Pergunta natural para criar conexão com colegas." },
      { en: "He is retired.", pt: "Ele está / é aposentado.", tip: "'Retired' serve para qualquer gênero — não há 'retireda'." },
    ],
    guidedExercise:
      "Complete as frases:\n1. She ___ Brazilian. (Ela é brasileira.)\n2. I'm ___ the Navy. (Sou da Marinha.)\n3. My brother is ___ driver. (Meu irmão é motorista.)\n4. ___ your father in the Army? (Seu pai é do Exército?)\n5. We are ___. (Somos americanos.) [american → Americans]\n\nRespostas: 1. is | 2. in | 3. a | 4. Is | 5. American.",
    writingExercise:
      "Escreva um parágrafo curto (4-5 frases) apresentando um membro da sua família ou um personagem fictício: diga o nome, a nacionalidade, o ramo ou profissão, e uma informação extra (casado(a), onde mora etc.). Use as estruturas aprendidas.",
    speakingExercise:
      "Leia o diálogo em voz alta no papel de 'You'. Preste atenção na pronúncia de **'Army'** (ár-mi) e **'Navy'** (nêi-vi) — os dois têm acento na primeira sílaba. Pratique também 'I'm in the Air Force' — 'Air' rima com 'cair' sem o 'c'.",
    listeningExercise:
      "Use o botão 'Ouvir pronúncia' nas palavras 'Army', 'Navy' e 'Air Force'. Depois ouça 'Brazilian' e 'Portuguese' — note que a sílaba tônica muda: bra-ZI-lian, por-tchu-GUÊSE. Repita cada uma três vezes.",
    mission:
      "MISSÃO: escreva ou grave uma apresentação de 6 frases sobre você ou um personagem criado por você, cobrindo: (1) nome e nacionalidade, (2) ramo das forças armadas ou função civil, (3) dois membros da sua família com as respectivas funções, (4) uma frase extra sobre onde a família mora ou de onde vem. Missão cumprida quando cada frase estiver correta.",
    checklist: [
      "Sei dizer minha nacionalidade em inglês com letra maiúscula",
      "Conheço os três ramos (Army, Navy, Air Force) e sei usar 'in the'",
      "Sei falar de pelo menos 4 membros da família",
      "Entendo a diferença entre 'Army' (Exército) e 'arma' (weapon)",
    ],
  },
  vocabulary: [
    { term: "Army", translation: "Exército (força terrestre)", example: "I'm in the Army.", pronunciation: "ármi", category: "Ramos" },
    { term: "Navy", translation: "Marinha (força naval)", example: "She's in the Navy.", pronunciation: "nêivi", category: "Ramos" },
    { term: "Air Force", translation: "Força Aérea", example: "He's in the Air Force.", pronunciation: "êr fors", category: "Ramos" },
    { term: "Driver", translation: "Motorista", example: "My brother is a driver.", pronunciation: "dráiver", category: "Funções" },
    { term: "Radio operator", translation: "Operador de rádio", example: "I'm the radio operator.", pronunciation: "rêidio óperêitor", category: "Funções" },
    { term: "Brazilian", translation: "Brasileiro(a)", example: "I'm Brazilian.", pronunciation: "bra-ZI-lian", category: "Nacionalidades" },
    { term: "Retired", translation: "Aposentado(a)", example: "My father is retired.", pronunciation: "ritáierd", category: "Básico" },
    { term: "Nurse", translation: "Enfermeiro(a)", example: "My wife is a nurse.", pronunciation: "nêrs", category: "Funções" },
  ],
  flashcards: [
    { front: "Army", back: "Exército", example: "I'm in the Army.", pronunciationTip: "ármi", category: "Ramos" },
    { front: "Navy", back: "Marinha", example: "She's in the Navy.", pronunciationTip: "nêivi", category: "Ramos" },
    { front: "Air Force", back: "Força Aérea", example: "He's in the Air Force.", pronunciationTip: "êr fors", category: "Ramos" },
    { front: "Brazilian", back: "Brasileiro(a)", example: "We're Brazilian.", pronunciationTip: "bra-ZI-lian", category: "Nacionalidades" },
    { front: "Radio operator", back: "Operador de rádio", example: "I'm a radio operator.", pronunciationTip: "rêidio óperêitor", category: "Funções" },
    { front: "My father / My mother", back: "Meu pai / Minha mãe", example: "My father is in the Army.", pronunciationTip: "mái fáder / mái móder", category: "Família" },
  ],
  quiz: {
    title: "Quiz — Família, nacionalidade e função",
    passScore: 70,
    questions: [
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Qual frase está correta para dizer 'Sou da Marinha'?",
        explanation: "Para pertencimento a um ramo das forças armadas usamos 'in the': 'I'm in the Navy'.",
        options: [
          { text: "I'm in the Navy.", isCorrect: true },
          { text: "I'm a Navy.", isCorrect: false },
          { text: "I'm the Navy.", isCorrect: false },
          { text: "I'm on Navy.", isCorrect: false },
        ],
      },
      {
        type: "FILL_BLANK",
        prompt: "Complete: 'My brother is ___ driver.' (Meu irmão é motorista.)",
        explanation: "Profissões em inglês pedem o artigo indefinido 'a' ou 'an' antes. 'driver' começa com consoante, então usamos 'a'.",
        correctAnswer: "a",
      },
      {
        type: "TRANSLATE_PT_EN",
        prompt: "Traduza para o inglês: 'Sou brasileiro e estou na Força Aérea.'",
        explanation: "'Sou brasileiro' = 'I'm Brazilian' (maiúsculo); 'na Força Aérea' = 'in the Air Force'.",
        correctAnswer: "I'm Brazilian and I'm in the Air Force",
      },
      {
        type: "FIND_ERROR",
        prompt: "Encontre o erro: 'She is in the army and she is a good nurse'.",
        explanation: "Adjetivos de nacionalidade e nomes de ramos como 'Army' são escritos com letra maiúscula em inglês: 'Army', não 'army'.",
        options: [
          { text: "'army' deveria ser 'Army' (letra maiúscula)", isCorrect: true },
          { text: "'She is' deveria ser 'She are'", isCorrect: false },
          { text: "'a good nurse' deveria ser 'good nurse' (sem artigo)", isCorrect: false },
        ],
      },
      {
        type: "WORD_ORDER",
        prompt: "Ordene as palavras: 'the / in / Air Force / I'm'",
        explanation: "A estrutura correta é sujeito + verbo + 'in the' + ramo: 'I'm in the Air Force'.",
        correctAnswer: "I'm in the Air Force",
      },
      {
        type: "TRANSLATE_EN_PT",
        prompt: "Traduza para o português: 'My sister is a radio operator in the Army.'",
        explanation: "'My sister' = minha irmã; 'radio operator' = operadora de rádio; 'in the Army' = no Exército.",
        correctAnswer: "Minha irmã é operadora de rádio no Exército",
      },
    ],
  },
};
