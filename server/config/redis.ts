import Redis from 'ioredis';
import { logger } from './logger';

/**
 * Redis configuration and connection management
 * Used for Pub/Sub, caching, and rate limiting
 */

let redisClient: Redis | null = null;
let redisSubscriber: Redis | null = null;
let redisPublisher: Redis | null = null;

const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';
const REDIS_OPTIONS = {
    maxRetriesPerRequest: 3,
    enableReadyCheck: true,
    connectTimeout: 5000, // 5s timeout
    retryStrategy: (times: number) => {
        if (times > 5) return null; // Stop retrying after 5 attempts if initial connection fails
        const delay = Math.min(times * 50, 2000);
        return delay;
    },
    reconnectOnError: (err: Error) => {
        logger.error('[Redis] Reconnect on error:', err);
        return true;
    },
};

/**
 * Get main Redis client (for caching and rate limiting)
 */
export async function getRedisClient(): Promise<Redis> {
    if (!redisClient) {
        redisClient = new Redis(REDIS_URL, REDIS_OPTIONS);

        redisClient.on('connect', () => {
            logger.info('[Redis] Connected successfully');
        });

        redisClient.on('error', (err) => {
            logger.error('[Redis] Client error:', err);
        });

        redisClient.on('ready', () => {
            logger.info('[Redis] Client ready');
        });
    }

    return redisClient;
}

/**
 * Get Redis subscriber (dedicated connection for Pub/Sub)
 */
export async function getRedisSubscriber(): Promise<Redis> {
    if (!redisSubscriber) {
        redisSubscriber = new Redis(REDIS_URL, REDIS_OPTIONS);

        redisSubscriber.on('connect', () => {
            logger.info('[Redis] Subscriber connected');
        });

        redisSubscriber.on('error', (err) => {
            logger.error('[Redis] Subscriber error:', err);
        });
    }

    return redisSubscriber;
}

/**
 * Get Redis publisher (dedicated connection for Pub/Sub)
 */
export async function getRedisPublisher(): Promise<Redis> {
    if (!redisPublisher) {
        redisPublisher = new Redis(REDIS_URL, REDIS_OPTIONS);

        redisPublisher.on('connect', () => {
            logger.info('[Redis] Publisher connected');
        });

        redisPublisher.on('error', (err) => {
            logger.error('[Redis] Publisher error:', err);
        });
    }

    return redisPublisher;
}

/**
 * Close all Redis connections
 */
export async function closeRedisConnections() {
    const promises = [];

    if (redisClient) {
        promises.push(redisClient.quit());
        redisClient = null;
    }

    if (redisSubscriber) {
        promises.push(redisSubscriber.quit());
        redisSubscriber = null;
    }

    if (redisPublisher) {
        promises.push(redisPublisher.quit());
        redisPublisher = null;
    }

    await Promise.all(promises);
    logger.info('[Redis] All connections closed');
}

/**
 * Check if Redis is available
 */
export async function isRedisAvailable(): Promise<boolean> {
    try {
        const client = await getRedisClient();
        // Add a timeout to the ping
        const pingPromise = client.ping();
        const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Redis ping timeout')), 2000)
        );

        await Promise.race([pingPromise, timeoutPromise]);
        return true;
    } catch (error) {
        // Only log warning, don't error out
        logger.warn('[Redis] Health check failed - Redis unlikely to be running.');
        return false;
    }
}
