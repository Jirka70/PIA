import { z } from "zod";
import { ProjectAcceptState } from "@/db/schema";

export const changeAcceptStateInput = z.object({
    accept: z.enum(ProjectAcceptState.enumValues),
    projectId: z.string()
});
