# TODO - Configuration Agents & Clés API

## 🔑 SAUVEGARDE CLÉS API (PRIORITÉ HAUTE)

- [ ] Créer route tRPC `platformConnections.saveApiKey()` pour sauvegarder les clés
- [ ] Encryption AES-256 des clés API avant sauvegarde en base
- [ ] Modifier ConfigModal pour appeler la route saveApiKey() au lieu de juste toast
- [ ] Tester connexion API après sauvegarde (route `testConnection()`)
- [ ] Afficher feedback succès/erreur avec détails

## 🤖 PAGE ÉQUIPE D'AGENTS COMPLÈTE (PRIORITÉ HAUTE)

### Liste et Cards Agents
- [ ] Liste de tous les agents (Lead Scraper, Content Generator, Publisher, Analyzer)
- [ ] Card par agent avec configuration complète
- [ ] Dropdown sélection modèle IA par agent (Claude Sonnet 4, Gemini 2.0 Flash, Llama 3.3 70B, GPT-4)
- [ ] Afficher le coût estimé par agent selon le modèle choisi
- [ ] Bouton "Sauvegarder" qui persiste la configuration

### Upload Documents RAG par Agent
- [ ] Section "Documents RAG" dans chaque card agent
- [ ] Upload multiple de fichiers (PDF, TXT, MD, DOCX)
- [ ] Afficher liste des documents uploadés avec taille et date
- [ ] Bouton "Supprimer" pour chaque document
- [ ] Stocker documents dans S3 via `storagePut()`
- [ ] Sauvegarder références documents dans table `agent_documents`

### Éditeur Prompts Système par Agent
- [ ] Textarea pour éditer le prompt système de chaque agent
- [ ] Prompt par défaut pré-rempli pour chaque type d'agent
- [ ] Compteur de tokens du prompt
- [ ] Bouton "Réinitialiser" pour revenir au prompt par défaut
- [ ] Sauvegarde automatique (debounced) ou bouton "Sauvegarder"
- [ ] Prévisualisation du prompt avec variables ({{variable}})

## 🗄️ BACKEND

### Routes tRPC
- [ ] `agents.list()` - Récupérer tous les agents avec leur config
- [ ] `agents.updateConfig()` - Mettre à jour modèle IA, prompt, etc.
- [ ] `agents.uploadDocument()` - Upload document RAG
- [ ] `agents.deleteDocument()` - Supprimer document RAG
- [ ] `agents.getDocuments()` - Lister documents d'un agent
- [ ] `platformConnections.saveApiKey()` - Sauvegarder clé API encryptée
- [ ] `platformConnections.testConnection()` - Tester connexion API

### Tables Database
- [ ] Créer table `agents` (id, name, type, model, systemPrompt, config, createdAt, updatedAt)
- [ ] Créer table `agent_documents` (id, agentId, fileName, fileUrl, fileSize, mimeType, uploadedAt)
- [ ] Ajouter indexes pour performance (agentId, type)
- [ ] Ajouter colonne `apiKeyEncrypted` dans `platform_connections`

## 📋 AGENTS PAR DÉFAUT

### Lead Scraper Agent
- **Modèle par défaut:** Gemini 2.0 Flash (GRATUIT)
- **Prompt système:** "Tu es un expert en scraping de leads B2B. Analyse les données de Google Maps et extrait les informations pertinentes (nom, adresse, téléphone, email, site web, note). Enrichis les leads avec des insights marketing."
- **Documents RAG:** Guide scraping, liste mots-clés secteurs

### Content Generator Agent
- **Modèle par défaut:** Claude Sonnet 4 (qualité premium)
- **Prompt système:** "Tu es un expert en copywriting marketing pour restaurants. Génère des posts LinkedIn engageants avec CTA clair, hashtags pertinents et ton professionnel mais chaleureux."
- **Documents RAG:** Guide brand voice, exemples posts performants

### Publisher Agent
- **Modèle par défaut:** Gemini 2.0 Flash (simple, pas besoin de premium)
- **Prompt système:** "Tu es responsable de la publication de contenus sur LinkedIn. Vérifie la qualité, optimise le timing et publie aux meilleurs moments pour maximiser l'engagement."
- **Documents RAG:** Best practices LinkedIn, calendrier éditorial

### Analyzer Agent
- **Modèle par défaut:** Llama 3.3 70B (bon rapport qualité/prix)
- **Prompt système:** "Tu es un analyste marketing data-driven. Analyse les performances des posts (likes, commentaires, partages) et génère des insights actionnables pour améliorer les futures campagnes."
- **Documents RAG:** Métriques clés, benchmarks industrie
