import { Badge } from "@/components/ui/badge";
import { ShieldCheck, ShieldAlert } from "lucide-react";

/**
 * Mostra o status de acesso do aluno. Nesta versão todos têm acesso liberado;
 * o componente já está pronto para refletir planos/pagamento no futuro.
 */
export function AccessBadge({
  plan,
  blocked,
}: {
  plan?: string;
  blocked?: boolean;
}) {
  if (blocked) {
    return (
      <Badge variant="danger" className="gap-1">
        <ShieldAlert className="h-3 w-3" /> Acesso bloqueado
      </Badge>
    );
  }
  return (
    <Badge variant="success" className="gap-1">
      <ShieldCheck className="h-3 w-3" /> Acesso liberado
      {plan && plan !== "FREE" ? ` · ${plan}` : ""}
    </Badge>
  );
}
