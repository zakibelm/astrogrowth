/**
 * Schéma de Base de Données pour Monitoring API et LLM Router
 * 
 * Tables:
 * - platform_connections: Connexions aux plateformes externes
 * - api_usage: Logs d'utilisation des APIs
 * - llm_requests: Historique détaillé des requêtes LLM
 */

import { mysqlTable, int, varchar, text, decimal, timestamp, json, mysqlEnum } from "drizzle-orm/mysql-core";

/**
 * Table: platform_connections
 * Stocke les connexions aux plateformes externes (OAuth, API keys)
 */
export const platformConnections = mysqlTable("platform_connections", {
  id: int("id").primaryKey().autoincrement(),
  userId: int("user_id").notNull(),
  
  // Identification de la plateforme
  provider: varchar("provider", { length: 50 }).notNull(), // 'linkedin', 'openrouter', 'google-maps', etc.
  category: mysqlEnum("category", ["social", "media", "scraping", "llm"]).notNull(),
  
  // Credentials (encrypted)
  apiKey: text("api_key"), // Encrypted
  apiSecret: text("api_secret"), // Encrypted
  accessToken: text("access_token"), // OAuth token
  refreshToken: text("refresh_token"), // OAuth refresh
  
  // Configuration
  config: json("config"), // JSON pour paramètres spécifiques
  
  // Status
  status: mysqlEnum("status", ["connected", "disconnected", "error"]).notNull().default("disconnected"),
  lastError: text("last_error"),
  
  // Timestamps
  connectedAt: timestamp("connected_at"),
  lastUsedAt: timestamp("last_used_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow().onUpdateNow(),
});

/**
 * Table: api_usage
 * Logs d'utilisation des APIs pour tracking et facturation
 */
export const apiUsage = mysqlTable("api_usage", {
  id: int("id").primaryKey().autoincrement(),
  userId: int("user_id").notNull(),
  
  // Identification
  provider: varchar("provider", { length: 50 }).notNull(), // 'openrouter', 'huggingface', 'ollama', etc.
  category: mysqlEnum("category", ["llm", "image", "scraping", "other"]).notNull(),
  
  // Métriques
  requestCount: int("request_count").notNull().default(1),
  tokensUsed: int("tokens_used").default(0),
  creditsUsed: decimal("credits_used", { precision: 10, scale: 4 }).default("0"),
  cost: decimal("cost", { precision: 10, scale: 4 }).default("0"), // En USD
  
  // Contexte
  campaignId: int("campaign_id"),
  leadId: int("lead_id"),
  contentId: int("content_id"),
  
  // Timestamps
  timestamp: timestamp("timestamp").notNull().defaultNow(),
  date: varchar("date", { length: 10 }).notNull(), // Format: YYYY-MM-DD pour agrégation
});

/**
 * Table: llm_requests
 * Historique détaillé des requêtes LLM pour debugging et analytics
 */
export const llmRequests = mysqlTable("llm_requests", {
  id: int("id").primaryKey().autoincrement(),
  userId: int("user_id").notNull(),
  
  // Request
  requestId: varchar("request_id", { length: 100 }).notNull().unique(),
  provider: mysqlEnum("provider", ["openrouter", "huggingface", "ollama"]).notNull(),
  model: varchar("model", { length: 100 }).notNull(),
  
  // Content
  prompt: text("prompt").notNull(),
  response: text("response"),
  
  // Métriques
  promptTokens: int("prompt_tokens").default(0),
  completionTokens: int("completion_tokens").default(0),
  totalTokens: int("total_tokens").default(0),
  cost: decimal("cost", { precision: 10, scale: 6 }).default("0"),
  duration: int("duration").default(0), // En millisecondes
  
  // Status
  status: mysqlEnum("status", ["success", "error", "fallback"]).notNull(),
  errorMessage: text("error_message"),
  fallbackTier: int("fallback_tier"), // 1, 2, ou 3
  
  // Contexte
  campaignId: int("campaign_id"),
  leadId: int("lead_id"),
  contentId: int("content_id"),
  
  // Timestamps
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

/**
 * Table: api_credits
 * Gestion des crédits et limites par utilisateur
 */
export const apiCredits = mysqlTable("api_credits", {
  id: int("id").primaryKey().autoincrement(),
  userId: int("user_id").notNull().unique(),
  
  // Crédits
  totalCredits: decimal("total_credits", { precision: 10, scale: 2 }).notNull().default("100.00"),
  usedCredits: decimal("used_credits", { precision: 10, scale: 2 }).notNull().default("0.00"),
  remainingCredits: decimal("remaining_credits", { precision: 10, scale: 2 }).notNull().default("100.00"),
  
  // Limites mensuelles
  monthlyLimit: decimal("monthly_limit", { precision: 10, scale: 2 }).default("50.00"),
  currentMonthUsage: decimal("current_month_usage", { precision: 10, scale: 2 }).default("0.00"),
  
  // Alertes
  lowCreditThreshold: decimal("low_credit_threshold", { precision: 10, scale: 2 }).default("10.00"),
  alertSent: timestamp("alert_sent"),
  
  // Timestamps
  lastResetAt: timestamp("last_reset_at").notNull().defaultNow(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow().onUpdateNow(),
});
