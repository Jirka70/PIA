import { z } from "zod";
import { sendInput } from "@/lib/validators/trpc/email/send";
import { sendToUserInput } from "@/lib/validators/trpc/email/sendToUser";

export type ContactEmailInput = z.infer<typeof sendInput>;
export type SendToUserEmailInput = z.infer<typeof sendToUserInput>;
