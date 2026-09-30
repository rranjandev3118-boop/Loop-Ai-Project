import assert from "node:assert/strict";
import { createServer } from "node:net";
import { test } from "node:test";
import { sendOtpEmail } from "../lib/email";

function setNodeEnv(value: string | undefined) {
  const updated = value === undefined
    ? Reflect.deleteProperty(process.env, "NODE_ENV")
    : Reflect.set(process.env, "NODE_ENV", value);
  if (!updated) throw new Error("Unable to update NODE_ENV for test");
}

test("sendOtpEmail logs the OTP in development when SMTP is not configured", async () => {
  const originalEnv = {
    NODE_ENV: process.env.NODE_ENV,
    SMTP_HOST: process.env.SMTP_HOST,
    SMTP_FROM: process.env.SMTP_FROM,
    SMTP_USER: process.env.SMTP_USER,
    SMTP_PASS: process.env.SMTP_PASS
  };
  const originalInfo = console.info;
  let log = "";

  try {
    setNodeEnv("development");
    delete process.env.SMTP_HOST;
    delete process.env.SMTP_FROM;
    delete process.env.SMTP_USER;
    delete process.env.SMTP_PASS;

    console.info = (...args: unknown[]) => {
      log = args.join(" ");
    };
    assert.equal(await sendOtpEmail("user@example.test", "123456"), "development-console");
    assert.match(log, /DEV EMAIL - NOT SENT/);
    assert.match(log, /123456/);
  } finally {
    console.info = originalInfo;
    for (const [name, value] of Object.entries(originalEnv)) {
      if (name === "NODE_ENV") setNodeEnv(value);
      else if (value === undefined) delete process.env[name];
      else process.env[name] = value;
    }
  }
});

test("sendOtpEmail logs the OTP in development when Gmail credentials are missing", async () => {
  const originalEnv = {
    NODE_ENV: process.env.NODE_ENV,
    SMTP_HOST: process.env.SMTP_HOST,
    SMTP_FROM: process.env.SMTP_FROM,
    SMTP_USER: process.env.SMTP_USER,
    SMTP_PASS: process.env.SMTP_PASS
  };
  const originalInfo = console.info;
  let log = "";

  try {
    setNodeEnv("development");
    process.env.SMTP_HOST = "smtp.gmail.com";
    process.env.SMTP_FROM = "";
    delete process.env.SMTP_USER;
    delete process.env.SMTP_PASS;

    console.info = (...args: unknown[]) => {
      log = args.join(" ");
    };
    assert.equal(await sendOtpEmail("user@example.test", "123456"), "development-console");
    assert.match(log, /123456/);
  } finally {
    console.info = originalInfo;
    for (const [name, value] of Object.entries(originalEnv)) {
      if (name === "NODE_ENV") setNodeEnv(value);
      else if (value === undefined) delete process.env[name];
      else process.env[name] = value;
    }
  }
});

test("sendOtpEmail still requires SMTP configuration in production", async () => {
  const originalEnv = {
    NODE_ENV: process.env.NODE_ENV,
    SMTP_HOST: process.env.SMTP_HOST,
    SMTP_FROM: process.env.SMTP_FROM,
    SMTP_USER: process.env.SMTP_USER,
    SMTP_PASS: process.env.SMTP_PASS
  };

  try {
    setNodeEnv("production");
    delete process.env.SMTP_HOST;
    delete process.env.SMTP_FROM;
    delete process.env.SMTP_USER;
    delete process.env.SMTP_PASS;

    await assert.rejects(sendOtpEmail("user@example.test", "123456"), {
      message: "OTP_EMAIL_NOT_CONFIGURED"
    });
  } finally {
    for (const [name, value] of Object.entries(originalEnv)) {
      if (name === "NODE_ENV") setNodeEnv(value);
      else if (value === undefined) delete process.env[name];
      else process.env[name] = value;
    }
  }
});

test("sendOtpEmail delivers through the configured SMTP server", async () => {
  const originalEnv = {
    NODE_ENV: process.env.NODE_ENV,
    SMTP_HOST: process.env.SMTP_HOST,
    SMTP_PORT: process.env.SMTP_PORT,
    SMTP_SECURE: process.env.SMTP_SECURE,
    SMTP_USER: process.env.SMTP_USER,
    SMTP_PASS: process.env.SMTP_PASS,
    SMTP_FROM: process.env.SMTP_FROM
  };
  let receivedMessage = "";
  let resolveMessage: () => void = () => {};
  const messageReceived = new Promise<void>((resolve) => {
    resolveMessage = resolve;
  });
  const server = createServer((socket) => {
    let pending = "";
    let receivingMessage = false;
    let authStep = 0;
    socket.write("220 localhost ESMTP\r\n");
    socket.on("data", (chunk) => {
      pending += chunk.toString();
      let lineEnd = pending.indexOf("\r\n");
      while (lineEnd >= 0) {
        const line = pending.slice(0, lineEnd);
        pending = pending.slice(lineEnd + 2);
        if (receivingMessage) {
          if (line === ".") {
            receivingMessage = false;
            resolveMessage();
            socket.write("250 2.0.0 queued\r\n");
          } else {
            receivedMessage += `${line}\r\n`;
          }
        } else if (line.startsWith("EHLO") || line.startsWith("HELO")) {
          socket.write("250-localhost\r\n250-AUTH LOGIN PLAIN\r\n250 8BITMIME\r\n");
        } else if (line.startsWith("AUTH PLAIN")) {
          socket.write("235 2.7.0 authenticated\r\n");
        } else if (line === "AUTH LOGIN") {
          authStep = 1;
          socket.write("334 VXNlcm5hbWU6\r\n");
        } else if (authStep === 1) {
          authStep = 2;
          socket.write("334 UGFzc3dvcmQ6\r\n");
        } else if (authStep === 2) {
          authStep = 0;
          socket.write("235 2.7.0 authenticated\r\n");
        } else if (line.startsWith("MAIL FROM") || line.startsWith("RCPT TO")) {
          socket.write("250 2.1.0 accepted\r\n");
        } else if (line === "DATA") {
          receivingMessage = true;
          socket.write("354 continue\r\n");
        } else if (line === "QUIT") {
          socket.write("221 2.0.0 bye\r\n");
          socket.end();
        } else {
          socket.write("500 unsupported command\r\n");
        }
        lineEnd = pending.indexOf("\r\n");
      }
    });
  });

  try {
    await new Promise<void>((resolve, reject) => {
      server.once("error", reject);
      server.listen(0, "127.0.0.1", resolve);
    });
    const address = server.address();
    assert(address && typeof address !== "string");

    setNodeEnv("test");
    process.env.SMTP_HOST = "127.0.0.1";
    process.env.SMTP_PORT = String(address.port);
    process.env.SMTP_SECURE = "false";
    process.env.SMTP_USER = "sender@example.test";
    process.env.SMTP_PASS = "test-password";
    process.env.SMTP_FROM = "";
    process.env.SMTP_USER = "sender@example.test";

    await sendOtpEmail("user@example.test", "123456");
    await messageReceived;

    assert.match(receivedMessage, /Subject: Your LOOP verification code/i);
    assert.match(receivedMessage, /Your LOOP verification code is 123456/);
    assert.match(receivedMessage, /To: user@example\.test/i);
    assert.match(receivedMessage, /From:.*sender@example\.test/i);
  } finally {
    for (const [name, value] of Object.entries(originalEnv)) {
      if (name === "NODE_ENV") setNodeEnv(value);
      else if (value === undefined) delete process.env[name];
      else process.env[name] = value;
    }
    await new Promise<void>((resolve) => server.close(() => resolve()));
  }
});
