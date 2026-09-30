import assert from "node:assert/strict";
import { test } from "node:test";
import {
  createInvitationSchema,
  getInvitationConflictMessage,
  getInvitationErrorResponse,
  isLastActiveAdmin,
} from "../lib/workspace-invitations";

test("invitation payload trims and lowercases emails before lookup", () => {
  assert.deepEqual(
    createInvitationSchema.parse({
      email: "  NewMember@Test.com ",
      role: "ANALYST",
    }),
    { email: "newmember@test.com", role: "ANALYST" },
  );
});

test("invitation payload rejects an invalid email address", () => {
  const result = createInvitationSchema.safeParse({
    email: "not-an-email",
    role: "ANALYST",
  });
  assert.equal(result.success, false);
});

test("duplicate account messages distinguish this workspace from another", () => {
  assert.equal(
    getInvitationConflictMessage("workspace-a", "workspace-a"),
    "This person is already in your workspace",
  );
  assert.equal(
    getInvitationConflictMessage("workspace-b", "workspace-a"),
    "This email is already registered in another workspace",
  );
});

test("invitation authorization and unexpected errors have the required responses", () => {
  assert.deepEqual(getInvitationErrorResponse(new Error("FORBIDDEN")), {
    status: 403,
    error: "Only admins can invite members",
  });
  assert.deepEqual(getInvitationErrorResponse(new Error("UNEXPECTED_DB_ERROR")), {
    status: 500,
    error: "Unable to create invitation. Please try again.",
  });
});

test("email delivery failures remain explicit service-unavailable responses", () => {
  assert.equal(
    getInvitationErrorResponse(new Error("OTP_EMAIL_DELIVERY_FAILED")).status,
    503,
  );
});

test("the final active admin cannot lose admin access", () => {
  assert.equal(isLastActiveAdmin("ADMIN", 1, true), true);
  assert.equal(isLastActiveAdmin("ADMIN", 2, true), false);
  assert.equal(isLastActiveAdmin("ADMIN", 1, false), false);
  assert.equal(isLastActiveAdmin("ANALYST", 1, true), false);
});
