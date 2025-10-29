ALTER TABLE "invitation" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "organization" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "invitation" CASCADE;--> statement-breakpoint
DROP TABLE "organization" CASCADE;--> statement-breakpoint
ALTER TABLE "member" DROP CONSTRAINT "member_organization_id_organization_id_fk";
--> statement-breakpoint
ALTER TABLE "member" DROP CONSTRAINT "member_user_id_user_id_fk";
--> statement-breakpoint
ALTER TABLE "member" DROP COLUMN "organization_id";--> statement-breakpoint
ALTER TABLE "member" DROP COLUMN "user_id";