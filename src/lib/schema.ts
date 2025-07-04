import {
  pgTable,
  serial,
  varchar,
  integer,
  timestamp,
} from "drizzle-orm/pg-core";

export const hallOfFameEntries = pgTable("hall_of_fame_entries", {
  id: serial("id").primaryKey(),
  participantNumber: integer("participant_number").unique().notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  dateStr: varchar("date_str", { length: 50 }).notNull(),
  notes: varchar("notes", { length: 255 }),
  age: integer("age"), // number of days alive
  elapsedTime: integer("elapsed_time"), // time in seconds to complete challenge
  completionCount: integer("completion_count"), // completion number (1st, 2nd, 3rd, etc.)
  parsedDate: timestamp("parsed_date").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type HallOfFameEntry = typeof hallOfFameEntries.$inferSelect;
export type NewHallOfFameEntry = typeof hallOfFameEntries.$inferInsert;
