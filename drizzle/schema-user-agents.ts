import { mysqlTable, int, varchar, text, timestamp, boolean, json } from "drizzle-orm/mysql-core";

/**
 * User-specific agent configurations
 * Tracks which agents are enabled for each user and their custom settings
 */
export const userAgents = mysqlTable("user_agents", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  
  // Agent identification (matches frontend agent IDs)
  agentId: varchar("agentId", { length: 100 }).notNull(), // 'lead-scraper-linkedin', 'copywriter-instagram', etc.
  
  // Status
  enabled: boolean("enabled").default(false).notNull(),
  
  // LLM Configuration (overrides defaults)
  llmModel: varchar("llmModel", { length: 50 }).notNull().default("gemini-2.0-flash"), // 'gemini-2.0-flash', 'claude-sonnet-4', 'llama-3.3-70b', 'gpt-4', 'imagen-3'
  systemPrompt: text("systemPrompt"), // Custom system prompt (null = use default)
  
  // RAG Documents (S3 URLs)
  ragDocuments: json("ragDocuments").$type<string[]>(),
  
  // Custom configuration (agent-specific settings)
  config: json("config").$type<Record<string, any>>(),
  
  // Metadata
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type UserAgent = typeof userAgents.$inferSelect;
export type InsertUserAgent = typeof userAgents.$inferInsert;

/**
 * Workflow templates (pre-configured agent groups)
 */
export const workflows = mysqlTable("workflows", {
  id: int("id").autoincrement().primaryKey(),
  
  // Workflow identification
  workflowId: varchar("workflowId", { length: 100 }).notNull().unique(), // 'restaurant-local', 'ecommerce', etc.
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description").notNull(),
  icon: varchar("icon", { length: 10 }).notNull(), // Emoji
  
  // Target audience
  targetSector: varchar("targetSector", { length: 100 }).notNull(), // 'restaurant', 'ecommerce', 'b2b', etc.
  
  // Agents included in this workflow (array of agentIds)
  agentIds: json("agentIds").$type<string[]>().notNull(),
  
  // Estimated metrics
  estimatedTimeSaved: varchar("estimatedTimeSaved", { length: 50 }), // "10h/semaine"
  estimatedROI: varchar("estimatedROI", { length: 50 }), // "3x en 6 mois"
  
  // Pricing
  monthlyPrice: int("monthlyPrice"), // in CAD cents (59900 = 599.00$)
  
  // Metadata
  isActive: boolean("isActive").default(true).notNull(),
  sortOrder: int("sortOrder").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Workflow = typeof workflows.$inferSelect;
export type InsertWorkflow = typeof workflows.$inferInsert;

/**
 * User workflow activations
 * Tracks which workflows each user has activated
 */
export const userWorkflows = mysqlTable("user_workflows", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  workflowId: int("workflowId").notNull(), // References workflows.id
  
  // Configuration
  workflowConfig: json("workflowConfig").$type<{
    businessInfo?: {
      businessName: string;
      address: string;
      city: string;
      province: string;
      postalCode: string;
      phone: string;
      website: string;
      sector: string;
      description: string;
    };
    marketingGoals?: {
      primaryGoal: string;
      leadsPerMonth: string;
      budget: string;
      targetAudience: string;
      uniqueSellingPoint: string;
    };
    agentPreferences?: {
      contentTone: string;
      postingFrequency: string;
      responseTime: string;
      customInstructions: string;
    };
  }>(),
  
  // Status
  active: boolean("active").default(true).notNull(),
  
  // Activation metadata
  activatedAt: timestamp("activatedAt").defaultNow().notNull(),
  deactivatedAt: timestamp("deactivatedAt"),
});

export type UserWorkflow = typeof userWorkflows.$inferSelect;
export type InsertUserWorkflow = typeof userWorkflows.$inferInsert;
