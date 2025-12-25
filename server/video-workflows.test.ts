import { describe, it, expect } from "vitest";
import { appRouter } from "./routers";
import type { Context } from "./_core/context";
import type { Request, Response } from "express";

// Mock context for protected procedures
function createMockContext(userId: number): Context {
  return {
    req: {} as Request,
    res: {} as Response,
    user: {
      id: userId,
      openId: "test-open-id",
      name: "Test User",
      email: "test@example.com",
      avatar: null,
      role: "user",
      businessName: null,
      businessType: null,
      businessLocation: null,
      businessPhone: null,
      businessWebsite: null,
      linkedinConnected: false,
      linkedinAccessToken: null,
      linkedinRefreshToken: null,
      linkedinTokenExpiry: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  };
}

describe("Video Workflows (Veo 3 & Wan 2)", () => {
  const caller = appRouter.createCaller(createMockContext(1));

  it("should list video workflows (Reels & Stories)", async () => {
    const workflows = await caller.workflows.list();
    
    expect(Array.isArray(workflows)).toBe(true);
    
    // Check Reels Creator workflow
    const reelsWorkflow = workflows.find((w) => w.workflowId === "reels-creator");
    expect(reelsWorkflow).toBeDefined();
    expect(reelsWorkflow?.name).toBe("Créateur de Reels");
    expect(reelsWorkflow?.icon).toBe("🎬");
    expect(reelsWorkflow?.monthlyPrice).toBe(89900); // 899.00$ CAD
    
    // Check Stories Creator workflow
    const storiesWorkflow = workflows.find((w) => w.workflowId === "stories-creator");
    expect(storiesWorkflow).toBeDefined();
    expect(storiesWorkflow?.name).toBe("Créateur de Stories");
    expect(storiesWorkflow?.icon).toBe("📱");
    expect(storiesWorkflow?.monthlyPrice).toBe(69900); // 699.00$ CAD
  });

  it("should have correct video agents in Reels workflow", async () => {
    const workflows = await caller.workflows.list();
    const reelsWorkflow = workflows.find((w) => w.workflowId === "reels-creator");
    
    expect(reelsWorkflow).toBeDefined();
    
    const agentIds = reelsWorkflow?.agentIds as string[];
    expect(agentIds).toContain("scriptwriter-reels");
    expect(agentIds).toContain("veo3-generator");
    expect(agentIds).toContain("video-editor-reels");
    expect(agentIds).toContain("hashtag-optimizer-video");
    expect(agentIds).toContain("multi-platform-publisher");
    expect(agentIds.length).toBe(5);
  });

  it("should have correct video agents in Stories workflow", async () => {
    const workflows = await caller.workflows.list();
    const storiesWorkflow = workflows.find((w) => w.workflowId === "stories-creator");
    
    expect(storiesWorkflow).toBeDefined();
    
    const agentIds = storiesWorkflow?.agentIds as string[];
    expect(agentIds).toContain("story-designer");
    expect(agentIds).toContain("wan2-generator");
    expect(agentIds).toContain("text-overlay-agent");
    expect(agentIds).toContain("music-selector");
    expect(agentIds).toContain("auto-publisher-stories");
    expect(agentIds.length).toBe(5);
  });

  it("should activate Reels workflow with video content configuration", async () => {
    const workflows = await caller.workflows.list();
    const reelsWorkflow = workflows.find((w) => w.workflowId === "reels-creator");
    
    if (!reelsWorkflow) {
      throw new Error("Reels workflow not found");
    }

    const result = await caller.workflows.activate({
      workflowId: reelsWorkflow.id,
      config: {
        businessInfo: {
          businessName: "Studio Créatif",
          address: "789 Rue des Artistes",
          city: "Montréal",
          province: "QC",
          postalCode: "H3B 2Y9",
          phone: "(514) 555-9999",
          website: "https://www.studiocreatif.com",
          sector: "content-creation",
          description: "Studio de création de contenu vidéo viral",
        },
        marketingGoals: {
          primaryGoal: "brand-awareness",
          leadsPerMonth: "100",
          budget: "2500-5000",
          targetAudience: "Créateurs de contenu 18-35 ans",
          uniqueSellingPoint: "Reels viraux générés par IA en quelques minutes",
        },
        agentPreferences: {
          contentTone: "energetic",
          postingFrequency: "daily",
          responseTime: "instant",
          customInstructions: "Privilégier les hooks percutants et les transitions dynamiques",
        },
      },
    });

    expect(result.success).toBe(true);
  });

  it("should activate Stories workflow with minimal configuration", async () => {
    const workflows = await caller.workflows.list();
    const storiesWorkflow = workflows.find((w) => w.workflowId === "stories-creator");
    
    if (!storiesWorkflow) {
      throw new Error("Stories workflow not found");
    }

    const result = await caller.workflows.activate({
      workflowId: storiesWorkflow.id,
      config: {
        businessInfo: {
          businessName: "Boutique Tendance",
          address: "321 Boulevard Mode",
          city: "Québec",
          province: "QC",
          postalCode: "G1K 3X2",
          phone: "(418) 555-7777",
          website: "https://www.boutiquetendance.com",
          sector: "ecommerce",
          description: "Mode féminine tendance",
        },
      },
    });

    expect(result.success).toBe(true);
  });

  it("should have personalized video agents after activation", async () => {
    const userAgents = await caller.agents.list();
    
    expect(Array.isArray(userAgents)).toBe(true);
    
    // Check Veo 3 generator agent
    const veo3Agent = userAgents.find((ua) => ua.agentId === "veo3-generator");
    if (veo3Agent) {
      expect(veo3Agent.systemPrompt).toBeDefined();
      expect(veo3Agent.systemPrompt).toContain("Studio Créatif");
      expect(veo3Agent.systemPrompt).toContain("Veo 3");
    }
    
    // Check Wan 2 generator agent
    const wan2Agent = userAgents.find((ua) => ua.agentId === "wan2-generator");
    if (wan2Agent) {
      expect(wan2Agent.systemPrompt).toBeDefined();
      expect(wan2Agent.systemPrompt).toContain("Boutique Tendance");
      expect(wan2Agent.systemPrompt).toContain("Wan 2");
    }
  });
});
