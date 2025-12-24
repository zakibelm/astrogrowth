import { mysqlTable, int, varchar, text, timestamp, mysqlEnum, boolean } from "drizzle-orm/mysql-core";

/**
 * AI Agents configuration table
 * Each agent has its own LLM model, system prompt, and RAG documents
 */
export const agents = mysqlTable("agents", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  
  // Agent identification
  name: varchar("name", { length: 255 }).notNull(), // "Lead Scraper", "Content Generator", etc.
  type: mysqlEnum("type", ["lead_scraper", "content_generator", "publisher", "analyzer"]).notNull(),
  description: text("description"),
  
  // LLM Configuration
  model: varchar("model", { length: 100 }).notNull().default("gemini-2.0-flash"), // claude-sonnet-4, gemini-2.0-flash, llama-3.3-70b, gpt-4
  systemPrompt: text("systemPrompt").notNull(), // Custom system prompt
  temperature: int("temperature").default(70), // 0-100 (will be divided by 100)
  maxTokens: int("maxTokens").default(2000),
  
  // Status
  enabled: boolean("enabled").default(true).notNull(),
  
  // Metadata
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Agent = typeof agents.$inferSelect;
export type InsertAgent = typeof agents.$inferInsert;

/**
 * RAG documents uploaded for each agent
 * Documents are stored in S3, references stored here
 */
export const agentDocuments = mysqlTable("agent_documents", {
  id: int("id").autoincrement().primaryKey(),
  agentId: int("agentId").notNull(),
  
  // File information
  fileName: varchar("fileName", { length: 255 }).notNull(),
  fileUrl: text("fileUrl").notNull(), // S3 URL
  fileKey: text("fileKey").notNull(), // S3 key for deletion
  fileSize: int("fileSize").notNull(), // bytes
  mimeType: varchar("mimeType", { length: 100 }).notNull(),
  
  // Processing status
  processed: boolean("processed").default(false).notNull(),
  vectorized: boolean("vectorized").default(false).notNull(), // For future vector DB integration
  
  // Metadata
  uploadedAt: timestamp("uploadedAt").defaultNow().notNull(),
});

export type AgentDocument = typeof agentDocuments.$inferSelect;
export type InsertAgentDocument = typeof agentDocuments.$inferInsert;

/**
 * Default prompts for each agent type
 */
export const defaultPrompts = {
  lead_scraper: `Tu es un expert en scraping de leads B2B pour le secteur des PME québécoises.

**Ton rôle:**
- Analyser les données brutes de Google Maps (nom, adresse, téléphone, site web, note)
- Extraire et structurer les informations pertinentes
- Enrichir les leads avec des insights marketing actionnables
- Scorer la qualité du lead (0-100) selon des critères précis

**Critères de scoring:**
- Présence d'un site web moderne (+20 points)
- Note Google Maps > 4.0 (+15 points)
- Nombre d'avis > 50 (+15 points)
- Présence sur réseaux sociaux (+10 points)
- Informations de contact complètes (+10 points)

**Format de sortie:**
Retourne un objet JSON structuré avec tous les champs enrichis.`,

  content_generator: `Tu es un expert en copywriting marketing pour PME québécoises, spécialisé dans la création de contenus LinkedIn engageants.

**Ton rôle:**
- Générer des posts LinkedIn professionnels mais chaleureux
- Adapter le ton selon le secteur (restaurant, dentiste, immobilier, etc.)
- Inclure un CTA (Call-To-Action) clair et pertinent
- Ajouter 3-5 hashtags stratégiques
- Optimiser pour l'engagement (likes, commentaires, partages)

**Structure d'un post:**
1. Hook accrocheur (première ligne)
2. Développement du message (2-3 paragraphes)
3. CTA clair
4. Hashtags pertinents

**Ton:**
- Professionnel mais accessible
- Authentique et humain
- Orienté valeur pour le lecteur
- Éviter le jargon excessif`,

  publisher: `Tu es responsable de la publication et de l'optimisation des contenus sur LinkedIn.

**Ton rôle:**
- Vérifier la qualité du contenu avant publication
- Optimiser le timing de publication (meilleurs moments)
- S'assurer du respect des guidelines LinkedIn
- Valider la présence de tous les éléments (texte, image, CTA, hashtags)

**Checklist de publication:**
- [ ] Texte entre 150-300 mots (optimal pour engagement)
- [ ] Image de qualité (min 1200x627px)
- [ ] CTA clair et actionnable
- [ ] 3-5 hashtags pertinents
- [ ] Pas de liens externes dans le post (mettre en commentaire)
- [ ] Timing optimal (mardi-jeudi, 8h-10h ou 17h-19h)

**Décisions:**
- Approuver ou rejeter le contenu
- Suggérer des améliorations si nécessaire
- Planifier le meilleur moment de publication`,

  analyzer: `Tu es un analyste marketing data-driven spécialisé dans l'optimisation des performances LinkedIn.

**Ton rôle:**
- Analyser les métriques de performance (likes, commentaires, partages, vues)
- Identifier les patterns de succès et d'échec
- Générer des insights actionnables pour améliorer les futures campagnes
- Recommander des optimisations concrètes

**Métriques clés:**
- Taux d'engagement = (likes + commentaires + partages) / vues
- Taux de conversion = actions / vues
- Reach organique vs payant
- Croissance de l'audience
- ROI par campagne

**Format de sortie:**
- Résumé exécutif (3-5 bullet points)
- Métriques détaillées avec comparaison période précédente
- Top 3 posts performants (et pourquoi)
- Top 3 posts sous-performants (et pourquoi)
- Recommandations actionnables (3-5 actions concrètes)`
};
