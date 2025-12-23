import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import * as db from "./db";

export const appRouter = router({
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

  // User profile management
  profile: router({
    get: protectedProcedure.query(async ({ ctx }) => {
      return await db.getUserById(ctx.user.id);
    }),
    
    update: protectedProcedure
      .input(z.object({
        businessName: z.string().optional(),
        businessType: z.string().optional(),
        businessLocation: z.string().optional(),
        businessPhone: z.string().optional(),
        businessWebsite: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        await db.updateUserProfile(ctx.user.id, input);
        return { success: true };
      }),
  }),

  // Campaign management
  campaigns: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      return await db.getCampaignsByUserId(ctx.user.id);
    }),
    
    get: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return await db.getCampaignById(input.id);
      }),
    
    create: protectedProcedure
      .input(z.object({
        name: z.string().min(1),
        targetIndustry: z.string().min(1),
        targetLocation: z.string().min(1),
      }))
      .mutation(async ({ ctx, input }) => {
        const campaignId = await db.createCampaign({
          userId: ctx.user.id,
          ...input,
          status: 'draft',
        });
        
        // Create notification
        await db.createNotification({
          userId: ctx.user.id,
          type: 'campaign_created',
          title: 'Nouvelle campagne créée',
          message: `La campagne "${input.name}" a été créée avec succès.`,
          campaignId,
        });
        
        return { id: campaignId };
      }),
    
    updateStatus: protectedProcedure
      .input(z.object({
        id: z.number(),
        status: z.enum(['draft', 'running', 'completed', 'error']),
      }))
      .mutation(async ({ input }) => {
        await db.updateCampaign(input.id, { status: input.status });
        return { success: true };
      }),
  }),

  // Lead management
  leads: router({
    listByCampaign: protectedProcedure
      .input(z.object({ campaignId: z.number() }))
      .query(async ({ input }) => {
        return await db.getLeadsByCampaignId(input.campaignId);
      }),
    
    get: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return await db.getLeadById(input.id);
      }),
  }),

  // Content management
  contents: router({
    listByCampaign: protectedProcedure
      .input(z.object({ campaignId: z.number() }))
      .query(async ({ input }) => {
        return await db.getContentsByCampaignId(input.campaignId);
      }),
    
    listByUser: protectedProcedure
      .input(z.object({ status: z.string().optional() }))
      .query(async ({ ctx, input }) => {
        return await db.getContentsByUserId(ctx.user.id, input.status);
      }),
    
    get: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return await db.getContentById(input.id);
      }),
    
    approve: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await db.approveContent(input.id);
        return { success: true };
      }),
    
    reject: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await db.rejectContent(input.id);
        return { success: true };
      }),
  }),

  // Notifications
  notifications: router({
    list: protectedProcedure
      .input(z.object({ unreadOnly: z.boolean().optional() }))
      .query(async ({ ctx, input }) => {
        return await db.getNotificationsByUserId(ctx.user.id, input.unreadOnly);
      }),
    
    markAsRead: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await db.markNotificationAsRead(input.id);
        return { success: true };
      }),
  }),

  // Dashboard metrics
  dashboard: router({
    metrics: protectedProcedure.query(async ({ ctx }) => {
      return await db.getDashboardMetrics(ctx.user.id);
    }),
  }),

  // Lead scraping and generation
  scraper: router({
    scrapeLeads: protectedProcedure
      .input(z.object({
        campaignId: z.number(),
        query: z.string(),
        location: z.string(),
        maxResults: z.number().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const { scrapeLeads } = await import('./services/leadScraper');
        return await scrapeLeads({
          ...input,
          userId: ctx.user.id,
        });
      }),
  }),

  // Content generation
  generator: router({
    generateForLead: protectedProcedure
      .input(z.object({
        leadId: z.number(),
        campaignId: z.number(),
      }))
      .mutation(async ({ ctx, input }) => {
        const lead = await db.getLeadById(input.leadId);
        if (!lead) {
          throw new Error('Lead not found');
        }
        const { generateContent } = await import('./services/contentGenerator');
        return await generateContent({
          lead,
          campaignId: input.campaignId,
          userId: ctx.user.id,
        });
      }),

    generateForCampaign: protectedProcedure
      .input(z.object({
        campaignId: z.number(),
      }))
      .mutation(async ({ ctx, input }) => {
        const { generateContentForCampaign } = await import('./services/contentGenerator');
        return await generateContentForCampaign(input.campaignId, ctx.user.id);
      }),
  }),

  // LinkedIn publishing
  linkedin: router({
    publish: protectedProcedure
      .input(z.object({
        contentId: z.number(),
      }))
      .mutation(async ({ ctx, input }) => {
        const { publishToLinkedIn } = await import('./services/linkedinPublisher');
        return await publishToLinkedIn(input.contentId, ctx.user.id);
      }),

    batchPublish: protectedProcedure
      .input(z.object({
        contentIds: z.array(z.number()),
      }))
      .mutation(async ({ ctx, input }) => {
        const { batchPublish } = await import('./services/linkedinPublisher');
        return await batchPublish(input.contentIds, ctx.user.id);
      }),
  }),
});

export type AppRouter = typeof appRouter;
