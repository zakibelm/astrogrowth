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

describe("Agents Management", () => {
  const caller = appRouter.createCaller(createMockContext(1));

  it("should list user agents (empty initially)", async () => {
    const result = await caller.agents.list();
    expect(Array.isArray(result)).toBe(true);
  });

  it("should toggle agent on", async () => {
    const result = await caller.agents.toggle({
      agentId: "lead-scraper-linkedin",
      enabled: true,
    });
    expect(result.success).toBe(true);
  });

  it("should toggle agent off", async () => {
    const result = await caller.agents.toggle({
      agentId: "lead-scraper-linkedin",
      enabled: false,
    });
    expect(result.success).toBe(true);
  });

  it("should update agent config", async () => {
    const result = await caller.agents.updateConfig({
      agentId: "copywriter-linkedin",
      llmModel: "claude-sonnet-4",
      systemPrompt: "Custom prompt for testing",
    });
    expect(result.success).toBe(true);
  });

  it("should list user agents after modifications", async () => {
    const result = await caller.agents.list();
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
  });
});

describe("Workflows Management", () => {
  const caller = appRouter.createCaller(createMockContext(1));

  it("should list all workflows", async () => {
    const result = await caller.workflows.list();
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(8); // 8 workflows inserted
  });

  it("should have restaurant-local workflow", async () => {
    const result = await caller.workflows.list();
    const restaurant = result.find((w) => w.workflowId === "restaurant-local");
    expect(restaurant).toBeDefined();
    expect(restaurant?.name).toBe("Restaurant Local");
    expect(restaurant?.icon).toBe("🍽️");
  });

  it("should have correct agent count in workflows", async () => {
    const result = await caller.workflows.list();
    const ecommerce = result.find((w) => w.workflowId === "ecommerce");
    expect(ecommerce).toBeDefined();
    const agentIds = ecommerce?.agentIds as string[];
    expect(agentIds.length).toBeGreaterThan(0);
  });

  it("should activate workflow", async () => {
    const workflows = await caller.workflows.list();
    const firstWorkflow = workflows[0];
    
    const result = await caller.workflows.activate({
      workflowId: firstWorkflow.id,
    });
    expect(result.success).toBe(true);
  });

  it("should list user workflows after activation", async () => {
    const result = await caller.workflows.getUserWorkflows();
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
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
