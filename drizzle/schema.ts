import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, decimal, boolean, json } from "drizzle-orm/mysql-core";

// Export des tables de monitoring API
export * from "./schema-api-monitoring";

// Export des tables agents
export * from "./schema-agents";

// Export des tables user agents et workflows
export * from "./schema-user-agents";

/**
 * Core user table backing auth flow.
 * Extended with business profile information for SME owners.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  
  // Business profile fields
  businessName: text("businessName"),
  businessType: varchar("businessType", { length: 100 }), // restaurant, dentiste, agent immobilier, etc.
  businessLocation: text("businessLocation"),
  businessPhone: varchar("businessPhone", { length: 50 }),
  businessWebsite: text("businessWebsite"),
  
  // LinkedIn OAuth tokens (encrypted)
  linkedinAccessToken: text("linkedinAccessToken"),
  linkedinRefreshToken: text("linkedinRefreshToken"),
  linkedinTokenExpiry: timestamp("linkedinTokenExpiry"),
  linkedinConnected: boolean("linkedinConnected").default(false).notNull(),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Marketing campaigns created by users
 */
export const campaigns = mysqlTable("campaigns", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  
  name: varchar("name", { length: 255 }).notNull(),
  targetIndustry: varchar("targetIndustry", { length: 100 }).notNull(), // restaurant, dentiste, etc.
  targetLocation: text("targetLocation").notNull(),
  
  status: mysqlEnum("status", ["draft", "running", "completed", "error"]).default("draft").notNull(),
  
  // Statistics
  totalLeads: int("totalLeads").default(0).notNull(),
  totalContent: int("totalContent").default(0).notNull(),
  totalPublished: int("totalPublished").default(0).notNull(),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  completedAt: timestamp("completedAt"),
});

export type Campaign = typeof campaigns.$inferSelect;
export type InsertCampaign = typeof campaigns.$inferInsert;

/**
 * Leads scraped from Google Maps and enriched
 */
export const leads = mysqlTable("leads", {
  id: int("id").autoincrement().primaryKey(),
  campaignId: int("campaignId").notNull(),
  userId: int("userId").notNull(),
  
  // Business information
  businessName: varchar("businessName", { length: 255 }).notNull(),
  businessType: varchar("businessType", { length: 100 }),
  address: text("address"),
  city: varchar("city", { length: 100 }),
  province: varchar("province", { length: 100 }),
  postalCode: varchar("postalCode", { length: 20 }),
  
  // Contact information (enriched)
  phone: varchar("phone", { length: 50 }),
  email: varchar("email", { length: 320 }),
  website: text("website"),
  
  // Google Maps data
  googleMapsUrl: text("googleMapsUrl"),
  googleRating: decimal("googleRating", { precision: 2, scale: 1 }),
  googleReviews: int("googleReviews"),
  
  // Lead scoring (0-100)
  leadScore: int("leadScore").notNull(),
  
  // Enrichment status
  enriched: boolean("enriched").default(false).notNull(),
  enrichmentError: text("enrichmentError"),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Lead = typeof leads.$inferSelect;
export type InsertLead = typeof leads.$inferInsert;

/**
 * Marketing content generated for leads
 */
export const contents = mysqlTable("contents", {
  id: int("id").autoincrement().primaryKey(),
  leadId: int("leadId").notNull(),
  campaignId: int("campaignId").notNull(),
  userId: int("userId").notNull(),
  
  // Generated content
  textContent: text("textContent").notNull(),
  imageUrl: text("imageUrl"),
  imageS3Key: text("imageS3Key"),
  hashtags: text("hashtags"), // JSON array stored as text
  
  // Content quality
  qualityScore: int("qualityScore").notNull(), // 0-100
  
  // Approval workflow
  status: mysqlEnum("status", ["pending", "approved", "rejected", "published"]).default("pending").notNull(),
  approvedAt: timestamp("approvedAt"),
  rejectedAt: timestamp("rejectedAt"),
  publishedAt: timestamp("publishedAt"),
  
  // LinkedIn publication
  linkedinPostId: text("linkedinPostId"),
  linkedinPostUrl: text("linkedinPostUrl"),
  
  // Engagement metrics (updated from LinkedIn API)
  likes: int("likes").default(0),
  comments: int("comments").default(0),
  shares: int("shares").default(0),
  impressions: int("impressions").default(0),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Content = typeof contents.$inferSelect;
export type InsertContent = typeof contents.$inferInsert;

/**
 * System notifications for the owner
 */
export const notifications = mysqlTable("notifications", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  
  type: mysqlEnum("type", ["campaign_created", "leads_ready", "content_generated", "post_published", "system_error"]).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  message: text("message").notNull(),
  
  read: boolean("read").default(false).notNull(),
  readAt: timestamp("readAt"),
  
  // Related entities
  campaignId: int("campaignId"),
  leadId: int("leadId"),
  contentId: int("contentId"),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Notification = typeof notifications.$inferSelect;
export type InsertNotification = typeof notifications.$inferInsert;

/**
 * Rate limiting for LinkedIn API calls
 */
export const rateLimits = mysqlTable("rateLimits", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().unique(),
  
  // Daily limits
  postsToday: int("postsToday").default(0).notNull(),
  lastPostAt: timestamp("lastPostAt"),
  
  // Reset tracking
  lastResetAt: timestamp("lastResetAt").defaultNow().notNull(),
  
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type RateLimit = typeof rateLimits.$inferSelect;
export type InsertRateLimit = typeof rateLimits.$inferInsert;
