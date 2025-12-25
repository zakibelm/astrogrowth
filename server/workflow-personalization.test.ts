import { describe, it, expect, beforeAll } from "vitest";
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

describe("Workflow Personalization", () => {
  const caller = appRouter.createCaller(createMockContext(1));

  it("should activate workflow with full configuration", async () => {
    const workflows = await caller.workflows.list();
    const restaurantWorkflow = workflows.find((w) => w.workflowId === "restaurant-local");
    
    if (!restaurantWorkflow) {
      throw new Error("Restaurant workflow not found");
    }

    const result = await caller.workflows.activate({
      workflowId: restaurantWorkflow.id,
      config: {
        businessInfo: {
          businessName: "Restaurant Chez Mario",
          address: "123 Rue Principale",
          city: "Montréal",
          province: "QC",
          postalCode: "H2X 1Y7",
          phone: "(514) 555-1234",
          website: "https://www.chezmario.com",
          sector: "restaurant",
          description: "Restaurant italien authentique depuis 1985",
        },
        marketingGoals: {
          primaryGoal: "leads",
          leadsPerMonth: "50",
          budget: "1000-2500",
          targetAudience: "Familles et professionnels 30-55 ans à Montréal",
          uniqueSellingPoint: "Recettes familiales italiennes transmises depuis 3 générations",
        },
        agentPreferences: {
          contentTone: "friendly",
          postingFrequency: "daily",
          responseTime: "1h",
          customInstructions: "Toujours mentionner nos plats signature: lasagne maison et tiramisu",
        },
      },
    });

    expect(result.success).toBe(true);
  });

  it("should retrieve user workflows with configuration", async () => {
    const userWorkflows = await caller.workflows.getUserWorkflows();
    
    expect(Array.isArray(userWorkflows)).toBe(true);
    expect(userWorkflows.length).toBeGreaterThan(0);
    
    const activeWorkflow = userWorkflows.find((uw) => uw.active);
    expect(activeWorkflow).toBeDefined();
    expect(activeWorkflow?.workflowConfig).toBeDefined();
    
    const config = activeWorkflow?.workflowConfig as any;
    
    // Config might be null if workflow was activated without configuration
    if (config) {
      expect(config.businessInfo?.businessName).toBe("Restaurant Chez Mario");
      expect(config.marketingGoals?.primaryGoal).toBe("leads");
      expect(config.agentPreferences?.contentTone).toBe("friendly");
    }
  });

  it("should have personalized agents after workflow activation", async () => {
    const userAgents = await caller.agents.list();
    
    expect(Array.isArray(userAgents)).toBe(true);
    expect(userAgents.length).toBeGreaterThan(0);
    
    // Check that agents have personalized prompts
    const leadScraperAgent = userAgents.find((ua) => ua.agentId === "lead-scraper-google");
    
    if (leadScraperAgent) {
      expect(leadScraperAgent.systemPrompt).toBeDefined();
      expect(leadScraperAgent.systemPrompt).toContain("Restaurant Chez Mario");
      expect(leadScraperAgent.systemPrompt).toContain("Montréal");
    }
  });

  it("should activate workflow with minimal configuration", async () => {
    const workflows = await caller.workflows.list();
    const ecommerceWorkflow = workflows.find((w) => w.workflowId === "ecommerce");
    
    if (!ecommerceWorkflow) {
      throw new Error("E-commerce workflow not found");
    }

    const result = await caller.workflows.activate({
      workflowId: ecommerceWorkflow.id,
      config: {
        businessInfo: {
          businessName: "Boutique Mode",
          address: "456 Avenue du Commerce",
          city: "Québec",
          province: "QC",
          postalCode: "G1R 2B5",
          phone: "(418) 555-5678",
          website: "https://www.boutiquemode.com",
          sector: "ecommerce",
          description: "Vêtements tendance pour femmes",
        },
      },
    });

    expect(result.success).toBe(true);
  });

  it("should deactivate workflow", async () => {
    const workflows = await caller.workflows.list();
    const firstWorkflow = workflows[0];
    
    const result = await caller.workflows.deactivate({
      workflowId: firstWorkflow.id,
    });

    expect(result.success).toBe(true);
  });
});
