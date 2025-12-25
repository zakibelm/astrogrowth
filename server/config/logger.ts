import winston from 'winston';

/**
 * Structured logging with Winston
 * Supports JSON format for production and readable format for development
 */

const isProduction = process.env.NODE_ENV === 'production';

// Custom format for development
const devFormat = winston.format.combine(
    winston.format.colorize(),
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.printf(({ level, message, timestamp, ...metadata }) => {
        let msg = `${timestamp} [${level}]: ${message}`;

        // Add metadata if present
        if (Object.keys(metadata).length > 0) {
            msg += ` ${JSON.stringify(metadata)}`;
        }

        return msg;
    })
);

// JSON format for production
const prodFormat = winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
);

// Create logger instance
export const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || (isProduction ? 'info' : 'debug'),
    format: isProduction ? prodFormat : devFormat,
    defaultMeta: {
        service: 'astrogrowth',
        environment: process.env.NODE_ENV || 'development',
    },
    transports: [
        // Console output
        new winston.transports.Console({
            stderrLevels: ['error'],
        }),
    ],
    // Don't exit on handled exceptions
    exitOnError: false,
});

// Add file transports in production
if (isProduction) {
    // Error logs
    logger.add(
        new winston.transports.File({
            filename: 'logs/error.log',
            level: 'error',
            maxsize: 5242880, // 5MB
            maxFiles: 5,
        })
    );

    // Combined logs
    logger.add(
        new winston.transports.File({
            filename: 'logs/combined.log',
            maxsize: 5242880, // 5MB
            maxFiles: 5,
        })
    );
}

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason: Error) => {
    logger.error('Unhandled Promise Rejection:', {
        error: reason.message,
        stack: reason.stack,
    });
});

// Handle uncaught exceptions
process.on('uncaughtException', (error: Error) => {
    logger.error('Uncaught Exception:', {
        error: error.message,
        stack: error.stack,
    });

    // Exit process after logging
    process.exit(1);
});

/**
 * Log HTTP requests (middleware helper)
 */
export function logRequest(req: any, res: any, duration: number) {
    logger.info('HTTP Request', {
        method: req.method,
        url: req.url,
        status: res.statusCode,
        duration: `${duration}ms`,
        ip: req.ip,
        userAgent: req.get('user-agent'),
    });
}

/**
 * Log service operations with context
 */
export function logOperation(
    service: string,
    operation: string,
    metadata?: Record<string, any>
) {
    logger.info(`[${service}] ${operation}`, metadata);
}

/**
 * Log errors with full context
 */
export function logError(
    service: string,
    operation: string,
    error: Error,
    metadata?: Record<string, any>
) {
    logger.error(`[${service}] ${operation} failed`, {
        error: error.message,
        stack: error.stack,
        ...metadata,
    });
}

export default logger;
