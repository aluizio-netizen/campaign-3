import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { ROLES } from "@/lib/constants";

export async function POST(
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

  const unit = await db.unit.findUnique({
    where: { id: params.id },
    select: { id: true },
  });
  if (!unit) {
    return NextResponse.json(
      { error: "Unidade não encontrada." },
      { status: 404 }
    );
  }

  const body = (await req.json().catch(() => null)) as {
    action?: unknown;
    kind?: unknown;
    ids?: unknown;
  } | null;

  const action = body?.action;
  const kind = body?.kind;
  const ids = body?.ids;

  if (action !== "attach" && action !== "detach") {
    return NextResponse.json(
      { error: "Ação inválida." },
      { status: 400 }
    );
  }
  if (kind !== "track" && kind !== "page") {
    return NextResponse.json(
      { error: "Tipo de mídia inválido." },
      { status: 400 }
    );
  }
  if (
    !Array.isArray(ids) ||
    !ids.every((x): x is string => typeof x === "string")
  ) {
    return NextResponse.json(
      { error: "Lista de ids inválida." },
      { status: 400 }
    );
  }
  if (ids.length === 0) {
    return NextResponse.json({ ok: true });
  }

  const nextUnitId = action === "attach" ? unit.id : null;

  if (kind === "track") {
    await db.audioTrack.updateMany({
      where: { id: { in: ids } },
      data: { unitId: nextUnitId },
    });
  } else {
    await db.bookPage.updateMany({
      where: { id: { in: ids } },
      data: { unitId: nextUnitId },
    });
  }

  await db.adminLog.create({
    data: {
      actorId: session.user.id,
      action: `${action === "attach" ? "ATTACH" : "DETACH"}_${
        kind === "track" ? "TRACK" : "PAGE"
      }`,
      target: unit.id,
    },
  });

  return NextResponse.json({ ok: true });
}
