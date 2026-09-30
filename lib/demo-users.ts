import type { RoleKey } from "@/lib/role-config";

export const DEMO_WORKSPACE_ID = "demo-workspace";

export const DEMO_USERS: Record<RoleKey, { email: string; name: string }> = {
  ADMIN: { email: "admin@loop.demo", name: "Demo Admin" },
  ANALYST: { email: "analyst@loop.demo", name: "Demo Analyst" },
  VIEWER: { email: "viewer@loop.demo", name: "Demo Viewer" },
};

export function getDemoEmail(role: RoleKey) {
  return DEMO_USERS[role].email;
}
