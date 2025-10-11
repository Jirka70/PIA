import { z } from 'zod';
import { adminProcedure, baseProcedure, createTRPCRouter, protectedProcedure, translatorProcedure } from '../init';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
export const appRouter = createTRPCRouter({
  hello: translatorProcedure
    .input(
      z.object({
        text: z.string(),
      }),
    )
    .query((opts) => {
      return {
        greeting: `hello ${opts.input.text}`,
      };
    }),
  loggedUser: baseProcedure
    .query(async () => {
      const sesh = await auth.api.getSession({
        headers: await headers()
      })

      return {
        user: sesh?.user
      }
    })
});
// export type definition of API
export type AppRouter = typeof appRouter;