import { adminProcedure, createTRPCRouter } from "../init";
import * as activityService from "@/server/services/activity.service";

export const activityRouter = createTRPCRouter({
    getMany: adminProcedure
        .query(async ({ ctx }) => {
            const activities = await activityService.getMany(ctx.db);
            return { activities };
        }),
    getRecentActivity: adminProcedure
        .query(async ({ ctx }) => {
            const recentActivities = await activityService.getRecent(ctx.db);
            return { recentActivities };
        })
})
