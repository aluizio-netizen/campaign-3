import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { courseSeed, levelsSeed, allLessons } from "../src/content";
import { ROLES, PROGRESS_STATUS } from "../src/lib/constants";

const db = new PrismaClient();

async function main() {
  console.log("🌱 Iniciando seed...");

  // ── Usuários (idempotente por e-mail) ─────────────────────────────────────
  const adminEmail = (process.env.ADMIN_EMAIL ?? "admin@missaoingles.com").toLowerCase();
  const adminPass = process.env.ADMIN_PASSWORD ?? "admin123";
  const studentEmail = (process.env.DEMO_STUDENT_EMAIL ?? "aluno@missaoingles.com").toLowerCase();
  const studentPass = process.env.DEMO_STUDENT_PASSWORD ?? "aluno123";

  const admin = await db.user.upsert({
    where: { email: adminEmail },
    update: { role: ROLES.ADMIN },
    create: {
      name: "Administrador",
      email: adminEmail,
      passwordHash: await bcrypt.hash(adminPass, 10),
      role: ROLES.ADMIN,
    },
  });
  console.log(`👤 Admin: ${admin.email}`);

  const student = await db.user.upsert({
    where: { email: studentEmail },
    update: {},
    create: {
      name: "Aluno Demo",
      email: studentEmail,
      passwordHash: await bcrypt.hash(studentPass, 10),
      role: ROLES.STUDENT,
      streakCount: 3,
      lastStudyAt: new Date(),
    },
  });
  console.log(`👤 Aluno demo: ${student.email}`);

  // ── Curso (recria do zero para refletir o conteúdo atual) ─────────────────
  await db.course.deleteMany({ where: { slug: courseSeed.slug } });

  const course = await db.course.create({
    data: {
      slug: courseSeed.slug,
      title: courseSeed.title,
      description: courseSeed.description,
      language: courseSeed.language,
      estimatedHours: courseSeed.estimatedHours,
    },
  });
  console.log(`📚 Curso: ${course.title}`);

  // ── Níveis ────────────────────────────────────────────────────────────────
  const levelIdByCode: Record<string, string> = {};
  for (const lvl of levelsSeed) {
    const created = await db.level.create({
      data: {
        courseId: course.id,
        code: lvl.code,
        slug: lvl.slug,
        title: lvl.title,
        description: lvl.description,
        order: lvl.order,
      },
    });
    levelIdByCode[lvl.code] = created.id;
  }
  console.log(`🎯 Níveis: ${levelsSeed.map((l) => l.code).join(", ")}`);

  // ── Aulas + conteúdo + vocabulário + flashcards + quiz ────────────────────
  let firstLessonId = "";
  for (const l of allLessons) {
    const levelId = levelIdByCode[l.levelCode];
    if (!levelId) throw new Error(`Nível ${l.levelCode} não encontrado para a aula ${l.slug}`);

    const lesson = await db.lesson.create({
      data: {
        levelId,
        slug: l.slug,
        title: l.title,
        order: l.order,
        objective: l.objective,
        durationMin: l.durationMin,
        summary: l.summary,
        content: {
          create: {
            warmup: l.content.warmup,
            grammar: l.content.grammar,
            comparison: l.content.comparison,
            falseFriends: JSON.stringify(l.content.falseFriends ?? []),
            dialogue: JSON.stringify(l.content.dialogue),
            phrases: JSON.stringify(l.content.phrases),
            guidedExercise: l.content.guidedExercise,
            writingExercise: l.content.writingExercise,
            speakingExercise: l.content.speakingExercise,
            listeningExercise: l.content.listeningExercise,
            mission: l.content.mission,
            checklist: JSON.stringify(l.content.checklist),
          },
        },
        vocabulary: {
          create: l.vocabulary.map((v, i) => ({
            term: v.term,
            translation: v.translation,
            example: v.example,
            pronunciation: v.pronunciation,
            category: v.category,
            order: i,
          })),
        },
        flashcards: {
          create: l.flashcards.map((f, i) => ({
            front: f.front,
            back: f.back,
            example: f.example,
            pronunciationTip: f.pronunciationTip,
            category: f.category,
            order: i,
          })),
        },
      },
    });
    if (!firstLessonId) firstLessonId = lesson.id;

    // Quiz + questões + alternativas
    const quiz = await db.quiz.create({
      data: {
        lessonId: lesson.id,
        title: l.quiz.title,
        passScore: l.quiz.passScore ?? 70,
      },
    });

    for (let qi = 0; qi < l.quiz.questions.length; qi++) {
      const q = l.quiz.questions[qi];
      await db.question.create({
        data: {
          quizId: quiz.id,
          order: qi,
          type: q.type,
          prompt: q.prompt,
          explanation: q.explanation,
          correctAnswer: q.correctAnswer ?? null,
          options: q.options
            ? {
                create: q.options.map((o, oi) => ({
                  text: o.text,
                  isCorrect: o.isCorrect,
                  order: oi,
                })),
              }
            : undefined,
        },
      });
    }
    console.log(`  ✔ Aula ${l.order}: ${l.title}`);
  }

  // ── Progresso de exemplo para o aluno demo (primeira aula concluída) ──────
  if (firstLessonId) {
    await db.userProgress.upsert({
      where: { userId_lessonId: { userId: student.id, lessonId: firstLessonId } },
      update: {},
      create: {
        userId: student.id,
        lessonId: firstLessonId,
        status: PROGRESS_STATUS.COMPLETED,
        lessonRead: true,
        quizPassed: true,
        pronunciationDone: true,
        completedAt: new Date(),
      },
    });
  }

  console.log("✅ Seed concluído.");
}

main()
  .catch((e) => {
    console.error("❌ Erro no seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
