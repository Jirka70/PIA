import { language, Project, translatorLanguage, translatorReview, user } from "@/db/schema";
import { DB } from "@/lib/types/db.type";
import { UserType } from "@/lib/types/user.type";
import { and, eq, getTableColumns, or, sql } from "drizzle-orm";

export async function findById(db: DB, id: string): Promise<UserType | undefined> {
  const [found] = await db.select().from(user).where(eq(user.id, id));
  return found;
}

export async function getUsersWithOpenProjects(db: DB) {
  return db
    .select({
      ...getTableColumns(user),
      numberOfOpenProjects: sql<number>`
        count(*) FILTER (
          WHERE ${Project.status} IN ('NEW', 'IN_PROGRESS', 'QA', 'ASSIGNED')
        )
      `,
    })
    .from(user)
    .leftJoin(Project, or(eq(Project.clientId, user.id), eq(Project.translatorId, user.id)))
    .groupBy(user.id);
}

export async function getTranslatorWithProjects(db: DB, translatorId: string) {
  const [translator] = await db.select().from(user).where(eq(user.id, translatorId));

  const projects = await db.select().from(Project).where(eq(Project.translatorId, translatorId));

  return { translator, projects };
}

export async function getUserWithProjects(db: DB, userId: string) {
  const rows = await db
    .select({
      user,
      project: Project,
    })
    .from(user)
    .leftJoin(Project, eq(Project.clientId, user.id))
    .where(eq(user.id, userId));

  return rows;
}

export async function getTranslatorLanguages(db: DB, translatorId: string) {
  return db
    .select({ code: language.code, name: language.name })
    .from(translatorLanguage)
    .innerJoin(language, eq(language.code, translatorLanguage.languageCode))
    .where(eq(translatorLanguage.translatorId, translatorId));
}

export async function getUserStats(db: DB) {
  const [result] = await db
    .select({
      totalUsers: sql<number>`COUNT(*)`,
      usersLastMonth: sql<number>`
      COUNT(*) FILTER (
          WHERE ${user.createdAt} >= NOW() - INTERVAL '1 month'
      )
      `,
      translators: sql<number>`
      COUNT(*) FILTER (
          WHERE ${user.role} = 'translator'
      )
      `,
      normalUsers: sql<number>`
      COUNT(*) FILTER (
          WHERE ${user.role} = 'user'
      )
      `,
    })
    .from(user);

  return result;
}

export async function updateUserRole(db: DB, id: string, role: UserType["role"]) {
  const [updatedUser] = await db.update(user).set({ role }).where(eq(user.id, id)).returning();
  return updatedUser;
}

export async function getTranslatorAverageRatings(db: DB, translatorId: string) {
  const [averages] = await db
    .select({
      quality: sql<number>`COALESCE(AVG(${translatorReview.qualityRating}), 0)`,
      communication: sql<number>`COALESCE(AVG(${translatorReview.communicationRating}), 0)`,
      punctuality: sql<number>`COALESCE(AVG(${translatorReview.punctualityRating}), 0)`,
      overall: sql<number>`COALESCE(AVG(${translatorReview.overallRating}), 0)`,
      totalReviews: sql<number>`COUNT(*)`,
    })
    .from(translatorReview)
    .where(eq(translatorReview.translatorId, translatorId));

  return averages;
}

export async function getTranslatorRatingDistribution(db: DB, translatorId: string) {
  return db
    .select({
      overall: translatorReview.overallRating,
      quality: translatorReview.qualityRating,
      communication: translatorReview.communicationRating,
      punctuality: translatorReview.punctualityRating,
    })
    .from(translatorReview)
    .where(eq(translatorReview.translatorId, translatorId));
}
