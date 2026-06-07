import { AppShell } from "@/components/app/app-shell";
import { requireUser } from "@/lib/queries";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireUser();

  return (
    <AppShell
      user={{
        name: user.name,
        email: user.email,
        role: user.role,
        plan: user.plan,
        blocked: user.accessBlocked,
      }}
    >
      {children}
    </AppShell>
  );
}
