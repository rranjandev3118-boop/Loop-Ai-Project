import { NextResponse } from "next/server";
import { z } from "zod";
import { Role } from "@prisma/client";
import { requireRole } from "@/lib/auth";
import { authOptions } from "@/lib/auth-options";
import { DEMO_USERS } from "@/lib/demo-users";
import { createRoleSessionCookie, getRoleSwitchPasswordValid, getRoleSwitchTargetError, isPasswordlessDemoSwitchEnabled } from "@/lib/role-switch";
import { db } from "@/lib/db";
import { enforceRateLimit } from "@/lib/rate-limit";

const requestSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
  password: z.string().optional(),
  targetRole: z.nativeEnum(Role),
});

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const actor = await requireRole(["ADMIN", "ANALYST", "VIEWER"]);
    if (!enforceRateLimit(`role-switch:${actor.id}`, 8, 60_000)) {
      return NextResponse.json(
        { error: "Too many role switch attempts. Try again shortly." },
        { status: 429 },
      );
    }

    let requestBody: unknown;
    try {
      requestBody = await req.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid role switch request" },
        { status: 400 },
      );
    }

    const parsed = requestSchema.safeParse(requestBody);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid role switch request" },
        { status: 400 },
      );
    }
    const { email, password, targetRole } = parsed.data;

    const target = await db.user.findUnique({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
        passwordHash: true,
        role: true,
        workspaceId: true,
        disabledAt: true,
        memberships: {
          where: { workspaceId: actor.workspaceId },
          select: { role: true, status: true },
        },
      },
    });
    const membership = target?.memberships.find(
      (item) => item.status === "ACTIVE",
    );

    const targetError = getRoleSwitchTargetError(
      actor.workspaceId,
      targetRole,
      target && membership
        ? {
            workspaceId: target.workspaceId,
            role: target.role,
            membershipRole: membership.role,
            membershipStatus: membership.status,
            disabledAt: target.disabledAt,
          }
        : null,
    );
    if (targetError) {
      return NextResponse.json({ error: targetError }, { status: 403 });
    }

    if (!target || !membership) {
      return NextResponse.json(
        { error: "This account does not belong to this workspace" },
        { status: 403 },
      );
    }

    const passwordlessDemoSwitch = isPasswordlessDemoSwitchEnabled(
      process.env.DEMO_MODE,
      actor.workspaceId,
    );
    if (
      passwordlessDemoSwitch &&
      email !== DEMO_USERS[targetRole].email
    ) {
      return NextResponse.json(
        { error: "Demo role switching is limited to the seeded demo accounts" },
        { status: 403 },
      );
    }
    if (!passwordlessDemoSwitch) {
      if (!(await getRoleSwitchPasswordValid(password, target.passwordHash))) {
        return NextResponse.json(
          { error: "Incorrect password" },
          { status: 401 },
        );
      }
    }

    const secret = authOptions.secret ?? process.env.NEXTAUTH_SECRET;
    if (!secret) throw new Error("NEXTAUTH_SECRET is required to switch roles");
    const secureCookie =
      process.env.NEXTAUTH_URL?.startsWith("https://") ??
      Boolean(process.env.VERCEL);
    const maxAge = authOptions.session?.maxAge ?? 30 * 24 * 60 * 60;
    const sessionCookie = await createRoleSessionCookie(
      {
        id: target.id,
        name: target.name,
        email: target.email,
        role: membership.role,
        workspaceId: actor.workspaceId,
      },
      secret,
      secureCookie,
      maxAge,
    );
    const response = NextResponse.json({ success: true, role: membership.role });
    response.cookies.set(sessionCookie);

    console.info("Role switch completed", {
      userId: actor.id,
      from: actor.role,
      to: membership.role,
      time: new Date().toISOString(),
    });

    return response;
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHENTICATED") {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }
    if (error instanceof Error && error.message === "FORBIDDEN") {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }
    console.error("Role switch error:", error);
    return NextResponse.json({ error: "Role switch failed" }, { status: 500 });
  }
}