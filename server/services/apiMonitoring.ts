/**
 * Service de Monitoring API
 * 
 * Fonctionnalités:
 * - Tracking de l'utilisation des APIs
 * - Calcul des coûts en temps réel
 * - Gestion des crédits utilisateur
 * - Alertes de dépassement de seuil
 * - Export des logs
 */

import { getDb } from "../db";
import { apiUsage, apiCredits, llmRequests } from "../../drizzle/schema";
import { eq, and, gte, sql } from "drizzle-orm";

export interface UsageStats {
  totalRequests: number;
  totalTokens: number;
  totalCost: number;
  byProvider: Record<string, {
    requests: number;
    tokens: number;
    cost: number;
  }>;
}

/**
 * Enregistrer l'utilisation d'une API
 */
export async function logApiUsage(params: {
  userId: number;
  provider: string;
  category: 'llm' | 'image' | 'scraping' | 'other';
  tokensUsed?: number;
  cost: number;
  campaignId?: number;
  leadId?: number;
  contentId?: number;
}) {
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

  const db = await getDb();
  if (!db) throw new Error('Database not available');
  await db.insert(apiUsage).values({
    userId: params.userId,
    provider: params.provider,
    category: params.category,
    requestCount: 1,
    tokensUsed: params.tokensUsed || 0,
    creditsUsed: params.cost.toString(),
    cost: params.cost.toString(),
    campaignId: params.campaignId,
    leadId: params.leadId,
    contentId: params.contentId,
    date: today,
  });

  // Mettre à jour les crédits de l'utilisateur
  await updateUserCredits(params.userId, params.cost);
}

/**
 * Mettre à jour les crédits de l'utilisateur
 */
async function updateUserCredits(userId: number, cost: number) {
  // Récupérer les crédits actuels
  const db = await getDb();
  if (!db) throw new Error('Database not available');
  const [credits] = await db
    .select()
    .from(apiCredits)
    .where(eq(apiCredits.userId, userId))
    .limit(1);

  if (!credits) {
    // Créer l'entrée si elle n'existe pas
    await db.insert(apiCredits).values({
      userId,
      totalCredits: "100.00",
      usedCredits: cost.toString(),
      remainingCredits: (100 - cost).toString(),
      monthlyLimit: "50.00",
      currentMonthUsage: cost.toString(),
    });
  } else {
    // Mettre à jour
    const newUsed = parseFloat(credits.usedCredits) + cost;
    const newRemaining = parseFloat(credits.totalCredits) - newUsed;
    const newMonthlyUsage = parseFloat(credits.currentMonthUsage || "0") + cost;

    await db
      .update(apiCredits)
      .set({
        usedCredits: newUsed.toString(),
        remainingCredits: newRemaining.toString(),
        currentMonthUsage: newMonthlyUsage.toString(),
      })
      .where(eq(apiCredits.userId, userId));

    // Vérifier si alerte nécessaire
    const threshold = parseFloat(credits.lowCreditThreshold || "10");
    if (newRemaining <= threshold && !credits.alertSent) {
      await sendLowCreditAlert(userId, newRemaining);
      await db
        .update(apiCredits)
        .set({ alertSent: new Date() })
        .where(eq(apiCredits.userId, userId));
    }
  }
}

/**
 * Envoyer une alerte de crédits faibles
 */
async function sendLowCreditAlert(userId: number, remainingCredits: number) {
  console.log(`[API Monitoring] 🚨 Low credit alert for user ${userId}: $${remainingCredits.toFixed(2)} remaining`);
  // TODO: Envoyer notification via le système de notifications
}

/**
 * Obtenir les statistiques d'utilisation d'un utilisateur
 */
export async function getUserUsageStats(
  userId: number,
  startDate?: Date,
  endDate?: Date
): Promise<UsageStats> {
  const conditions = [eq(apiUsage.userId, userId)];
  
  if (startDate) {
    conditions.push(gte(apiUsage.timestamp, startDate));
  }
  
  if (endDate) {
    conditions.push(sql`${apiUsage.timestamp} <= ${endDate}`);
  }

  const db = await getDb();
  if (!db) throw new Error('Database not available');
  const usage = await db
    .select()
    .from(apiUsage)
    .where(and(...conditions));

  const stats: UsageStats = {
    totalRequests: 0,
    totalTokens: 0,
    totalCost: 0,
    byProvider: {}
  };

  for (const record of usage) {
    stats.totalRequests += record.requestCount;
    stats.totalTokens += record.tokensUsed || 0;
    stats.totalCost += parseFloat(record.cost || "0");

    if (!stats.byProvider[record.provider]) {
      stats.byProvider[record.provider] = {
        requests: 0,
        tokens: 0,
        cost: 0
      };
    }

    stats.byProvider[record.provider].requests += record.requestCount;
    stats.byProvider[record.provider].tokens += record.tokensUsed || 0;
    stats.byProvider[record.provider].cost += parseFloat(record.cost || "0");
  }

  return stats;
}

/**
 * Obtenir les crédits d'un utilisateur
 */
export async function getUserCredits(userId: number) {
  const db = await getDb();
  if (!db) throw new Error('Database not available');
  const [credits] = await db
    .select()
    .from(apiCredits)
    .where(eq(apiCredits.userId, userId))
    .limit(1);

  if (!credits) {
    // Créer l'entrée avec crédits par défaut
    await db.insert(apiCredits).values({
      userId,
      totalCredits: "100.00",
      usedCredits: "0.00",
      remainingCredits: "100.00",
      monthlyLimit: "50.00",
      currentMonthUsage: "0.00",
    });

    return {
      totalCredits: 100,
      usedCredits: 0,
      remainingCredits: 100,
      monthlyLimit: 50,
      currentMonthUsage: 0,
    };
  }

  return {
    totalCredits: parseFloat(credits.totalCredits),
    usedCredits: parseFloat(credits.usedCredits),
    remainingCredits: parseFloat(credits.remainingCredits),
    monthlyLimit: parseFloat(credits.monthlyLimit || "0"),
    currentMonthUsage: parseFloat(credits.currentMonthUsage || "0"),
  };
}

/**
 * Réinitialiser l'utilisation mensuelle (à appeler au début de chaque mois)
 */
export async function resetMonthlyUsage(userId: number) {
  const db = await getDb();
  if (!db) throw new Error('Database not available');
  await db
    .update(apiCredits)
    .set({
      currentMonthUsage: "0.00",
      alertSent: undefined,
      lastResetAt: new Date(),
    })
    .where(eq(apiCredits.userId, userId));
}

/**
 * Obtenir l'historique des requêtes LLM
 */
export async function getLLMRequestHistory(
  userId: number,
  limit = 50
) {
  const db = await getDb();
  if (!db) throw new Error('Database not available');
  return await db
    .select()
    .from(llmRequests)
    .where(eq(llmRequests.userId, userId))
    .orderBy(sql`${llmRequests.createdAt} DESC`)
    .limit(limit);
}
