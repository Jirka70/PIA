import { Role } from '@/db/schema';
import { auth } from '@/lib/auth';
import { ADMIN_ROLES, TRANSLATOR_ROLES } from '@/modules/roles/permissions';
import { initTRPC, TRPCError } from '@trpc/server';
import { headers } from 'next/headers';
import { db } from '@/db/drizzle';
import superjson from "superjson"

export async function createTRPCContext() {
  const hdrs = headers()
  const session = await auth.api.getSession({
    headers: await hdrs,
  });
  
  return { session: session, 
    user: session?.user, 
    auth: auth,
    db: db
  };
}

export type Context = Awaited<ReturnType<typeof createTRPCContext>>;

const t = initTRPC.context<Context>().create({
  transformer: superjson
});

export const isAuthed = t.middleware(async ({ ctx, next }) => {
  if (!ctx.session || !ctx.user) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Not authenticated"
    })
  }


  return next({
      ctx: {
        ...ctx,
        session: ctx.session,
        user: ctx.user,
      },
    });
})

export const hasUserPermission = (roles: Role[]) => t.middleware(async ({ ctx, next }) => {
  const session = ctx.session

  if (!session?.user) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Not authenticated"
    })
  }

  const role = session?.user.role as Role;
  if (!roles.includes(role)) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Not authorized"
    })
  }
  
  return next()
})


export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;

export const baseProcedure = t.procedure;
export const protectedProcedure = baseProcedure.use(isAuthed)
export const translatorProcedure = protectedProcedure.use(hasUserPermission(TRANSLATOR_ROLES))
export const adminProcedure = protectedProcedure.use(hasUserPermission(ADMIN_ROLES))