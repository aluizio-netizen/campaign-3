import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { updateLessonProgress } from "@/lib/progress";

/**
 * Avaliação de pronúncia SIMULADA.
 * Gera uma nota entre 72 e 98 e um feedback coerente em PT-BR.
 * O uso de Math.random aqui é intencional (placeholder até integrar STT real).
 */
function evaluatePhrase(): { score: number; feedback: string } {
  const score = Math.floor(72 + Math.random() * (98 - 72 + 1)); // 72-98
  let feedback: string;
  if (score > 90) {
    feedback = "Excelente! Pronúncia muito clara e natural.";
  } else if (score >= 80) {
    feedback = "Bom! Cuidado com o som final das palavras.";
  } else {
    feedback = "Continue praticando o som do 'th' e o ritmo da frase.";
  }
  return { score, feedback };
}

export async function POST(req: Request) {
  const session = await getSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const phrase = body?.phrase as string | undefined;
  const lessonSlug = body?.lessonSlug as string | undefined;

  if (!phrase || !phrase.trim()) {
    return NextResponse.json({ error: "Frase ausente." }, { status: 400 });
  }

  const userId = session.user.id;
  const { score, feedback } = evaluatePhrase();

  // Tenta vincular à aula pelo slug (opcional).
  const lesson = lessonSlug
    ? await db.lesson.findUnique({ where: { slug: lessonSlug } })
    : null;

  await db.pronunciationAttempt.create({
    data: {
      userId,
      lessonId: lesson?.id ?? null,
      phrase: phrase.trim(),
      score,
      feedback,
    },
  });

  // Marca a prática de fala como realizada na aula vinculada.
  if (lesson) {
    await updateLessonProgress(userId, lesson.id, { pronunciationDone: true });
  }

  return NextResponse.json({ score, feedback });
}
