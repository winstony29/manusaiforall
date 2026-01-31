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
    generateTheme: publicProcedure
      .input(z.object({
        campaignGoal: z.string(),
        targetAudience: z.string(),
        toneOfVoice: z.string(),
      }))
      .mutation(async ({ input }) => {
        // Generate a theme based on campaign parameters
        // For now, return a structured theme object
        const themes = [
          {
            name: "Golden Fortune CNY",
            slogan: "Huat with Every Sip! 🧧",
            description: "A festive celebration featuring gold and red accents, prosperity themes, and limited-edition drinks.",
            keyMessages: ["Limited-edition CNY drinks", "Prosperity bundle deals", "Festive cup designs", "Family sharing sets"],
            colorPalettes: [
              { name: "Classic Fortune", colors: ["#C41E3A", "#FFD700", "#8B0000", "#FFF8DC", "#B8860B"] },
              { name: "Modern Prosperity", colors: ["#E74C3C", "#F39C12", "#2C3E50", "#ECF0F1", "#D4AF37"] },
              { name: "Elegant Gold", colors: ["#DAA520", "#B22222", "#FFFAF0", "#CD853F", "#8B4513"] }
            ],
            selectedPaletteIndex: 0
          },
          {
            name: "Summer Splash",
            slogan: "Cool Down with Every Sip! 🌊",
            description: "A refreshing summer campaign featuring tropical flavors and cool vibes.",
            keyMessages: ["Tropical fruit flavors", "Ice-cold refreshments", "Beach-ready packaging", "Summer specials"],
            colorPalettes: [
              { name: "Ocean Breeze", colors: ["#00CED1", "#FF6B6B", "#4ECDC4", "#FFE66D", "#95E1D3"] },
              { name: "Tropical Sunset", colors: ["#FF7F50", "#40E0D0", "#FFD93D", "#6BCB77", "#FF6B6B"] },
              { name: "Fresh Mint", colors: ["#98D8C8", "#F7DC6F", "#BB8FCE", "#85C1E9", "#F8B500"] }
            ],
            selectedPaletteIndex: 0
          },
          {
            name: "Autumn Harvest",
            slogan: "Savor the Season! 🍂",
            description: "A cozy autumn campaign featuring warm flavors and earthy tones.",
            keyMessages: ["Seasonal flavors", "Warm drinks", "Cozy vibes", "Limited edition"],
            colorPalettes: [
              { name: "Harvest Gold", colors: ["#D2691E", "#DAA520", "#8B4513", "#F4A460", "#CD853F"] },
              { name: "Autumn Leaves", colors: ["#FF6347", "#FFD700", "#8B0000", "#FF8C00", "#B8860B"] },
              { name: "Cozy Brown", colors: ["#A0522D", "#DEB887", "#D2B48C", "#BC8F8F", "#F5DEB3"] }
            ],
            selectedPaletteIndex: 0
          }
        ];
        
        // Select theme based on keywords in campaign goal
        let selectedTheme = themes[0];
        const goalLower = input.campaignGoal.toLowerCase();
        if (goalLower.includes('summer') || goalLower.includes('cool') || goalLower.includes('refresh')) {
          selectedTheme = themes[1];
        } else if (goalLower.includes('autumn') || goalLower.includes('fall') || goalLower.includes('harvest')) {
          selectedTheme = themes[2];
        }
        
        return { theme: selectedTheme };
      }),
    generateCampaignContent: publicProcedure
      .input(z.object({
        theme: z.object({
          name: z.string(),
          slogan: z.string(),
          description: z.string(),
          keyMessages: z.array(z.string()),
          colorPalettes: z.array(z.object({
            name: z.string(),
            colors: z.array(z.string())
          })),
          selectedPaletteIndex: z.number()
        }),
        formats: z.array(z.string()),
        merchandise: z.array(z.string()),
        generateCaptions: z.boolean(),
        campaignGoal: z.string(),
        targetAudience: z.string(),
      }))
      .mutation(async ({ input }) => {
        const { theme, formats, merchandise, campaignGoal, targetAudience } = input;
        const selectedPalette = theme.colorPalettes[theme.selectedPaletteIndex];
        
        // Generate social posts content
        const socialPosts = await Promise.all(formats.map(async (formatId) => {
          const isVideo = formatId.includes('video') || formatId.includes('reel');
          const platform = formatId.includes('tiktok') ? 'tiktok' : 
                          formatId.includes('instagram') ? 'instagram' : 'facebook';
          
          let imageUrl: string | undefined;
          
          // Generate image for non-video formats
          if (!isVideo) {
            try {
              const prompt = `Create a vibrant, eye-catching social media marketing image for ${platform} about "${theme.name}". Theme: ${theme.description}. Use colors: ${selectedPalette.colors.join(', ')}. Style: modern, professional, suitable for a bubble tea brand. Include decorative elements like tea leaves, bubbles, or cups. High quality marketing visual.`;
              const result = await generateImage({ prompt });
              imageUrl = result.url;
            } catch (error) {
              console.error('Error generating image:', error);
            }
          }
          
          return {
            platform,
            format: formatId,
            contentType: isVideo ? 'video' : 'image',
            caption: `✨ ${theme.slogan} ✨\n\n${campaignGoal}\n\nPerfect for ${targetAudience}! 🎉`,
            hashtags: `#teadojo #bubbletea #${theme.name.toLowerCase().replace(/\s+/g, '')} #marketing`,
            imageUrl,
            imagePrompt: !isVideo ? `Marketing image for "${theme.name}" campaign with ${selectedPalette.name} color palette` : undefined,
            videoPrompt: isVideo ? `Marketing video for "${theme.name}" campaign. ${theme.description}` : undefined
          };
        }));
        
        // Generate video script if any video formats selected
        const hasVideo = formats.some(f => f.includes('video') || f.includes('reel'));
        const videoScript = hasVideo ? {
          scenes: [
            { sceneNumber: 1, duration: '0-3s', visualDescription: `Opening shot with ${theme.name} branding, colors: ${selectedPalette.colors[0]}` },
            { sceneNumber: 2, duration: '3-8s', visualDescription: `Showcase bubble tea preparation with energetic vibe` },
            { sceneNumber: 3, duration: '8-12s', visualDescription: `Customer enjoying drinks, "${theme.slogan}" text overlay` },
            { sceneNumber: 4, duration: '12-15s', visualDescription: `Call to action with brand logo and campaign colors` }
          ]
        } : null;
        
        // Generate merchandise designs
        const merchandiseDesigns = await Promise.all(merchandise.map(async (merchId) => {
          const merchTypes: Record<string, { label: string; category: string }> = {
            'cup-design': { label: 'Cup Design', category: 'packaging' },
            'bag-design': { label: 'Bag Design', category: 'packaging' },
            'tshirt-design': { label: 'T-Shirt Design', category: 'apparel' },
            'apron-design': { label: 'Apron Design', category: 'apparel' },
            'cap-design': { label: 'Cap/Hat Design', category: 'apparel' }
          };
          
          const merchInfo = merchTypes[merchId] || { label: merchId, category: 'other' };
          
          let imageUrl: string | undefined;
          try {
            const prompt = `Design a ${merchInfo.label.toLowerCase()} for a bubble tea brand with the theme "${theme.name}". ${theme.description}. Slogan: "${theme.slogan}". Primary colors: ${selectedPalette.colors.slice(0, 3).join(', ')}. Professional product mockup, high quality, realistic rendering.`;
            const result = await generateImage({ prompt });
            imageUrl = result.url;
          } catch (error) {
            console.error('Error generating merchandise design:', error);
          }
          
          return {
            type: merchInfo.label,
            category: merchInfo.category,
            imageUrl,
            designPrompt: `Design for "${theme.name}" campaign with ${selectedPalette.name} palette`,
            specifications: merchInfo.category === 'packaging' 
              ? 'Print-ready design with bleed marks, CMYK color mode'
              : 'Vector format, front and back designs, size chart compatible'
          };
        }));
        
        return {
          socialPosts,
          videoScript,
          merchandiseDesigns
        };
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
