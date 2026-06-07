import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  const session = await getSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const name = typeof body?.name === "string" ? body.name.trim() : "";

  if (name.length < 2) {
    return NextResponse.json(
      { error: "O nome deve ter pelo menos 2 caracteres." },
      { status: 400 }
    );
  }

  await db.user.update({
    where: { id: session.user.id },
    data: { name },
  });

  return NextResponse.json({ ok: true });
}
