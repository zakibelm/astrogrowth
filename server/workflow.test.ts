import { describe, expect, it, vi, beforeEach } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";
import { type Lead, type InsertContent } from "../drizzle/schema";

// ----------------------------------------------------------------------------
// 1. Mocks
// ----------------------------------------------------------------------------

// Mock leadScraper service
vi.mock("./services/leadScraper", () => {
  return {
    scrapeLeads: vi.fn().mockImplementation(async ({ query, location, userId, campaignId }) => {
        // Return a deterministic mock response without hitting Google Maps
        return {
            success: true,
            leadsCount: 2
        };
    }),
  };
});

// Mock contentGenerator service
vi.mock("./services/contentGenerator", () => {
  return {
    generateContentForCampaign: vi.fn().mockImplementation(async (campaignId, userId) => {
      // Mock generating content for leads - in a real integration test with DB, 
      // we would actually insert into the DB here or let the router doing it if logic was mixed.
      // But the router imports this function. Ideally we want to spy on it or mock implementation 
      // to actually simulate DB inserts if the original function does that.
      
      // Since the original function handles logic + DB, defaulting to a spy that *does* logic 
      // but without external API calls is hard without refactoring.
      // For this test, we will assume the DB part is handled inside the service, 
      // so we will simulate the OUTPUT of the service (DB insertions) manually here for the test context
      // OR we just verify the router calls the service.
      
      // Let's rely on checking if the service was called for now, 
      // OR better: we can manually insert mock content into the DB here to simulate "work done"
      // so the next steps of the test (approval) see data.
      return {
        success: true,
        generatedCount: 2
      };
    }),
  };
});


// ----------------------------------------------------------------------------
// 2. Test Setup (Auth Context)
// ----------------------------------------------------------------------------

function createAuthContext(): { ctx: TrpcContext } {
  // Use a different user ID to avoid conflicts if DB is shared, or clear DB in beforeEach
  // For now using ID 999
  const user = {
    id: 999,
    openId: "integration-test-user",
    email: "test-integration@example.com",
    name: "Integration Tester",
    loginMethod: "manus",
    role: "user" as const,
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  const ctx: TrpcContext = {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as any,
    res: {
      clearCookie: () => {},
    } as any,
  };

  return { ctx };
}

// ----------------------------------------------------------------------------
// 3. Integration Test
// ----------------------------------------------------------------------------

describe("End-to-End Workflow Integration", () => {
  
  // We should ideally mock the DB calls if we don't want to touch the real DB,
  // but for "Integration" usually we want real DB + mocked external APIs.
  // Assuming SQLite/Drizzle setup allows easy writes.
  
  // Note: Since we haven't mocked 'db', these calls go to the REAL database configured in `db.ts`.
  // Ensure your environment supports this (e.g. local sqlite or test container). 
  // If not, we would need to mock `db` calls too. 

  it("should execute the full Campaign -> Lead -> Content flow", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    // --- Step 1: Create Campaign ---
    console.log("Creating campaign...");
    const campaignResult = await caller.campaigns.create({
      name: "Integration Test Campaign",
      targetIndustry: "Bistro",
      targetLocation: "Montreal",
    });
    
    expect(campaignResult).toHaveProperty("id");
    const campaignId = campaignResult.id;
    expect(typeof campaignId).toBe("number");


    // --- Step 2: Scrape Leads (Mocked) ---
    console.log("Triggering scraper...");
    const scrapeResult = await caller.scraper.scrapeLeads({
      campaignId,
      query: "Bistro",
      location: "Montreal"
    });

    expect(scrapeResult.success).toBe(true);
    // Note: Since we mocked `scrapeLeads` to just return success but NOT actually do DB inserts 
    // (because the original function logic is inside the mock which we replaced), 
    // WE need to verify the ROUTER called our mock.
    
    // However, if we want to confirm DB state for the NEXT steps, we need to manually seed the DB 
    // with leads "as if" the scraper did it.
    
    // Inject mock leads into DB manualy for the rest of the flow
    const { createLeadsBatch } = await import("./db"); 
    await createLeadsBatch([
        {
            userId: ctx.user.id,
            campaignId,
            businessName: "Bistro Test 1",
            leadScore: 80,
            enriched: true
        },
        {
            userId: ctx.user.id,
            campaignId,
            businessName: "Bistro Test 2",
            leadScore: 40,
            enriched: true
        }
    ]);
    
    // Verify leads are now in DB
    const leads = await caller.leads.listByCampaign({ campaignId });
    expect(leads.length).toBeGreaterThanOrEqual(2);
    const leadId = leads[0].id;


    // --- Step 3: Generate Content (Mocked) ---
    console.log("Triggering content generation...");
    // We mocked the service, so again, we just get success.
    const genResult = await caller.generator.generateForCampaign({ campaignId });
    expect(genResult.success).toBe(true);

    // Manually inject mock content "as if" generator did it
    const { createContent } = await import("./db");
    const contentId = await createContent({
        userId: ctx.user.id,
        campaignId,
        leadId,
        textContent: "Super bistro à découvrir !",
        qualityScore: 85,
        status: "pending"
    });

    // Verify content exists
    const contents = await caller.contents.listByCampaign({ campaignId });
    expect(contents.length).toBeGreaterThanOrEqual(1);
    expect(contents[0].status).toBe("pending");


    // --- Step 4: Approve Content ---
    console.log("Approving content...");
    const approveResult = await caller.contents.approve({ id: contentId });
    expect(approveResult.success).toBe(true);

    // Verify status updated
    const updatedContent = await caller.contents.get({ id: contentId });
    expect(updatedContent).toBeDefined();
    expect(updatedContent?.status).toBe("approved");

    console.log("Workflow test completed successfully.");
  });
});
