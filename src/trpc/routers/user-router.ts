import z from "zod";
import { adminProcedure, createTRPCRouter } from "../init";
import { user } from "@/db/schema";
import { eq } from "drizzle-orm";

export const userRouter = createTRPCRouter({
    getUserById: adminProcedure
        .input(z.object({
            id: z.string()
        }))
        .query(async ({ ctx, input }) => {
            const db = ctx.db;

            const [res] = await db
                .select()
                .from(user)
                .where(eq(user.id, input.id))

            return {
                user: res
            }
        }),
    getMany: adminProcedure
        .query(async ({ ctx }) => {
            const db = ctx.db;

            const res = await db
                .select()
                .from(user)

            return {
                users: res
            }
        })
})