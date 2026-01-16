import { Role } from "@/db/schema";
import { BadPayloadType } from "@/lib/types/bad-payload.type";
import { DB } from "@/lib/types/db.type";
import { UserType } from "@/lib/types/user.type";
import {
  ChangeUserRoleInput,
  GetTranslatorAverageRatingsInput,
  GetTranslatorInfoInput,
  GetUserByIdInput,
  GetUserInfoInput,
} from "@/lib/types/user-input.type";
import { changeUserRoleInput } from "@/lib/validators/trpc/user/changeUserRole";
import { getTranslatorAverageRatingsInput } from "@/lib/validators/trpc/user/getTranslatorAverageRatings";
import { getTranslatorInfoInput } from "@/lib/validators/trpc/user/getTranslatorInfo";
import { getUserByIdInput } from "@/lib/validators/trpc/user/getUserById";
import { getUserInfoInput } from "@/lib/validators/trpc/user/getUserInfo";
import * as languageRepo from "@/server/repositories/language.repo";
import * as userRepo from "@/server/repositories/user.repo";
import { TRPCError } from "@trpc/server";

export async function getUserById(db: DB, input: GetUserByIdInput) {
  const parsed = getUserByIdInput.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false as const,
      error: parsed.error,
    };
  }

  const user = await userRepo.findById(db, parsed.data.id);
  return { user };
}

export async function getMany(db: DB) {
  const users = await userRepo.getUsersWithOpenProjects(db);
  return { users };
}

export async function getTranslatorInfo(db: DB, input: GetTranslatorInfoInput) {
  const parsed = getTranslatorInfoInput.safeParse(input);

  if (!parsed.success) {
    return {
      ok: false as const,
      error: parsed.error,
    };
  }

  const { translator, projects } = await userRepo.getTranslatorWithProjects(db, parsed.data.id);

  if (!translator) return null;

  const languages = await languageRepo.getTranslatorLanguages(db, parsed.data.id);

  return { translator, projects, languages };
}

export async function getUserInfo(db: DB, input: GetUserInfoInput) {
  const parsed = getUserInfoInput.safeParse(input);

  if (!parsed.success) {
    return {
      ok: false as const,
      error: parsed.error,
    };
  }

  const rows = await userRepo.getUserWithProjects(db, parsed.data.id);
  if (rows.length === 0) return null;

  const obtainedUser = rows[0].user;
  const projects = rows
    .map((item) => item.project)
    .filter((project): project is NonNullable<typeof project> => project !== null && project !== undefined);
  return {
    user: obtainedUser,
    projects,
  };
}

export async function getUserStats(db: DB) {
  const result = await userRepo.getUserStats(db);
  return { result };
}

export async function changeUserRole(db: DB, input: ChangeUserRoleInput): Promise<{ user?: UserType } | BadPayloadType> {
  const parsed = changeUserRoleInput.safeParse(input);

  if (!parsed.success) {
    return {
      ok: false as const,
      error: parsed.error,
    };
  }

  if (parsed.data.role === "admin") {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Cannot change role to admin",
    });
  }

  const updatedUser = await userRepo.updateUserRole(db, parsed.data.id, parsed.data.role);
  return { user: updatedUser };
}

export async function getTranslatorAverageRatings(
  db: DB,
  input: GetTranslatorAverageRatingsInput,
  requester: UserType & { role: Role },
) {
  const parsed = getTranslatorAverageRatingsInput.safeParse(input);

  if (!parsed.success) {
    return {
      ok: false as const,
      error: parsed.error,
    };
  }

  if (!["admin", "owner"].includes(requester.role as Role) && requester.id !== parsed.data.translatorId) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Not authorized to access translator ratings",
    });
  }

  const averages = await userRepo.getTranslatorAverageRatings(db, parsed.data.translatorId);
  return { averages };
}
