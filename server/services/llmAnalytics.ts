import { getRedisClient } from '../config/redis';
import { logger } from '../config/logger';
import { circuitBreakerManager } from './circuitBreaker';
import { semanticCache } from './semanticCache';
import { LLMProvider, TaskType } from './llmRouter';

/**
 * LLM Analytics Service
 * Provides insights into LLM usage, costs, and performance
 */

export interface ProviderStats {
    calls: number;
    tokens: number;
    estimatedCostCAD: number;
    avgLatencyMs: number;
    errorRate: number;
}

export interface ModelStats {
    provider: string;
    calls: number;
    tokens: number;
    estimatedCostCAD: number;
    avgLatencyMs: number;
}

export interface TaskTypeStats {
    calls: number;
    tokens: number;
    estimatedCostCAD: number;
    topModels: Array<{ model: string; calls: number }>;
}

export interface DailyUsage {
    date: string;
    calls: number;
    tokens: number;
    estimatedCostCAD: number;
    cacheHits: number;
    cacheMisses: number;
}

export interface LLMAnalyticsSummary {
    totalCalls: number;
    totalTokens: number;
    totalCostCAD: number;
    totalSavingsCAD: number; // From cache
    providers: Record<string, ProviderStats>;
    models: Record<string, ModelStats>;
    taskTypes: Record<string, TaskTypeStats>;
    dailyUsage: DailyUsage[];
    cacheMetrics: {
        hits: number;
        misses: number;
        hitRate: number;
        savingsCAD: number;
    };
    circuitBreakerStatus: Record<string, any>;
}

// Cost per million tokens (CAD)
const COST_PER_MILLION_TOKENS: Record<string, number> = {
    // OpenRouter
    'google/gemini-2.0-flash-exp:free': 0.0,
    'meta-llama/llama-3.3-70b-instruct:free': 0.0,
    'openai/gpt-4o-mini': 0.27, // ~0.20 USD
    'anthropic/claude-sonnet-4': 4.0, // ~3.00 USD

    // Hugging Face (all FREE)
    'mistralai/Mistral-7B-Instruct-v0.2': 0.0,
    'HuggingFaceH4/zephyr-7b-beta': 0.0,
    'mistralai/Mixtral-8x7B-Instruct-v0.1': 0.0,

    // Ollama (local, free)
    'llama3.2:3b': 0.0,
    'phi3:mini': 0.0,

    // Default
    default: 1.33, // ~1.00 USD
};

export class LLMAnalyticsService {
    /**
     * Track LLM usage
     */
    async trackUsage(
        provider: string,
        model: string,
        taskType: string,
        tokens: number,
        latencyMs: number,
        success: boolean
    ): Promise<void> {
        try {
            const redis = await getRedisClient();
            const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

            // Track by provider
            await redis.hincrby(`llm:usage:provider:${provider}:${today}`, 'calls', 1);
            await redis.hincrby(`llm:usage:provider:${provider}:${today}`, 'tokens', tokens);
            await redis.hincrby(`llm:usage:provider:${provider}:${today}`, 'latencyMs', latencyMs);
            if (!success) {
                await redis.hincrby(`llm:usage:provider:${provider}:${today}`, 'errors', 1);
            }

            // Track by model
            await redis.hincrby(`llm:usage:model:${model}:${today}`, 'calls', 1);
            await redis.hincrby(`llm:usage:model:${model}:${today}`, 'tokens', tokens);
            await redis.hincrby(`llm:usage:model:${model}:${today}`, 'latencyMs', latencyMs);

            // Track by task type
            await redis.hincrby(`llm:usage:taskType:${taskType}:${today}`, 'calls', 1);
            await redis.hincrby(`llm:usage:taskType:${taskType}:${today}`, 'tokens', tokens);

            // Track daily totals
            await redis.hincrby(`llm:usage:daily:${today}`, 'calls', 1);
            await redis.hincrby(`llm:usage:daily:${today}`, 'tokens', tokens);

            // Set expiry (30 days)
            const expiry = 30 * 24 * 60 * 60;
            await redis.expire(`llm:usage:provider:${provider}:${today}`, expiry);
            await redis.expire(`llm:usage:model:${model}:${today}`, expiry);
            await redis.expire(`llm:usage:taskType:${taskType}:${today}`, expiry);
            await redis.expire(`llm:usage:daily:${today}`, expiry);
        } catch (error) {
            logger.error('[LLMAnalytics] Error tracking usage:', error);
        }
    }

    /**
     * Get analytics summary
     */
    async getAnalyticsSummary(days: number = 7): Promise<LLMAnalyticsSummary> {
        try {
            const redis = await getRedisClient();

            const providers: Record<string, ProviderStats> = {};
            const models: Record<string, ModelStats> = {};
            const taskTypes: Record<string, TaskTypeStats> = {};
            const dailyUsage: DailyUsage[] = [];

            let totalCalls = 0;
            let totalTokens = 0;
            let totalCostCAD = 0;

            // Get data for last N days
            for (let i = 0; i < days; i++) {
                const date = new Date();
                date.setDate(date.getDate() - i);
                const dateStr = date.toISOString().split('T')[0];

                // Daily totals
                const daily = await redis.hgetall(`llm:usage:daily:${dateStr}`);
                if (daily && Object.keys(daily).length > 0) {
                    const calls = parseInt(daily.calls || '0');
                    const tokens = parseInt(daily.tokens || '0');

                    dailyUsage.push({
                        date: dateStr,
                        calls,
                        tokens,
                        estimatedCostCAD: 0, // Will calculate below
                        cacheHits: 0,
                        cacheMisses: 0,
                    });

                    totalCalls += calls;
                    totalTokens += tokens;
                }

                // Provider stats
                for (const provider of Object.values(LLMProvider)) {
                    const providerData = await redis.hgetall(`llm:usage:provider:${provider}:${dateStr}`);
                    if (providerData && Object.keys(providerData).length > 0) {
                        if (!providers[provider]) {
                            providers[provider] = {
                                calls: 0,
                                tokens: 0,
                                estimatedCostCAD: 0,
                                avgLatencyMs: 0,
                                errorRate: 0,
                            };
                        }

                        const calls = parseInt(providerData.calls || '0');
                        const tokens = parseInt(providerData.tokens || '0');
                        const latencyMs = parseInt(providerData.latencyMs || '0');
                        const errors = parseInt(providerData.errors || '0');

                        providers[provider].calls += calls;
                        providers[provider].tokens += tokens;
                        providers[provider].avgLatencyMs += latencyMs;
                        providers[provider].errorRate += errors;
                    }
                }

                // Model stats (scan pattern)
                const modelKeys = await redis.keys(`llm:usage:model:*:${dateStr}`);
                for (const key of modelKeys) {
                    const modelName = key.split(':')[3]; // Extract model name
                    const modelData = await redis.hgetall(key);

                    if (modelData && Object.keys(modelData).length > 0) {
                        if (!models[modelName]) {
                            models[modelName] = {
                                provider: this.getProviderFromModel(modelName),
                                calls: 0,
                                tokens: 0,
                                estimatedCostCAD: 0,
                                avgLatencyMs: 0,
                            };
                        }

                        const calls = parseInt(modelData.calls || '0');
                        const tokens = parseInt(modelData.tokens || '0');
                        const latencyMs = parseInt(modelData.latencyMs || '0');
                        const costPerMillion = COST_PER_MILLION_TOKENS[modelName] || COST_PER_MILLION_TOKENS.default;
                        const cost = (tokens / 1000000) * costPerMillion;

                        models[modelName].calls += calls;
                        models[modelName].tokens += tokens;
                        models[modelName].estimatedCostCAD += cost;
                        models[modelName].avgLatencyMs += latencyMs;

                        totalCostCAD += cost;
                    }
                }

                // Task type stats
                for (const taskType of Object.values(TaskType)) {
                    const taskData = await redis.hgetall(`llm:usage:taskType:${taskType}:${dateStr}`);
                    if (taskData && Object.keys(taskData).length > 0) {
                        if (!taskTypes[taskType]) {
                            taskTypes[taskType] = {
                                calls: 0,
                                tokens: 0,
                                estimatedCostCAD: 0,
                                topModels: [],
                            };
                        }

                        const calls = parseInt(taskData.calls || '0');
                        const tokens = parseInt(taskData.tokens || '0');

                        taskTypes[taskType].calls += calls;
                        taskTypes[taskType].tokens += tokens;
                    }
                }
            }

            // Calculate averages
            Object.values(providers).forEach((p) => {
                if (p.calls > 0) {
                    p.avgLatencyMs = Math.round(p.avgLatencyMs / p.calls);
                    p.errorRate = Math.round((p.errorRate / p.calls) * 100) / 100;
                }
            });

            Object.values(models).forEach((m) => {
                if (m.calls > 0) {
                    m.avgLatencyMs = Math.round(m.avgLatencyMs / m.calls);
                }
            });

            // Get cache metrics
            const cacheMetrics = await semanticCache.getMetrics();

            // Get circuit breaker status
            const circuitBreakerStatus = circuitBreakerManager.getAllStatus();

            return {
                totalCalls,
                totalTokens,
                totalCostCAD: Math.round(totalCostCAD * 100) / 100,
                totalSavingsCAD: cacheMetrics.estimatedSavingsUSD * 1.33, // USD to CAD
                providers,
                models,
                taskTypes,
                dailyUsage: dailyUsage.reverse(), // Oldest first
                cacheMetrics: {
                    hits: cacheMetrics.hits,
                    misses: cacheMetrics.misses,
                    hitRate: cacheMetrics.hitRate,
                    savingsCAD: cacheMetrics.estimatedSavingsUSD * 1.33,
                },
                circuitBreakerStatus,
            };
        } catch (error) {
            logger.error('[LLMAnalytics] Error getting analytics summary:', error);
            throw error;
        }
    }

    /**
     * Get provider from model name
     */
    private getProviderFromModel(model: string): string {
        if (model.startsWith('google/') || model.startsWith('anthropic/') || model.startsWith('openai/') || model.startsWith('meta-llama/')) {
            return 'openrouter';
        }
        if (model.includes('mistral') || model.includes('zephyr')) {
            return 'huggingface';
        }
        return 'ollama';
    }

    /**
     * Get cost forecast
     */
    async getForecast(horizonDays: number = 30): Promise<{
        currentMonthlyCAD: number;
        projectedMonthlyCAD: number;
        dailyForecast: Array<{ day: number; estimatedCostCAD: number }>;
    }> {
        // Get last 30 days usage
        const summary = await this.getAnalyticsSummary(30);

        // Calculate daily average
        const dailyAvg = summary.totalCostCAD / 30;

        // Assume 10% month-over-month growth
        const growthRate = 0.10 / 30; // Daily growth rate

        const dailyForecast = [];
        for (let day = 1; day <= horizonDays; day++) {
            const projectedCost = dailyAvg * (1 + growthRate * day);
            dailyForecast.push({
                day,
                estimatedCostCAD: Math.round(projectedCost * 100) / 100,
            });
        }

        const projectedMonthlyCAD = dailyForecast.reduce((sum, d) => sum + d.estimatedCostCAD, 0);

        return {
            currentMonthlyCAD: Math.round(summary.totalCostCAD * 100) / 100,
            projectedMonthlyCAD: Math.round(projectedMonthlyCAD * 100) / 100,
            dailyForecast,
        };
    }
}

export const llmAnalytics = new LLMAnalyticsService();

export default LLMAnalyticsService;
