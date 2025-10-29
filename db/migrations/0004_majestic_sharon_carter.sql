CREATE TYPE "public"."project_status" AS ENUM('NEW', 'IN_PROGRESS', 'QA', 'BLOCKED', 'DONE', 'CLOSED');--> statement-breakpoint
CREATE TABLE "project" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"status" "project_status" DEFAULT 'NEW' NOT NULL,
	"progress_percent" smallint DEFAULT 0 NOT NULL,
	"translator_id" text,
	"client_id" text,
	"due_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "project" ADD CONSTRAINT "project_translator_id_user_id_fk" FOREIGN KEY ("translator_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project" ADD CONSTRAINT "project_client_id_user_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;