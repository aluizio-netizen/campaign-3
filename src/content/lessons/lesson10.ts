import type { LessonSeed } from "@/content/types";

export const lesson10: LessonSeed = {
  slug: "simulacao-de-missao",
  title: "Simulação de missão: briefing, checkpoint e rádio",
  order: 10,
  levelCode: "B1",
  objective:
    "Integrar todas as estruturas aprendidas no curso em uma simulação real: conduzir um briefing, passar por um checkpoint, comunicar-se por rádio e fazer uma apresentação profissional completa em inglês.",
  durationMin: 20,
  summary:
    "Missão final: você agora coloca tudo em prática — saudações, identidade, ordens, direções, relatórios e linguagem de rádio num cenário integrado e realista.",
  content: {
    warmup:
      "Esta é sua missão final. Você integra tudo o que aprendeu no curso: cumprimentar e se identificar (lição 1 e 2), dar e receber ordens (lição 3), falar sobre localização e direções (lição 5), descrever pessoas e situações (lição 6), lidar com suprimentos (lição 8) e relatar no passado e planejar o futuro (lição 9). Nesta simulação, você passará por um checkpoint, participará de um briefing e se comunicará por rádio. Respire fundo — você está pronto.",
    grammar:
      "**Linguagem de briefing — estrutura profissional**\n\nUm briefing em inglês segue uma estrutura clara. Aprenda as frases de abertura e transição:\n\n- **Abertura**: 'Good morning, everyone. I will brief you on today's operation.'\n- **Objetivo**: 'Our objective is to...'\n- **Situação**: 'Currently, the situation is...'\n- **Missão**: 'Our mission is to... by [time].'\n- **Encerramento**: 'Any questions? / Are there any questions?'\n\n**Linguagem de rádio — fraseologia padrão**\n\n| Termo | Uso |\n|---|---|\n| **Over** | Terminei de falar, aguardo resposta |\n| **Out** | Terminei a comunicação, sem resposta necessária |\n| **Stand by** | Aguarde |\n| **Say again** | Repita a mensagem |\n| **Copy / Roger** | Entendido |\n| **Wilco** | Entendido e cumprirei (will comply) |\n| **Break** | Pausa numa mensagem longa |\n| **Actual** | O próprio comandante (ex.: 'Alpha Actual' = o comandante da equipe Alpha) |\n\n**Revisão integrada de tempos verbais no contexto de missão:**\n\n- Passado (relatório): 'We completed the sweep at 0700.'\n- Presente contínuo (situação atual): 'Two units are approaching the sector.'\n- Futuro (plano): 'We are going to establish a perimeter.'\n- Pedido formal (imperativo/modal): 'Please identify yourself.' / 'Could you confirm your position?'",
    comparison:
      "No português militar brasileiro, dizemos 'câmbio' para sinalizar que terminamos e aguardamos resposta — isso equivale ao **'over'** do inglês. Já 'câmbio encerrado' corresponde a **'out'**. Uma confusão clássica: brasileiros traduzem 'over' como 'acabou/terminou' (sentido de 'game over'), mas no rádio **'over'** significa justamente que você ainda quer uma resposta. Somente **'out'** encerra a comunicação.\n\nOutra diferença: em português dizemos 'pode falar' ao ceder a palavra no rádio; em inglês dizemos **'go ahead'** ou **'send'**. Nunca use 'repeat' no rádio — nesse contexto, 'repeat' pode ser interpretado como uma ordem para repetir um disparo. Use sempre **'say again'**.",
    falseFriends: [
      {
        en: "Over (no rádio)",
        pt: "Terminar / Acabou",
        note: "'Over' no rádio significa **aguardo sua resposta**, não que a conversa terminou. Para encerrar sem aguardar resposta, use **'out'**.",
      },
      {
        en: "Actual",
        pt: "Atual / De verdade",
        note: "No contexto de rádio, 'Actual' identifica o **comandante em pessoa** de uma unidade (ex.: 'Bravo Actual'). Não é só 'atual' em português.",
      },
    ],
    dialogue: [
      {
        speaker: "Guard",
        en: "Halt! This is a checkpoint. Please identify yourself and state your unit.",
        pt: "Alto! Este é um checkpoint. Por favor, identifique-se e informe sua unidade.",
      },
      {
        speaker: "You",
        en: "Sergeant Torres, Unit Bravo-3. I have my ID card. We are on our way to the forward operating base.",
        pt: "Sargento Torres, Unidade Bravo-3. Tenho meu cartão de identificação. Estamos a caminho da base operacional avançada.",
      },
      {
        speaker: "Guard",
        en: "Copy that. Stand by while I verify. Have you passed through this checkpoint before?",
        pt: "Entendido. Aguarde enquanto verifico. Você já passou por este checkpoint antes?",
      },
      {
        speaker: "You",
        en: "Yes. I have operated in this sector twice. We secured this area last month.",
        pt: "Sim. Já operei neste setor duas vezes. Asseguramos esta área no mês passado.",
      },
      {
        speaker: "Guard",
        en: "Verified. You are clear to proceed. The briefing starts in ten minutes — building Alpha, second floor.",
        pt: "Verificado. Pode prosseguir. O briefing começa em dez minutos — prédio Alpha, segundo andar.",
      },
      {
        speaker: "You",
        en: "Roger, wilco. I will contact the command team by radio before entering. Over and out.",
        pt: "Entendido, cumprirei. Vou contatar a equipe de comando pelo rádio antes de entrar. Câmbio e encerrado.",
      },
    ],
    phrases: [
      {
        en: "Please identify yourself and state your unit.",
        pt: "Por favor, identifique-se e informe sua unidade.",
        tip: "Estrutura padrão em checkpoints. 'State' aqui = 'declare/informe'.",
      },
      {
        en: "Stand by. / Stand by for further instructions.",
        pt: "Aguarde. / Aguarde mais instruções.",
        tip: "'Stand by' é a frase de pausa no rádio e em comunicações presenciais.",
      },
      {
        en: "Our objective is to secure the northern perimeter by 0600.",
        pt: "Nosso objetivo é assegurar o perímetro norte até as 06h.",
        tip: "Estrutura de briefing: 'Our objective is to + verbo base'.",
      },
      {
        en: "Say again your last message. Over.",
        pt: "Repita sua última mensagem. Câmbio.",
        tip: "No rádio, 'over' sinaliza que você aguarda resposta.",
      },
      {
        en: "Bravo-3 Actual, this is Delta-1. Do you copy? Over.",
        pt: "Comandante do Bravo-3, aqui é o Delta-1. Você me ouve? Câmbio.",
        tip: "'Actual' identifica o próprio comandante da unidade, não um subordinado.",
      },
      {
        en: "Roger, wilco. Proceeding to the objective. Out.",
        pt: "Entendido, cumprirei. Seguindo para o objetivo. Encerrado.",
        tip: "'Wilco' = will comply (vou cumprir). 'Out' encerra a comunicação.",
      },
    ],
    guidedExercise:
      "Complete o script de rádio abaixo com os termos corretos (over, out, say again, copy, stand by, wilco):\n\nDelta-1: 'Bravo-3, this is Delta-1. We have reached the checkpoint. [1: aguardo resposta]'\nBravo-3: '[2: entendido]. What is your status? [3: aguardo resposta]'\nDelta-1: 'All personnel are accounted for. We are going to move to sector 7. [4: aguardo resposta]'\nBravo-3: '[5: aguardo um momento]. ... Bravo-3 to Delta-1, [6: entendido e cumprirei]. Proceed to sector 7. [encerre]'\n\nRespostas: 1. Over | 2. Copy | 3. Over | 4. Over | 5. Stand by | 6. Wilco ... Out",
    writingExercise:
      "Redija um mini briefing (6-8 frases) em inglês para uma patrulha imaginária. Use a estrutura: abertura → objetivo → situação atual → missão → instruções → encerramento. Use ao menos um tempo passado, um presente contínuo e um futuro com 'going to'.",
    speakingExercise:
      "Grave uma comunicação de rádio completa de 40-60 segundos em inglês entre dois personagens (você faz os dois, com pausa entre as falas). Inclua: identificação de unidades, pedido de status, pelo menos um 'say again', confirmação com 'copy', e encerramento com 'out'. Use os termos de rádio corretamente.",
    listeningExercise:
      "Ouça e repita as frases de rádio desta lição com atenção à entonação profissional: voz firme, ritmo constante, pausa antes de 'Over' e 'Out'. Frases-alvo: 'Do you copy? Over.' / 'Roger, wilco. Out.' / 'Stand by.' Repita cada uma 3 vezes com confiança crescente.",
    mission:
      "MISSÃO FINAL — SIMULAÇÃO COMPLETA: conduza por escrito ou gravado um cenário de 3 etapas: (1) CHECKPOINT — identifique-se, responda perguntas e demonstre experiência com present perfect; (2) BRIEFING — apresente o objetivo da missão, a situação atual e o plano de ação com estrutura de briefing; (3) COMUNICAÇÃO DE RÁDIO — registre duas trocas de rádio usando over, out, copy, wilco e say again corretamente. Esta é sua prova final de operabilidade em inglês.",
    checklist: [
      "Sei identificar-me e relatar minha unidade em inglês em um checkpoint",
      "Conheço os termos de rádio: over, out, stand by, say again, copy, wilco, actual",
      "Consigo conduzir ou participar de um briefing com estrutura profissional em inglês",
      "Integro passado, presente e futuro corretamente em comunicações reais",
    ],
  },
  vocabulary: [
    {
      term: "briefing",
      translation: "briefing / reunião de instrução",
      example: "The briefing starts in ten minutes.",
      pronunciation: "brífing",
      category: "Operações",
    },
    {
      term: "checkpoint",
      translation: "ponto de controle / checkpoint",
      example: "All vehicles must stop at the checkpoint.",
      pronunciation: "tchéckpoint",
      category: "Operações",
    },
    {
      term: "wilco",
      translation: "entendido e cumprirei (will comply)",
      example: "Roger, wilco. Moving to sector 4.",
      pronunciation: "uílcou",
      category: "Rádio",
    },
    {
      term: "over",
      translation: "câmbio (aguardo resposta)",
      example: "Delta-1, do you copy? Over.",
      pronunciation: "óuver",
      category: "Rádio",
    },
    {
      term: "out",
      translation: "encerrado (fim da comunicação)",
      example: "Message received. Out.",
      pronunciation: "aut",
      category: "Rádio",
    },
    {
      term: "perimeter",
      translation: "perímetro",
      example: "Secure the perimeter before dawn.",
      pronunciation: "perímicter",
      category: "Táticas",
    },
    {
      term: "proceed",
      translation: "prosseguir / avançar",
      example: "You are clear to proceed.",
      pronunciation: "prossíid",
      category: "Ordens",
    },
    {
      term: "accounted for",
      translation: "contabilizado / presente (ninguém faltando)",
      example: "All personnel are accounted for.",
      pronunciation: "acáunted for",
      category: "Relatório",
    },
  ],
  flashcards: [
    {
      front: "Over",
      back: "Câmbio — aguardo sua resposta",
      example: "Delta-1, what is your status? Over.",
      pronunciationTip: "óuver — não confundir com 'out' (encerrado)",
      category: "Rádio",
    },
    {
      front: "Out",
      back: "Encerrado — fim da comunicação",
      example: "Understood. Moving now. Out.",
      pronunciationTip: "aut — encerra sem aguardar resposta",
      category: "Rádio",
    },
    {
      front: "Wilco",
      back: "Entendido e cumprirei",
      example: "Roger, wilco. Proceeding to the objective.",
      pronunciationTip: "uílcou — abreviação de 'will comply'",
      category: "Rádio",
    },
    {
      front: "Stand by",
      back: "Aguarde",
      example: "Stand by for further instructions.",
      pronunciationTip: "sténd bai",
      category: "Rádio",
    },
    {
      front: "Our objective is to secure the area.",
      back: "Nosso objetivo é assegurar a área.",
      example: "Our objective is to secure the northern perimeter by 0600.",
      pronunciationTip: "aur objetiv iz tchu",
      category: "Briefing",
    },
    {
      front: "All personnel are accounted for.",
      back: "Todo o pessoal está contabilizado / ninguém faltando.",
      example: "Check complete — all personnel are accounted for.",
      pronunciationTip: "ol persenél ar acáunted for",
      category: "Relatório",
    },
  ],
  quiz: {
    title: "Quiz Final — Simulação de missão",
    passScore: 70,
    questions: [
      {
        type: "MULTIPLE_CHOICE",
        prompt: "No rádio, qual termo você usa para indicar que terminou de falar e AGUARDA uma resposta?",
        explanation: "'Over' indica que você aguarda resposta. 'Out' encerra sem aguardar. Confundir os dois é um erro grave de comunicação.",
        options: [
          { text: "Over", isCorrect: true },
          { text: "Out", isCorrect: false },
          { text: "Wilco", isCorrect: false },
          { text: "Copy", isCorrect: false },
        ],
      },
      {
        type: "TRANSLATE_PT_EN",
        prompt: "Traduza para inglês a frase de briefing: 'Nosso objetivo é assegurar o perímetro norte até as 06h00.'",
        explanation: "A estrutura de briefing é 'Our objective is to + verbo base'. O horário militar é 'by 0600'.",
        correctAnswer: "Our objective is to secure the northern perimeter by 0600",
      },
      {
        type: "FIND_ERROR",
        prompt: "Qual mensagem de rádio tem um erro de protocolo?",
        explanation: "Nunca use 'repeat' no rádio — pode ser interpretado como pedido de repetição de disparo. O correto é 'Say again'. As outras frases estão corretas.",
        options: [
          { text: "Message not clear. Please repeat. Over.", isCorrect: true },
          { text: "Message not clear. Say again. Over.", isCorrect: false },
          { text: "Delta-1, do you copy? Over.", isCorrect: false },
          { text: "Roger, wilco. Proceeding now. Out.", isCorrect: false },
        ],
      },
      {
        type: "FILL_BLANK",
        prompt: "Complete a frase de rádio: 'Understood. Moving to sector 4. ___.' (encerre a comunicação sem aguardar resposta)",
        explanation: "'Out' encerra a comunicação sem aguardar resposta. 'Over' seria para aguardar resposta.",
        correctAnswer: "Out",
      },
      {
        type: "WORD_ORDER",
        prompt: "Ordene as palavras para a frase de identificação em checkpoint: 'your / please / and / identify / yourself / unit / state'",
        explanation: "A frase padrão de checkpoint é 'Please identify yourself and state your unit.'",
        correctAnswer: "Please identify yourself and state your unit",
      },
      {
        type: "FREE_TEXT",
        prompt: "Você chega a um checkpoint. Em 3-4 frases em inglês, identifique-se (nome, unidade), mencione uma experiência relevante neste setor usando present perfect, e diga para onde está indo. Use linguagem profissional.",
        explanation: "Exemplo: 'Sergeant Lima, Unit Alpha-2. I have operated in this sector before — we secured this zone last month. I am on my way to the forward operating base for the 0700 briefing.'",
        correctAnswer: "Sergeant [name], Unit [unit]. I have operated in this sector before. I am on my way to the forward operating base.",
      },
    ],
  },
};
