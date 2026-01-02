import z from "zod";

export const sendToUserInput = z.object({
    to: z.string().email(),
    subject: z.string().optional().default(""),
    body: z.string().optional().default("")
});
