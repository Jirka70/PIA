import { z } from "zod";
import { userRole } from "@/db/schema";

export const changeUserRoleInput = z.object({
    id: z.string(),
    role: z.enum(userRole.enumValues)
});
