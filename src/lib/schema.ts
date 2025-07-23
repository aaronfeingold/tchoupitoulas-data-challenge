import {
  pgTable,
  serial,
  varchar,
  integer,
  timestamp,
  text,
  boolean,
  primaryKey,
} from "drizzle-orm/pg-core";
import type { AdapterAccount } from "@auth/core/adapters";

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

// NextAuth.js required tables
export const users = pgTable("user", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  name: text("name"),
  email: text("email").notNull(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
  // Custom user profile fields from plan
  location: varchar("location", { length: 255 }),
  favoriteIceCreamFlavor: varchar("favorite_ice_cream_flavor", { length: 100 }),
  favoriteTopping: varchar("favorite_topping", { length: 100 }),
  favoriteBrand: varchar("favorite_brand", { length: 100 }),
  favoritePlace: varchar("favorite_place", { length: 100 }),
  avatarSelection: integer("avatar_selection").default(0), // 0-7 for 8 ice cream themed avatars
  emailNotificationsEnabled: boolean("email_notifications_enabled").default(
    false,
  ),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const accounts = pgTable(
  "account",
  {
    userId: integer("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccount["type"]>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  }),
);

export const sessions = pgTable("session", {
  sessionToken: text("sessionToken").notNull().primaryKey(),
  userId: integer("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const verificationTokens = pgTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
  }),
);

export type HallOfFameEntry = typeof hallOfFameEntries.$inferSelect;
export type NewHallOfFameEntry = typeof hallOfFameEntries.$inferInsert;
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
