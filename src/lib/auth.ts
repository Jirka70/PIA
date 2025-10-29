import { db } from "@/db/drizzle";
import { schema } from "@/db/schema";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { admin as adminPlugin } from "better-auth/plugins"
import { ac, owner, admin, user, translator } from "@/modules/roles/permissions"
 

export const auth = betterAuth({
    emailAndPassword: { 
    enabled: true, 
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
            user,
            translator
        }
    }), nextCookies()]
});

