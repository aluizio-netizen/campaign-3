import Link from "next/link";
import {
  Target,
  Headphones,
  MessageSquareText,
  GraduationCap,
  Compass,
  Mic,
  CheckCircle2,
} from "lucide-react";
import { PublicHeader } from "@/components/public/public-header";
import { PublicFooter } from "@/components/public/public-footer";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { siteConfig } from "@/config/site";

const benefits = [
  {
    icon: Target,
    title: "Aprendizado por missões",
    text: "Cada aula é uma missão curta com objetivo claro, etapas e checklist de conclusão.",
  },
  {
    icon: MessageSquareText,
    title: "Professor de IA",
    text: "Converse em inglês, receba correções e simule situações reais com um tutor virtual.",
  },
  {
    icon: Mic,
    title: "Pronúncia guiada",
    text: "Ouça os modelos, grave sua voz e receba feedback para soar mais natural.",
  },
  {
    icon: GraduationCap,
    title: "Certificado",
    text: "Conclua as missões, atinja o aproveitamento mínimo e emita seu certificado.",
  },
];

const levels = [
  {
    code: "A1",
    title: "Fundamentos",
    text: "Primeiros contatos, apresentação, verbos essenciais e pedidos básicos.",
  },
  {
    code: "A2",
    title: "Sobrevivência e rotina",
    text: "Rotina, horários, deslocamento, direções e logística do dia a dia.",
  },
  {
    code: "B1",
    title: "Conversação prática",
    text: "Passado, planos, experiências e simulação de conversa real em missão.",
  },
];

const faqs = [
  {
    q: "Preciso saber inglês para começar?",
    a: "Não. O curso começa do iniciante absoluto (A1) e avança gradualmente até o intermediário (B1).",
  },
  {
    q: "Como funciona o professor de IA?",
    a: "Ele conversa com você principalmente em inglês e explica em português quando você pede ajuda. Sem chave de IA configurada, funciona em modo demonstração.",
  },
  {
    q: "Já posso pagar pelo curso?",
    a: "Nesta versão inicial o pagamento ainda não está habilitado. Todos os alunos cadastrados têm acesso completo e gratuito.",
  },
  {
    q: "Recebo certificado?",
    a: `Sim. Ao concluir as aulas e atingir ${siteConfig.passScore}% de aproveitamento, você emite seu certificado com código de validação.`,
  },
];

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <PublicHeader />

      <main className="flex-1">
        {/* HERO */}
        <section className="gradient-hero text-white">
          <div className="container grid gap-10 py-20 md:grid-cols-2 md:py-28">
            <div className="flex flex-col justify-center">
              <Badge variant="accent" className="mb-4 w-fit bg-white/15 text-white">
                {siteConfig.tagline}
              </Badge>
              <h1 className="font-display text-4xl font-semibold leading-tight tracking-tight md:text-5xl">
                Aprenda inglês de missão, <span className="text-accent">etapa por etapa</span>.
              </h1>
              <p className="mt-4 max-w-md text-white/80">
                {siteConfig.description}
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/cadastro"
                  className={buttonVariants({ variant: "accent", size: "lg" })}
                >
                  Começar agora
                </Link>
                <Link
                  href="/login"
                  className={buttonVariants({ variant: "outline", size: "lg" }) + " bg-white/10 text-white border-white/30 hover:bg-white/20"}
                >
                  Já tenho conta
                </Link>
              </div>
              <p className="mt-4 text-sm text-white/70">
                Acesso completo e gratuito nesta fase inicial.
              </p>
            </div>
            <div className="hidden items-center justify-center md:flex">
              <div className="w-full max-w-sm rounded-2xl border border-white/15 bg-white/10 p-6 backdrop-blur">
                <p className="text-sm font-medium text-white/70">Missão atual</p>
                <p className="mt-1 font-display text-xl font-semibold">
                  Primeiros contatos
                </p>
                <div className="mt-4 space-y-2 text-sm">
                  {[
                    "Cumprimentar e se apresentar",
                    "Código fonético (NATO)",
                    "Confirmar com 'Copy that'",
                  ].map((s) => (
                    <div key={s} className="flex items-center gap-2 text-white/90">
                      <CheckCircle2 className="h-4 w-4 text-accent" />
                      {s}
                    </div>
                  ))}
                </div>
                <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/20">
                  <div className="h-full w-2/3 rounded-full bg-accent" />
                </div>
                <p className="mt-2 text-xs text-white/70">Progresso operacional: 66%</p>
              </div>
            </div>
          </div>
        </section>

        {/* BENEFÍCIOS */}
        <section className="container py-16">
          <div className="card-grid">
            {benefits.map((b) => (
              <Card key={b.title} className="p-6">
                <span className="grid h-11 w-11 place-items-center rounded-lg bg-primary/10 text-primary">
                  <b.icon className="h-5 w-5" />
                </span>
                <h3 className="mt-4 font-display text-base font-semibold">{b.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{b.text}</p>
              </Card>
            ))}
          </div>
        </section>

        {/* NÍVEIS */}
        <section id="niveis" className="border-y bg-card py-16">
          <div className="container">
            <div className="mb-8 text-center">
              <h2 className="font-display text-3xl font-semibold tracking-tight">
                Uma jornada em 3 níveis
              </h2>
              <p className="mt-2 text-muted-foreground">
                Do iniciante absoluto ao intermediário, no seu ritmo.
              </p>
            </div>
            <div className="grid gap-5 md:grid-cols-3">
              {levels.map((l) => (
                <Card key={l.code} className="p-6">
                  <Badge variant="accent">{l.code}</Badge>
                  <h3 className="mt-3 font-display text-lg font-semibold">{l.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{l.text}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* PROFESSOR IA */}
        <section id="professor-ia" className="container py-16">
          <div className="grid items-center gap-8 md:grid-cols-2">
            <div>
              <Badge variant="secondary" className="mb-3">Professor IA</Badge>
              <h2 className="font-display text-3xl font-semibold tracking-tight">
                Um tutor que conversa com você
              </h2>
              <p className="mt-3 text-muted-foreground">
                Pratique conversação, peça correções de frases, simule um
                checkpoint ou um pedido no refeitório. O professor responde
                principalmente em inglês e explica em português quando você
                precisa.
              </p>
              <ul className="mt-5 space-y-2 text-sm">
                {[
                  "Conversação livre e correção de frases",
                  "Simulação de missão e viagem",
                  "Plano de estudo personalizado",
                ].map((i) => (
                  <li key={i} className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-success" /> {i}
                  </li>
                ))}
              </ul>
            </div>
            <Card className="p-6">
              <CardContent className="space-y-3 p-0 text-sm">
                <div className="flex gap-2">
                  <Compass className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <p className="rounded-lg bg-muted px-3 py-2">
                    Good morning! Ready for today&apos;s mission?
                  </p>
                </div>
                <div className="flex justify-end gap-2">
                  <p className="rounded-lg bg-primary px-3 py-2 text-primary-foreground">
                    Yes! Can you correct my sentence?
                  </p>
                </div>
                <div className="flex gap-2">
                  <Headphones className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <p className="rounded-lg bg-muted px-3 py-2">
                    Of course. Send it and I&apos;ll fix it. 👍
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* PREÇO (placeholder) */}
        <section id="preco" className="border-y bg-card py-16">
          <div className="container max-w-2xl text-center">
            <h2 className="font-display text-3xl font-semibold tracking-tight">
              Preço
            </h2>
            <Card className="mt-6 p-8">
              <Badge variant="muted" className="mx-auto">{siteConfig.pricing.label}</Badge>
              <p className="mt-4 font-display text-4xl font-semibold">
                {siteConfig.pricing.amount
                  ? `R$ ${siteConfig.pricing.amount}`
                  : "Em breve"}
              </p>
              <p className="mt-3 text-sm text-muted-foreground">
                {siteConfig.pricing.note}
              </p>
              <Link
                href="/cadastro"
                className={buttonVariants({ size: "lg" }) + " mt-6"}
              >
                Acessar gratuitamente
              </Link>
            </Card>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="container py-16">
          <h2 className="text-center font-display text-3xl font-semibold tracking-tight">
            Perguntas frequentes
          </h2>
          <div className="mx-auto mt-8 max-w-2xl divide-y rounded-lg border bg-card">
            {faqs.map((f) => (
              <details key={f.q} className="group p-5">
                <summary className="cursor-pointer list-none font-medium">
                  {f.q}
                </summary>
                <p className="mt-2 text-sm text-muted-foreground">{f.a}</p>
              </details>
            ))}
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}
