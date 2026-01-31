import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { z } from "zod";
import {
  getAllCalendarEvents,
  createCalendarEvent,
  updateCalendarEvent,
  deleteCalendarEvent,
  getAllWeeklySchedules,
  createWeeklySchedule,
  updateWeeklySchedule,
  deleteWeeklySchedule,
  seedDefaultCalendarEvents,
  seedDefaultWeeklySchedules,
} from "./db";
import { generateImage } from "./_core/imageGeneration";

export const appRouter = router({
  // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // Calendar Events CRUD
  calendar: router({
    list: publicProcedure.query(async () => {
      // Seed default data if empty
      await seedDefaultCalendarEvents();
      return await getAllCalendarEvents();
    }),
    create: publicProcedure
      .input(z.object({
        month: z.string(),
        date: z.string(),
        event: z.string(),
        type: z.enum(["Public Holiday", "Cultural", "Commercial", "Custom"]),
        priority: z.number().min(1).max(4),
        campaign: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        await createCalendarEvent({
          ...input,
          isDefault: 0,
        });
        return { success: true };
      }),
    update: publicProcedure
      .input(z.object({
        id: z.number(),
        month: z.string().optional(),
        date: z.string().optional(),
        event: z.string().optional(),
        type: z.enum(["Public Holiday", "Cultural", "Commercial", "Custom"]).optional(),
        priority: z.number().min(1).max(4).optional(),
        campaign: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        await updateCalendarEvent(id, data);
        return { success: true };
      }),
    delete: publicProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await deleteCalendarEvent(input.id);
        return { success: true };
      }),
  }),

  // Content Generation
  content: router({
    generateVisuals: publicProcedure
      .input(z.object({
        theme: z.string(),
        platform: z.enum(["instagram", "facebook", "tiktok"]),
        caption: z.string(),
        colors: z.array(z.string()).optional(),
      }))
      .mutation(async ({ input }) => {
        const colorDescription = input.colors && input.colors.length > 0
          ? ` Use these brand colors: ${input.colors.join(", ")}.`
          : "";
        
        const prompt = `Create a vibrant, eye-catching social media post for ${input.platform} about "${input.theme}". The post should include: ${input.caption}.${colorDescription} Make it visually appealing with modern design, suitable for a tea/bubble tea brand. Include decorative elements like tea leaves, bubbles, or cups. Professional marketing quality.`;
        
        const result = await generateImage({ prompt });
        return { imageUrl: result.url };
      }),
    generateMerchandiseDesign: publicProcedure
      .input(z.object({
        type: z.string(),
        theme: z.string(),
        designPrompt: z.string(),
        colors: z.array(z.string()).optional(),
      }))
      .mutation(async ({ input }) => {
        const colorDescription = input.colors && input.colors.length > 0
          ? ` Use these brand colors: ${input.colors.join(", ")}.`
          : "";
        
        const prompt = `Design a ${input.type} for a bubble tea brand with the theme "${input.theme}". ${input.designPrompt}${colorDescription} Professional product mockup, high quality, realistic rendering.`;
        
        const result = await generateImage({ prompt });
        return { imageUrl: result.url };
      }),
  }),

  // Weekly Schedule CRUD
  schedule: router({
    list: publicProcedure.query(async () => {
      // Seed default data if empty
      await seedDefaultWeeklySchedules();
      return await getAllWeeklySchedules();
    }),
    create: publicProcedure
      .input(z.object({
        day: z.enum(["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]),
        instagram: z.string().optional(),
        tiktok: z.string().optional(),
        facebook: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        await createWeeklySchedule({
          ...input,
          isDefault: 0,
        });
        return { success: true };
      }),
    update: publicProcedure
      .input(z.object({
        id: z.number(),
        day: z.enum(["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]).optional(),
        instagram: z.string().optional(),
        tiktok: z.string().optional(),
        facebook: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        await updateWeeklySchedule(id, data);
        return { success: true };
      }),
    delete: publicProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await deleteWeeklySchedule(input.id);
        return { success: true };
      }),
  }),
});

export type AppRouter = typeof appRouter;
