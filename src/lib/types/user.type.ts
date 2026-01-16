import { user } from "@/db/schema";
import { InferInsertModel, InferSelectModel } from "drizzle-orm";

export type UserType = InferSelectModel<typeof user>;
export type InsertUserType = InferInsertModel<typeof user>;
