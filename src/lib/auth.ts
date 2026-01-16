import { getDb } from "@/db/drizzle";
import { schema, user as dbUser } from "@/db/schema";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { admin as adminPlugin, createAuthMiddleware, username } from "better-auth/plugins"
import { ac, owner, admin, user as betterAuthUser, translator } from "@/modules/roles/permissions"
import { eq } from "drizzle-orm";

const db = getDb()
 

export const auth = betterAuth({
    emailAndPassword: { 
    enabled: true, 
  },
  basePath: "/api/auth", 
  hooks: {
    after: createAuthMiddleware(async (ctx) => {
      const newSession = ctx.context.newSession
      if (!newSession) return;

      const pendingRole = ctx.getCookie("pending_role")
      if (pendingRole !== "translator") return;

      const userId = newSession.user.id;
      const [user] = await db.select().from(dbUser)
        .where(eq(dbUser.id, userId))

      if (!user) return
      if (user.role && user.role !== "user") return;

      await db.update(dbUser).set({
        role: "translator"
      }).where(eq(dbUser.id, userId))
      
      ctx.setCookie("pending_role", "", {
        path: "/",
        maxAge: 0
      })
    })
  },
    socialProviders: { 
        google: { 
            clientId: process.env.GOOGLE_CLIENT_ID as string, 
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string, 
        }, 
    }, 
    user: {
    additionalFields: {
      role: {
        type: "string",
        required: true,
        defaultValue: "user",
      },
    },
  },
    database: drizzleAdapter(db, {
        provider: "pg",
        schema,
    }),
    plugins: [adminPlugin({
        ac,
        roles: {
            owner,
            admin,
            betterAuthUser,
            translator
        }
    }), 
    username(),
    nextCookies()]
});

