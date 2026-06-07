import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { aiMessageSchema } from "@/lib/validations";
import { generateReply, type ChatMessage } from "@/lib/ai/ai-provider";
import { AI_MODES, type AiMode } from "@/lib/constants";

export async function POST(req: Request) {
  const session = await getSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }
  const userId = session.user.id;

  const body = await req.json().catch(() => null);
  const parsed = aiMessageSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Dados inválidos." },
      { status: 400 }
    );
  }
  const { message } = parsed.data;
  const mode = (parsed.data.mode in AI_MODES ? parsed.data.mode : "free") as AiMode;
  const studentLevel = (body?.studentLevel as string) || "A1";

  // Conversa existente (do usuário) ou nova.
  let conversationId = parsed.data.conversationId;
  if (conversationId) {
    const owns = await db.aiConversation.findFirst({
      where: { id: conversationId, userId },
      select: { id: true },
    });
    if (!owns) conversationId = undefined;
  }
  if (!conversationId) {
    const created = await db.aiConversation.create({
      data: {
        userId,
        mode,
        title: message.slice(0, 40) + (message.length > 40 ? "…" : ""),
      },
    });
    conversationId = created.id;
  }

  // Salva a mensagem do aluno.
  await db.aiMessage.create({
    data: { conversationId, role: "user", content: message },
  });

  // Histórico (limitado) para contexto.
  const history = await db.aiMessage.findMany({
    where: { conversationId },
    orderBy: { createdAt: "asc" },
    take: 20,
  });
  const chatMessages: ChatMessage[] = history.map((m) => ({
    role: m.role === "assistant" ? "assistant" : "user",
    content: m.content,
  }));

  const reply = await generateReply({ mode, messages: chatMessages, studentLevel });

  await db.aiMessage.create({
    data: { conversationId, role: "assistant", content: reply.content },
  });
  await db.aiConversation.update({
    where: { id: conversationId },
    data: { updatedAt: new Date(), mode },
  });

  return NextResponse.json({
    ok: true,
    conversationId,
    reply: reply.content,
    demo: reply.demo,
  });
}
