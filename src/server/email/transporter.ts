// src/server/email/transporter.ts
import nodemailer, { Transporter } from 'nodemailer';

declare global {
  // eslint-disable-next-line no-var
  var __mailer: Transporter | undefined;
}

export function getMailer() {
  if (!global.__mailer) {
    global.__mailer = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'localhost',
      port: Number(process.env.SMTP_PORT || 1025),
      secure: false, // MailHog nepoužívá TLS
      auth: undefined,
      tls: { rejectUnauthorized: false },
    });
  }
  return global.__mailer;
}
