import { language } from "@/db/schema";
import { InferSelectModel } from "drizzle-orm";

export type LanguageType = InferSelectModel<typeof language>;
