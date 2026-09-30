import nodemailer from "nodemailer";

export type EmailDelivery = "smtp" | "development-console";

function getSmtpConfig() {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const isDevelopment = process.env.NODE_ENV === "development" || process.env.NODE_ENV === "test";

  if (!host) {
    if (isDevelopment) return null;
    throw new Error("OTP_EMAIL_NOT_CONFIGURED");
  }
  if (host === "smtp.gmail.com" && (!user || !pass)) {
    if (isDevelopment) return null;
    throw new Error("OTP_GMAIL_CREDENTIALS_REQUIRED");
  }
  if (Boolean(user) !== Boolean(pass)) {
    if (isDevelopment) return null;
    throw new Error("OTP_EMAIL_NOT_CONFIGURED");
  }

  const from = process.env.SMTP_FROM || user;
  if (!from) {
    if (isDevelopment) return null;
    throw new Error("OTP_EMAIL_NOT_CONFIGURED");
  }

  const port = Number(process.env.SMTP_PORT ?? "587");
  if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error("OTP_EMAIL_NOT_CONFIGURED");

  const secureValue = process.env.SMTP_SECURE;
  if (secureValue && secureValue !== "true" && secureValue !== "false") throw new Error("OTP_EMAIL_NOT_CONFIGURED");

  return {
    host,
    port,
    secure: secureValue ? secureValue === "true" : port === 465,
    from,
    auth: user && pass ? { user, pass } : undefined
  };
}

async function sendEmail(to: string, subject: string, text: string): Promise<EmailDelivery> {
  const config = getSmtpConfig();
  if (!config) {
    console.info(`[DEV EMAIL - NOT SENT] To: ${to}\nSubject: ${subject}\n${text}`);
    return "development-console";
  }

  try {
    const { from, ...transportConfig } = config;
    await nodemailer.createTransport({
      ...transportConfig,
      connectionTimeout: 10_000,
      greetingTimeout: 10_000,
      socketTimeout: 30_000
    }).sendMail({ from, to, subject, text });
    return "smtp";
  } catch (error) {
    const code = error instanceof Error && "code" in error && typeof error.code === "string" ? error.code : "UNKNOWN";
    console.error("SMTP email delivery failed:", code);
    throw new Error("OTP_EMAIL_DELIVERY_FAILED");
  }
}

export async function sendOtpEmail(to: string, otp: string): Promise<EmailDelivery> {
  return sendEmail(to, "Your LOOP verification code", `Your LOOP verification code is ${otp}. It expires in 10 minutes.`);
}

export async function sendInvitationEmail(to: string, inviteUrl: string, role: string): Promise<void> {
  await sendEmail(
    to,
    "You have been invited to LOOP",
    `You have been invited to join LOOP as a ${role.toLowerCase()}.\n\nOpen this link to accept the invitation:\n${inviteUrl}\n\nThis invitation expires in 7 days.`
  );
}
