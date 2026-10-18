CREATE TYPE "public"."Role" AS ENUM('USER', 'ADMIN');--> statement-breakpoint
CREATE TYPE "public"."TokenType" AS ENUM('REFRESH', 'EMAIL_VERIFY');--> statement-breakpoint
CREATE TABLE "recipe" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"cuisine" text NOT NULL,
	"meal_type" text[] NOT NULL,
	"difficulty" text NOT NULL,
	"cook_time_minutes" integer NOT NULL,
	"tags" text[] NOT NULL,
	"image" text NOT NULL,
	"ingredients" text[] NOT NULL,
	"instructions" text[] NOT NULL,
	"user_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "token" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"type" "TokenType" NOT NULL,
	"token" text NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"consumed_at" timestamp with time zone,
	"revoked_at" timestamp with time zone,
	"user_id" uuid NOT NULL,
	CONSTRAINT "token_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"password" text NOT NULL,
	"name" text NOT NULL,
	"email_verified" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"role" "Role" DEFAULT 'USER' NOT NULL,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "recipe" ADD CONSTRAINT "recipe_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "token" ADD CONSTRAINT "token_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "recipe_owner_idx" ON "recipe" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "token_owner_type_idx" ON "token" USING btree ("user_id","type");