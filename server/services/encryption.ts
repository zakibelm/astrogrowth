import Cryptr from 'cryptr';
import { logger } from '../config/logger';

/**
 * Encryption service for sensitive data (OAuth tokens, etc.)
 * Uses AES-256-GCM encryption
 */

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'default-key-change-in-production-32-chars-min';

if (!process.env.ENCRYPTION_KEY && process.env.NODE_ENV === 'production') {
    logger.error('[Encryption] ENCRYPTION_KEY not set in production!');
    throw new Error('ENCRYPTION_KEY environment variable is required in production');
}

if (ENCRYPTION_KEY.length < 32) {
    logger.warn('[Encryption] Encryption key should be at least 32 characters for strong security');
}

const cryptr = new Cryptr(ENCRYPTION_KEY, {
    encoding: 'base64',
    pbkdf2Iterations: 10000,
    saltLength: 10,
});

/**
 * Encrypt sensitive data
 */
export function encrypt(plaintext: string): string {
    try {
        return cryptr.encrypt(plaintext);
    } catch (error) {
        logger.error('[Encryption] Failed to encrypt data:', error);
        throw new Error('Encryption failed');
    }
}

/**
 * Decrypt sensitive data
 */
export function decrypt(ciphertext: string): string {
    try {
        return cryptr.decrypt(ciphertext);
    } catch (error) {
        logger.error('[Encryption] Failed to decrypt data:', error);
        throw new Error('Decryption failed');
    }
}

/**
 * Encrypt LinkedIn tokens
 */
export function encryptLinkedInTokens(tokens: {
    accessToken: string;
    refreshToken?: string;
}): {
    encryptedAccessToken: string;
    encryptedRefreshToken?: string;
} {
    return {
        encryptedAccessToken: encrypt(tokens.accessToken),
        encryptedRefreshToken: tokens.refreshToken ? encrypt(tokens.refreshToken) : undefined,
    };
}

/**
 * Decrypt LinkedIn tokens
 */
export function decryptLinkedInTokens(tokens: {
    encryptedAccessToken: string;
    encryptedRefreshToken?: string;
}): {
    accessToken: string;
    refreshToken?: string;
} {
    return {
        accessToken: decrypt(tokens.encryptedAccessToken),
        refreshToken: tokens.encryptedRefreshToken ? decrypt(tokens.encryptedRefreshToken) : undefined,
    };
}

/**
 * Verify encryption/decryption is working
 */
export function testEncryption(): boolean {
    try {
        const testData = 'test-encryption-data-123';
        const encrypted = encrypt(testData);
        const decrypted = decrypt(encrypted);

        if (testData === decrypted) {
            logger.info('[Encryption] Self-test passed');
            return true;
        }

        logger.error('[Encryption] Self-test failed: decrypted data does not match original');
        return false;
    } catch (error) {
        logger.error('[Encryption] Self-test failed:', error);
        return false;
    }
}

export default {
    encrypt,
    decrypt,
    encryptLinkedInTokens,
    decryptLinkedInTokens,
    testEncryption,
};
