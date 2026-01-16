import { z } from "zod";
import { changeUserRoleInput } from "@/lib/validators/trpc/user/changeUserRole";
import { getTranslatorAverageRatingsInput } from "@/lib/validators/trpc/user/getTranslatorAverageRatings";
import { getTranslatorInfoInput } from "@/lib/validators/trpc/user/getTranslatorInfo";
import { getUserByIdInput } from "@/lib/validators/trpc/user/getUserById";
import { getUserInfoInput } from "@/lib/validators/trpc/user/getUserInfo";

export type GetUserByIdInput = z.infer<typeof getUserByIdInput>;
export type GetTranslatorInfoInput = z.infer<typeof getTranslatorInfoInput>;
export type GetUserInfoInput = z.infer<typeof getUserInfoInput>;
export type ChangeUserRoleInput = z.infer<typeof changeUserRoleInput>;
export type TranslatorAverageRatingsInput = z.infer<typeof getTranslatorAverageRatingsInput>;
// Alias used across services to keep naming consistent
export type GetTranslatorAverageRatingsInput = TranslatorAverageRatingsInput;
