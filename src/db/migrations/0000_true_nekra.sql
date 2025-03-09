CREATE TABLE "conversations" (
	"uuid" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	"user_id" text NOT NULL,
	"title" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "messages" (
	"uuid" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	"conversation_uuid" uuid NOT NULL,
	"id" text NOT NULL,
	"role" text NOT NULL,
	"content" text NOT NULL,
	"parts" jsonb
);
--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "fk_messages_conversation_uuid" FOREIGN KEY ("conversation_uuid") REFERENCES "public"."conversations"("uuid") ON DELETE cascade ON UPDATE cascade;