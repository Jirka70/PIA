import { activitySeverity, activityStatus } from "@/db/schema";
import { InferInsertModel } from "drizzle-orm";
import { z } from "zod";
import { userActivity } from "@/db/schema";

export const USER_ACTIVITY_ID_MIN = 1;
export const USER_ACTIVITY_INFO_MIN = 0;

export const insertUserActivitySchema = z.object({
    id: z.string().min(USER_ACTIVITY_ID_MIN),
    userId: z.string().min(USER_ACTIVITY_ID_MIN).nullable().optional(),
    projectId: z.string().min(USER_ACTIVITY_ID_MIN).nullable().optional(),
    info: z.string().min(USER_ACTIVITY_INFO_MIN).optional().default(""),
    date: z.date().optional(),
    activityStatus: z.enum(activityStatus.enumValues),
    activitySeverity: z.enum(activitySeverity.enumValues),
});

export type InsertUserActivitySchema = z.infer<typeof insertUserActivitySchema>;
export type InsertUserActivityShape = InferInsertModel<typeof userActivity>;
