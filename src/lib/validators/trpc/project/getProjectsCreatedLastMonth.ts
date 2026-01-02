import { z } from "zod";

export const getProjectsCreatedLastMonthInput = z.object({
    id: z.string()
});
