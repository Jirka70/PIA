import { z } from "zod";
import { uploadedFileMeta } from "@/lib/validators/uploaded-file-meta";

export const createProjectInput = z.object({
    name: z.string()
        .min(1, { message: "Project name is required" })
        .max(100, { message: "Project name is too long" }),
    description: z.string()
        .max(10_000, { message: "Description is too long" })
        .optional(),
    targetLanguage: z.string({ message: "Invalid language specification" })
        .length(2, { message: "Invalid language specification" }),
    dueAt: z.date()
        .nullable()
        .optional()
        .refine((d) => {
            if (!d) {
                return true;
            }

            const today = new Date();
            today.setHours(0, 0, 0, 0);

            const dd = new Date(d);
            dd.setHours(0, 0, 0, 0);

            return dd >= today;
        }, "Deadline has to be in future"),
    file: uploadedFileMeta,
});

export type CreateProjectFormInput = z.input<typeof createProjectInput>;
export type CreateProjectFormOutput = z.output<typeof createProjectInput>;
