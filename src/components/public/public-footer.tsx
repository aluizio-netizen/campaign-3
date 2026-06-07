import { Logo } from "@/components/shared/logo";
import { siteConfig } from "@/config/site";

export function PublicFooter() {
  return (
    <footer className="border-t bg-card">
      <div className="container flex flex-col items-center justify-between gap-4 py-10 text-sm text-muted-foreground md:flex-row">
        <div className="flex flex-col items-center gap-2 md:items-start">
          <Logo />
          <p className="max-w-sm text-center md:text-left">
            {siteConfig.description}
          </p>
        </div>
        <div className="flex flex-col items-center gap-1 md:items-end">
          <p>
            © {new Date().getFullYear()} {siteConfig.company}. Todos os direitos
            reservados.
          </p>
          <p>{siteConfig.supportEmail}</p>
          <p className="text-xs">
            Versão inicial · pagamento não habilitado nesta fase.
          </p>
        </div>
      </div>
    </footer>
  );
}
