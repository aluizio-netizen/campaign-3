/**
 * Constantes "tipo enum" — o schema Prisma usa String para compatibilidade
 * SQLite/PostgreSQL, então centralizamos os valores válidos aqui.
 */

export const ROLES = {
  STUDENT: "STUDENT",
  ADMIN: "ADMIN",
} as const;
export type Role = (typeof ROLES)[keyof typeof ROLES];

export const PROGRESS_STATUS = {
  NOT_STARTED: "NOT_STARTED",
  IN_PROGRESS: "IN_PROGRESS",
  COMPLETED: "COMPLETED",
} as const;
export type ProgressStatus =
  (typeof PROGRESS_STATUS)[keyof typeof PROGRESS_STATUS];

export const QUESTION_TYPES = {
  MULTIPLE_CHOICE: "MULTIPLE_CHOICE",
  FILL_BLANK: "FILL_BLANK",
  TRANSLATE_PT_EN: "TRANSLATE_PT_EN",
  TRANSLATE_EN_PT: "TRANSLATE_EN_PT",
  FIND_ERROR: "FIND_ERROR",
  WORD_ORDER: "WORD_ORDER",
  FREE_TEXT: "FREE_TEXT",
} as const;
export type QuestionType =
  (typeof QUESTION_TYPES)[keyof typeof QUESTION_TYPES];

export const QUESTION_TYPE_LABELS: Record<QuestionType, string> = {
  MULTIPLE_CHOICE: "Múltipla escolha",
  FILL_BLANK: "Completar a frase",
  TRANSLATE_PT_EN: "Traduzir (PT → EN)",
  TRANSLATE_EN_PT: "Traduzir (EN → PT)",
  FIND_ERROR: "Identificar o erro",
  WORD_ORDER: "Ordenar as palavras",
  FREE_TEXT: "Resposta livre",
};

/** Tipos cuja correção é automática (objetiva). FREE_TEXT depende de IA. */
export const AUTO_GRADED_TYPES: QuestionType[] = [
  "MULTIPLE_CHOICE",
  "FILL_BLANK",
  "TRANSLATE_PT_EN",
  "TRANSLATE_EN_PT",
  "FIND_ERROR",
  "WORD_ORDER",
];

export const FLASHCARD_DIFFICULTY = {
  EASY: "EASY",
  MEDIUM: "MEDIUM",
  HARD: "HARD",
} as const;
export type FlashcardDifficulty =
  (typeof FLASHCARD_DIFFICULTY)[keyof typeof FLASHCARD_DIFFICULTY];

export const AI_MODES = {
  free: "Conversação livre",
  correction: "Correção de frases",
  travel: "Simulação de missão/viagem",
  pronunciation: "Treino de pronúncia",
  review: "Revisão da aula",
  study_plan: "Plano de estudo",
} as const;
export type AiMode = keyof typeof AI_MODES;

export const LEVEL_CODES = ["A1", "A2", "B1"] as const;
export type LevelCode = (typeof LEVEL_CODES)[number];

export const SUBSCRIPTION_STATUS = {
  ACTIVE: "ACTIVE",
  INACTIVE: "INACTIVE",
  TRIAL: "TRIAL",
} as const;
