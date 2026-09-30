import { NextResponse } from "next/server";
import { createHash, randomBytes } from "crypto";
import { z } from "zod";
import { Prisma, Role } from "@prisma/client";
import { db } from "@/lib/db";
import { requireRole } from "@/lib/auth";
import { sendInvitationEmail } from "@/lib/email";
import {
  createInvitationSchema,
  getInvitationConflictMessage,
  getInvitationErrorResponse,
  isLastActiveAdmin,
} from "@/lib/workspace-invitations";

const roleSchema = z.enum(["ADMIN", "ANALYST", "VIEWER"]);

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const user = await requireRole(["ADMIN"]);
    const members = await db.user.findMany({
      where: { workspaceId: user.workspaceId, disabledAt: null, memberships: { some: { workspaceId: user.workspaceId, status: "ACTIVE" } } },
      select: { id: true, name: true, email: true, role: true },
      orderBy: { name: "asc" }
    });
    return NextResponse.json({ members });
  } catch (error) {
    const message = error instanceof Error ? error.message : "";
    const status = message === "UNAUTHENTICATED" ? 401 : message === "FORBIDDEN" ? 403 : 400;
    return NextResponse.json({ error: status === 400 ? "Unable to load members" : "Access denied" }, { status });
  }
}

export async function POST(request: Request) {
  try {
    const user = await requireRole(["ADMIN"]);
    let requestBody: unknown;
    try {
      requestBody = await request.json();
    } catch {
      return NextResponse.json(
        { error: "Enter a valid email address" },
        { status: 400 },
      );
    }
    const parsed = createInvitationSchema.safeParse(requestBody);
    if (!parsed.success) {
      const invalidEmail = parsed.error.issues.some(
        (issue) => issue.path[0] === "email",
      );
      return NextResponse.json(
        { error: invalidEmail ? "Enter a valid email address" : "Invalid invitation" },
        { status: 400 },
      );
    }
    const payload = parsed.data;
    const existing = await db.user.findUnique({ where: { email: payload.email }, select: { workspaceId: true } });
    if (existing) {
      return NextResponse.json(
        {
          error: getInvitationConflictMessage(
            existing.workspaceId,
            user.workspaceId,
          ),
        },
        { status: 409 },
      );
    }
    const rawToken = randomBytes(32).toString("hex");
    const invitation = await db.invitation.create({
      data: {
        email: payload.email.toLowerCase(),
        role: payload.role,
        token: createHash("sha256").update(rawToken).digest("hex"),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        workspaceId: user.workspaceId,
        invitedById: user.id
      }
    });
    const inviteUrl = new URL(`/signup?invite=${rawToken}`, process.env.NEXTAUTH_URL ?? request.url).toString();
    try {
      await sendInvitationEmail(payload.email, inviteUrl, payload.role);
    } catch (error) {
      await db.invitation.delete({ where: { id: invitation.id } });
      throw error;
    }
    return NextResponse.json({ invitationId: invitation.id, email: payload.email, expiresAt: invitation.expiresAt }, { status: 201 });
  } catch (error) {
    console.error("Invitation creation failed", error);
    const response = getInvitationErrorResponse(error);
    return NextResponse.json(
      { error: response.error },
      { status: response.status },
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const user = await requireRole(["ADMIN"]);
    const payload = z.object({
      memberId: z.string().min(1),
      role: roleSchema.optional(),
      disabled: z.boolean().optional()
    }).refine((value) => value.role !== undefined || value.disabled !== undefined, "Provide a role or disabled state").parse(await request.json());
    if (payload.memberId === user.id) return NextResponse.json({ error: "You cannot change your own role" }, { status: 400 });
    const disabledAt = payload.disabled === true ? new Date() : payload.disabled === false ? null : undefined;
    const result = await db.$transaction(async (tx) => {
      await tx.$queryRaw(
        Prisma.sql`SELECT "id" FROM "Workspace" WHERE "id" = ${user.workspaceId} FOR UPDATE`,
      );
      const member = await tx.user.findFirst({
        where: { id: payload.memberId, workspaceId: user.workspaceId },
        select: { id: true, role: true, disabledAt: true },
      });
      if (!member) return { kind: "not-found" as const };
      const isDemotingAdmin =
        member.role === "ADMIN" &&
        ((payload.role !== undefined && payload.role !== "ADMIN") ||
          (disabledAt !== undefined && disabledAt !== null));
      if (isDemotingAdmin) {
        const adminCount = await tx.user.count({
          where: {
            workspaceId: user.workspaceId,
            role: "ADMIN",
            disabledAt: null,
            memberships: {
              some: {
                workspaceId: user.workspaceId,
                role: "ADMIN",
                status: "ACTIVE",
              },
            },
          },
        });
        if (isLastActiveAdmin(member.role, adminCount, isDemotingAdmin)) {
          return { kind: "last-admin" as const };
        }
      }
      const updated = await tx.user.updateMany({
        where: { id: payload.memberId, workspaceId: user.workspaceId },
        data: { ...(payload.role ? { role: payload.role as Role } : {}), ...(disabledAt !== undefined ? { disabledAt } : {}) }
      });
      if (updated.count && payload.role) {
        await tx.workspaceMember.updateMany({ where: { userId: payload.memberId, workspaceId: user.workspaceId, status: "ACTIVE" }, data: { role: payload.role as Role } });
      }
      if (updated.count && disabledAt !== undefined) {
        await tx.workspaceMember.updateMany({ where: { userId: payload.memberId, workspaceId: user.workspaceId }, data: { status: disabledAt ? "DISABLED" : "ACTIVE" } });
      }
      return updated.count
        ? { kind: "updated" as const, member }
        : { kind: "not-found" as const };
    });
    if (result.kind === "not-found") {
      return NextResponse.json({ error: "Member not found" }, { status: 404 });
    }
    if (result.kind === "last-admin") {
      return NextResponse.json(
        { error: "Workspace must retain an active admin" },
        { status: 409 },
      );
    }
    const member = result.member;
    await db.auditLog.create({
      data: {
        workspaceId: user.workspaceId,
        actorId: user.id,
        entityType: "User",
        entityId: member.id,
        action: payload.role ? "ROLE_CHANGE" : "UPDATE",
        oldValue: { role: member.role, disabledAt: member.disabledAt?.toISOString() ?? null },
        newValue: { role: payload.role ?? member.role, disabledAt: disabledAt === undefined ? member.disabledAt?.toISOString() ?? null : disabledAt?.toISOString() ?? null }
      }
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to update member";
    const status = message === "FORBIDDEN" ? 403 : message === "UNAUTHENTICATED" ? 401 : 400;
    return NextResponse.json({ error: status === 400 ? "Invalid member update" : "Access denied" }, { status });
  }
}

export async function DELETE(request: Request) {
  try {
    const user = await requireRole(["ADMIN"]);
    const memberId = z.object({ memberId: z.string().min(1) }).parse(await request.json()).memberId;
    if (memberId === user.id) return NextResponse.json({ error: "You cannot remove yourself" }, { status: 400 });
    const member = await db.user.findFirst({ where: { id: memberId, workspaceId: user.workspaceId }, select: { role: true } });
    if (!member) return NextResponse.json({ error: "Member not found" }, { status: 404 });
    const removedAt = new Date();
    const result = await db.$transaction(async (tx) => {
      await tx.$queryRaw(
        Prisma.sql`SELECT "id" FROM "Workspace" WHERE "id" = ${user.workspaceId} FOR UPDATE`,
      );
      const member = await tx.user.findFirst({
        where: { id: memberId, workspaceId: user.workspaceId },
        select: { role: true },
      });
      if (!member) return { kind: "not-found" as const };
      if (member.role === "ADMIN") {
        const adminCount = await tx.user.count({
          where: {
            workspaceId: user.workspaceId,
            role: "ADMIN",
            disabledAt: null,
            memberships: {
              some: {
                workspaceId: user.workspaceId,
                role: "ADMIN",
                status: "ACTIVE",
              },
            },
          },
        });
        if (isLastActiveAdmin(member.role, adminCount, true)) {
          return { kind: "last-admin" as const };
        }
      }
      const updated = await tx.user.updateMany({ where: { id: memberId, workspaceId: user.workspaceId, disabledAt: null }, data: { disabledAt: removedAt } });
      if (updated.count) await tx.workspaceMember.updateMany({ where: { userId: memberId, workspaceId: user.workspaceId }, data: { status: "REMOVED" } });
      return updated.count
        ? { kind: "removed" as const }
        : { kind: "not-found" as const };
    });
    if (result.kind === "not-found") {
      return NextResponse.json({ error: "Member not found" }, { status: 404 });
    }
    if (result.kind === "last-admin") {
      return NextResponse.json(
        { error: "Workspace must retain an active admin" },
        { status: 409 },
      );
    }
    await db.auditLog.create({
      data: {
        workspaceId: user.workspaceId,
        actorId: user.id,
        entityType: "User",
        entityId: memberId,
        action: "DELETE",
        newValue: { disabledAt: removedAt.toISOString() }
      }
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to remove member";
    const status = message === "FORBIDDEN" ? 403 : message === "UNAUTHENTICATED" ? 401 : 400;
    return NextResponse.json({ error: status === 400 ? "Invalid member removal" : "Access denied" }, { status });
  }
}
