import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Calendar events table for annual marketing calendar
 */
export const calendarEvents = mysqlTable("calendar_events", {
  id: int("id").autoincrement().primaryKey(),
  month: varchar("month", { length: 20 }).notNull(),
  date: varchar("date", { length: 50 }).notNull(),
  event: varchar("event", { length: 200 }).notNull(),
  type: mysqlEnum("type", ["Public Holiday", "Cultural", "Commercial", "Custom"]).default("Custom").notNull(),
  priority: int("priority").default(2).notNull(),
  campaign: varchar("campaign", { length: 200 }),
  isDefault: int("isDefault").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type CalendarEvent = typeof calendarEvents.$inferSelect;
export type InsertCalendarEvent = typeof calendarEvents.$inferInsert;

/**
 * Weekly schedule table for posting schedule
 */
export const weeklySchedules = mysqlTable("weekly_schedules", {
  id: int("id").autoincrement().primaryKey(),
  day: mysqlEnum("day", ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]).notNull(),
  instagram: text("instagram"),
  tiktok: text("tiktok"),
  facebook: text("facebook"),
  isDefault: int("isDefault").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type WeeklySchedule = typeof weeklySchedules.$inferSelect;
export type InsertWeeklySchedule = typeof weeklySchedules.$inferInsert;