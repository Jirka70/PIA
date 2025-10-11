import { Role } from '@/db/schema';
import { auth } from '@/lib/auth';
import { ADMIN_ROLES, hasAnyRole, TRANSLATOR_ROLES } from '@/modules/roles/permissions';
import { initTRPC, TRPCError } from '@trpc/server';
import { headers } from 'next/headers';
import { cache } from 'react';
import superjson from "superjson"



export const createTRPCContext = cache(async () => {
  const sesh = await auth.api.getSession({
    headers: await headers()
  })

  return {
    user: sesh?.user,
  }
});

export type Context = Awaited<ReturnType<typeof createTRPCContext>>

const t = initTRPC.context<Context>().create({

  transformer: superjson,
});

export const isAuthed = t.middleware(({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Not authenticated"
    })
  }

  return next()
})

export const hasUserPermission = (roles: Role[]) => t.middleware(({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Not authenticated"
    })
  }

  const role = ctx.user.role as Role;
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