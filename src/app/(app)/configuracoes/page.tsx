import { Bot, CreditCard, Mail, ShieldCheck } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { AccessBadge } from "@/components/shared/access-badge";
import { ProfileForm } from "@/components/app/profile-form";
import { requireUser } from "@/lib/queries";
import { isAiConfigured } from "@/lib/ai/ai-provider";

export default async function SettingsPage() {
  const user = await requireUser();
  const aiReal = isAiConfigured();

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader
        title="Configurações"
        description="Gerencie seu perfil, acesso e preferências."
      />

      <div className="space-y-6">
        {/* Perfil */}
        <Card>
          <CardHeader>
            <CardTitle>Perfil</CardTitle>
            <CardDescription>
              Atualize seu nome de exibição. O e-mail não pode ser alterado.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ProfileForm initialName={user.name} />
            <div className="space-y-1.5">
              <Label htmlFor="email">E-mail</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="email"
                  value={user.email}
                  readOnly
                  disabled
                  className="pl-9"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Acesso */}
        <Card>
          <CardHeader>
            <CardTitle>Acesso</CardTitle>
            <CardDescription>
              Situação atual da sua conta na plataforma.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <AccessBadge plan={user.plan} blocked={user.accessBlocked} />
              <Badge variant="muted">Plano: {user.plan}</Badge>
              <Badge variant="muted">
                Assinatura: {user.subscriptionStatus}
              </Badge>
            </div>
            <p className="flex items-center gap-2 text-sm text-muted-foreground">
              <ShieldCheck className="h-4 w-4 text-success" />
              Acesso liberado para todos nesta fase.
            </p>
          </CardContent>
        </Card>

        {/* Professor IA */}
        <Card>
          <CardHeader>
            <CardTitle>Professor IA</CardTitle>
            <CardDescription>
              Status da integração do professor de inteligência artificial.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center gap-2">
              <Bot className="h-4 w-4 text-primary" />
              {aiReal ? (
                <Badge variant="success">Modo real</Badge>
              ) : (
                <Badge variant="warning">Modo demonstração</Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              {aiReal
                ? "O professor IA está conectado a um provedor real de IA."
                : "O professor IA está em modo demonstração, com respostas simuladas. Configure uma chave de API para ativar o modo real."}
            </p>
          </CardContent>
        </Card>

        {/* Pagamento (placeholder) */}
        <Card className="border-dashed bg-muted/30 opacity-80">
          <CardHeader>
            <div className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-muted-foreground" />
              <CardTitle className="text-muted-foreground">
                Pagamento — em breve
              </CardTitle>
            </div>
            <CardDescription>
              A integração de pagamento (Stripe, Mercado Pago, Hotmart, Kiwify)
              ainda não está habilitada. Nesta fase, o acesso é totalmente
              gratuito para todos os alunos.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Badge variant="muted">Não disponível</Badge>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
