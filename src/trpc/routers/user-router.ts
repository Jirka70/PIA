import { adminProcedure, createTRPCRouter, translatorProcedure } from "../init";
import { TRPCError } from "@trpc/server";
import type { Role } from "@/db/schema";
import type { UserType } from "@/lib/types/user.type";
import { getUserByIdInput } from "@/lib/validators/trpc/user/getUserById";
import { getTranslatorInfoInput } from "@/lib/validators/trpc/user/getTranslatorInfo";
import { getUserInfoInput } from "@/lib/validators/trpc/user/getUserInfo";
import { changeUserRoleInput } from "@/lib/validators/trpc/user/changeUserRole";
import { getTranslatorAverageRatingsInput } from "@/lib/validators/trpc/user/getTranslatorAverageRatings";
import * as userService from "@/server/services/user.service";
import { isBadPayload } from "@/lib/utils";

export const userRouter = createTRPCRouter({
    getUserById: adminProcedure
        .input(getUserByIdInput)
        .query(async ({ ctx, input }) => {
            const result = await userService.getUserById(ctx.db, input);

            if (isBadPayload(result)) {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: "Invalid request payload",
                    cause: result.error
                })
            }

            return result;
        }),
    getMany: adminProcedure
        .query(async ({ ctx }) => {
            const result = await userService.getMany(ctx.db);
            return result;
    }),
    getTranslatorInfo: adminProcedure
        .input(getTranslatorInfoInput)
        .query(async ({ ctx, input }) => {
            const result = await userService.getTranslatorInfo(ctx.db, input);

            if (isBadPayload(result)) {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: "Invalid request payload",
                    cause: result.error
                })
            }

            return result;
    }),
    getUserInfo: adminProcedure
        .input(getUserInfoInput)
        .query(async ({ ctx, input }) => {
            const result = await userService.getUserInfo(ctx.db, input);

            if (isBadPayload(result)) {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: "Invalid request payload",
                    cause: result.error
                })
            }

            return result;
        }),
    getUserStats: adminProcedure
        .query(async ({ ctx }) => {
            return userService.getUserStats(ctx.db);
    }),
    changeUserRole: adminProcedure
        .input(changeUserRoleInput)
        .mutation(async ({ ctx, input }) => {
            const result = await userService.changeUserRole(ctx.db, input);

            if (isBadPayload(result)) {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: "Invalid request payload",
                    cause: result.error
                })
            }

            return result;
    }),
    getTranslatorAverageRatings: translatorProcedure
        .input(getTranslatorAverageRatingsInput)
        .query(async ({ ctx, input }) => {
            const currentUser = ctx.user as UserType & { role: Role };
            const result = await userService.getTranslatorAverageRatings(ctx.db, input, currentUser);

            if (isBadPayload(result)) {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: "Invalid request payload",
                    cause: result.error
                })
            }

            return result;
        })
})
