CREATE TABLE "track_hits" (
	"ip_hash" text NOT NULL,
	"window_start" timestamp with time zone NOT NULL,
	"hits" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "track_hits_ip_hash_window_start_pk" PRIMARY KEY("ip_hash","window_start")
);
--> statement-breakpoint
CREATE TABLE "units" (
	"unit_id" text PRIMARY KEY NOT NULL,
	"variant" text NOT NULL,
	"status" text DEFAULT 'in_stock' NOT NULL,
	"order_id" integer,
	"note" text DEFAULT '' NOT NULL,
	"added_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "units_variant_status_idx" ON "units" USING btree ("variant","status");--> statement-breakpoint
CREATE INDEX "units_order_idx" ON "units" USING btree ("order_id");