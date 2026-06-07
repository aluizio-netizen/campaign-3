import type { LevelCode, QuestionType } from "@/lib/constants";

export interface VocabSeed {
  term: string; // inglês
  translation: string; // português
  example: string; // exemplo em inglês
  pronunciation: string; // dica de pronúncia (aproximação falada em PT-BR)
  category: string;
}

export interface FlashcardSeed {
  front: string; // termo em inglês
  back: string; // tradução em português
  example: string; // exemplo em inglês
  pronunciationTip: string;
  category: string;
}

export interface DialogueLine {
  speaker: string;
  en: string;
  pt: string;
}

export interface PhraseSeed {
  en: string;
  pt: string;
  tip?: string; // dica de uso/pronúncia
}

export interface FalseFriend {
  en: string;
  pt: string; // o que o brasileiro pensa que significa
  note: string; // o que realmente significa / cuidado
}

export interface QuestionSeed {
  type: QuestionType;
  prompt: string;
  explanation: string;
  /** Para MULTIPLE_CHOICE / FIND_ERROR: alternativas (marque a correta). */
  options?: { text: string; isCorrect: boolean }[];
  /** Para tipos textuais (FILL_BLANK, TRANSLATE_*, WORD_ORDER, FREE_TEXT). */
  correctAnswer?: string;
}

export interface LessonContentSeed {
  warmup: string;
  grammar: string;
  comparison: string;
  falseFriends?: FalseFriend[];
  dialogue: DialogueLine[];
  phrases: PhraseSeed[];
  guidedExercise: string;
  writingExercise: string;
  speakingExercise: string;
  listeningExercise: string;
  mission: string;
  checklist: string[];
}

export interface LessonSeed {
  slug: string;
  title: string;
  order: number; // 1..10 (ordem global no curso)
  levelCode: LevelCode; // A1 | A2 | B1
  objective: string;
  durationMin: number;
  summary: string;
  content: LessonContentSeed;
  vocabulary: VocabSeed[];
  flashcards: FlashcardSeed[];
  quiz: {
    title: string;
    passScore?: number;
    questions: QuestionSeed[];
  };
}
