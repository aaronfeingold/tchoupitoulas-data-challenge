CREATE TABLE "hall_of_fame_entries" (
	"id" serial PRIMARY KEY NOT NULL,
	"participant_number" integer NOT NULL,
	"name" varchar(255) NOT NULL,
	"date_str" varchar(50) NOT NULL,
	"notes" varchar(255),
	"age" integer,
	"elapsed_time" integer,
	"completion_count" integer,
	"parsed_date" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "hall_of_fame_entries_participant_number_unique" UNIQUE("participant_number")
);
