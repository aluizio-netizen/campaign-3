import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { ROLES } from "@/lib/constants";

function slugify(input: string): string {
  return input
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }
  if (session.user.role !== ROLES.ADMIN) {
    return NextResponse.json({ error: "Acesso negado." }, { status: 403 });
  }

  const unit = await db.unit.findUnique({ where: { id: params.id } });
  if (!unit) {
    return NextResponse.json(
      { error: "Unidade não encontrada." },
      { status: 404 }
    );
  }

  const body = (await req.json().catch(() => null)) as Record<
    string,
    unknown
  > | null;
  if (!body) {
    return NextResponse.json({ error: "Corpo inválido." }, { status: 400 });
  }

  const data: {
    title?: string;
    slug?: string;
    order?: number;
    summary?: string;
    objective?: string;
    body?: string;
    vocab?: string;
    durationMin?: number;
    published?: boolean;
  } = {};

  if (typeof body.title === "string") {
    const title = body.title.trim();
    if (!title) {
      return NextResponse.json(
        { error: "O título não pode ficar vazio." },
        { status: 400 }
      );
    }
    data.title = title;
  }

  if (typeof body.slug === "string") {
    const slug = slugify(body.slug);
    if (!slug) {
      return NextResponse.json(
        { error: "Slug inválido." },
        { status: 400 }
      );
    }
    if (slug !== unit.slug) {
      const clash = await db.unit.findUnique({ where: { slug } });
      if (clash && clash.id !== unit.id) {
        return NextResponse.json(
          { error: "Já existe uma unidade com esse slug." },
          { status: 409 }
        );
      }
    }
    data.slug = slug;
  }

  if (body.order !== undefined) {
    if (typeof body.order !== "number" || !Number.isFinite(body.order)) {
      return NextResponse.json(
        { error: "Ordem inválida." },
        { status: 400 }
      );
    }
    data.order = Math.trunc(body.order);
  }

  if (typeof body.summary === "string") data.summary = body.summary;
  if (typeof body.objective === "string") data.objective = body.objective;
  if (typeof body.body === "string") data.body = body.body;

  if (body.vocab !== undefined) {
    if (typeof body.vocab !== "string") {
      return NextResponse.json(
        { error: "Vocabulário deve ser uma string JSON." },
        { status: 400 }
      );
    }
    try {
      JSON.parse(body.vocab);
    } catch {
      return NextResponse.json(
        { error: "Vocabulário com JSON inválido." },
        { status: 400 }
      );
    }
    data.vocab = body.vocab;
  }

  if (body.durationMin !== undefined) {
    if (
      typeof body.durationMin !== "number" ||
      !Number.isFinite(body.durationMin)
    ) {
      return NextResponse.json(
        { error: "Duração inválida." },
        { status: 400 }
      );
    }
    data.durationMin = Math.max(0, Math.trunc(body.durationMin));
  }

  if (body.published !== undefined) {
    if (typeof body.published !== "boolean") {
      return NextResponse.json(
        { error: "Campo published inválido." },
        { status: 400 }
      );
    }
    data.published = body.published;
  }

  await db.unit.update({ where: { id: unit.id }, data });

  await db.adminLog.create({
    data: {
      actorId: session.user.id,
      action: "UPDATE_UNIT",
      target: unit.id,
    },
  });

  return NextResponse.json({ ok: true });
}

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }
  if (session.user.role !== ROLES.ADMIN) {
    return NextResponse.json({ error: "Acesso negado." }, { status: 403 });
  }

  const unit = await db.unit.findUnique({ where: { id: params.id } });
  if (!unit) {
    return NextResponse.json(
      { error: "Unidade não encontrada." },
      { status: 404 }
    );
  }

  // Faixas e páginas têm onDelete: SetNull -> apenas desvinculam.
  await db.unit.delete({ where: { id: unit.id } });

  await db.adminLog.create({
    data: {
      actorId: session.user.id,
      action: "DELETE_UNIT",
      target: unit.id,
    },
  });

  return NextResponse.json({ ok: true });
}
