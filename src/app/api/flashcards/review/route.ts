import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { FLASHCARD_DIFFICULTY, type FlashcardDifficulty } from "@/lib/constants";

const VALID_DIFFICULTIES: FlashcardDifficulty[] = [
  FLASHCARD_DIFFICULTY.EASY,
  FLASHCARD_DIFFICULTY.MEDIUM,
  FLASHCARD_DIFFICULTY.HARD,
];

export async function POST(req: Request) {
  const session = await getSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const flashcardId = body?.flashcardId as string | undefined;
  const difficulty = body?.difficulty as FlashcardDifficulty | undefined;

  if (!flashcardId) {
    return NextResponse.json(
      { error: "flashcardId ausente." },
      { status: 400 }
    );
  }
  if (!difficulty || !VALID_DIFFICULTIES.includes(difficulty)) {
    return NextResponse.json(
      { error: "Dificuldade inválida." },
      { status: 400 }
    );
  }

  const userId = session.user.id;
  const isEasy = difficulty === FLASHCARD_DIFFICULTY.EASY;

  await db.flashcardReview.upsert({
    where: { userId_flashcardId: { userId, flashcardId } },
    update: {
      difficulty,
      reviewedAt: new Date(),
      ...(isEasy ? { correctCount: { increment: 1 } } : {}),
    },
    create: {
      userId,
      flashcardId,
      difficulty,
      correctCount: isEasy ? 1 : 0,
    },
  });

  return NextResponse.json({ ok: true });
}
