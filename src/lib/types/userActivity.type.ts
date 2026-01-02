import { userActivity } from "@/db/schema";
import { InferInsertModel, InferSelectModel } from "drizzle-orm";

export type InsertUserActivityType = InferInsertModel<typeof userActivity>
export type UserActivityType = InferSelectModel<typeof userActivity>