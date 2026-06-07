import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { updateLessonProgress } from "@/lib/progress";

export async function POST(req: Request) {
  const session = await getSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const lessonId = body?.lessonId as string | undefined;
  const action = body?.action as string | undefined;
  if (!lessonId) {
    return NextResponse.json({ error: "lessonId ausente." }, { status: 400 });
  }

  const lesson = await db.lesson.findUnique({ where: { id: lessonId } });
  if (!lesson) {
    return NextResponse.json({ error: "Aula não encontrada." }, { status: 404 });
  }

  const patch =
    action === "read"
      ? { lessonRead: true }
      : action === "pronunciation"
        ? { pronunciationDone: true }
        : {};

  const progress = await updateLessonProgress(session.user.id, lessonId, patch);
  return NextResponse.json({ ok: true, progress });
}
