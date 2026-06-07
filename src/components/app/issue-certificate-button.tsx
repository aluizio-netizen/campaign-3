"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Award, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function IssueCertificateButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function issue() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/certificate", { method: "POST" });
      const data = await res.json().catch(() => null);
      if (res.ok && data?.ok) {
        router.refresh();
      } else {
        setError(data?.error ?? "Não foi possível emitir o certificado.");
        setLoading(false);
      }
    } catch {
      setError("Erro de conexão. Tente novamente.");
      setLoading(false);
    }
  }

  return (
    <div className="space-y-2">
      <Button onClick={issue} disabled={loading}>
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Award className="h-4 w-4" />
        )}
        Emitir certificado
      </Button>
      {error && <p className="text-sm text-danger">{error}</p>}
    </div>
  );
}
