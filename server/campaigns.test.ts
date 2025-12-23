import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAuthContext(): { ctx: TrpcContext } {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "test-user",
    email: "test@example.com",
    name: "Test User",
    loginMethod: "manus",
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  const ctx: TrpcContext = {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };

  return { ctx };
}

describe("campaigns", () => {
  it("should create a campaign with valid data", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.campaigns.create({
      name: "Test Campaign",
      targetIndustry: "restaurant",
      targetLocation: "Montréal, QC",
    });

    expect(result).toHaveProperty("id");
    expect(typeof result.id).toBe("number");
  });

  it("should list campaigns for authenticated user", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const campaigns = await caller.campaigns.list();

    expect(Array.isArray(campaigns)).toBe(true);
  });

  it("should get dashboard metrics for authenticated user", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const metrics = await caller.dashboard.metrics();

    expect(metrics).toHaveProperty("totalLeads");
    expect(metrics).toHaveProperty("totalContents");
    expect(metrics).toHaveProperty("totalPublished");
    expect(typeof metrics.totalLeads).toBe("number");
    expect(typeof metrics.totalContents).toBe("number");
    expect(typeof metrics.totalPublished).toBe("number");
  });
});

describe("profile", () => {
  it("should get user profile", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const profile = await caller.profile.get();

    expect(profile).toBeDefined();
    if (profile) {
      expect(profile.id).toBeDefined();
      expect(typeof profile.id).toBe("number");
    }
  });

  it("should update user profile", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.profile.update({
      businessName: "Test Business",
      businessType: "restaurant",
      businessLocation: "Montréal, QC",
    });

    expect(result).toEqual({ success: true });
  });
});
