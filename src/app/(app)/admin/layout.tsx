import { requireAdmin } from "@/lib/queries";
import { AdminNav, type AdminNavItem } from "@/components/app/admin-nav";

const adminNav: AdminNavItem[] = [
  { href: "/admin", label: "Visão geral" },
  { href: "/admin/alunos", label: "Alunos" },
  { href: "/admin/unidades", label: "Unidades" },
  { href: "/admin/aulas", label: "Aulas" },
  { href: "/admin/quizzes", label: "Quizzes" },
  { href: "/admin/flashcards", label: "Flashcards" },
  { href: "/admin/certificados", label: "Certificados" },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdmin();

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-6">
        <AdminNav items={adminNav} />
      </div>
      {children}
    </div>
  );
}
