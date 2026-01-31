import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, calendarEvents, InsertCalendarEvent, weeklySchedules, InsertWeeklySchedule } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// Calendar Events queries
export async function getAllCalendarEvents() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(calendarEvents).orderBy(calendarEvents.id);
}

export async function createCalendarEvent(event: InsertCalendarEvent) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(calendarEvents).values(event);
  return result;
}

export async function updateCalendarEvent(id: number, event: Partial<InsertCalendarEvent>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(calendarEvents).set(event).where(eq(calendarEvents.id, id));
}

export async function deleteCalendarEvent(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(calendarEvents).where(eq(calendarEvents.id, id));
}

// Weekly Schedule queries
export async function getAllWeeklySchedules() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(weeklySchedules).orderBy(weeklySchedules.id);
}

export async function createWeeklySchedule(schedule: InsertWeeklySchedule) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(weeklySchedules).values(schedule);
  return result;
}

export async function updateWeeklySchedule(id: number, schedule: Partial<InsertWeeklySchedule>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(weeklySchedules).set(schedule).where(eq(weeklySchedules.id, id));
}

export async function deleteWeeklySchedule(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(weeklySchedules).where(eq(weeklySchedules.id, id));
}

// Seed default data
export async function seedDefaultCalendarEvents() {
  const db = await getDb();
  if (!db) return;
  
  const existing = await db.select().from(calendarEvents).limit(1);
  if (existing.length > 0) return; // Already seeded
  
  const defaultEvents: InsertCalendarEvent[] = [
    { month: "January", date: "1 Jan", event: "New Year's Day", type: "Public Holiday", priority: 3, campaign: "New Year, New Brew", isDefault: 1 },
    { month: "January", date: "13-17 Jan", event: "Pongal Festival", type: "Cultural", priority: 2, campaign: "Harvest Celebration", isDefault: 1 },
    { month: "February", date: "14 Feb", event: "Valentine's Day", type: "Commercial", priority: 3, campaign: "Love is Brewing", isDefault: 1 },
    { month: "February", date: "17-18 Feb", event: "Chinese New Year", type: "Public Holiday", priority: 4, campaign: "Huat with Tea Dojo", isDefault: 1 },
    { month: "March", date: "21 Mar", event: "Hari Raya Puasa", type: "Public Holiday", priority: 3, campaign: "Raya Refreshers", isDefault: 1 },
    { month: "April", date: "3 Apr", event: "Good Friday", type: "Public Holiday", priority: 2, campaign: "Good Fri-Yay!", isDefault: 1 },
    { month: "May", date: "1 May", event: "Labour Day", type: "Public Holiday", priority: 3, campaign: "Toast to Workers", isDefault: 1 },
    { month: "May", date: "10 May", event: "Mother's Day", type: "Commercial", priority: 3, campaign: "Mom's Favorite Brew", isDefault: 1 },
    { month: "May", date: "27 May", event: "Hari Raya Haji", type: "Public Holiday", priority: 3, campaign: "Family Gathering", isDefault: 1 },
    { month: "June", date: "19 Jun", event: "Dragon Boat Festival", type: "Cultural", priority: 2, campaign: "Dragon's Brew", isDefault: 1 },
    { month: "June", date: "21 Jun", event: "Father's Day", type: "Commercial", priority: 3, campaign: "Dad's Strong Brew", isDefault: 1 },
    { month: "August", date: "9 Aug", event: "National Day", type: "Public Holiday", priority: 4, campaign: "Our Singapore, Our Tea", isDefault: 1 },
    { month: "September", date: "25 Sep", event: "Mid-Autumn Festival", type: "Cultural", priority: 3, campaign: "Moonlit Brews", isDefault: 1 },
    { month: "October", date: "31 Oct", event: "Halloween", type: "Commercial", priority: 2, campaign: "Spook-tacular Sips", isDefault: 1 },
    { month: "November", date: "8 Nov", event: "Deepavali", type: "Public Holiday", priority: 3, campaign: "Festival of Lights", isDefault: 1 },
    { month: "November", date: "11 Nov", event: "Singles' Day (11.11)", type: "Commercial", priority: 3, campaign: "Self-Love Sale", isDefault: 1 },
    { month: "December", date: "25 Dec", event: "Christmas Day", type: "Public Holiday", priority: 4, campaign: "A Jolly Tea-mas", isDefault: 1 },
  ];
  
  await db.insert(calendarEvents).values(defaultEvents);
}

export async function seedDefaultWeeklySchedules() {
  const db = await getDb();
  if (!db) return;
  
  const existing = await db.select().from(weeklySchedules).limit(1);
  if (existing.length > 0) return; // Already seeded
  
  const defaultSchedules: InsertWeeklySchedule[] = [
    { day: "Monday", instagram: "Product Feature\n10:00 AM", tiktok: "-", facebook: "Community Post\n11:00 AM", isDefault: 1 },
    { day: "Tuesday", instagram: "Stories\n7:00 PM", tiktok: "Trending Content\n7:00 PM", facebook: "-", isDefault: 1 },
    { day: "Wednesday", instagram: "Reels\n12:00 PM", tiktok: "Behind-the-scenes\n7:00 PM", facebook: "Event/Promo\n11:00 AM", isDefault: 1 },
    { day: "Thursday", instagram: "Product Launch\n12:00 PM", tiktok: "Tutorial\n7:00 PM", facebook: "-", isDefault: 1 },
    { day: "Friday", instagram: "Weekend Teaser\n5:00 PM", tiktok: "Fun/Trending\n8:00 PM", facebook: "Weekend Deals\n12:00 PM", isDefault: 1 },
    { day: "Saturday", instagram: "Lifestyle\n12:00 PM", tiktok: "Challenge\n3:00 PM", facebook: "Family Content\n11:00 AM", isDefault: 1 },
    { day: "Sunday", instagram: "UGC/Relaxation\n3:00 PM", tiktok: "-", facebook: "Community Stories\n4:00 PM", isDefault: 1 },
  ];
  
  await db.insert(weeklySchedules).values(defaultSchedules);
}
