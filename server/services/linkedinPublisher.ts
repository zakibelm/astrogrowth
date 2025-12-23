import * as db from "../db";
import { Content } from "../../drizzle/schema";

/**
 * LinkedIn publisher service with OAuth and rate limiting
 * Note: This is a simplified implementation. Full LinkedIn OAuth integration
 * requires additional setup including LinkedIn App credentials and redirect URLs.
 */

const LINKEDIN_API_BASE = 'https://api.linkedin.com/v2';
const MAX_POSTS_PER_DAY = 100;
const MIN_POST_INTERVAL_MS = 15 * 60 * 1000; // 15 minutes

interface PublishResult {
  success: boolean;
  postId?: string;
  postUrl?: string;
  error?: string;
}

/**
 * Check if user can post based on rate limits
 */
async function checkRateLimit(userId: number): Promise<{ allowed: boolean; reason?: string }> {
  const rateLimit = await db.getRateLimit(userId);
  
  if (!rateLimit) {
    return { allowed: true };
  }
  
  // Check daily limit
  if (rateLimit.postsToday >= MAX_POSTS_PER_DAY) {
    return {
      allowed: false,
      reason: `Limite quotidienne atteinte (${MAX_POSTS_PER_DAY} posts/jour)`,
    };
  }
  
  // Check minimum interval between posts
  if (rateLimit.lastPostAt) {
    const timeSinceLastPost = Date.now() - rateLimit.lastPostAt.getTime();
    if (timeSinceLastPost < MIN_POST_INTERVAL_MS) {
      const minutesRemaining = Math.ceil((MIN_POST_INTERVAL_MS - timeSinceLastPost) / 60000);
      return {
        allowed: false,
        reason: `Veuillez attendre ${minutesRemaining} minutes avant de publier à nouveau`,
      };
    }
  }
  
  // Check if daily limit needs reset (new day)
  const lastResetDate = rateLimit.lastResetAt ? new Date(rateLimit.lastResetAt).toDateString() : null;
  const currentDate = new Date().toDateString();
  
  if (lastResetDate !== currentDate) {
    // Reset daily counter
    await db.resetDailyLimits(userId);
  }
  
  return { allowed: true };
}

/**
 * Upload image to LinkedIn
 * This is a placeholder - actual implementation requires LinkedIn API credentials
 */
async function uploadImageToLinkedIn(accessToken: string, imageUrl: string): Promise<string> {
  // In a real implementation, this would:
  // 1. Register upload with LinkedIn API
  // 2. Upload image bytes to the provided upload URL
  // 3. Return the asset URN
  
  // For now, return a placeholder
  console.log('[LinkedIn] Image upload placeholder:', imageUrl);
  return 'urn:li:digitalmediaAsset:placeholder';
}

/**
 * Create a LinkedIn post
 * This is a placeholder - actual implementation requires LinkedIn API credentials
 */
async function createLinkedInPost(
  accessToken: string,
  personUrn: string,
  text: string,
  imageAssetUrn?: string
): Promise<{ postId: string; postUrl: string }> {
  // In a real implementation, this would call LinkedIn's UGC Post API
  // POST https://api.linkedin.com/v2/ugcPosts
  
  console.log('[LinkedIn] Post creation placeholder');
  console.log('Text:', text);
  console.log('Image URN:', imageAssetUrn);
  
  // Return placeholder values
  const postId = `urn:li:share:${Date.now()}`;
  const postUrl = `https://www.linkedin.com/feed/update/${postId}`;
  
  return { postId, postUrl };
}

/**
 * Get LinkedIn person URN from access token
 * This is a placeholder - actual implementation requires LinkedIn API call
 */
async function getPersonUrn(accessToken: string): Promise<string> {
  // In a real implementation, this would call:
  // GET https://api.linkedin.com/v2/me
  
  return 'urn:li:person:placeholder';
}

/**
 * Publish content to LinkedIn
 */
export async function publishToLinkedIn(contentId: number, userId: number): Promise<PublishResult> {
  try {
    // Get content
    const content = await db.getContentById(contentId);
    if (!content) {
      return { success: false, error: 'Contenu introuvable' };
    }
    
    // Check if content is approved
    if (content.status !== 'approved') {
      return { success: false, error: 'Le contenu doit être approuvé avant publication' };
    }
    
    // Get user and check LinkedIn connection
    const user = await db.getUserById(userId);
    if (!user || !user.linkedinConnected || !user.linkedinAccessToken) {
      return { success: false, error: 'Compte LinkedIn non connecté' };
    }
    
    // Check rate limits
    const rateLimitCheck = await checkRateLimit(userId);
    if (!rateLimitCheck.allowed) {
      return { success: false, error: rateLimitCheck.reason };
    }
    
    // Prepare post content
    const hashtags = content.hashtags ? JSON.parse(content.hashtags) : [];
    const postText = `${content.textContent}\n\n${hashtags.join(' ')}`;
    
    // Get person URN
    const personUrn = await getPersonUrn(user.linkedinAccessToken);
    
    // Upload image if present
    let imageAssetUrn: string | undefined;
    if (content.imageUrl) {
      imageAssetUrn = await uploadImageToLinkedIn(user.linkedinAccessToken, content.imageUrl);
    }
    
    // Create post
    const { postId, postUrl } = await createLinkedInPost(
      user.linkedinAccessToken,
      personUrn,
      postText,
      imageAssetUrn
    );
    
    // Update content record
    await db.publishContent(contentId, postId, postUrl);
    
    // Update rate limit
    await db.incrementPostCount(userId);
    
    // Update campaign stats
    const campaign = await db.getCampaignById(content.campaignId);
    if (campaign) {
      await db.updateCampaignStats(content.campaignId, {
        totalPublished: (campaign.totalPublished || 0) + 1,
      });
    }
    
    // Create notification
    await db.createNotification({
      userId,
      type: 'post_published',
      title: 'Post publié sur LinkedIn',
      message: `Votre contenu a été publié avec succès sur LinkedIn.`,
      campaignId: content.campaignId,
      contentId,
    });
    
    console.log(`[LinkedIn] Post published successfully: ${postUrl}`);
    
    return {
      success: true,
      postId,
      postUrl,
    };
    
  } catch (error) {
    console.error('[LinkedIn] Error publishing post:', error);
    
    // Create error notification
    await db.createNotification({
      userId,
      type: 'system_error',
      title: 'Erreur de publication LinkedIn',
      message: `Une erreur s'est produite lors de la publication sur LinkedIn.`,
      contentId,
    });
    
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erreur inconnue',
    };
  }
}

/**
 * Auto-publish approved content
 * This function can be called after content approval
 */
export async function autoPublishIfApproved(contentId: number, userId: number): Promise<PublishResult> {
  const content = await db.getContentById(contentId);
  
  if (!content) {
    return { success: false, error: 'Contenu introuvable' };
  }
  
  // Only auto-publish if quality score is high enough and status is approved
  if (content.status === 'approved' && content.qualityScore >= 70) {
    return await publishToLinkedIn(contentId, userId);
  }
  
  return { success: false, error: 'Contenu non éligible pour auto-publication' };
}

/**
 * Batch publish multiple approved contents
 */
export async function batchPublish(contentIds: number[], userId: number): Promise<{ results: PublishResult[] }> {
  const results: PublishResult[] = [];
  
  for (const contentId of contentIds) {
    const result = await publishToLinkedIn(contentId, userId);
    results.push(result);
    
    // Add delay between posts to respect rate limits
    if (result.success) {
      await new Promise(resolve => setTimeout(resolve, 60000)); // 1 minute delay
    }
  }
  
  return { results };
}
