import { invokeLLM } from "../_core/llm";
import { generateImage } from "../_core/imageGeneration";
import { storagePut } from "../storage";
import * as db from "../db";
import { Lead, InsertContent } from "../../drizzle/schema";
import { nanoid } from "nanoid";

/**
 * Content generator service using Gemini 2.0 Flash for text and Imagen 3 for images
 */

interface GenerateContentParams {
  lead: Lead;
  campaignId: number;
  userId: number;
}

interface GeneratedContent {
  textContent: string;
  imageUrl: string;
  imageS3Key: string;
  hashtags: string[];
  qualityScore: number;
}

/**
 * Generate marketing text content for a lead using Gemini 2.0 Flash
 */
async function generateTextContent(lead: Lead): Promise<{ text: string; hashtags: string[]; score: number }> {
  const prompt = `Tu es un expert en marketing B2B pour les PME québécoises. 

Crée un post LinkedIn professionnel et engageant pour promouvoir "${lead.businessName}", une entreprise de type "${lead.businessType}" située à ${lead.city || lead.address || 'Québec'}.

Le post doit :
- Être en français canadien naturel et professionnel
- Mettre en valeur les points forts de l'entreprise
- Inclure un appel à l'action subtil
- Faire environ 150-200 mots
- Être authentique et personnel, pas trop commercial

${lead.googleRating ? `Note Google: ${lead.googleRating}/5 avec ${lead.googleReviews} avis` : ''}
${lead.website ? `Site web: ${lead.website}` : ''}

Retourne uniquement le texte du post, sans titre ni hashtags.`;

  try {
    const response = await invokeLLM({
      messages: [
        { role: "system", content: "Tu es un expert en marketing de contenu pour PME québécoises. Tu crées des posts LinkedIn authentiques et engageants." },
        { role: "user", content: prompt }
      ],
    });

    const messageContent = response.choices[0]?.message?.content;
    const textContent = typeof messageContent === 'string' ? messageContent : '';
    
    // Generate hashtags
    const hashtagsPrompt = `Pour ce post LinkedIn sur "${lead.businessName}" (${lead.businessType}), suggère 3-5 hashtags pertinents en français. 
    
Post: ${textContent}

Retourne uniquement les hashtags séparés par des espaces, sans numérotation ni explication.`;

    const hashtagsResponse = await invokeLLM({
      messages: [
        { role: "user", content: hashtagsPrompt }
      ],
    });

    const hashtagsMessageContent = hashtagsResponse.choices[0]?.message?.content;
    const hashtagsText = typeof hashtagsMessageContent === 'string' ? hashtagsMessageContent : '';
    const hashtags = hashtagsText
      .split(/\s+/)
      .filter(tag => tag.startsWith('#'))
      .slice(0, 5);

    // Calculate quality score based on content length and structure
    const wordCount = textContent.split(/\s+/).length;
    let score = 50; // Base score
    
    // Length scoring (optimal 150-200 words)
    if (wordCount >= 150 && wordCount <= 200) {
      score += 20;
    } else if (wordCount >= 100 && wordCount < 250) {
      score += 10;
    }
    
    // Has call to action
    if (textContent.match(/contactez|visitez|découvrez|rejoignez|suivez/i)) {
      score += 15;
    }
    
    // Has hashtags
    if (hashtags.length >= 3) {
      score += 15;
    }

    return {
      text: textContent,
      hashtags,
      score: Math.min(100, score),
    };
  } catch (error) {
    console.error('[ContentGenerator] Error generating text:', error);
    throw error;
  }
}

/**
 * Generate marketing image for a lead using Imagen 3
 */
async function generateMarketingImage(lead: Lead, textContent: string): Promise<{ url: string; s3Key: string }> {
  const imagePrompt = `Professional marketing image for a ${lead.businessType} business called "${lead.businessName}". 
  
Style: Modern, clean, professional, welcoming
Colors: Warm and inviting
Mood: Trustworthy and approachable
Context: ${textContent.substring(0, 200)}

Create a high-quality, visually appealing image suitable for LinkedIn business post. No text overlay.`;

  try {
    const imageResult = await generateImage({
      prompt: imagePrompt,
    });
    
    if (!imageResult.url) {
      throw new Error('Image generation failed: no URL returned');
    }

    // Download the image and upload to S3 for permanent storage
    const imageResponse = await fetch(imageResult.url);
    const imageBuffer = Buffer.from(await imageResponse.arrayBuffer());
    
    // Generate unique S3 key
    const s3Key = `content-images/${lead.userId}/${nanoid()}.png`;
    
    // Upload to S3
    const { url: s3Url } = await storagePut(s3Key, imageBuffer, 'image/png');

    return {
      url: s3Url,
      s3Key,
    };
  } catch (error) {
    console.error('[ContentGenerator] Error generating image:', error);
    throw error;
  }
}

/**
 * Generate complete marketing content (text + image) for a lead
 */
export async function generateContent(params: GenerateContentParams): Promise<{ success: boolean; contentId?: number; error?: string }> {
  const { lead, campaignId, userId } = params;

  try {
    console.log(`[ContentGenerator] Generating content for lead: ${lead.businessName}`);

    // Generate text content
    const { text, hashtags, score: textScore } = await generateTextContent(lead);
    
    // Generate image
    const { url: imageUrl, s3Key: imageS3Key } = await generateMarketingImage(lead, text);

    // Calculate overall quality score (weighted average)
    const qualityScore = Math.round(textScore * 0.7 + 30); // Text is 70%, having an image adds 30%

    // Create content record
    const content: InsertContent = {
      leadId: lead.id,
      campaignId,
      userId,
      textContent: text,
      imageUrl,
      imageS3Key,
      hashtags: JSON.stringify(hashtags),
      qualityScore,
      status: qualityScore >= 70 ? 'approved' : 'pending', // Auto-approve if score >= 70
    };

    const contentId = await db.createContent(content);

    // Update campaign stats
    const campaign = await db.getCampaignById(campaignId);
    if (campaign) {
      await db.updateCampaignStats(campaignId, {
        totalContent: (campaign.totalContent || 0) + 1,
      });
    }

    // Create notification
    await db.createNotification({
      userId,
      type: 'content_generated',
      title: 'Contenu généré',
      message: `Un nouveau contenu marketing a été créé pour "${lead.businessName}".`,
      campaignId,
      leadId: lead.id,
      contentId,
    });

    console.log(`[ContentGenerator] Content created successfully (ID: ${contentId}, Score: ${qualityScore})`);

    return { success: true, contentId };
  } catch (error) {
    console.error('[ContentGenerator] Error generating content:', error);
    
    // Create error notification
    await db.createNotification({
      userId,
      type: 'system_error',
      title: 'Erreur de génération de contenu',
      message: `Une erreur s'est produite lors de la génération du contenu pour "${lead.businessName}".`,
      campaignId,
      leadId: lead.id,
    });

    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Generate content for all leads in a campaign
 */
export async function generateContentForCampaign(campaignId: number, userId: number): Promise<{ success: boolean; generatedCount: number; error?: string }> {
  try {
    const leads = await db.getLeadsByCampaignId(campaignId);
    
    if (leads.length === 0) {
      return { success: true, generatedCount: 0 };
    }

    console.log(`[ContentGenerator] Generating content for ${leads.length} leads in campaign ${campaignId}`);

    let successCount = 0;
    let errorCount = 0;

    // Generate content for each lead (sequentially to avoid rate limits)
    for (const lead of leads) {
      const result = await generateContent({ lead, campaignId, userId });
      if (result.success) {
        successCount++;
      } else {
        errorCount++;
      }
      
      // Add small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    console.log(`[ContentGenerator] Campaign content generation complete: ${successCount} success, ${errorCount} errors`);

    return {
      success: true,
      generatedCount: successCount,
    };
  } catch (error) {
    console.error('[ContentGenerator] Error generating campaign content:', error);
    return {
      success: false,
      generatedCount: 0,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
