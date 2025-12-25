import { getRedisClient } from '../config/redis';
import { logger } from '../config/logger';

/**
 * Redis-based rate limiting for LinkedIn API and other services
 * Uses sliding window algorithm for accurate rate limiting
 */

export interface RateLimitConfig {
    maxRequests: number; // Maximum number of requests
    windowMs: number; // Time window in milliseconds
}

export interface RateLimitResult {
    allowed: boolean;
    remaining: number;
    resetAt: Date;
    reason?: string;
}

// Predefined rate limit configs
export const RATE_LIMITS = {
    LINKEDIN_POSTS: {
        maxRequests: 100,
        windowMs: 24 * 60 * 60 * 1000, // 24 hours
    },
    LINKEDIN_POST_INTERVAL: {
        maxRequests: 1,
        windowMs: 15 * 60 * 1000, // 15 minutes
    },
    CONTENT_GENERATION: {
        maxRequests: 500,
        windowMs: 24 * 60 * 60 * 1000, // 24 hours
    },
    API_REQUESTS: {
        maxRequests: 1000,
        windowMs: 60 * 60 * 1000, // 1 hour
    },
} as const;

/**
 * Check if request is allowed under rate limit
 */
export async function checkRateLimit(
    key: string,
    config: RateLimitConfig
): Promise<RateLimitResult> {
    try {
        const redis = await getRedisClient();
        const now = Date.now();
        const windowStart = now - config.windowMs;

        // Redis key for this rate limit
        const redisKey = `ratelimit:${key}`;

        // Remove old entries outside the window
        await redis.zremrangebyscore(redisKey, 0, windowStart);

        // Count current requests in window
        const currentCount = await redis.zcard(redisKey);

        // Check if limit exceeded
        if (currentCount >= config.maxRequests) {
            // Get the oldest request timestamp to calculate reset time
            const oldestRequests = await redis.zrange(redisKey, 0, 0, 'WITHSCORES');
            const oldestTimestamp = oldestRequests.length > 1 ? parseInt(oldestRequests[1]) : now;
            const resetAt = new Date(oldestTimestamp + config.windowMs);

            return {
                allowed: false,
                remaining: 0,
                resetAt,
                reason: `Rate limit exceeded: ${config.maxRequests} requests per ${config.windowMs / 1000}s`,
            };
        }

        // Add current request
        await redis.zadd(redisKey, now, `${now}-${Math.random()}`);

        // Set expiry on the key
        await redis.expire(redisKey, Math.ceil(config.windowMs / 1000));

        // Calculate remaining requests
        const remaining = config.maxRequests - currentCount - 1;

        // Calculate reset time (end of current window)
        const resetAt = new Date(now + config.windowMs);

        return {
            allowed: true,
            remaining,
            resetAt,
        };
    } catch (error) {
        logger.error('[RateLimiter] Error checking rate limit:', error);

        // Fail open in case of Redis error (allow the request)
        return {
            allowed: true,
            remaining: 0,
            resetAt: new Date(Date.now() + config.windowMs),
        };
    }
}

/**
 * Check LinkedIn post rate limit for a user
 */
export async function checkLinkedInPostLimit(userId: number): Promise<RateLimitResult> {
    return checkRateLimit(`linkedin:posts:user:${userId}`, RATE_LIMITS.LINKEDIN_POSTS);
}

/**
 * Check LinkedIn post interval (minimum 15 minutes between posts)
 */
export async function checkLinkedInPostInterval(userId: number): Promise<RateLimitResult> {
    return checkRateLimit(`linkedin:interval:user:${userId}`, RATE_LIMITS.LINKEDIN_POST_INTERVAL);
}

/**
 * Check content generation rate limit
 */
export async function checkContentGenerationLimit(userId: number): Promise<RateLimitResult> {
    return checkRateLimit(`content:generation:user:${userId}`, RATE_LIMITS.CONTENT_GENERATION);
}

/**
 * Check API request rate limit
 */
export async function checkApiLimit(identifier: string): Promise<RateLimitResult> {
    return checkRateLimit(`api:${identifier}`, RATE_LIMITS.API_REQUESTS);
}

/**
 * Reset rate limit for a key (admin function)
 */
export async function resetRateLimit(key: string): Promise<void> {
    try {
        const redis = await getRedisClient();
        const redisKey = `ratelimit:${key}`;
        await redis.del(redisKey);
        logger.info(`[RateLimiter] Reset rate limit for key: ${key}`);
    } catch (error) {
        logger.error('[RateLimiter] Error resetting rate limit:', error);
        throw error;
    }
}

/**
 * Get current rate limit status without incrementing
 */
export async function getRateLimitStatus(
    key: string,
    config: RateLimitConfig
): Promise<RateLimitResult> {
    try {
        const redis = await getRedisClient();
        const now = Date.now();
        const windowStart = now - config.windowMs;

        const redisKey = `ratelimit:${key}`;

        // Remove old entries
        await redis.zremrangebyscore(redisKey, 0, windowStart);

        // Count current requests
        const currentCount = await redis.zcard(redisKey);

        // Calculate remaining
        const remaining = Math.max(0, config.maxRequests - currentCount);

        // Get reset time
        const resetAt = new Date(now + config.windowMs);

        return {
            allowed: remaining > 0,
            remaining,
            resetAt,
        };
    } catch (error) {
        logger.error('[RateLimiter] Error getting rate limit status:', error);

        return {
            allowed: true,
            remaining: config.maxRequests,
            resetAt: new Date(Date.now() + config.windowMs),
        };
    }
}

export default {
    checkRateLimit,
    checkLinkedInPostLimit,
    checkLinkedInPostInterval,
    checkContentGenerationLimit,
    checkApiLimit,
    resetRateLimit,
    getRateLimitStatus,
    RATE_LIMITS,
};
