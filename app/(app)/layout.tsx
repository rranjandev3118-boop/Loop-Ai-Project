import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { ToastProvider } from "@/components/ui/toast-provider";
import { getSession } from "@/lib/auth";
import type { RoleKey } from "@/lib/role-config";
import { ThemeProvider } from "@/components/theme-provider";
import { db } from "@/lib/db";
import { DEMO_WORKSPACE_ID } from "@/lib/demo-users";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session?.user) redirect("/login");

  const cookieStore = await cookies();
  const currentUser = await db.user.findUnique({
    where: { id: session.user.id },
    select: {
      role: true,
      workspaceId: true,
      workspace: { select: { name: true } },
      disabledAt: true,
    },
  });
  if (!currentUser || currentUser.disabledAt) redirect("/login");

  const actualRole = currentUser.role as RoleKey;
  const roleCookie = cookieStore.get("loop_role_context")?.value as RoleKey | undefined;
  const currentRole = ["ADMIN", "ANALYST", "VIEWER"].includes(actualRole) ? actualRole : "VIEWER";

  const safeRole = roleCookie && ["ADMIN", "ANALYST", "VIEWER"].includes(roleCookie) && roleCookie === actualRole ? roleCookie : currentRole;
  const demoMode = process.env.DEMO_MODE === "true";
  const passwordlessDemoSwitch =
    demoMode && currentUser.workspaceId === DEMO_WORKSPACE_ID;

  return (
    <ThemeProvider>
      <AppShell
        user={{
          email: session.user.email || "",
          role: safeRole,
          name: session.user.name || "Member"
        }}
        currentRole={safeRole}
        workspaceName={currentUser.workspace.name}
        demoMode={demoMode}
        passwordlessDemoSwitch={passwordlessDemoSwitch}
      >
        <ToastProvider />
        {children}
      </AppShell>
    </ThemeProvider>
  );
}
