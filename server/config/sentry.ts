import * as Sentry from '@sentry/node';
import { Express } from 'express';
import { logger } from './logger';

/**
 * Sentry configuration for error tracking and performance monitoring
 * Compatible with Sentry Node SDK v8+
 */

const SENTRY_DSN = process.env.SENTRY_DSN;
const isProduction = process.env.NODE_ENV === 'production';

/**
 * Initialize Sentry
 */
export function initSentry(app?: Express) {
    if (!SENTRY_DSN) {
        logger.warn('[Sentry] DSN not configured, error tracking disabled');
        return;
    }

    Sentry.init({
        dsn: SENTRY_DSN,
        environment: process.env.NODE_ENV || 'development',
        tracesSampleRate: isProduction ? 0.1 : 1.0,
        release: process.env.GIT_COMMIT_SHA || 'development',
        // Allow default integrations
        beforeSend(event) {
            // Remove sensitive headers
            if (event.request?.headers) {
                delete event.request.headers['authorization'];
                delete event.request.headers['cookie'];
            }
            if (event.request?.url?.includes('/health')) {
                return null;
            }
            return event;
        },
    });

    if (app) {
        // Attempt to set up Express error handler if available (v8+)
        if ('setupExpressErrorHandler' in Sentry && typeof Sentry.setupExpressErrorHandler === 'function') {
            (Sentry as any).setupExpressErrorHandler(app);
        }
    }

    logger.info('[Sentry] Initialized successfully');
}

/**
 * Express error handler middleware (legacy support)
 */
export function sentryErrorHandler() {
    return (err: any, req: any, res: any, next: any) => {
        if (SENTRY_DSN) {
            Sentry.captureException(err);
        }
        next(err);
    };
}

/**
 * Capture error manually with context
 */
export function captureError(
    error: Error,
    context?: {
        user?: { id: number; email?: string };
        tags?: Record<string, string>;
        extra?: Record<string, any>;
    }
) {
    if (!SENTRY_DSN) {
        if (!isProduction) {
            logger.error('[Sentry] Error not captured (DSN not configured):', error);
        }
        return;
    }

    Sentry.withScope((scope) => {
        // Add user context
        if (context?.user) {
            scope.setUser({
                id: context.user.id.toString(),
                email: context.user.email,
            });
        }

        // Add tags
        if (context?.tags) {
            scope.setTags(context.tags);
        }

        // Add extra context
        if (context?.extra) {
            scope.setExtras(context.extra);
        }

        Sentry.captureException(error);
    });
}

/**
 * Capture message manually
 */
export function captureMessage(
    message: string,
    level: Sentry.SeverityLevel = 'info',
    context?: Record<string, any>
) {
    if (!SENTRY_DSN) {
        return;
    }

    Sentry.withScope((scope) => {
        if (context) {
            scope.setExtras(context);
        }
        Sentry.captureMessage(message, level);
    });
}

/**
 * Start a new transaction for performance monitoring
 * Note: specific to v7, in v8+ spans are used differently.
 * This is a shim to prevent type errors.
 */
export function startTransaction(name: string, op: string) {
    if (!SENTRY_DSN) {
        return { finish: () => { } };
    }

    // Return dummy object if startTransaction is not available
    const anySentry = Sentry as any;
    if (typeof anySentry.startTransaction === 'function') {
        return anySentry.startTransaction({ name, op });
    }

    return { finish: () => { } };
}

/**
 * Close Sentry and flush events
 */
export async function closeSentry() {
    if (!SENTRY_DSN) {
        return;
    }

    await Sentry.close(2000); // Wait up to 2 seconds for events to be sent
    logger.info('[Sentry] Closed and flushed');
}

export default Sentry;
