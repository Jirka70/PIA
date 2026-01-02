import { createTRPCRouter, baseProcedure } from "../init";
import { sendEmail } from "@/server/email/transporter";
import { language } from "@/db/schema";
import { TRPCError } from "@trpc/server";
import { sql } from "drizzle-orm";
import { sendInput } from "@/lib/validators/trpc/email/send";
import { sendToUserInput } from "@/lib/validators/trpc/email/sendToUser";

export const emailRouter = createTRPCRouter({
    send: baseProcedure
        .input(sendInput)
        .mutation(async ({ ctx, input }) => {
            const db = ctx.db;

            const availableLanguages = await db
                .select({ code: language.code })
                .from(language)
                .where(sql`${language.code} IN (${input.sourceLanguage}, ${input.targetLanguage})`);

            const codes = availableLanguages.map((l) => l.code);
            if (!codes.includes(input.sourceLanguage) || !codes.includes(input.targetLanguage)) {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: "Invalid language selection"
                });
            }

            const subject = `New contact request from ${input.firstName} ${input.lastName}`;
            const bodyLines = [
                `Name: ${input.firstName} ${input.lastName}`,
                `Email: ${input.email}`,
                `Service: ${input.serviceType}`,
                `Source language: ${input.sourceLanguage}`,
                `Target language: ${input.targetLanguage}`,
                ``,
                `Project details:`,
                input.projectDetails
            ];

            await sendEmail({
                to: process.env.CONTACT_EMAIL ?? input.email,
                subject,
                text: bodyLines.join("\n")
            });

            return {
                ok: true
            };
        })
        ,
    sendToUser: baseProcedure
        .input(sendToUserInput)
        .mutation(async ({ input }) => {
            await sendEmail({
                to: input.to,
                subject: input.subject || "Message from translator",
                text: input.body || ""
            })

            return {
                ok: true
            }
        })
});
