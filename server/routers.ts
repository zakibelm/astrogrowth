import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import * as db from "./db";
import * as dbAgents from "./db-agents";

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

  // Platform connections management
  platformConnections: router({
    getStatus: protectedProcedure.query(async ({ ctx }) => {
      const user = await db.getUserById(ctx.user.id);
      if (!user) throw new Error('User not found');
      
      return {
        linkedin: {
          connected: user.linkedinConnected || false,
          status: user.linkedinConnected ? 'connected' : 'disconnected',
        },
        openrouter: {
          connected: true, // TODO: Check from platform_connections table
          status: 'connected',
          usage: '1.2M tokens ce mois',
          credits: '$42.30 restants',
        },
        huggingface: {
          connected: true,
          status: 'connected',
          usage: '500K tokens ce mois',
          credits: 'Gratuit',
        },
        ollama: {
          connected: true,
          status: 'connected',
          usage: 'Local',
          credits: 'Gratuit',
        },
        imagen: {
          connected: true,
          status: 'connected',
          usage: '45/1000 images',
          credits: '$15.80 restants',
        },
        googlemaps: {
          connected: true,
          status: 'connected',
          usage: '1,250 requêtes',
          credits: '$8.50 restants',
        },
      };
    }),
    
    disconnect: protectedProcedure
      .input(z.object({ platform: z.string() }))
      .mutation(async ({ ctx, input }) => {
        // TODO: Implement disconnect logic
        return { success: true, message: `Déconnecté de ${input.platform}` };
      }),
  }),

  // AI Agents management
  agents: router({    list: protectedProcedure.query(async ({ ctx }) => {
      return await dbAgents.getUserAgents(ctx.user.id);
    }),
    
    toggle: protectedProcedure
      .input(z.object({
        agentId: z.string(),
        enabled: z.boolean(),
      }))
      .mutation(async ({ ctx, input }) => {
        return await dbAgents.toggleUserAgent(ctx.user.id, input.agentId, input.enabled);
      }),
    
    updateConfig: protectedProcedure
      .input(z.object({
        agentId: z.string(),
        llmModel: z.string().optional(),
        systemPrompt: z.string().optional(),
        ragDocuments: z.array(z.string()).optional(),
        config: z.record(z.string(), z.any()).optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const { agentId, ...config } = input;
        return await dbAgents.updateUserAgentConfig(ctx.user.id, agentId, config);
      }),
  }),

  // Workflows management
  workflows: router({
    list: publicProcedure.query(async () => {
      return await dbAgents.getAllWorkflows();
    }),
    
    activate: protectedProcedure
      .input(z.object({
        workflowId: z.number(),
        config: z.object({
          businessInfo: z.object({
            businessName: z.string(),
            address: z.string(),
            city: z.string(),
            province: z.string(),
            postalCode: z.string(),
            phone: z.string(),
            website: z.string(),
            sector: z.string(),
            description: z.string(),
          }).optional(),
          marketingGoals: z.object({
            primaryGoal: z.string(),
            leadsPerMonth: z.string(),
            budget: z.string(),
            targetAudience: z.string(),
            uniqueSellingPoint: z.string(),
          }).optional(),
          agentPreferences: z.object({
            contentTone: z.string(),
            postingFrequency: z.string(),
            responseTime: z.string(),
            customInstructions: z.string(),
          }).optional(),
        }).optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        return await dbAgents.activateWorkflow(ctx.user.id, input.workflowId, input.config);
      }),
    
    deactivate: protectedProcedure
      .input(z.object({
        workflowId: z.number(),
      }))
      .mutation(async ({ ctx, input }) => {
        return await dbAgents.deactivateWorkflow(ctx.user.id, input.workflowId);
      }),
    
    getUserWorkflows: protectedProcedure.query(async ({ ctx }) => {
      return await dbAgents.getUserWorkflows(ctx.user.id);
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

  // Custom Workflows
  customWorkflows: router({
    create: protectedProcedure
      .input(z.object({
        name: z.string(),
        description: z.string(),
        mission: z.string(),
        agents: z.array(z.object({
          id: z.string(),
          position: z.number(),
        })),
        totalPrice: z.number(),
      }))
      .mutation(async ({ ctx, input }) => {
        const { createCustomWorkflow } = await import("./db-agents");
        const result = await createCustomWorkflow(
          ctx.user.id,
          input.name,
          input.description,
          input.mission,
          input.agents,
          input.totalPrice
        );
        return { success: true, id: result.id };
      }),

    list: protectedProcedure.query(async ({ ctx }) => {
      const { listCustomWorkflows } = await import("./db-agents");
      return await listCustomWorkflows(ctx.user.id);
    }),
  }),

  // Custom Agents
  customAgents: router({
    create: protectedProcedure
      .input(z.object({
        name: z.string(),
        emoji: z.string(),
        role: z.string(),
        description: z.string(),
        mission: z.string(),
        systemPrompt: z.string(),
        model: z.string(),
        tools: z.array(z.string()),
        department: z.string(),
      }))
      .mutation(async ({ ctx, input }) => {
        // For now, return mock success - will implement proper DB insert later
        return { success: true, id: Date.now() };
      }),

    list: protectedProcedure.query(async ({ ctx }) => {
      // For now, return empty array - will implement proper DB query later
      return [];
    }),
  }),
});

export type AppRouter = typeof appRouter;
