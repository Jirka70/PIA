import { Project, user, userActivity } from "@/db/schema"
import { DB } from "@/lib/types/db.type"
import { InsertUserActivityType, UserActivityType } from "@/lib/types/userActivity.type"
import { desc, eq, gt } from "drizzle-orm"

export async function createActivity(db: DB, values: InsertUserActivityType) : Promise<UserActivityType>  {
    const [res] = await db
        .insert(userActivity)
        .values(values)
        .returning()

    return res;
}

export async function getActivities(db: DB) {
    return db
        .select({
            id: userActivity.id,
            userId: userActivity.userId,
            info: userActivity.info,
            date: userActivity.date,
            activityStatus: userActivity.activityStatus,
            activitySeverity: userActivity.activitySeverity,
            userName: user.name,
            projectName: Project.name
        })
        .from(userActivity)
        .leftJoin(user, eq(user.id, userActivity.userId))
        .leftJoin(Project, eq(Project.id, userActivity.projectId))
        .orderBy(desc(userActivity.date));
}

export async function getRecentActivities(db: DB, since: Date, limit: number) {
    return db
        .select({
            id: userActivity.id,
            userId: userActivity.userId,
            info: userActivity.info,
            date: userActivity.date,
            activityStatus: userActivity.activityStatus,
            activitySeverity: userActivity.activitySeverity,
            userName: user.name,
            projectName: Project.name,
            projectId: Project.id,
        })
        .from(userActivity)
        .leftJoin(user, eq(user.id, userActivity.userId))
        .leftJoin(Project, eq(Project.id, userActivity.projectId))
        .where(gt(userActivity.date, since))
        .orderBy(desc(userActivity.date))
        .limit(limit);
}
