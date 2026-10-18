import {
  pgTable,
  pgEnum,
  uuid,
  text,
  timestamp,
  integer,
  index,
} from "drizzle-orm/pg-core";

export const roleEnum = pgEnum("Role", ["USER", "ADMIN"]);
export const tokenTypeEnum = pgEnum("TokenType", ["REFRESH", "EMAIL_VERIFY"]);

export const users = pgTable(
  "user",
  {
    id: uuid().defaultRandom().primaryKey(),
    email: text().unique().notNull(),
    password: text().notNull(),
    name: text().notNull(),
    emailVerified: timestamp("email_verified", {
      withTimezone: true,
      mode: "string",
    }),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true, mode: "string" })
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date().toISOString()),
    role: roleEnum().default("USER").notNull(),
  },
);

export const recipes = pgTable(
  "recipe",
  {
    id: uuid().defaultRandom().primaryKey(),
    name: text().notNull(),
    cuisine: text().notNull(),
    mealType: text("meal_type").array().notNull(),
    difficulty: text().notNull(),
    cookTimeMinutes: integer("cook_time_minutes").notNull(),
    tags: text().array().notNull(),
    image: text().notNull(),
    ingredients: text().array().notNull(),
    instructions: text().array().notNull(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
  },
  (table) => [index("recipe_owner_idx").on(table.userId)],
);

export const tokens = pgTable(
  "token",
  {
    id: uuid().defaultRandom().primaryKey(),
    type: tokenTypeEnum().notNull(),
    token: text().unique().notNull(),
    expiresAt: timestamp("expires_at", { withTimezone: true, mode: "string" }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
      .defaultNow()
      .notNull(),
    consumedAt: timestamp("consumed_at", { withTimezone: true, mode: "string" }),
    revokedAt: timestamp("revoked_at", { withTimezone: true, mode: "string" }),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
  },
  (table) => [index("token_owner_type_idx").on(table.userId, table.type)],
);

export type User = typeof users.$inferSelect;
export type Recipe = typeof recipes.$inferSelect;
export type Token = typeof tokens.$inferSelect;
