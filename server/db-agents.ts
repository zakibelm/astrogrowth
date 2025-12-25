import { eq, and } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { userAgents, workflows, userWorkflows } from "../drizzle/schema";
import type { InsertUserAgent, InsertWorkflow, InsertUserWorkflow } from "../drizzle/schema";
import { personalizeWorkflowAgents } from "./agent-personalization";

let _db: ReturnType<typeof drizzle> | null = null;

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

const db = drizzle(process.env.DATABASE_URL || "");

/**
 * User Agents - Configuration per user
 */

export async function getUserAgents(userId: number) {
  return await db.select().from(userAgents).where(eq(userAgents.userId, userId));
}

export async function getUserAgent(userId: number, agentId: string) {
  const result = await db
    .select()
    .from(userAgents)
    .where(and(eq(userAgents.userId, userId), eq(userAgents.agentId, agentId)))
    .limit(1);
  return result[0] || null;
}

export async function createUserAgent(data: InsertUserAgent) {
  const result = await db.insert(userAgents).values(data);
  return result;
}

export async function toggleUserAgent(userId: number, agentId: string, enabled: boolean) {
  // Check if agent config exists
  const existing = await getUserAgent(userId, agentId);
  
  if (existing) {
    // Update existing
    await db
      .update(userAgents)
      .set({ enabled, updatedAt: new Date() })
      .where(and(eq(userAgents.userId, userId), eq(userAgents.agentId, agentId)));
  } else {
    // Create new
    await createUserAgent({
      userId,
      agentId,
      enabled,
      llmModel: "gemini-2.0-flash",
    });
  }
  
  return { success: true };
}

export async function updateUserAgentConfig(
  userId: number,
  agentId: string,
  config: {
    llmModel?: string;
    systemPrompt?: string;
    ragDocuments?: string[];
    config?: Record<string, any>;
  }
) {
  const existing = await getUserAgent(userId, agentId);
  
  if (existing) {
    await db
      .update(userAgents)
      .set({ ...config, updatedAt: new Date() })
      .where(and(eq(userAgents.userId, userId), eq(userAgents.agentId, agentId)));
  } else {
    await createUserAgent({
      userId,
      agentId,
      enabled: false,
      llmModel: config.llmModel || "gemini-2.0-flash",
      systemPrompt: config.systemPrompt,
      ragDocuments: config.ragDocuments,
      config: config.config,
    });
  }
  
  return { success: true };
}

/**
 * Workflows - Templates
 */

export async function getAllWorkflows() {
  return await db.select().from(workflows).where(eq(workflows.isActive, true));
}

export async function getWorkflowById(id: number) {
  const result = await db.select().from(workflows).where(eq(workflows.id, id)).limit(1);
  return result[0] || null;
}

export async function getWorkflowByWorkflowId(workflowId: string) {
  const result = await db.select().from(workflows).where(eq(workflows.workflowId, workflowId)).limit(1);
  return result[0] || null;
}

export async function createWorkflow(data: InsertWorkflow) {
  const result = await db.insert(workflows).values(data);
  return result;
}

/**
 * User Workflows - Activations
 */

export async function getUserWorkflows(userId: number) {
  return await db.select().from(userWorkflows).where(eq(userWorkflows.userId, userId));
}

export async function activateWorkflow(
  userId: number,
  workflowId: number,
  config?: {
    businessInfo?: any;
    marketingGoals?: any;
    agentPreferences?: any;
  }
) {
  // Check if already activated
  const existing = await db
    .select()
    .from(userWorkflows)
    .where(and(eq(userWorkflows.userId, userId), eq(userWorkflows.workflowId, workflowId)))
    .limit(1);
  
  if (existing.length > 0) {
    // Reactivate if deactivated
    await db
      .update(userWorkflows)
      .set({ active: true, deactivatedAt: null })
      .where(and(eq(userWorkflows.userId, userId), eq(userWorkflows.workflowId, workflowId)));
  } else {
    // Create new activation
    await db.insert(userWorkflows).values({
      userId,
      workflowId,
      active: true,
      workflowConfig: config,
    });
  }
  
  // Get workflow details
  const workflow = await getWorkflowById(workflowId);
  if (!workflow) {
    throw new Error("Workflow not found");
  }
  
    // Generate personalized prompts for all agents
  const agentIds = workflow.agentIds as string[];
  const personalizedPrompts = personalizeWorkflowAgents(agentIds, config || {});
  
  // Activate all agents in the workflow with personalized prompts
  for (const agentId of agentIds) {
    const personalizedPrompt = personalizedPrompts[agentId];
    
    // Check if agent already exists
    const existing = await db
      .select()
      .from(userAgents)
      .where(and(eq(userAgents.userId, userId), eq(userAgents.agentId, agentId)))
      .limit(1);
    
    if (existing.length > 0) {
      // Update existing agent
      await db
        .update(userAgents)
        .set({
          enabled: true,
          systemPrompt: personalizedPrompt,
        })
        .where(and(eq(userAgents.userId, userId), eq(userAgents.agentId, agentId)));
    } else {
      // Create new agent with personalized prompt
      await db.insert(userAgents).values({
        userId,
        agentId,
        enabled: true,
        systemPrompt: personalizedPrompt,
        llmModel: "gemini-2.0-flash-exp",
      });
    }
  }
  
  return { success: true };
}

export async function deactivateWorkflow(userId: number, workflowId: number) {
  await db
    .update(userWorkflows)
    .set({ active: false, deactivatedAt: new Date() })
    .where(and(eq(userWorkflows.userId, userId), eq(userWorkflows.workflowId, workflowId)));
  
  return { success: true };
}

/**
 * Custom Workflows - User-created workflows
 */

export async function createCustomWorkflow(
  userId: number,
  name: string,
  description: string,
  mission: string,
  agents: Array<{ id: string; position: number }>,
  totalPrice: number
) {
  // Use SQL directly via import to avoid Drizzle typing issues
  const { sql } = await import('drizzle-orm');
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const agentsJson = JSON.stringify(agents);
  const result = await db.execute(
    sql`INSERT INTO custom_workflows (userId, name, description, mission, selectedAgents, monthlyPrice, createdAt, updatedAt)
        VALUES (${userId}, ${name}, ${description}, ${mission}, ${agentsJson}, ${totalPrice}, NOW(), NOW())`
  );
  
  return {
    id: (result as any).insertId || Date.now(),
    name,
    description,
    mission,
    agents,
    totalPrice,
  };
}

export async function listCustomWorkflows(userId: number) {
  const { sql } = await import('drizzle-orm');
  const db = await getDb();
  if (!db) return [];
  
  const rows = await db.execute(
    sql`SELECT id, name, description, mission, selectedAgents, monthlyPrice, createdAt, updatedAt
        FROM custom_workflows
        WHERE userId = ${userId}
        ORDER BY createdAt DESC`
  );
  
  const results = (rows as any).rows || (rows as any) || [];
  return results.map((row: any) => ({
    id: row.id,
    name: row.name,
    description: row.description,
    mission: row.mission,
    agents: JSON.parse(row.selectedAgents || '[]'),
    monthlyPrice: row.monthlyPrice,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    isCustom: true,
  }));
}
