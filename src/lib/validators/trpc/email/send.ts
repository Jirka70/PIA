import z from "zod";

export const sendInput = z
    .object({
        firstName: z.string().min(1),
        lastName: z.string().min(1),
        email: z.email(),
        sourceLanguage: z.string().min(1),
        targetLanguage: z.string().min(1),
        serviceType: z.string().min(1),
        projectDetails: z.string().min(10)
    })
    .refine((data) => data.sourceLanguage !== data.targetLanguage, {
        message: "Source and target languages must differ",
        path: ["targetLanguage"]
    });
