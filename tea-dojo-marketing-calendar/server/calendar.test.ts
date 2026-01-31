import { describe, expect, it, beforeEach, vi } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

// Mock the database functions
vi.mock("./db", () => ({
  getAllCalendarEvents: vi.fn().mockResolvedValue([
    { id: 1, month: "January", date: "1 Jan", event: "New Year's Day", type: "Public Holiday", priority: 3, campaign: "New Year, New Brew", isDefault: 1 },
    { id: 2, month: "February", date: "14 Feb", event: "Valentine's Day", type: "Commercial", priority: 3, campaign: "Love is Brewing", isDefault: 1 },
  ]),
  createCalendarEvent: vi.fn().mockResolvedValue({ insertId: 3 }),
  updateCalendarEvent: vi.fn().mockResolvedValue(undefined),
  deleteCalendarEvent: vi.fn().mockResolvedValue(undefined),
  seedDefaultCalendarEvents: vi.fn().mockResolvedValue(undefined),
  getAllWeeklySchedules: vi.fn().mockResolvedValue([
    { id: 1, day: "Monday", instagram: "Product Feature\n10:00 AM", tiktok: "-", facebook: "Community Post\n11:00 AM", isDefault: 1 },
    { id: 2, day: "Tuesday", instagram: "Stories\n7:00 PM", tiktok: "Trending Content\n7:00 PM", facebook: "-", isDefault: 1 },
  ]),
  createWeeklySchedule: vi.fn().mockResolvedValue({ insertId: 8 }),
  updateWeeklySchedule: vi.fn().mockResolvedValue(undefined),
  deleteWeeklySchedule: vi.fn().mockResolvedValue(undefined),
  seedDefaultWeeklySchedules: vi.fn().mockResolvedValue(undefined),
}));

function createTestContext(): TrpcContext {
  return {
    user: null,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: vi.fn(),
    } as unknown as TrpcContext["res"],
  };
}

describe("calendar router", () => {
  let ctx: TrpcContext;

  beforeEach(() => {
    ctx = createTestContext();
    vi.clearAllMocks();
  });

  describe("calendar.list", () => {
    it("returns list of calendar events", async () => {
      const caller = appRouter.createCaller(ctx);
      const result = await caller.calendar.list();

      expect(result).toHaveLength(2);
      expect(result[0]).toMatchObject({
        id: 1,
        month: "January",
        event: "New Year's Day",
        type: "Public Holiday",
      });
    });
  });

  describe("calendar.create", () => {
    it("creates a new calendar event", async () => {
      const caller = appRouter.createCaller(ctx);
      const result = await caller.calendar.create({
        month: "March",
        date: "15 Mar",
        event: "Store Anniversary",
        type: "Custom",
        priority: 3,
        campaign: "Anniversary Sale",
      });

      expect(result).toEqual({ success: true });
    });

    it("creates event with all valid fields", async () => {
      const caller = appRouter.createCaller(ctx);
      
      const result = await caller.calendar.create({
        month: "March",
        date: "15 Mar",
        event: "Test Event",
        type: "Custom",
        priority: 2,
      });
      
      expect(result).toEqual({ success: true });
    });

    it("validates priority range", async () => {
      const caller = appRouter.createCaller(ctx);
      
      await expect(
        caller.calendar.create({
          month: "March",
          date: "15 Mar",
          event: "Test Event",
          type: "Custom",
          priority: 5, // Invalid - should be 1-4
        })
      ).rejects.toThrow();
    });
  });

  describe("calendar.update", () => {
    it("updates an existing calendar event", async () => {
      const caller = appRouter.createCaller(ctx);
      const result = await caller.calendar.update({
        id: 1,
        event: "Updated Event Name",
        priority: 4,
      });

      expect(result).toEqual({ success: true });
    });
  });

  describe("calendar.delete", () => {
    it("deletes a calendar event", async () => {
      const caller = appRouter.createCaller(ctx);
      const result = await caller.calendar.delete({ id: 1 });

      expect(result).toEqual({ success: true });
    });
  });
});

describe("schedule router", () => {
  let ctx: TrpcContext;

  beforeEach(() => {
    ctx = createTestContext();
    vi.clearAllMocks();
  });

  describe("schedule.list", () => {
    it("returns list of weekly schedules", async () => {
      const caller = appRouter.createCaller(ctx);
      const result = await caller.schedule.list();

      expect(result).toHaveLength(2);
      expect(result[0]).toMatchObject({
        id: 1,
        day: "Monday",
        instagram: "Product Feature\n10:00 AM",
      });
    });
  });

  describe("schedule.update", () => {
    it("updates a weekly schedule", async () => {
      const caller = appRouter.createCaller(ctx);
      const result = await caller.schedule.update({
        id: 1,
        instagram: "Updated Content\n9:00 AM",
        tiktok: "New TikTok Content\n6:00 PM",
      });

      expect(result).toEqual({ success: true });
    });
  });

  describe("schedule.delete", () => {
    it("deletes a weekly schedule", async () => {
      const caller = appRouter.createCaller(ctx);
      const result = await caller.schedule.delete({ id: 1 });

      expect(result).toEqual({ success: true });
    });
  });
});
