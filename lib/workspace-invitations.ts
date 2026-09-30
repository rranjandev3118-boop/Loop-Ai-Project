import { z } from "zod";

export const createInvitationSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
  role: z.enum(["ADMIN", "ANALYST", "VIEWER"]),
});

export function getInvitationConflictMessage(
  accountWorkspaceId: string,
  inviterWorkspaceId: string,
) {
  return accountWorkspaceId === inviterWorkspaceId
    ? "This person is already in your workspace"
    : "This email is already registered in another workspace";
}

export function isLastActiveAdmin(
  memberRole: string,
  activeAdminCount: number,
  willLoseAdminAccess: boolean,
) {
  return (
    memberRole === "ADMIN" &&
    willLoseAdminAccess &&
    activeAdminCount <= 1
  );
}

export function getInvitationErrorResponse(error: unknown) {
  const message = error instanceof Error ? error.message : "";

  if (message === "FORBIDDEN") {
    return { status: 403, error: "Only admins can invite members" };
  }
  if (message === "UNAUTHENTICATED") {
    return { status: 401, error: "Access denied" };
  }
  if (
    message === "OTP_EMAIL_NOT_CONFIGURED" ||
    message === "OTP_GMAIL_CREDENTIALS_REQUIRED"
  ) {
    return {
      status: 503,
      error: "Invitation delivery is unavailable because email settings are incomplete.",
    };
  }
  if (message === "OTP_EMAIL_DELIVERY_FAILED") {
    return {
      status: 503,
      error: "Unable to send the invitation email. Please try again.",
    };
  }
  return {
    status: 500,
    error: "Unable to create invitation. Please try again.",
  };
}
