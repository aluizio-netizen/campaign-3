import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { ROLES } from "@/lib/constants";

/** Slugify simples: minúsculas, sem acentos, hífens. */
function slugify(input: string): string {
  return input
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Garante slug único, sufixando -2, -3... em caso de colisão. */
async function uniqueSlug(base: string): Promise<string> {
  const root = base || "unidade";
  let candidate = root;
  let n = 2;
  // eslint-disable-next-line no-await-in-loop
  while (await db.unit.findUnique({ where: { slug: candidate } })) {
    candidate = `${root}-${n}`;
    n += 1;
  }
  return candidate;
}

export async function POST(req: Request) {
  const session = await getSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }
  if (session.user.role !== ROLES.ADMIN) {
    return NextResponse.json({ error: "Acesso negado." }, { status: 403 });
  }

  const body = (await req.json().catch(() => null)) as Record<
    string,
    unknown
  > | null;
  if (!body) {
    return NextResponse.json({ error: "Corpo inválido." }, { status: 400 });
  }

  const title =
    typeof body.title === "string" ? body.title.trim() : "";
  if (!title) {
    return NextResponse.json(
      { error: "O título é obrigatório." },
      { status: 400 }
    );
  }

  const course = await db.course.findUnique({
    where: { slug: "campaign-3" },
  });
  if (!course) {
    return NextResponse.json(
      { error: "Curso não encontrado." },
      { status: 404 }
    );
  }

  const requestedSlug =
    typeof body.slug === "string" && body.slug.trim()
      ? slugify(body.slug)
      : slugify(title);
  const slug = await uniqueSlug(requestedSlug);

  // order: usa o informado ou o próximo na sequência do curso.
  let order: number;
  if (typeof body.order === "number" && Number.isFinite(body.order)) {
    order = Math.trunc(body.order);
  } else {
    const last = await db.unit.findFirst({
      where: { courseId: course.id },
      orderBy: { order: "desc" },
      select: { order: true },
    });
    order = (last?.order ?? 0) + 1;
  }

  let vocab = "[]";
  if (typeof body.vocab === "string") {
    try {
      JSON.parse(body.vocab);
      vocab = body.vocab;
    } catch {
      return NextResponse.json(
        { error: "Vocabulário com JSON inválido." },
        { status: 400 }
      );
    }
  }

  const durationMin =
    typeof body.durationMin === "number" && Number.isFinite(body.durationMin)
      ? Math.max(0, Math.trunc(body.durationMin))
      : 20;

  const unit = await db.unit.create({
    data: {
      courseId: course.id,
      slug,
      order,
      title,
      summary: typeof body.summary === "string" ? body.summary : "",
      objective: typeof body.objective === "string" ? body.objective : "",
      body: typeof body.body === "string" ? body.body : "",
      vocab,
      durationMin,
      published: typeof body.published === "boolean" ? body.published : false,
    },
    select: { id: true },
  });

  await db.adminLog.create({
    data: {
      actorId: session.user.id,
      action: "CREATE_UNIT",
      target: unit.id,
    },
  });

  return NextResponse.json({ ok: true, id: unit.id });
}
