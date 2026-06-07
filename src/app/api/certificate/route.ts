import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { getCourse } from "@/lib/queries";
import { PROGRESS_STATUS } from "@/lib/constants";
import { siteConfig } from "@/config/site";

/** Gera um código de validação único: "MI-XXXXXXXX" (8 chars alfanuméricos). */
function generateCertificateCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let suffix = "";
  for (let i = 0; i < 8; i++) {
    suffix += chars[Math.floor(Math.random() * chars.length)];
  }
  return `MI-${suffix}`;
}

export async function POST() {
  const session = await getSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }

  const userId = session.user.id;
  const [user, course] = await Promise.all([
    db.user.findUnique({ where: { id: userId } }),
    getCourse(),
  ]);

  if (!user || !course) {
    return NextResponse.json(
      { error: "Usuário ou curso não encontrado." },
      { status: 404 }
    );
  }

  const lessons = course.levels.flatMap((l) => l.lessons);
  const total = lessons.length;

  const [progress, attempts, existing] = await Promise.all([
    db.userProgress.findMany({ where: { userId } }),
    db.quizAttempt.findMany({ where: { userId } }),
    db.certificate.findFirst({ where: { userId } }),
  ]);

  const completedIds = new Set(
    progress
      .filter((p) => p.status === PROGRESS_STATUS.COMPLETED)
      .map((p) => p.lessonId)
  );
  const completed = lessons.filter((l) => completedIds.has(l.id)).length;
  const allCompleted = total > 0 && completed === total;

  const avgScore = attempts.length
    ? Math.round(attempts.reduce((s, a) => s + a.score, 0) / attempts.length)
    : 0;

  const passScore = siteConfig.passScore;
  const criteria = { completed, total, avgScore, passScore };

  // Já possui certificado — retorna o existente.
  if (existing) {
    return NextResponse.json({ ok: true, certificate: existing });
  }

  const eligible = allCompleted && avgScore >= passScore;
  if (!eligible) {
    return NextResponse.json(
      {
        ok: false,
        error: "Critérios para emissão do certificado ainda não cumpridos.",
        criteria,
      },
      { status: 400 }
    );
  }

  const certificate = await db.certificate.create({
    data: {
      userId,
      code: generateCertificateCode(),
      courseTitle: course.title,
      studentName: user.name,
      hours: siteConfig.courseHours,
      score: avgScore,
    },
  });

  return NextResponse.json({ ok: true, certificate });
}
