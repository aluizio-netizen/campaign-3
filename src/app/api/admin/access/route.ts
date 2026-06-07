import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { ROLES } from "@/lib/constants";

export async function POST(req: Request) {
  const session = await getSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }
  if (session.user.role !== ROLES.ADMIN) {
    return NextResponse.json({ error: "Acesso negado." }, { status: 403 });
  }

  const body = await req.json().catch(() => null);
  const userId = body?.userId as string | undefined;
  const blocked = body?.blocked as boolean | undefined;

  if (!userId || typeof blocked !== "boolean") {
    return NextResponse.json(
      { error: "Parâmetros inválidos." },
      { status: 400 }
    );
  }

  const user = await db.user.findUnique({ where: { id: userId } });
  if (!user) {
    return NextResponse.json(
      { error: "Usuário não encontrado." },
      { status: 404 }
    );
  }

  await db.user.update({
    where: { id: userId },
    data: { accessBlocked: blocked },
  });

  await db.adminLog.create({
    data: {
      actorId: session.user.id,
      action: blocked ? "BLOCK_ACCESS" : "UNBLOCK_ACCESS",
      target: userId,
    },
  });

  return NextResponse.json({ ok: true });
}
