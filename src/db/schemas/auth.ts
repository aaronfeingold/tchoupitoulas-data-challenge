import {
  pgTable,
  varchar,
  integer,
  timestamp,
  text,
  boolean,
  primaryKey,
} from "drizzle-orm/pg-core";
import type { AdapterAccount } from "@auth/core/adapters";
import { randomUUID } from "crypto";

// NextAuth.js required tables
export const users = pgTable("user", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => randomUUID()),
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
    false
  ),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const accounts = pgTable(
  "account",
  {
    userId: text("userId")
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
  })
);

export const verificationTokens = pgTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
  })
);

export type User = typeof users.$inferSelect;
export type Account = typeof accounts.$inferSelect;
export type NewUser = typeof users.$inferInsert;