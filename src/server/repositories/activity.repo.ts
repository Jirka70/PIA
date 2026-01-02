import { userActivity } from "@/db/schema"
import { DB } from "@/lib/types/db.type"
import { InsertUserActivityType, UserActivityType } from "@/lib/types/userActivity.type"

export async function createActivity(db: DB, values: InsertUserActivityType) : Promise<UserActivityType>  {
    const [res] = await db
        .insert(userActivity)
        .values(values)
        .returning()

    return res;
}