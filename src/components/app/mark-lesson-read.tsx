"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function MarkLessonRead({
  lessonId,
  alreadyRead,
}: {
  lessonId: string;
  alreadyRead: boolean;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(alreadyRead);

  async function mark() {
    setLoading(true);
    await fetch("/api/progress", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lessonId, action: "read" }),
    });
    setLoading(false);
    setDone(true);
    router.refresh();
  }

  if (done) {
    return (
      <Button variant="outline" disabled className="gap-2">
        <CheckCircle2 className="h-4 w-4 text-success" /> Leitura concluída
      </Button>
    );
  }

  return (
    <Button onClick={mark} disabled={loading} className="gap-2">
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <CheckCircle2 className="h-4 w-4" />
      )}
      Marcar leitura como concluída
    </Button>
  );
}
