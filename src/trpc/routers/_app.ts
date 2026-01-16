import { createTRPCRouter } from '../init';
import { activityRouter } from './activity-router';
import { emailRouter } from './email-router';
import { languageRouter } from './language-router';
import { projectRouter } from './project-router';
import { reviewRouter } from './review-router';
import { userRouter } from './user-router';

// Root TRPC router stitching together domain routers
export const appRouter = createTRPCRouter({
  projects: projectRouter,
  activity: activityRouter,
  users: userRouter,
  languages: languageRouter,
  reviews: reviewRouter,
  emails: emailRouter
});

export type AppRouter = typeof appRouter;
