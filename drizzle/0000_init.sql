CREATE TABLE "editions" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"variant" text NOT NULL,
	"name_en" text NOT NULL,
	"name_bn" text NOT NULL,
	"accessory_en" text NOT NULL,
	"accessory_bn" text NOT NULL,
	"eyes_en" text NOT NULL,
	"eyes_bn" text NOT NULL,
	"tint" text DEFAULT '#f3f1ee' NOT NULL,
	"price" integer,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "editions_slug_unique" UNIQUE("slug"),
	CONSTRAINT "editions_variant_unique" UNIQUE("variant")
);
--> statement-breakpoint
CREATE TABLE "preorders" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"variant" text NOT NULL,
	"qty" integer DEFAULT 1 NOT NULL,
	"lang" text DEFAULT 'en' NOT NULL,
	"status" text DEFAULT 'new' NOT NULL,
	"note" text DEFAULT '' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "settings" (
	"key" text PRIMARY KEY NOT NULL,
	"value" jsonb NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
