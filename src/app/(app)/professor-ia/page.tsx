import Link from "next/link";
import { MessagesSquare } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AiChat } from "@/components/app/ai-chat";
import {
  requireUser,
  getCourse,
  getDashboardStats,
} from "@/lib/queries";
import { db } from "@/lib/db";
import { isAiConfigured } from "@/lib/ai/ai-provider";
import { AI_MODES, type AiMode } from "@/lib/constants";
import { cn } from "@/lib/utils";

export default async function ProfessorIaPage({
  searchParams,
}: {
  searchParams: { c?: string };
}) {
  const user = await requireUser();
  const course = await getCourse();
  const stats = await getDashboardStats(user.id, course);

  const conversations = await db.aiConversation.findMany({
    where: { userId: user.id },
    orderBy: { updatedAt: "desc" },
    take: 15,
  });

  let initialMessages: { role: "user" | "assistant"; content: string }[] = [];
  let initialMode: AiMode = "free";
  let initialConversationId: string | undefined;

  if (searchParams.c) {
    const conv = await db.aiConversation.findFirst({
      where: { id: searchParams.c, userId: user.id },
      include: { messages: { orderBy: { createdAt: "asc" } } },
    });
    if (conv) {
      initialConversationId = conv.id;
      initialMode = (conv.mode in AI_MODES ? conv.mode : "free") as AiMode;
      initialMessages = conv.messages.map((m) => ({
        role: m.role === "assistant" ? "assistant" : "user",
        content: m.content,
      }));
    }
  }

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        title="Professor IA"
        description="Seu tutor de inglês. Conversa em inglês e explica em português quando você precisa."
      />

      <div className="grid gap-4 lg:grid-cols-[260px_1fr]">
        {/* Histórico */}
        <aside className="order-2 lg:order-1">
          <Card className="p-3">
            <p className="px-1 text-xs font-semibold uppercase text-muted-foreground">
              Histórico de conversas
            </p>
            <div className="mt-2 space-y-1">
              <Link
                href="/professor-ia"
                className={cn(
                  "block rounded-md px-2 py-1.5 text-sm font-medium",
                  !initialConversationId
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted"
                )}
              >
                + Nova conversa
              </Link>
              {conversations.length === 0 && (
                <p className="px-2 py-2 text-xs text-muted-foreground">
                  Nenhuma conversa ainda.
                </p>
              )}
              {conversations.map((c) => (
                <Link
                  key={c.id}
                  href={`/professor-ia?c=${c.id}`}
                  className={cn(
                    "block rounded-md px-2 py-1.5 text-sm",
                    c.id === initialConversationId
                      ? "bg-muted font-medium"
                      : "hover:bg-muted"
                  )}
                >
                  <span className="line-clamp-1">{c.title}</span>
                  <span className="text-[11px] text-muted-foreground">
                    {AI_MODES[(c.mode in AI_MODES ? c.mode : "free") as AiMode]}
                  </span>
                </Link>
              ))}
            </div>
          </Card>
        </aside>

        {/* Chat */}
        <div className="order-1 lg:order-2">
          <AiChat
            key={initialConversationId ?? "new"}
            initialConversationId={initialConversationId}
            initialMessages={initialMessages}
            initialMode={initialMode}
            studentLevel={stats.currentLevelCode}
            demoMode={!isAiConfigured()}
          />
          {!isAiConfigured() && (
            <p className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
              <MessagesSquare className="h-3.5 w-3.5" />
              Modo demonstração ativo. Configure <code>AI_API_KEY</code> e{" "}
              <code>AI_PROVIDER</code> no <code>.env</code> para ativar a IA
              real.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
