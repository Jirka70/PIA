DO $$ BEGIN
    CREATE TYPE "project_accept_state" AS ENUM ('accepted', 'rejected', 'waiting for approval', 'n/a');
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;
--> statement-breakpoint
ALTER TABLE "project" ALTER COLUMN "accept_state" DROP DEFAULT;
--> statement-breakpoint
ALTER TABLE "project"
ALTER COLUMN "accept_state"
TYPE "project_accept_state"
USING (
    CASE
        WHEN "accept_state" = TRUE THEN 'accepted'::project_accept_state
        WHEN "accept_state" = FALSE THEN 'rejected'::project_accept_state
        ELSE 'n/a'::project_accept_state
    END
);
--> statement-breakpoint
ALTER TABLE "project" ALTER COLUMN "accept_state" SET DEFAULT 'n/a';
--> statement-breakpoint
ALTER TABLE "project" ALTER COLUMN "accept_state" SET NOT NULL;
