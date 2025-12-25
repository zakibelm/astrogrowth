import { logger } from '../config/logger';

/**
 * Circuit Breaker Pattern - Production Ready
 * Prevents cascading failures by stopping requests to failing services
 *
 * States:
 * - CLOSED: Normal operation, requests pass through
 * - OPEN: Service is failing, requests fail fast
 * - HALF_OPEN: Testing if service recovered
 */

export enum CircuitState {
    CLOSED = 'CLOSED',
    OPEN = 'OPEN',
    HALF_OPEN = 'HALF_OPEN',
}

export interface CircuitBreakerConfig {
    failureThreshold: number; // Number of failures before opening
    successThreshold: number; // Number of successes in HALF_OPEN to close
    timeout: number; // Milliseconds before trying HALF_OPEN
    monitoringPeriod: number; // Milliseconds to track failures
}

export class CircuitBreaker {
    private state: CircuitState = CircuitState.CLOSED;
    private failureCount: number = 0;
    private successCount: number = 0;
    private lastFailureTime: number = 0;
    private nextAttemptTime: number = 0;
    private readonly name: string;
    private readonly config: CircuitBreakerConfig;

    // Default configuration
    private static readonly DEFAULT_CONFIG: CircuitBreakerConfig = {
        failureThreshold: 5, // Open after 5 failures
        successThreshold: 2, // Close after 2 successes in HALF_OPEN
        timeout: 60000, // Try again after 1 minute
        monitoringPeriod: 60000, // Monitor failures in 1 minute window
    };

    constructor(name: string, config?: Partial<CircuitBreakerConfig>) {
        this.name = name;
        this.config = { ...CircuitBreaker.DEFAULT_CONFIG, ...config };
    }

    /**
     * Execute function with circuit breaker protection
     */
    async execute<T>(fn: () => Promise<T>): Promise<T> {
        // Check if circuit is open
        if (this.state === CircuitState.OPEN) {
            // Check if timeout has elapsed
            if (Date.now() < this.nextAttemptTime) {
                const waitTime = Math.ceil((this.nextAttemptTime - Date.now()) / 1000);
                logger.warn(`[CircuitBreaker:${this.name}] Circuit OPEN, failing fast. Retry in ${waitTime}s`);
                throw new Error(`Circuit breaker is OPEN for ${this.name}. Retry in ${waitTime}s`);
            }

            // Timeout elapsed, try HALF_OPEN
            this.state = CircuitState.HALF_OPEN;
            this.successCount = 0;
            logger.info(`[CircuitBreaker:${this.name}] Moving to HALF_OPEN state`);
        }

        try {
            // Execute the function
            const result = await fn();

            // Success!
            this.onSuccess();

            return result;
        } catch (error) {
            // Failure
            this.onFailure();

            throw error;
        }
    }

    /**
     * Handle successful execution
     */
    private onSuccess(): void {
        this.failureCount = 0;

        if (this.state === CircuitState.HALF_OPEN) {
            this.successCount++;

            logger.info(
                `[CircuitBreaker:${this.name}] Success in HALF_OPEN (${this.successCount}/${this.config.successThreshold})`
            );

            // Enough successes? Close the circuit
            if (this.successCount >= this.config.successThreshold) {
                this.state = CircuitState.CLOSED;
                this.successCount = 0;
                logger.info(`[CircuitBreaker:${this.name}] Circuit CLOSED - service recovered`);
            }
        }
    }

    /**
     * Handle failed execution
     */
    private onFailure(): void {
        this.failureCount++;
        this.lastFailureTime = Date.now();

        logger.warn(
            `[CircuitBreaker:${this.name}] Failure ${this.failureCount}/${this.config.failureThreshold} in ${this.state}`
        );

        if (this.state === CircuitState.HALF_OPEN) {
            // Failed in HALF_OPEN? Back to OPEN
            this.trip();
        } else if (this.failureCount >= this.config.failureThreshold) {
            // Too many failures? Open the circuit
            this.trip();
        }
    }

    /**
     * Trip the circuit breaker (open it)
     */
    private trip(): void {
        this.state = CircuitState.OPEN;
        this.nextAttemptTime = Date.now() + this.config.timeout;

        const retryIn = Math.ceil(this.config.timeout / 1000);

        logger.error(
            `[CircuitBreaker:${this.name}] Circuit OPENED! Too many failures. Will retry in ${retryIn}s`
        );
    }

    /**
     * Force reset the circuit breaker (admin function)
     */
    reset(): void {
        this.state = CircuitState.CLOSED;
        this.failureCount = 0;
        this.successCount = 0;
        this.lastFailureTime = 0;
        this.nextAttemptTime = 0;

        logger.info(`[CircuitBreaker:${this.name}] Circuit manually reset to CLOSED`);
    }

    /**
     * Get current state
     */
    getState(): {
        state: CircuitState;
        failureCount: number;
        successCount: number;
        nextAttemptTime: number | null;
    } {
        return {
            state: this.state,
            failureCount: this.failureCount,
            successCount: this.successCount,
            nextAttemptTime: this.state === CircuitState.OPEN ? this.nextAttemptTime : null,
        };
    }

    /**
     * Check if circuit is allowing requests
     */
    isAvailable(): boolean {
        if (this.state === CircuitState.CLOSED || this.state === CircuitState.HALF_OPEN) {
            return true;
        }

        // OPEN - check if timeout elapsed
        return Date.now() >= this.nextAttemptTime;
    }
}

/**
 * Circuit Breaker Manager - Manages multiple circuit breakers
 */
export class CircuitBreakerManager {
    private breakers: Map<string, CircuitBreaker> = new Map();

    /**
     * Get or create circuit breaker for a service
     */
    getBreaker(name: string, config?: Partial<CircuitBreakerConfig>): CircuitBreaker {
        if (!this.breakers.has(name)) {
            this.breakers.set(name, new CircuitBreaker(name, config));
        }

        return this.breakers.get(name)!;
    }

    /**
     * Get all circuit breakers status
     */
    getAllStatus(): Record<string, ReturnType<CircuitBreaker['getState']>> {
        const status: Record<string, ReturnType<CircuitBreaker['getState']>> = {};

        this.breakers.forEach((breaker, name) => {
            status[name] = breaker.getState();
        });

        return status;
    }

    /**
     * Reset all circuit breakers
     */
    resetAll(): void {
        this.breakers.forEach((breaker) => breaker.reset());
        logger.info('[CircuitBreakerManager] All circuits reset');
    }

    /**
     * Reset specific circuit breaker
     */
    reset(name: string): void {
        const breaker = this.breakers.get(name);
        if (breaker) {
            breaker.reset();
        }
    }
}

// Global circuit breaker manager instance
export const circuitBreakerManager = new CircuitBreakerManager();

export default CircuitBreaker;
