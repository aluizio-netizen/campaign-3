import { normalizeAnswer } from "@/lib/utils";
import { QUESTION_TYPES } from "@/lib/constants";

export interface GradableOption {
  id: string;
  text: string;
  isCorrect: boolean;
}
export interface GradableQuestion {
  id: string;
  type: string;
  prompt: string;
  explanation: string;
  correctAnswer: string | null;
  options: GradableOption[];
}

export interface SubmittedAnswer {
  questionId: string;
  value: string | string[]; // optionId (MC) ou texto
}

export interface QuestionResult {
  questionId: string;
  correct: boolean;
  autoGraded: boolean;
  explanation: string;
  expected: string;
  given: string;
}

export interface GradeResult {
  results: QuestionResult[];
  correct: number;
  total: number; // questões auto-corrigidas
  score: number; // %
}

/** Corrige um quiz. FREE_TEXT não é auto-corrigido (fica para revisão da IA). */
export function gradeQuiz(
  questions: GradableQuestion[],
  answers: SubmittedAnswer[]
): GradeResult {
  const answerMap = new Map(answers.map((a) => [a.questionId, a.value]));
  const results: QuestionResult[] = [];
  let correct = 0;
  let total = 0;

  for (const q of questions) {
    const given = answerMap.get(q.id);
    const givenStr = Array.isArray(given) ? given.join(" ") : (given ?? "");

    if (q.type === QUESTION_TYPES.FREE_TEXT) {
      results.push({
        questionId: q.id,
        correct: false,
        autoGraded: false,
        explanation: q.explanation,
        expected: q.correctAnswer ?? "(resposta aberta)",
        given: givenStr,
      });
      continue;
    }

    total += 1;
    let isCorrect = false;
    let expected = q.correctAnswer ?? "";

    if (
      q.type === QUESTION_TYPES.MULTIPLE_CHOICE ||
      q.type === QUESTION_TYPES.FIND_ERROR
    ) {
      const correctOption = q.options.find((o) => o.isCorrect);
      expected = correctOption?.text ?? "";
      isCorrect = Boolean(correctOption && given === correctOption.id);
    } else {
      // Tipos textuais: comparação normalizada com a resposta esperada.
      isCorrect =
        normalizeAnswer(givenStr) === normalizeAnswer(q.correctAnswer ?? "");
    }

    if (isCorrect) correct += 1;
    results.push({
      questionId: q.id,
      correct: isCorrect,
      autoGraded: true,
      explanation: q.explanation,
      expected,
      given: givenStr,
    });
  }

  const score = total ? Math.round((correct / total) * 100) : 0;
  return { results, correct, total, score };
}
