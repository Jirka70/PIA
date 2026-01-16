import { createTRPCRouter, baseProcedure } from "../init";
import { sendInput } from "@/lib/validators/trpc/email/send";
import { sendToUserInput } from "@/lib/validators/trpc/email/sendToUser";
import { isBadPayload } from "@/lib/utils";
import * as emailService from "@/server/services/email.service";
import { TRPCError } from "@trpc/server";

export const emailRouter = createTRPCRouter({
    send: baseProcedure
        .input(sendInput)
        .mutation(async ({ ctx, input }) => {
            const result = await emailService.sendContactEmail(ctx.db, input);

            if (isBadPayload(result)) {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: "Invalid email payload",
                    cause: result.error
                })
            }

            return result;
        })
        ,
    sendToUser: baseProcedure
        .input(sendToUserInput)
        .mutation(async ({ input }) => {
            const result = await emailService.sendToUser(input);

            if (isBadPayload(result)) {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: "Invalid email payload",
                    cause: result.error
                })
            }

            return result
        })
});
