import { sendEmail } from "@/server/email/transporter";
import { DB } from "@/lib/types/db.type";
import { BadPayloadType } from "@/lib/types/bad-payload.type";
import { ContactEmailInput, SendToUserEmailInput } from "@/lib/types/email-input.type";
import { sendInput } from "@/lib/validators/trpc/email/send";
import { sendToUserInput } from "@/lib/validators/trpc/email/sendToUser";
import * as languageRepo from "@/server/repositories/language.repo";
import { TRPCError } from "@trpc/server";

export async function sendContactEmail(
  db: DB,
  input: ContactEmailInput,
): Promise<{ ok: true } | BadPayloadType> {
  const parsed = sendInput.safeParse(input);

  if (!parsed.success) {
    return {
      ok: false as const,
      error: parsed.error,
    };
  }

  const { data } = parsed;
  const availableLanguages = await languageRepo.getLanguagesByCodes(db, [
    data.sourceLanguage,
    data.targetLanguage,
  ]);

  const codes = availableLanguages.map((l) => l.code);
  if (!codes.includes(data.sourceLanguage) || !codes.includes(data.targetLanguage)) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Invalid language selection",
    });
  }

  const subject = `New contact request from ${data.firstName} ${data.lastName}`;
  const bodyLines = [
    `Name: ${data.firstName} ${data.lastName}`,
    `Email: ${data.email}`,
    `Service: ${data.serviceType}`,
    `Source language: ${data.sourceLanguage}`,
    `Target language: ${data.targetLanguage}`,
    ``,
    `Project details:`,
    data.projectDetails,
  ];

  await sendEmail({
    to: process.env.CONTACT_EMAIL ?? data.email,
    subject,
    text: bodyLines.join("\n"),
  });

  return { ok: true as const };
}

export async function sendToUser(input: SendToUserEmailInput): Promise<{ ok: true } | BadPayloadType> {
  const parsed = sendToUserInput.safeParse(input);

  if (!parsed.success) {
    return {
      ok: false as const,
      error: parsed.error,
    };
  }

  const { data } = parsed;

  await sendEmail({
    to: data.to,
    subject: data.subject || "Message from translator",
    text: data.body || "",
  });

  return { ok: true as const };
}
