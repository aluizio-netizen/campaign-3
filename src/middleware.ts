export { default } from "next-auth/middleware";

/**
 * Protege as rotas autenticadas no edge (redireciona para /login).
 * A autorização fina (admin) é feita nas páginas via requireAdmin().
 */
export const config = {
  matcher: [
    "/dashboard/:path*",
    "/curso/:path*",
    "/aula/:path*",
    "/flashcards/:path*",
    "/quiz/:path*",
    "/professor-ia/:path*",
    "/pronuncia/:path*",
    "/certificado/:path*",
    "/configuracoes/:path*",
    "/admin/:path*",
  ],
};
