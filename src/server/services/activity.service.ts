import { DB } from "@/lib/types/db.type";
import { InsertUserActivityType } from "@/lib/types/userActivity.type";
import { insertUserActivitySchema } from "@/lib/validators/trpc/activity/userActivitySchema";
import * as activityRepo from "@/server/repositories/activity.repo"

export async function create(db: DB, values: InsertUserActivityType) {
    const parsed = insertUserActivitySchema.safeParse(values);

    if (!parsed.success) {
        return {
            ok: false as const,
            error: parsed.error
        }
    }

    return await activityRepo.createActivity(db, values)
}

export async function getMany(db: DB) {
    return activityRepo.getActivities(db);
}

export async function getRecent(db: DB, limit = 5) {
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
    return activityRepo.getRecentActivities(db, yesterday, limit);
}
