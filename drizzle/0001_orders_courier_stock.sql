CREATE TABLE "stock" (
	"variant" text PRIMARY KEY NOT NULL,
	"qty" integer DEFAULT 0 NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "stock_qty_nonnegative" CHECK ("stock"."qty" >= 0)
);
--> statement-breakpoint
ALTER TABLE "preorders" ADD COLUMN "phone" text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "preorders" ADD COLUMN "address" text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "preorders" ADD COLUMN "location" text DEFAULT 'dhaka' NOT NULL;--> statement-breakpoint
ALTER TABLE "preorders" ADD COLUMN "courier" text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "preorders" ADD COLUMN "tracking_no" text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "preorders" ADD COLUMN "unit_price" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "preorders" ADD COLUMN "delivery" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "preorders" ADD COLUMN "total" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "preorders" ADD COLUMN "paid" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "preorders" ADD COLUMN "stock_held" boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE "preorders" ADD COLUMN "history" jsonb DEFAULT '[]'::jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "preorders" ADD COLUMN "updated_at" timestamp with time zone DEFAULT now() NOT NULL;--> statement-breakpoint
UPDATE "preorders" SET "status" = 'confirmed' WHERE "status" IN ('contacted', 'paid');--> statement-breakpoint
UPDATE "preorders" SET "status" = 'in_transit' WHERE "status" = 'shipped';--> statement-breakpoint
UPDATE "preorders" SET "stock_held" = false WHERE "status" = 'cancelled';--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "preorders_created_at_idx" ON "preorders" ("created_at" DESC);
