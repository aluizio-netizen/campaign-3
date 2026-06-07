import type { LessonSeed } from "@/content/types";

export const lesson09: LessonSeed = {
  slug: "passado-e-planos",
  title: "Passado, experiências e planos de ação",
  order: 9,
  levelCode: "B1",
  objective:
    "Relatar ações passadas em relatórios e briefings, descrever experiências com present perfect e comunicar planos futuros com 'going to' e 'will'.",
  durationMin: 20,
  summary:
    "Missão de debriefing: relate o que aconteceu, compartilhe sua experiência e apresente o plano para a próxima operação com as estruturas de tempo corretas.",
  content: {
    warmup:
      "Após uma operação, você precisa apresentar um relatório (after-action report). Mais tarde, deve apresentar o plano para a próxima missão. Essas duas situações exigem tempos verbais diferentes em inglês. Saber quando usar *past simple*, *present perfect* ou *going to/will* é o que diferencia um comunicador básico de um profissional. Vamos dominar essa distinção.",
    grammar:
      "**1. Past Simple — ação concluída no passado (relatório/after-action)**\n\nUsado quando o tempo da ação é definido ou implicitamente conhecido:\n- 'We **secured** the area at 0600.'\n- 'I **reported** to HQ on Monday.'\n- 'The team **completed** the mission successfully.'\n\nForma: verbo no passado simples (verbos regulares: + -ed; irregulares: memorizar).\nPerguntas: Did + sujeito + verbo base? → 'Did you contact the commander?'\nNegativa: didn't + verbo base → 'We didn't find any threats.'\n\n**2. Present Perfect — experiência ou ação com relevância no presente**\n\nUsado para falar de experiências de vida (sem definir quando) ou ações recentes que afetam o agora:\n- 'I **have worked** with international units before.' (experiência)\n- '**Have** you ever **been** under pressure?' (já teve essa experiência?)\n- 'The team **has completed** the briefing.' (acabou de completar, impacto no agora)\n\nForma: have/has + particípio passado.\nPalavras-chave: **ever, never, already, yet, just, before**.\n\n**3. Futuro com going to / will**\n\n- **Going to**: planos já decididos, intenções definidas:\n  'We **are going to** move at dawn.' (já decidido)\n\n- **Will**: decisões no momento da fala, previsões, promessas:\n  'I **will** send the report tonight.' (decido agora)\n  'It **will** be a quick operation.' (previsão)\n\n**Resumo prático:**\n| Estrutura | Quando usar |\n|---|---|\n| Past simple | Relatório: ação com tempo definido |\n| Present perfect | Experiência / ação recente relevante |\n| Going to | Plano já decidido |\n| Will | Decisão imediata / previsão |",
    comparison:
      "O português brasileiro muitas vezes usa o **passado simples** onde o inglês exige o **present perfect**. Dizemos 'Você já foi lá?' e traduzimos literalmente como 'Did you go there?' — mas em inglês o correto é 'Have you ever been there?' (pergunta de experiência). A diferença: o *past simple* em inglês ancora a ação em um tempo específico; o *present perfect* a desconecta do tempo, focando na experiência ou resultado.\n\nOutra armadilha: em português 'eu vou fazer' pode ser plano ou decisão imediata. Em inglês, distinguimos: plano = *going to*, decisão na hora = *will*.",
    falseFriends: [
      {
        en: "Eventually",
        pt: "Eventualmente",
        note: "'Eventually' significa **no final / finalmente** (depois de algum tempo), não 'às vezes' ou 'eventualmente'. Para 'às vezes', use 'sometimes'.",
      },
      {
        en: "Assist",
        pt: "Assistir (TV, jogo)",
        note: "'Assist' significa **ajudar / auxiliar**, não 'assistir a algo'. 'Assistir TV' = to watch TV.",
      },
    ],
    dialogue: [
      {
        speaker: "Commander",
        en: "Give me the after-action report. What happened during the night shift?",
        pt: "Me dê o relatório pós-ação. O que aconteceu durante o turno da noite?",
      },
      {
        speaker: "You",
        en: "We secured the perimeter at 2200 hours. I reported two suspicious vehicles, but they left before we could approach.",
        pt: "Asseguramos o perímetro às 22h00. Relatei dois veículos suspeitos, mas eles foram embora antes de conseguirmos nos aproximar.",
      },
      {
        speaker: "Commander",
        en: "Have you ever dealt with a similar situation before?",
        pt: "Você já lidou com uma situação semelhante antes?",
      },
      {
        speaker: "You",
        en: "Yes, sir. I have worked in high-alert zones twice. In both cases, we documented everything and waited for clearance.",
        pt: "Sim, senhor. Já trabalhei em zonas de alto alerta duas vezes. Em ambos os casos, documentamos tudo e aguardamos autorização.",
      },
      {
        speaker: "Commander",
        en: "Good. What are your plans for the next patrol?",
        pt: "Bom. Quais são seus planos para a próxima patrulha?",
      },
      {
        speaker: "You",
        en: "We are going to increase the patrol frequency. I will also coordinate with the intelligence team to get updated reports.",
        pt: "Vamos aumentar a frequência das patrulhas. Também coordenarei com a equipe de inteligência para obter relatórios atualizados.",
      },
    ],
    phrases: [
      {
        en: "We secured the area at 0800 hours.",
        pt: "Asseguramos a área às 08h00.",
        tip: "Past simple para relatórios com horário definido.",
      },
      {
        en: "I have worked with international teams before.",
        pt: "Já trabalhei com equipes internacionais antes.",
        tip: "'Before' no final = experiência. Use present perfect.",
      },
      {
        en: "Have you ever been in a situation like this?",
        pt: "Você já esteve em uma situação assim?",
        tip: "'Ever' com present perfect = pergunta de experiência.",
      },
      {
        en: "We are going to reinforce the position.",
        pt: "Vamos reforçar a posição. (plano decidido)",
        tip: "'Going to' indica plano já decidido antes do momento da fala.",
      },
      {
        en: "I will send the full report by 1800.",
        pt: "Enviarei o relatório completo até as 18h.",
        tip: "'Will' para compromisso ou decisão no momento.",
      },
      {
        en: "The mission has been completed successfully.",
        pt: "A missão foi concluída com sucesso. (e o resultado importa agora)",
        tip: "Present perfect passivo: foco no resultado presente.",
      },
    ],
    guidedExercise:
      "Escolha o tempo verbal correto para cada frase e justifique:\n\n1. 'We ___ (arrive) at the checkpoint at 0530.' → past simple ou present perfect?\n2. 'I ___ (never / work) with that unit before.' → qual tempo?\n3. 'We ___ (go to / reinforce) the eastern flank tomorrow — it's already planned.' → going to ou will?\n4. 'I ___ (send) you the coordinates right now.' → going to ou will? (decido agora)\n5. '___ you ever ___ (be) under fire?' → qual tempo?\n\nResponstas: 1. arrived | 2. have never worked | 3. are going to reinforce | 4. will send | 5. Have you ever been",
    writingExercise:
      "Escreva um mini relatório pós-ação de 5-6 frases em inglês descrevendo:\n- O que sua equipe fez (past simple, com horários)\n- Pelo menos uma experiência sua relevante (present perfect)\n- Dois planos para a próxima fase (going to / will)\nUse pelo menos três palavras do vocabulário desta lição.",
    speakingExercise:
      "Grave um debriefing de 30-45 segundos como se você fosse o personagem 'You' do diálogo. Expanda com detalhes inventados. Foque na pronúncia de 'secured' (sikíord), 'reported' (ripórted) e 'have worked' (hev uórkt).",
    listeningExercise:
      "Ouça a diferença de entonação entre 'Did you secure the area?' (passado simples) e 'Have you secured the area?' (present perfect). No primeiro, a ênfase fica em 'secure'; no segundo, em 'have'. Repita as duas perguntas três vezes cada, exagerando a entonação.",
    mission:
      "MISSÃO DE DEBRIEFING: redija em inglês um after-action report com 3 parágrafos curtos — (1) o que aconteceu usando past simple com pelo menos dois horários militares, (2) sua experiência relevante usando present perfect com 'ever', 'never' ou 'already', (3) o plano para a próxima operação com going to e will. Mostre domínio dos três tempos.",
    checklist: [
      "Sei usar o past simple para relatar ações com tempo definido em inglês",
      "Entendo quando usar present perfect para experiências e ações com resultado presente",
      "Distingo 'going to' (plano decidido) de 'will' (decisão imediata / previsão)",
      "Não confundo 'eventually' (no final) com 'eventualmente' em português",
    ],
  },
  vocabulary: [
    {
      term: "secure",
      translation: "assegurar / garantir a segurança de",
      example: "We secured the perimeter before dawn.",
      pronunciation: "sikíur",
      category: "Operações",
    },
    {
      term: "report",
      translation: "relatar / relatório",
      example: "I reported the incident to the commander.",
      pronunciation: "ripórt",
      category: "Comunicação",
    },
    {
      term: "patrol",
      translation: "patrulha / patrulhar",
      example: "We completed the night patrol.",
      pronunciation: "patrôl",
      category: "Operações",
    },
    {
      term: "clearance",
      translation: "autorização / liberação",
      example: "We waited for clearance before moving.",
      pronunciation: "clíerans",
      category: "Operações",
    },
    {
      term: "reinforce",
      translation: "reforçar",
      example: "We are going to reinforce the eastern position.",
      pronunciation: "riinforss",
      category: "Táticas",
    },
    {
      term: "coordinate",
      translation: "coordenar",
      example: "I will coordinate with the intelligence team.",
      pronunciation: "cóórdineit",
      category: "Liderança",
    },
    {
      term: "suspicious",
      translation: "suspeito",
      example: "I noticed two suspicious vehicles.",
      pronunciation: "saspíchuas",
      category: "Segurança",
    },
    {
      term: "frequency",
      translation: "frequência",
      example: "We will increase the patrol frequency.",
      pronunciation: "fríquensi",
      category: "Planejamento",
    },
  ],
  flashcards: [
    {
      front: "We secured the area.",
      back: "Asseguramos a área. (past simple)",
      example: "We secured the area at 0600 hours.",
      pronunciationTip: "ui sikíurd di éria",
      category: "Past Simple",
    },
    {
      front: "I have worked with this unit.",
      back: "Já trabalhei com esta unidade. (present perfect)",
      example: "I have worked with this unit for two years.",
      pronunciationTip: "ai hev uórkt",
      category: "Present Perfect",
    },
    {
      front: "Have you ever been under fire?",
      back: "Você já esteve sob fogo?",
      example: "Have you ever been in a combat zone?",
      pronunciationTip: "hev iú éver bin ânder fáir",
      category: "Present Perfect",
    },
    {
      front: "We are going to move at dawn.",
      back: "Vamos nos mover ao amanhecer. (plano)",
      example: "We are going to deploy two teams at dawn.",
      pronunciationTip: "ui ar gôing tchu muuv et dón",
      category: "Futuro",
    },
    {
      front: "I will send the report now.",
      back: "Enviarei o relatório agora. (decisão imediata)",
      example: "I will send the full report by 1800.",
      pronunciationTip: "ai uil sênd",
      category: "Futuro",
    },
    {
      front: "clearance",
      back: "autorização / liberação",
      example: "Wait for clearance before crossing.",
      pronunciationTip: "clíerans",
      category: "Vocabulário",
    },
  ],
  quiz: {
    title: "Quiz — Passado, experiências e planos",
    passScore: 70,
    questions: [
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Qual frase usa o tempo verbal CORRETO para um relatório com horário definido?",
        explanation: "Com horário específico ('at 0300'), usamos o past simple. O present perfect não é usado com tempo definido.",
        options: [
          { text: "We arrived at the checkpoint at 0300.", isCorrect: true },
          { text: "We have arrived at the checkpoint at 0300.", isCorrect: false },
          { text: "We are going to arrive at the checkpoint at 0300.", isCorrect: false },
          { text: "We will arrive at the checkpoint at 0300.", isCorrect: false },
        ],
      },
      {
        type: "FILL_BLANK",
        prompt: "Complete com a forma correta: 'I ___ (work) with that unit twice. It was a good experience.' Use o tempo certo.",
        explanation: "'Twice' sem referência de tempo específico indica experiência acumulada → present perfect: 'I have worked'.",
        correctAnswer: "have worked",
      },
      {
        type: "TRANSLATE_PT_EN",
        prompt: "Traduza para o inglês: 'Você já esteve em uma zona de combate?' (pergunta de experiência)",
        explanation: "Perguntas de experiência com 'já' usam present perfect + ever: 'Have you ever been in a combat zone?'",
        correctAnswer: "Have you ever been in a combat zone",
      },
      {
        type: "FIND_ERROR",
        prompt: "Qual frase contém um erro gramatical?",
        explanation: "Com 'last night' (tempo definido no passado), usamos past simple, não present perfect. O correto é 'We secured the area last night.'",
        options: [
          { text: "We have secured the area last night.", isCorrect: true },
          { text: "We secured the area last night.", isCorrect: false },
          { text: "We are going to secure the area tonight.", isCorrect: false },
        ],
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Você decide AGORA que vai enviar o relatório. Qual estrutura usar?",
        explanation: "'Will' é usado para decisões tomadas no momento da fala. 'Going to' seria para planos já feitos antes.",
        options: [
          { text: "I will send the report.", isCorrect: true },
          { text: "I am going to send the report.", isCorrect: false },
          { text: "I sent the report.", isCorrect: false },
        ],
      },
      {
        type: "FREE_TEXT",
        prompt: "Escreva duas frases em inglês: uma descrevendo o que sua equipe FEZ ontem (past simple) e outra dizendo o que você PLANEJA fazer amanhã (going to). Use vocabulário de operações.",
        explanation: "Exemplo de resposta: 'My team patrolled the northern sector yesterday. We are going to reinforce the eastern position tomorrow.' Past simple para passado definido; going to para plano decidido.",
        correctAnswer: "My team patrolled the sector yesterday. We are going to reinforce the position tomorrow.",
      },
    ],
  },
};
