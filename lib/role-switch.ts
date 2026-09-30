import { encode } from "next-auth/jwt";
import bcrypt from "bcryptjs";
import type { RoleKey } from "@/lib/role-config";
import { DEMO_WORKSPACE_ID } from "@/lib/demo-users";

type RoleSwitchTarget = {
  workspaceId: string;
  role: RoleKey;
  membershipRole: RoleKey;
  membershipStatus: string;
  disabledAt: Date | null;
};

export function isPasswordlessDemoSwitchEnabled(
  demoMode: string | undefined,
  workspaceId: string,
) {
  return demoMode === "true" && workspaceId === DEMO_WORKSPACE_ID;
}

export function getRoleSwitchPasswordValid(
  password: string | undefined,
  passwordHash: string,
) {
  if (!password) return Promise.resolve(false);
  return bcrypt.compare(password, passwordHash);
}

export function getRoleSwitchTargetError(
  currentWorkspaceId: string,
  targetRole: RoleKey,
  target: RoleSwitchTarget | null,
) {
  if (
    !target ||
    target.workspaceId !== currentWorkspaceId ||
    target.disabledAt !== null ||
    target.membershipStatus !== "ACTIVE"
  ) {
    return "This account does not belong to this workspace";
  }

  if (target.role !== targetRole || target.membershipRole !== targetRole) {
    return `This account is not a ${targetRole} in this workspace`;
  }

  return null;
}

export async function createRoleSessionCookie(
  user: {
    id: string;
    name: string;
    email: string;
    role: RoleKey;
    workspaceId: string;
  },
  secret: string,
  secure: boolean,
  maxAge: number,
) {
  const name = secure
    ? "__Secure-next-auth.session-token"
    : "next-auth.session-token";
  const value = await encode({
    token: {
      sub: user.id,
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      workspaceId: user.workspaceId,
    },
    secret,
    maxAge,
  });

  return {
    name,
    value,
    options: {
      httpOnly: true,
      sameSite: "lax" as const,
      path: "/",
      secure,
      maxAge,
    },
  };
}
