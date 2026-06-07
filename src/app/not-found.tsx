import Link from "next/link";
import { Compass } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <span className="grid h-14 w-14 place-items-center rounded-full bg-primary/10 text-primary">
        <Compass className="h-7 w-7" />
      </span>
      <h1 className="mt-4 font-display text-3xl font-semibold">
        Página não encontrada
      </h1>
      <p className="mt-2 max-w-sm text-muted-foreground">
        A missão que você procura saiu da rota. Vamos voltar para o caminho
        certo.
      </p>
      <Link href="/" className={buttonVariants() + " mt-6"}>
        Voltar ao início
      </Link>
    </div>
  );
}
