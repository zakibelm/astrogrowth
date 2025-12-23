import { eq, desc, and, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { 
  InsertUser, users, 
  campaigns, Campaign, InsertCampaign,
  leads, Lead, InsertLead,
  contents, Content, InsertContent,
  notifications, Notification, InsertNotification,
  rateLimits, RateLimit, InsertRateLimit
} from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

// ============================================================================
// USER MANAGEMENT
// ============================================================================

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod", "businessName", "businessType", "businessLocation", "businessPhone", "businessWebsite"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function getUserById(userId: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(users).where(eq(users.id, userId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function updateUserProfile(userId: number, profile: Partial<InsertUser>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(users).set(profile).where(eq(users.id, userId));
}

export async function updateLinkedInTokens(
  userId: number, 
  accessToken: string, 
  refreshToken: string, 
  expiresIn: number
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const expiry = new Date(Date.now() + expiresIn * 1000);
  
  await db.update(users).set({
    linkedinAccessToken: accessToken,
    linkedinRefreshToken: refreshToken,
    linkedinTokenExpiry: expiry,
    linkedinConnected: true,
  }).where(eq(users.id, userId));
}

// ============================================================================
// CAMPAIGN MANAGEMENT
// ============================================================================

export async function createCampaign(campaign: InsertCampaign): Promise<number> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(campaigns).values(campaign);
  return Number(result[0].insertId);
}

export async function getCampaignsByUserId(userId: number): Promise<Campaign[]> {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(campaigns).where(eq(campaigns.userId, userId)).orderBy(desc(campaigns.createdAt));
}

export async function getCampaignById(campaignId: number): Promise<Campaign | undefined> {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(campaigns).where(eq(campaigns.id, campaignId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function updateCampaign(campaignId: number, updates: Partial<Campaign>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(campaigns).set(updates).where(eq(campaigns.id, campaignId));
}

export async function updateCampaignStats(campaignId: number, stats: { totalLeads?: number; totalContent?: number; totalPublished?: number }) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(campaigns).set(stats).where(eq(campaigns.id, campaignId));
}

// ============================================================================
// LEAD MANAGEMENT
// ============================================================================

export async function createLead(lead: InsertLead): Promise<number> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(leads).values(lead);
  return Number(result[0].insertId);
}

export async function createLeadsBatch(leadsList: InsertLead[]): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  if (leadsList.length === 0) return;
  await db.insert(leads).values(leadsList);
}

export async function getLeadsByCampaignId(campaignId: number): Promise<Lead[]> {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(leads).where(eq(leads.campaignId, campaignId)).orderBy(desc(leads.leadScore));
}

export async function getLeadById(leadId: number): Promise<Lead | undefined> {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(leads).where(eq(leads.id, leadId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function updateLead(leadId: number, updates: Partial<Lead>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(leads).set(updates).where(eq(leads.id, leadId));
}

// ============================================================================
// CONTENT MANAGEMENT
// ============================================================================

export async function createContent(content: InsertContent): Promise<number> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(contents).values(content);
  return Number(result[0].insertId);
}

export async function getContentsByCampaignId(campaignId: number): Promise<Content[]> {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(contents).where(eq(contents.campaignId, campaignId)).orderBy(desc(contents.createdAt));
}

export async function getContentsByUserId(userId: number, status?: string): Promise<Content[]> {
  const db = await getDb();
  if (!db) return [];

  if (status) {
    return await db.select().from(contents)
      .where(and(eq(contents.userId, userId), eq(contents.status, status as any)))
      .orderBy(desc(contents.createdAt));
  }

  return await db.select().from(contents).where(eq(contents.userId, userId)).orderBy(desc(contents.createdAt));
}

export async function getContentById(contentId: number): Promise<Content | undefined> {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(contents).where(eq(contents.id, contentId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function updateContent(contentId: number, updates: Partial<Content>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(contents).set(updates).where(eq(contents.id, contentId));
}

export async function approveContent(contentId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(contents).set({
    status: 'approved',
    approvedAt: new Date(),
  }).where(eq(contents.id, contentId));
}

export async function rejectContent(contentId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(contents).set({
    status: 'rejected',
    rejectedAt: new Date(),
  }).where(eq(contents.id, contentId));
}

export async function publishContent(contentId: number, linkedinPostId: string, linkedinPostUrl: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(contents).set({
    status: 'published',
    publishedAt: new Date(),
    linkedinPostId,
    linkedinPostUrl,
  }).where(eq(contents.id, contentId));
}

// ============================================================================
// NOTIFICATIONS
// ============================================================================

export async function createNotification(notification: InsertNotification): Promise<number> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(notifications).values(notification);
  return Number(result[0].insertId);
}

export async function getNotificationsByUserId(userId: number, unreadOnly: boolean = false): Promise<Notification[]> {
  const db = await getDb();
  if (!db) return [];

  if (unreadOnly) {
    return await db.select().from(notifications)
      .where(and(eq(notifications.userId, userId), eq(notifications.read, false)))
      .orderBy(desc(notifications.createdAt));
  }

  return await db.select().from(notifications).where(eq(notifications.userId, userId)).orderBy(desc(notifications.createdAt));
}

export async function markNotificationAsRead(notificationId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(notifications).set({
    read: true,
    readAt: new Date(),
  }).where(eq(notifications.id, notificationId));
}

// ============================================================================
// RATE LIMITING
// ============================================================================

export async function getRateLimit(userId: number): Promise<RateLimit | undefined> {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(rateLimits).where(eq(rateLimits.userId, userId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function incrementPostCount(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const existing = await getRateLimit(userId);
  
  if (!existing) {
    await db.insert(rateLimits).values({
      userId,
      postsToday: 1,
      lastPostAt: new Date(),
      lastResetAt: new Date(),
    });
  } else {
    await db.update(rateLimits).set({
      postsToday: existing.postsToday + 1,
      lastPostAt: new Date(),
    }).where(eq(rateLimits.userId, userId));
  }
}

export async function resetDailyLimits(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(rateLimits).set({
    postsToday: 0,
    lastResetAt: new Date(),
  }).where(eq(rateLimits.userId, userId));
}

// ============================================================================
// DASHBOARD METRICS
// ============================================================================

export async function getDashboardMetrics(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const [totalLeadsResult] = await db.select({ count: sql<number>`count(*)` })
    .from(leads)
    .where(eq(leads.userId, userId));

  const [totalContentsResult] = await db.select({ count: sql<number>`count(*)` })
    .from(contents)
    .where(eq(contents.userId, userId));

  const [publishedResult] = await db.select({ count: sql<number>`count(*)` })
    .from(contents)
    .where(and(eq(contents.userId, userId), eq(contents.status, 'published')));

  const [engagementResult] = await db.select({ 
    totalLikes: sql<number>`sum(${contents.likes})`,
    totalComments: sql<number>`sum(${contents.comments})`,
    totalShares: sql<number>`sum(${contents.shares})`,
    totalImpressions: sql<number>`sum(${contents.impressions})`,
  }).from(contents).where(eq(contents.userId, userId));

  return {
    totalLeads: Number(totalLeadsResult?.count || 0),
    totalContents: Number(totalContentsResult?.count || 0),
    totalPublished: Number(publishedResult?.count || 0),
    totalLikes: Number(engagementResult?.totalLikes || 0),
    totalComments: Number(engagementResult?.totalComments || 0),
    totalShares: Number(engagementResult?.totalShares || 0),
    totalImpressions: Number(engagementResult?.totalImpressions || 0),
  };
}
