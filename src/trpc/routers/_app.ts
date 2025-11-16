import { createTRPCRouter } from '../init';
import { activityRouter } from './activity-router';
import { projectRouter } from './project-router';
import { userRouter } from './user-router';

export const appRouter = createTRPCRouter({
  projects: projectRouter,
  activity: activityRouter,
  users: userRouter
});

export type AppRouter = typeof appRouter;