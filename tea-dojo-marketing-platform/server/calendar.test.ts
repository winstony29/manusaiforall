import { describe, expect, it, vi, beforeEach } from "vitest";
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
  getAllWeeklySchedules: vi.fn().mockResolvedValue([
    { id: 1, day: "Monday", instagram: "Product Feature", tiktok: "-", facebook: "Community Post", isDefault: 1 },
  ]),
  createWeeklySchedule: vi.fn().mockResolvedValue({ insertId: 8 }),
  updateWeeklySchedule: vi.fn().mockResolvedValue(undefined),
  deleteWeeklySchedule: vi.fn().mockResolvedValue(undefined),
  seedDefaultCalendarEvents: vi.fn().mockResolvedValue(undefined),
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
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("lists calendar events", async () => {
    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.calendar.list();

    expect(result).toHaveLength(2);
    expect(result[0].event).toBe("New Year's Day");
    expect(result[1].event).toBe("Valentine's Day");
  });

  it("creates a calendar event", async () => {
    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.calendar.create({
      month: "March",
      date: "17 Mar",
      event: "St. Patrick's Day",
      type: "Commercial",
      priority: 2,
      campaign: "Green Tea Special",
    });

    expect(result).toEqual({ success: true });
  });

  it("updates a calendar event", async () => {
    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.calendar.update({
      id: 1,
      campaign: "Updated Campaign",
    });

    expect(result).toEqual({ success: true });
  });

  it("deletes a calendar event", async () => {
    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.calendar.delete({ id: 1 });

    expect(result).toEqual({ success: true });
  });
});

describe("schedule router", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("lists weekly schedules", async () => {
    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.schedule.list();

    expect(result).toHaveLength(1);
    expect(result[0].day).toBe("Monday");
  });

  it("creates a weekly schedule", async () => {
    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.schedule.create({
      day: "Tuesday",
      instagram: "Stories",
      tiktok: "Trending Content",
      facebook: "-",
    });

    expect(result).toEqual({ success: true });
  });

  it("updates a weekly schedule", async () => {
    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.schedule.update({
      id: 1,
      instagram: "Updated Content",
    });

    expect(result).toEqual({ success: true });
  });

  it("deletes a weekly schedule", async () => {
    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.schedule.delete({ id: 1 });

    expect(result).toEqual({ success: true });
  });
});
