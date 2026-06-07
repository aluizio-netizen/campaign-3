import type { LessonSeed } from "@/content/types";

export const lesson06: LessonSeed = {
  slug: "rotina-e-horarios",
  title: "Rotina e horários",
  order: 6,
  levelCode: "A2",
  objective:
    "Descrever a rotina diária em inglês usando o present simple, ler horários no formato militar 24h e falar sobre a escala de serviço.",
  durationMin: 15,
  summary:
    "Missão relógio: reporte sua rotina, leia horários militares e informe sua escala — tudo no tempo presente do inglês.",
  content: {
    warmup:
      "Em ambientes operacionais, todos precisam saber os horários com precisão. O inglês militar usa o formato **24 horas** (zero six hundred = 06:00; fourteen hundred = 14:00) para evitar confusão entre manhã e tarde. Além disso, você vai precisar descrever sua **rotina diária** em inglês — quando acorda, quando se reporta, quando termina o turno. Vamos aprender isso com o **present simple**.",
    grammar:
      "O **present simple** é o tempo verbal para rotinas, hábitos e fatos — exatamente o que você precisa para descrever sua escala.\n\n**Formação:**\n- Eu/você/nós/eles: verbo base → *I wake up at six.*\n- Ele/ela (3ª pessoa singular): adicione **-s** → *She reports at zero eight hundred.*\n\n**Advérbios de frequência** vêm antes do verbo principal (mas depois do verbo 'to be'):\n- **always** (sempre), **usually** (geralmente), **often** (frequentemente), **sometimes** (às vezes), **rarely** (raramente), **never** (nunca)\n- *I always wake up at 0500.* (Sempre acordo às 05:00.)\n- *She is never late.* (Ela nunca está atrasada.)\n\n**Horários militares (24h):**\n- 06:00 → *zero six hundred* (diga 'zero' para horas de 00–09)\n- 14:00 → *fourteen hundred*\n- 00:00 → *zero zero hundred* ou *midnight*\n- 'What time do you report?' → 'I report at zero eight hundred.'",
    comparison:
      "Em português, dizemos 'Eu acordo às seis' sem mudar o verbo. Em inglês, **na 3ª pessoa do singular** o verbo recebe **-s**: 'He wakes up at six.' Brasileiros frequentemente esquecem esse -s — é o erro mais comum no present simple!\n\nSobre horários: o português usa 'às 14h' ou '14 horas'; o inglês militar diz **'fourteen hundred'** (sem 'hours' depois, diferente do que muitos pensam). No inglês civil, usa-se '2 PM' ou '2 o'clock in the afternoon'.",
    falseFriends: [
      {
        en: "Actually",
        pt: "Atualmente",
        note: "'Actually' significa **na verdade** (not 'currently'). Para dizer 'atualmente', use **currently** ou **nowadays**.",
      },
      {
        en: "Duty",
        pt: "Dúvida / dote",
        note: "'Duty' significa **serviço / obrigação / plantão** (ex.: duty roster = escala de serviço). Não tem relação com dúvida.",
      },
    ],
    dialogue: [
      { speaker: "Sergeant", en: "What time do you usually wake up?", pt: "A que horas você geralmente acorda?" },
      { speaker: "You", en: "I always wake up at zero five hundred.", pt: "Eu sempre acordo às 05:00." },
      { speaker: "Sergeant", en: "And when do you report for duty?", pt: "E quando você se reporta para o serviço?" },
      { speaker: "You", en: "I report at zero six hundred every day.", pt: "Eu me reporto às 06:00 todos os dias." },
      { speaker: "Sergeant", en: "Do you ever work the night shift?", pt: "Você alguma vez trabalha no turno da noite?" },
      { speaker: "You", en: "Sometimes. My next night duty is at twenty-two hundred.", pt: "Às vezes. Meu próximo plantão noturno é às 22:00." },
    ],
    phrases: [
      { en: "I wake up at zero five hundred.", pt: "Acordo às 05:00.", tip: "Horário militar: diga 'zero' para horas 01–09." },
      { en: "I report for duty at...", pt: "Eu me reporto para o serviço às...", tip: "'Report for duty' = apresentar-se para o serviço." },
      { en: "What time do you...?", pt: "A que horas você...?", tip: "Use para perguntar horários no cotidiano." },
      { en: "I usually / always / never...", pt: "Eu geralmente / sempre / nunca...", tip: "Advérbio de frequência vem antes do verbo principal." },
      { en: "My shift ends at eighteen hundred.", pt: "Meu turno termina às 18:00.", tip: "'Shift' = turno de trabalho." },
      { en: "Check the duty roster.", pt: "Confira a escala de serviço.", tip: "'Roster' = lista de escala; very common in military/operational settings." },
    ],
    guidedExercise:
      "Leia os horários militares em voz alta:\n1. 07:00 → _____ (zero seven hundred)\n2. 13:30 → _____ (thirteen thirty)\n3. 20:00 → _____ (twenty hundred)\n4. 00:00 → _____ (zero zero hundred / midnight)\n\nAgora escreva 3 frases sobre SUA rotina usando os advérbios: always, usually e sometimes.",
    writingExercise:
      "Descreva sua rotina diária em 5 frases no present simple. Inclua: hora que acorda, hora que come, uma atividade que faz 'always' e uma que faz 'sometimes'. Use pelo menos um horário no formato militar.",
    speakingExercise:
      "Grave-se respondendo: 'Describe your daily routine.' Fale por 30 segundos usando present simple. Lembre-se do **-s** na 3ª pessoa se mencionar colegas: 'My partner always arrives at...'",
    listeningExercise:
      "Ouça as frases com horários militares desta aula usando o botão de pronúncia. Note que '0' em horários se diz 'zero' (não 'oh' como no inglês civil). Repita cada horário 2 vezes.",
    mission:
      "MISSÃO ESCALA: escreva sua própria escala de serviço fictícia em inglês para uma semana. Para cada dia, indique o horário de início e término do turno em formato militar, e use pelo menos 3 advérbios de frequência diferentes.",
    checklist: [
      "Sei conjugar verbos no present simple, incluindo o -s da 3ª pessoa",
      "Consigo ler e dizer horários no formato militar 24h",
      "Sei usar pelo menos 4 advérbios de frequência",
      "Consigo descrever minha rotina em 5 frases em inglês",
    ],
  },
  vocabulary: [
    { term: "Wake up", translation: "Acordar", example: "I wake up at zero five hundred.", pronunciation: "uêik áp", category: "Rotina" },
    { term: "Report for duty", translation: "Apresentar-se para o serviço", example: "I report for duty at zero six hundred.", pronunciation: "ripórt for diúti", category: "Rotina" },
    { term: "Shift", translation: "Turno", example: "My shift ends at eighteen hundred.", pronunciation: "chíft", category: "Trabalho" },
    { term: "Duty roster", translation: "Escala de serviço", example: "Check the duty roster for this week.", pronunciation: "diúti róster", category: "Trabalho" },
    { term: "Always", translation: "Sempre", example: "I always arrive early.", pronunciation: "ólueiz", category: "Advérbios" },
    { term: "Usually", translation: "Geralmente", example: "She usually works the day shift.", pronunciation: "iújuali", category: "Advérbios" },
    { term: "Sometimes", translation: "Às vezes", example: "He sometimes works nights.", pronunciation: "sâmtáimz", category: "Advérbios" },
    { term: "Never", translation: "Nunca", example: "We never skip the briefing.", pronunciation: "névuer", category: "Advérbios" },
  ],
  flashcards: [
    { front: "Present simple (3ª pessoa)", back: "Adiciona -s ao verbo: he work**s**", example: "She reports at 0600.", pronunciationTip: "Lembre do -s: ripórts", category: "Gramática" },
    { front: "Zero six hundred", back: "06:00 (formato militar)", example: "I wake up at zero six hundred.", pronunciationTip: "zírou síks hândred", category: "Horários" },
    { front: "Always", back: "Sempre", example: "I always check the roster.", pronunciationTip: "ólueiz", category: "Advérbios" },
    { front: "Duty roster", back: "Escala de serviço", example: "Your name is on the duty roster.", pronunciationTip: "diúti róster", category: "Trabalho" },
    { front: "Shift", back: "Turno de trabalho", example: "My shift starts at fourteen hundred.", pronunciationTip: "chíft", category: "Trabalho" },
    { front: "Usually", back: "Geralmente", example: "We usually debrief at eighteen hundred.", pronunciationTip: "iújuali", category: "Advérbios" },
  ],
  quiz: {
    title: "Quiz — Rotina e horários",
    passScore: 70,
    questions: [
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Qual frase está correta no present simple (3ª pessoa)?",
        explanation: "Na 3ª pessoa do singular (he/she/it), o verbo recebe -s: 'She reports', não 'She report'.",
        options: [
          { text: "She report at zero eight hundred.", isCorrect: false },
          { text: "She reports at zero eight hundred.", isCorrect: true },
          { text: "She reporting at zero eight hundred.", isCorrect: false },
          { text: "She is report at zero eight hundred.", isCorrect: false },
        ],
      },
      {
        type: "FILL_BLANK",
        prompt: "Complete: 'I _____ wake up early.' (use o advérbio de frequência = sempre)",
        explanation: "'Always' significa 'sempre' e vem antes do verbo principal.",
        correctAnswer: "always",
      },
      {
        type: "TRANSLATE_PT_EN",
        prompt: "Traduza para o inglês: 'Meu turno começa às 14:00.' (use formato militar)",
        explanation: "'My shift starts at fourteen hundred.' — 'shift' = turno, 14:00 = fourteen hundred.",
        correctAnswer: "My shift starts at fourteen hundred",
      },
      {
        type: "WORD_ORDER",
        prompt: "Ordene as palavras: 'usually / at / I / report / duty / for / hundred / zero / eight'",
        explanation: "Advérbio de frequência fica depois do sujeito, antes do verbo: 'I usually report for duty at zero eight hundred.'",
        correctAnswer: "I usually report for duty at zero eight hundred",
      },
      {
        type: "FIND_ERROR",
        prompt: "Encontre o erro: 'He never is late for the briefing.'",
        explanation: "Com o verbo 'to be', o advérbio de frequência vem DEPOIS do verbo: 'He is never late.' Com verbos comuns, vem antes.",
        options: [
          { text: "He never is late for the briefing.", isCorrect: true },
          { text: "He is never late for the briefing.", isCorrect: false },
          { text: "He is late never for the briefing.", isCorrect: false },
        ],
      },
      {
        type: "TRANSLATE_EN_PT",
        prompt: "Traduza para o português: 'Check the duty roster.'",
        explanation: "'Duty roster' = escala de serviço. 'Check' = verificar/conferir.",
        correctAnswer: "Confira a escala de serviço",
      },
    ],
  },
};
