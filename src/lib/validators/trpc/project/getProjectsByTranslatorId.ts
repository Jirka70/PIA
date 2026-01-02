import { z } from "zod";

export const getProjectsByTranslatorIdInput = z.object({
    id: z.string()
});
