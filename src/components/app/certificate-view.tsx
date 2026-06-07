"use client";

import { Award, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { formatDate } from "@/lib/utils";

export function CertificateView({
  studentName,
  courseTitle,
  hours,
  code,
  issuedAt,
  score,
}: {
  studentName: string;
  courseTitle: string;
  hours: number;
  code: string;
  issuedAt: Date | string;
  score: number;
}) {
  return (
    <div className="space-y-4">
      <div className="flex justify-end print:hidden">
        <Button onClick={() => window.print()}>
          <Printer className="h-4 w-4" /> Imprimir / Baixar PDF
        </Button>
      </div>

      <div className="rounded-xl border-4 border-double border-primary/60 bg-card p-2 shadow-card print:border-primary print:shadow-none">
        <div className="rounded-lg border border-primary/30 px-6 py-10 text-center sm:px-12 sm:py-14">
          <span className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-full bg-primary/10 text-primary print:bg-transparent">
            <Award className="h-8 w-8" />
          </span>

          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
            {siteConfig.company}
          </p>
          <h1 className="mt-3 font-display text-2xl font-semibold tracking-tight sm:text-3xl">
            Certificado de Conclusão
          </h1>

          <p className="mt-8 text-sm text-muted-foreground">
            Certificamos que
          </p>
          <p className="mt-2 font-display text-3xl font-bold tracking-tight sm:text-4xl">
            {studentName}
          </p>

          <p className="mx-auto mt-6 max-w-lg text-sm leading-relaxed text-muted-foreground">
            concluiu com êxito o curso{" "}
            <span className="font-medium text-foreground">{courseTitle}</span>,
            com carga horária de{" "}
            <span className="font-medium text-foreground">{hours} horas</span> e
            aproveitamento de{" "}
            <span className="font-medium text-foreground">{score}%</span>.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 text-sm sm:flex-row sm:gap-10">
            <div className="text-center">
              <p className="font-medium">{formatDate(issuedAt)}</p>
              <p className="text-xs text-muted-foreground">Data de emissão</p>
            </div>
            <div className="hidden h-8 w-px bg-border sm:block" />
            <div className="text-center">
              <p className="font-mono font-medium tracking-wide">{code}</p>
              <p className="text-xs text-muted-foreground">
                Código de validação
              </p>
            </div>
          </div>

          <p className="mt-10 text-xs text-muted-foreground">
            {siteConfig.company} · {siteConfig.supportEmail}
          </p>
        </div>
      </div>
    </div>
  );
}
