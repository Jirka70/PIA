import { z } from "zod";
import { projectStatus } from "@/db/schema";

export const changeProjectStatusInput = z.object({
    projectId: z.string(),
    projectStatus: z.enum(projectStatus.enumValues)
});
