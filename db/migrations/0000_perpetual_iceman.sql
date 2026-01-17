CREATE TYPE "public"."project_accept_state" AS ENUM('accepted', 'rejected', 'waiting for approval', 'n/a');--> statement-breakpoint
CREATE TYPE "public"."activity_severity" AS ENUM('Warning', 'Info', 'Success', 'Critical');--> statement-breakpoint
CREATE TYPE "public"."activity_status" AS ENUM('COMPLETED_PROJECT', 'CREATED_PROJECT', 'TRANSLATION_SUBMITTED', 'REVISION_REQUEST', 'PROJECT_CANCELED');--> statement-breakpoint
CREATE TYPE "public"."project_file_type" AS ENUM('SOURCE', 'TRANSLATE');--> statement-breakpoint
CREATE TYPE "public"."project_status" AS ENUM('NEW', 'ASSIGNED', 'IN_PROGRESS', 'QA', 'BLOCKED', 'DONE', 'CLOSED');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('owner', 'admin', 'translator', 'user');--> statement-breakpoint
CREATE TABLE "project" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"status" "project_status" DEFAULT 'NEW' NOT NULL,
	"progress_percent" smallint DEFAULT 0 NOT NULL,
	"progress_note" text,
	"source_language" text NOT NULL,
	"target_language" text NOT NULL,
	"translator_id" text,
	"client_id" text,
	"accept_state" "project_accept_state" DEFAULT 'n/a' NOT NULL,
	"due_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "project_file" (
	"id" text PRIMARY KEY NOT NULL,
	"project_id" text NOT NULL,
	"project_file_type" "project_file_type" NOT NULL,
	"file_name" text NOT NULL,
	"content_type" text NOT NULL,
	"size" integer NOT NULL,
	"storage_key" text NOT NULL,
	"url" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "project_file_project_id_project_file_type_unique" UNIQUE("project_id","project_file_type")
);
--> statement-breakpoint
CREATE TABLE "account" (
	"id" text PRIMARY KEY NOT NULL,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"user_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp,
	"refresh_token_expires_at" timestamp,
	"scope" text,
	"password" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "company_review" (
	"id" text PRIMARY KEY NOT NULL,
	"client_id" text NOT NULL,
	"project_id" text NOT NULL,
	"price_rating" integer,
	"support_rating" integer,
	"would_recommend" boolean,
	"overall_rating" integer,
	CONSTRAINT "company_review_project_id_unique" UNIQUE("project_id")
);
--> statement-breakpoint
CREATE TABLE "language" (
	"code" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" text PRIMARY KEY NOT NULL,
	"expires_at" timestamp NOT NULL,
	"token" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"user_id" text NOT NULL,
	"active_organization_id" text,
	CONSTRAINT "session_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "translator_language" (
	"translator_id" text NOT NULL,
	"language_code" text NOT NULL,
	CONSTRAINT "translator_language_translator_id_language_code_pk" PRIMARY KEY("translator_id","language_code")
);
--> statement-breakpoint
CREATE TABLE "translator_review" (
	"id" text PRIMARY KEY NOT NULL,
	"client_id" text NOT NULL,
	"translator_id" text NOT NULL,
	"project_id" text NOT NULL,
	"quality_rating" integer,
	"communication_rating" integer,
	"punctuality_rating" integer,
	"overall_rating" integer NOT NULL,
	"title" text NOT NULL,
	"comment" text DEFAULT '',
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "translator_review_project_id_unique" UNIQUE("project_id")
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"email_verified" boolean DEFAULT false NOT NULL,
	"image" text,
	"banned" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"role" "user_role" DEFAULT 'user' NOT NULL,
	CONSTRAINT "user_name_unique" UNIQUE("name"),
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "activity" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text,
	"project_id" text,
	"info" text DEFAULT '',
	"date" timestamp DEFAULT now() NOT NULL,
	"activity_status" "activity_status" NOT NULL,
	"activity_severity" "activity_severity" NOT NULL
);
--> statement-breakpoint
CREATE TABLE "verification" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "project" ADD CONSTRAINT "project_source_language_language_code_fk" FOREIGN KEY ("source_language") REFERENCES "public"."language"("code") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project" ADD CONSTRAINT "project_target_language_language_code_fk" FOREIGN KEY ("target_language") REFERENCES "public"."language"("code") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project" ADD CONSTRAINT "project_translator_id_user_id_fk" FOREIGN KEY ("translator_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project" ADD CONSTRAINT "project_client_id_user_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_file" ADD CONSTRAINT "project_file_project_id_project_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."project"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "company_review" ADD CONSTRAINT "company_review_client_id_user_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "company_review" ADD CONSTRAINT "company_review_project_id_project_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."project"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "translator_language" ADD CONSTRAINT "translator_language_translator_id_user_id_fk" FOREIGN KEY ("translator_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "translator_language" ADD CONSTRAINT "translator_language_language_code_language_code_fk" FOREIGN KEY ("language_code") REFERENCES "public"."language"("code") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "translator_review" ADD CONSTRAINT "translator_review_client_id_user_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "translator_review" ADD CONSTRAINT "translator_review_translator_id_user_id_fk" FOREIGN KEY ("translator_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "translator_review" ADD CONSTRAINT "translator_review_project_id_project_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."project"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "activity" ADD CONSTRAINT "activity_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "activity" ADD CONSTRAINT "activity_project_id_project_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."project"("id") ON DELETE set null ON UPDATE no action;