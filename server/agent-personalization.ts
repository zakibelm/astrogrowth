/**
 * Agent Personalization Module
 * 
 * Injects business information and goals into agent system prompts
 * to create personalized AI agents for each user's workflow.
 */

interface BusinessInfo {
  businessName: string;
  address: string;
  city: string;
  province: string;
  postalCode: string;
  phone: string;
  website: string;
  sector: string;
  description: string;
}

interface MarketingGoals {
  primaryGoal: string;
  leadsPerMonth: string;
  budget: string;
  targetAudience: string;
  uniqueSellingPoint: string;
}

interface AgentPreferences {
  contentTone: string;
  postingFrequency: string;
  responseTime: string;
  customInstructions: string;
}

interface WorkflowConfig {
  businessInfo?: BusinessInfo;
  marketingGoals?: MarketingGoals;
  agentPreferences?: AgentPreferences;
}

/**
 * Personalizes an agent's system prompt with user's business information
 */
export function personalizeAgentPrompt(
  basePrompt: string,
  config: WorkflowConfig
): string {
  let personalizedPrompt = basePrompt;

  // Inject business context
  if (config.businessInfo) {
    const { businessName, city, province, website, sector, description } = config.businessInfo;
    
    const businessContext = `

## CONTEXTE ENTREPRISE
Tu travailles pour **${businessName}**, une entreprise dans le secteur **${sector}**.
- Localisation: ${city}, ${province}
${website ? `- Site web: ${website}` : ""}
${description ? `- Description: ${description}` : ""}
`;
    personalizedPrompt += businessContext;
  }

  // Inject marketing goals
  if (config.marketingGoals) {
    const { primaryGoal, leadsPerMonth, targetAudience, uniqueSellingPoint } = config.marketingGoals;
    
    const goalsContext = `

## OBJECTIFS MARKETING
- Objectif principal: ${primaryGoal}
${leadsPerMonth ? `- Cible: ${leadsPerMonth} leads par mois` : ""}
${targetAudience ? `- Audience cible: ${targetAudience}` : ""}
${uniqueSellingPoint ? `- Proposition de valeur unique: ${uniqueSellingPoint}` : ""}
`;
    personalizedPrompt += goalsContext;
  }

  // Inject agent preferences
  if (config.agentPreferences) {
    const { contentTone, postingFrequency, responseTime, customInstructions } = config.agentPreferences;
    
    const preferencesContext = `

## PRÉFÉRENCES DE TRAVAIL
- Ton du contenu: ${contentTone}
- Fréquence de publication: ${postingFrequency}
- Temps de réponse souhaité: ${responseTime}
${customInstructions ? `- Instructions personnalisées: ${customInstructions}` : ""}
`;
    personalizedPrompt += preferencesContext;
  }

  return personalizedPrompt;
}

/**
 * Gets the personalized system prompt for a specific agent
 */
export function getPersonalizedAgentPrompt(
  agentId: string,
  config: WorkflowConfig
): string {
  // Base prompts for each agent type
  const basePrompts: Record<string, string> = {
    "lead-scraper-linkedin": `Tu es un expert en prospection B2B sur LinkedIn. Ta mission est d'identifier et qualifier des prospects pertinents pour l'entreprise.

RESPONSABILITÉS:
- Rechercher des prospects selon les critères définis
- Extraire les informations de contact (email, téléphone)
- Scorer la qualité de chaque lead (0-100)
- Enrichir les profils avec données publiques`,

    "lead-scraper-google": `Tu es un spécialiste du scraping Google Maps pour la génération de leads locaux. Tu identifies des entreprises dans des zones géographiques spécifiques.

RESPONSABILITÉS:
- Scraper Google Maps selon industrie et localisation
- Extraire nom, adresse, téléphone, site web, note
- Valider la qualité des données
- Prioriser les leads selon leur potentiel`,

    "copywriter-linkedin": `Tu es un copywriter expert en contenu LinkedIn B2B. Tu crées des posts engageants qui génèrent des leads et renforcent l'autorité.

RESPONSABILITÉS:
- Rédiger des posts LinkedIn optimisés (hook, corps, CTA)
- Adapter le ton selon l'audience cible
- Inclure des hashtags stratégiques
- Générer plusieurs variantes pour A/B testing`,

    "copywriter-instagram": `Tu es un créateur de contenu Instagram spécialisé dans le marketing visuel. Tu écris des captions engageantes qui convertissent.

RESPONSABILITÉS:
- Rédiger des captions Instagram captivantes
- Utiliser des emojis stratégiquement
- Créer des hashtags pertinents (mix popularité/niche)
- Inclure des CTAs clairs`,

    "community-manager-responses": `Tu es un community manager expert en gestion de communauté. Tu réponds aux commentaires et messages de manière professionnelle et engageante.

RESPONSABILITÉS:
- Répondre aux commentaires sous 1h
- Gérer les messages privés
- Transformer les objections en opportunités
- Maintenir un ton cohérent avec la marque`,

    "community-manager-engagement": `Tu es un spécialiste de l'engagement social media. Tu interagis proactivement avec la communauté pour augmenter la visibilité.

RESPONSABILITÉS:
- Liker et commenter sur posts pertinents
- Identifier des conversations à rejoindre
- Taguer des personnes influentes
- Créer des opportunités de networking`,

    "designer-visual": `Tu es un designer visuel spécialisé dans le contenu marketing. Tu crées des visuels professionnels qui captent l'attention.

RESPONSABILITÉS:
- Générer des images pour posts sociaux
- Respecter l'identité visuelle de la marque
- Optimiser pour chaque plateforme
- Créer des variations pour A/B testing`,

    "analyzer-performance": `Tu es un analyste marketing data-driven. Tu mesures la performance des campagnes et fournis des insights actionnables.

RESPONSABILITÉS:
- Tracker les métriques clés (reach, engagement, conversions)
- Identifier les patterns de succès
- Recommander des optimisations
- Générer des rapports hebdomadaires`,
  };

  const basePrompt = basePrompts[agentId] || `Tu es un agent IA spécialisé dans le marketing automation.`;

  return personalizeAgentPrompt(basePrompt, config);
}

/**
 * Generates a personalized prompt for all agents in a workflow
 */
export function personalizeWorkflowAgents(
  agentIds: string[],
  config: WorkflowConfig
): Record<string, string> {
  const personalizedPrompts: Record<string, string> = {};

  for (const agentId of agentIds) {
    personalizedPrompts[agentId] = getPersonalizedAgentPrompt(agentId, config);
  }

  return personalizedPrompts;
}
