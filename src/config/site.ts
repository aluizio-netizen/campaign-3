/**
 * Configuração central da marca/produto.
 * Troque aqui o nome, descrição e textos institucionais — nenhum outro arquivo
 * precisa ser alterado para renomear o produto.
 */
export const siteConfig = {
  name: "Missão Inglês",
  shortName: "Missão Inglês",
  tagline: "Inglês para missões, etapa por etapa.",
  description:
    "Plataforma premium para brasileiros aprenderem inglês voltado a contextos de missão e operações, com aulas curtas, exercícios práticos, pronúncia e professor de IA.",
  // Idioma ensinado (o app/interface é sempre PT-BR)
  targetLanguage: "Inglês",
  // Contato / institucional (placeholders)
  supportEmail: "suporte@missaoingles.com",
  company: "Missão Inglês",
  // Carga horária estimada do curso (para certificado)
  courseHours: 20,
  // Nota mínima (%) para concluir aula e emitir certificado
  passScore: 70,
  // Preço futuro (placeholder — pagamento não implementado nesta versão)
  pricing: {
    enabled: false,
    currency: "BRL",
    amount: null as number | null,
    label: "Em breve",
    note: "Pagamento ainda não disponível. Acesso liberado para todos os alunos.",
  },
  nav: {
    public: [
      { label: "Níveis", href: "#niveis" },
      { label: "Professor IA", href: "#professor-ia" },
      { label: "Preço", href: "#preco" },
      { label: "FAQ", href: "#faq" },
    ],
  },
} as const;

export type SiteConfig = typeof siteConfig;
