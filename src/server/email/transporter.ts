import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST ?? "localhost",
  port: Number(process.env.SMTP_PORT ?? 1025),
  secure: false,
});

export async function sendEmail(opts: {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}) {
  return transporter.sendMail({
    from: process.env.MAIL_FROM ?? "dev@example.test",
    ...opts,
  });
}
