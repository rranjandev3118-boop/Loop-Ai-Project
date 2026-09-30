import assert from "node:assert/strict";
import { test } from "node:test";
import bcrypt from "bcryptjs";
import { decode } from "next-auth/jwt";
import { DEMO_USERS, getDemoEmail } from "../lib/demo-users";
import {
  createRoleSessionCookie,
  getRoleSwitchPasswordValid,
  getRoleSwitchTargetError,
  isPasswordlessDemoSwitchEnabled,
} from "../lib/role-switch";
import type { RoleKey } from "../lib/role-config";

const roleKeys: RoleKey[] = ["ADMIN", "ANALYST", "VIEWER"];

test("each selectable demo role resolves to its seeded account email", () => {
  assert.deepEqual(
    roleKeys.map((role) => getDemoEmail(role)),
    [
      "admin@loop.demo",
      "analyst@loop.demo",
      "viewer@loop.demo",
    ],
  );
  assert.deepEqual(
    roleKeys.map((role) => DEMO_USERS[role].email),
    roleKeys.map((role) => getDemoEmail(role)),
  );
});

test("password-free switching is enabled only for the demo workspace and explicit flag", () => {
  assert.equal(isPasswordlessDemoSwitchEnabled(undefined, "demo-workspace"), false);
  assert.equal(isPasswordlessDemoSwitchEnabled("false", "demo-workspace"), false);
  assert.equal(isPasswordlessDemoSwitchEnabled("true", "other-workspace"), false);
  assert.equal(isPasswordlessDemoSwitchEnabled("true", "demo-workspace"), true);
});

test("role validation rejects accounts outside the active workspace", () => {
  assert.equal(
    getRoleSwitchTargetError("workspace-a", "VIEWER", {
      workspaceId: "workspace-b",
      role: "VIEWER",
      membershipRole: "VIEWER",
      membershipStatus: "ACTIVE",
      disabledAt: null,
    }),
    "This account does not belong to this workspace",
  );
});

test("role validation reports the selected role when the account role differs", () => {
  assert.equal(
    getRoleSwitchTargetError("workspace-a", "VIEWER", {
      workspaceId: "workspace-a",
      role: "ANALYST",
      membershipRole: "ANALYST",
      membershipStatus: "ACTIVE",
      disabledAt: null,
    }),
    "This account is not a VIEWER in this workspace",
  );
});

test("role validation rejects disabled and inactive memberships", () => {
  assert.equal(
    getRoleSwitchTargetError("workspace-a", "VIEWER", {
      workspaceId: "workspace-a",
      role: "VIEWER",
      membershipRole: "VIEWER",
      membershipStatus: "DISABLED",
      disabledAt: null,
    }),
    "This account does not belong to this workspace",
  );
  assert.equal(
    getRoleSwitchTargetError("workspace-a", "VIEWER", {
      workspaceId: "workspace-a",
      role: "VIEWER",
      membershipRole: "VIEWER",
      membershipStatus: "ACTIVE",
      disabledAt: new Date(),
    }),
    "This account does not belong to this workspace",
  );
});

test("target account password verification rejects missing and incorrect passwords", async () => {
  const passwordHash = await bcrypt.hash("target-password", 4);
  assert.equal(await getRoleSwitchPasswordValid(undefined, passwordHash), false);
  assert.equal(await getRoleSwitchPasswordValid("wrong-password", passwordHash), false);
  assert.equal(await getRoleSwitchPasswordValid("target-password", passwordHash), true);
});

test("a role switch token contains the target user role and workspace", async () => {
  const secret = "role-switch-test-secret-with-adequate-length";
  const cookie = await createRoleSessionCookie(
    {
      id: "viewer-id",
      name: "Demo Viewer",
      email: DEMO_USERS.VIEWER.email,
      role: "VIEWER",
      workspaceId: "demo-workspace",
    },
    secret,
    false,
    60,
  );

  assert.equal(cookie.name, "next-auth.session-token");
  assert.equal(cookie.options.httpOnly, true);
  const token = await decode({ token: cookie.value, secret });
  assert.equal(token?.sub, "viewer-id");
  assert.equal(token?.id, "viewer-id");
  assert.equal(token?.role, "VIEWER");
  assert.equal(token?.workspaceId, "demo-workspace");
});
