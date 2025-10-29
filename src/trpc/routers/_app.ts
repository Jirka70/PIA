import { createTRPCRouter } from '../init';
import { projectRouter } from './project-router';

export const appRouter = createTRPCRouter({
  projects: projectRouter
});

export type AppRouter = typeof appRouter;