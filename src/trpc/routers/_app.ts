import { createTRPCRouter } from '../init';
import { activityRouter } from './activity-router';
import { languageRouter } from './language-router';
import { projectRouter } from './project-router';
import { reviewRouter } from './review-router';
import { userRouter } from './user-router';

export const appRouter = createTRPCRouter({
  projects: projectRouter,
  activity: activityRouter,
  users: userRouter,
  languages: languageRouter,
  reviews: reviewRouter
});

export type AppRouter = typeof appRouter;