import { Project, user, userActivity } from "@/db/schema";
import { adminProcedure, createTRPCRouter } from "../init";
import { gt, eq, desc } from "drizzle-orm";

export const activityRouter = createTRPCRouter({
    getMany: adminProcedure
        .query(async ({ ctx }) => {
            const db = ctx.db;

            const [activities] = await db
                .select({
                    id:              userActivity.id,
                    userId:          userActivity.userId,
                    info:            userActivity.info,
                    date:            userActivity.date,
                    activityStatus:  userActivity.activityStatus,
                    activitySeverity:userActivity.activitySeverity,
                    userName:        user.name,
                    projectName:     Project.name
                })
                .from(userActivity)
                .leftJoin(user, eq(user.id, userActivity.userId))
                .leftJoin(Project, eq(Project.id, userActivity.projectId))
                .orderBy(desc(userActivity.date))

            return {
                activities
            }
        }),
    getRecentActivity: adminProcedure
        .query(async ({ ctx }) => {
            const db = ctx.db;
            const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);

            const recentActivities = await db
            .select({
                id:              userActivity.id,
                userId:          userActivity.userId,
                info:            userActivity.info,
                date:            userActivity.date,
                activityStatus:  userActivity.activityStatus,
                activitySeverity:userActivity.activitySeverity,
                userName:        user.name,
                projectName:     Project.name,
                projectId:       Project.id,
            })

            .from(userActivity)
            .leftJoin(user, eq(user.id, userActivity.userId))
            .leftJoin(Project, eq(Project.id, userActivity.projectId))
            .where(gt(userActivity.date, yesterday))
            .orderBy(desc(userActivity.date))
            .limit(5);

            return {
                recentActivities
            }
        })
})