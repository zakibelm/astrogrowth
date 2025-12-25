import { getRedisPublisher, getRedisSubscriber } from '../config/redis';
import { logger } from '../config/logger';

/**
 * Redis Pub/Sub service for decoupling services
 * Events: leads.ready, content.ready, content.approved, post.published
 */

// Event types
export enum PubSubEvent {
    LEADS_READY = 'leads.ready',
    CONTENT_READY = 'content.ready',
    CONTENT_APPROVED = 'content.approved',
    POST_PUBLISHED = 'post.published',
    CAMPAIGN_COMPLETED = 'campaign.completed',
}

// Event payloads
export interface LeadsReadyPayload {
    campaignId: number;
    userId: number;
    leadsCount: number;
    leadIds: number[];
}

export interface ContentReadyPayload {
    campaignId: number;
    userId: number;
    contentId: number;
    leadId: number;
    qualityScore: number;
    autoApproved: boolean;
}

export interface ContentApprovedPayload {
    contentId: number;
    userId: number;
    campaignId: number;
    approvedBy: 'user' | 'system';
}

export interface PostPublishedPayload {
    contentId: number;
    userId: number;
    campaignId: number;
    postId: string;
    postUrl: string;
    platform: 'linkedin' | 'instagram';
}

export interface CampaignCompletedPayload {
    campaignId: number;
    userId: number;
    totalLeads: number;
    totalContent: number;
    totalPublished: number;
}

type EventPayload =
    | LeadsReadyPayload
    | ContentReadyPayload
    | ContentApprovedPayload
    | PostPublishedPayload
    | CampaignCompletedPayload;

type EventHandler = (payload: EventPayload) => Promise<void> | void;

// Registry of event handlers
const eventHandlers: Map<string, EventHandler[]> = new Map();

// Flag to track if subscriber is initialized
let isSubscriberInitialized = false;

/**
 * Initialize Pub/Sub subscriber
 */
export async function initSubscriber() {
    if (isSubscriberInitialized) {
        return;
    }

    try {
        const subscriber = await getRedisSubscriber();

        // Handle incoming messages
        subscriber.on('message', async (channel: string, message: string) => {
            try {
                const payload = JSON.parse(message);
                logger.info(`[PubSub] Received event: ${channel}`, { payload });

                // Get handlers for this event
                const handlers = eventHandlers.get(channel) || [];

                // Execute all handlers
                await Promise.allSettled(
                    handlers.map(async (handler) => {
                        try {
                            await handler(payload);
                        } catch (error) {
                            logger.error(`[PubSub] Handler error for ${channel}:`, error);
                        }
                    })
                );
            } catch (error) {
                logger.error(`[PubSub] Error processing message on ${channel}:`, error);
            }
        });

        subscriber.on('subscribe', (channel) => {
            logger.info(`[PubSub] Subscribed to channel: ${channel}`);
        });

        subscriber.on('error', (error) => {
            logger.error('[PubSub] Subscriber error:', error);
        });

        isSubscriberInitialized = true;
        logger.info('[PubSub] Subscriber initialized');
    } catch (error) {
        logger.error('[PubSub] Failed to initialize subscriber:', error);
        throw error;
    }
}

/**
 * Subscribe to an event
 */
export async function subscribe(event: PubSubEvent, handler: EventHandler) {
    // Initialize subscriber if not done yet
    if (!isSubscriberInitialized) {
        await initSubscriber();
    }

    // Add handler to registry
    const handlers = eventHandlers.get(event) || [];
    handlers.push(handler);
    eventHandlers.set(event, handlers);

    // Subscribe to channel
    const subscriber = await getRedisSubscriber();
    await subscriber.subscribe(event);

    logger.info(`[PubSub] Added handler for event: ${event}`);
}

/**
 * Publish an event
 */
export async function publish(event: PubSubEvent, payload: EventPayload) {
    try {
        const publisher = await getRedisPublisher();
        const message = JSON.stringify(payload);

        await publisher.publish(event, message);

        logger.info(`[PubSub] Published event: ${event}`, { payload });
    } catch (error) {
        logger.error(`[PubSub] Failed to publish event ${event}:`, error);
        throw error;
    }
}

/**
 * Publish LEADS_READY event
 */
export async function publishLeadsReady(payload: LeadsReadyPayload) {
    await publish(PubSubEvent.LEADS_READY, payload);
}

/**
 * Publish CONTENT_READY event
 */
export async function publishContentReady(payload: ContentReadyPayload) {
    await publish(PubSubEvent.CONTENT_READY, payload);
}

/**
 * Publish CONTENT_APPROVED event
 */
export async function publishContentApproved(payload: ContentApprovedPayload) {
    await publish(PubSubEvent.CONTENT_APPROVED, payload);
}

/**
 * Publish POST_PUBLISHED event
 */
export async function publishPostPublished(payload: PostPublishedPayload) {
    await publish(PubSubEvent.POST_PUBLISHED, payload);
}

/**
 * Publish CAMPAIGN_COMPLETED event
 */
export async function publishCampaignCompleted(payload: CampaignCompletedPayload) {
    await publish(PubSubEvent.CAMPAIGN_COMPLETED, payload);
}

/**
 * Unsubscribe from all events
 */
export async function unsubscribeAll() {
    try {
        const subscriber = await getRedisSubscriber();
        await subscriber.unsubscribe();
        eventHandlers.clear();
        logger.info('[PubSub] Unsubscribed from all channels');
    } catch (error) {
        logger.error('[PubSub] Failed to unsubscribe:', error);
    }
}

export default {
    initSubscriber,
    subscribe,
    publish,
    publishLeadsReady,
    publishContentReady,
    publishContentApproved,
    publishPostPublished,
    publishCampaignCompleted,
    unsubscribeAll,
    PubSubEvent,
};
