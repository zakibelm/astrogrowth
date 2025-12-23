# 🎯 AstroGrowth - Plan d'Implémentation Complet

## 📋 Vue d'Ensemble du Projet

**Vision** : Plateforme SaaS d'automatisation marketing B2B pour PME québécoises
**Proposition de valeur** : De la prospection à la conversion en pilote automatique - 10x plus rapide, 80% moins cher qu'une agence
**Marché cible MVP** : Restaurants, dentistes, agents immobiliers au Québec
**Budget infrastructure** : <100$/mois
**Timeline** : MVP en ~20h de développement

---

## 🏗️ PHASE 1 : ARCHITECTURE (2h)

### 1.1 Conception Architecture Complète
- [ ] Créer diagramme architecture Mermaid (services, flux de données, Redis Pub/Sub)
- [ ] Documenter choix techniques justifiés (pourquoi Redis vs API polling)
- [ ] Définir structure fichiers complète (tree view)
- [ ] Estimer performance (leads/heure, contenus/heure)
- [ ] Documenter limites techniques MVP (50 clients max, 500 leads/jour)

### 1.2 Configuration Infrastructure
- [ ] Setup PostgreSQL/MySQL (base de données principale)
- [ ] Setup Redis (Pub/Sub pour communication services)
- [ ] Configurer variables d'environnement (toutes les clés API)
- [ ] Documenter coûts infrastructure détaillés

### 1.3 Schéma Base de Données
- [ ] Table `users` (auth + profil business + tokens LinkedIn)
- [ ] Table `campaigns` (nom, industrie, localisation, statut, métriques)
- [ ] Table `leads` (business scraped + enrichissement + scoring)
- [ ] Table `contents` (texte, image, hashtags, quality score, statut)
- [ ] Table `publications` (tracking LinkedIn posts + engagement)
- [ ] Table `rate_limits` (gestion limites API LinkedIn)
- [ ] Relations et indexes optimisés

---

## 🔧 PHASE 2 : SERVICES BACKEND (6h)

### 2.1 AstroLeads - Scraping & Enrichissement
- [ ] Service scraping Google Maps (par industrie + localisation)
  - [ ] Intégration API Google Maps via proxy Manus
  - [ ] Extraction données : nom, adresse, téléphone, rating, reviews
  - [ ] Parsing et nettoyage des données
- [ ] Service enrichissement leads
  - [ ] Extraction email (via patterns ou API Hunter.io)
  - [ ] Validation format email/téléphone
  - [ ] Enrichissement données manquantes
- [ ] Système de scoring leads (0-100)
  - [ ] Algorithme basé sur complétude données
  - [ ] Poids : email (30%), phone (20%), rating (20%), reviews (15%), website (15%)
  - [ ] Calcul automatique à la création
- [ ] API REST FastAPI
  - [ ] `POST /api/scrape` - Lancer scraping campagne
  - [ ] `GET /api/leads/{campaign_id}` - Récupérer leads
  - [ ] `GET /api/leads/{id}` - Détails lead
- [ ] Redis Publisher
  - [ ] Publier événement `leads.ready` après scraping
  - [ ] Payload : campaign_id, lead_count, leads[]
  - [ ] Error handling si Redis down
  - [ ] Retry logic avec backoff exponentiel

### 2.2 AstroMedia - Génération Contenu IA
- [ ] Service génération texte (Gemini 2.0 Flash)
  - [ ] Prompt engineering par industrie (restaurant, dentiste, immobilier)
  - [ ] Personnalisation par lead (nom business, localisation, USP)
  - [ ] Génération hashtags optimisés (3-5 par post)
  - [ ] Ton français québécois professionnel
  - [ ] Longueur optimale LinkedIn (150-300 mots)
- [ ] Service génération images (Imagen 3)
  - [ ] Prompts visuels par industrie
  - [ ] Style cohérent et professionnel
  - [ ] Résolution optimale LinkedIn (1200x627px)
  - [ ] Upload vers stockage S3
- [ ] Système quality scoring
  - [ ] Analyse pertinence texte (0-100)
  - [ ] Vérification hashtags (présence, pertinence)
  - [ ] Vérification image générée (URL valide)
  - [ ] Score global : moyenne pondérée
  - [ ] Auto-approve si score >= 70
- [ ] API REST FastAPI
  - [ ] `POST /api/generate` - Générer contenu pour lead
  - [ ] `GET /api/contents/{campaign_id}` - Liste contenus
  - [ ] `PUT /api/contents/{id}/approve` - Approuver contenu
  - [ ] `PUT /api/contents/{id}/reject` - Rejeter contenu
- [ ] Redis Subscriber
  - [ ] Écouter événement `leads.ready`
  - [ ] Générer contenu pour chaque lead automatiquement
  - [ ] Publier événement `content.ready` après génération

### 2.3 Orchestrator - Glue Code
- [ ] Service central coordination
  - [ ] Gestion workflow complet : scraping → génération → publication
  - [ ] State machine campagne (draft, scraping, generating, publishing, completed)
  - [ ] Error recovery et retry logic
- [ ] Redis Pub/Sub bridge
  - [ ] Subscriber multi-événements
  - [ ] Publisher événements système
  - [ ] Message queue avec persistence
- [ ] Cron jobs
  - [ ] Vérification campagnes en cours (toutes les 5 min)
  - [ ] Cleanup données anciennes (daily)
  - [ ] Refresh tokens LinkedIn expirés (daily)
- [ ] API REST FastAPI (endpoints publics)
  - [ ] `GET /api/metrics` - Métriques dashboard
  - [ ] `POST /api/campaigns` - Créer campagne
  - [ ] `GET /api/campaigns` - Liste campagnes
  - [ ] `GET /api/campaigns/{id}` - Détails campagne

---

## 📱 PHASE 3 : DISTRIBUTION LINKEDIN (4h)

### 3.1 OAuth LinkedIn
- [ ] Flow OAuth 2.0 complet
  - [ ] Endpoint `/auth/linkedin` - Redirect vers LinkedIn
  - [ ] Endpoint `/auth/linkedin/callback` - Recevoir authorization code
  - [ ] Exchange code pour access_token + refresh_token
  - [ ] Stockage tokens encrypted (Fernet)
- [ ] Token management
  - [ ] Refresh automatique avant expiration (7 jours)
  - [ ] Gestion erreurs (token révoqué, expired)
  - [ ] Re-authentication flow si nécessaire
- [ ] Database schema
  - [ ] Champs `linkedinAccessToken`, `linkedinRefreshToken`, `linkedinTokenExpiry`
  - [ ] Encryption at rest (clé via env var)
  - [ ] Champ `linkedinConnected` (boolean)

### 3.2 Publication LinkedIn
- [ ] LinkedIn API client
  - [ ] `upload_image(image_url)` - Upload image, retourne asset URN
  - [ ] `create_post(text, image_urn, hashtags)` - Créer post
  - [ ] `get_post_analytics(post_id)` - Récupérer métriques
  - [ ] Error handling (API errors, rate limits)
- [ ] Auto-publication
  - [ ] Trigger après approbation contenu (manuel ou auto si score >= 70)
  - [ ] Vérifier LinkedIn connecté avant publication
  - [ ] Tracking post_url + date publication
  - [ ] Mise à jour statut contenu : pending → published
- [ ] Rate limiting intelligent
  - [ ] Redis-based rate limiter
  - [ ] Limite : 1 post / 15 min par utilisateur
  - [ ] Queue si limite atteinte
  - [ ] Notification utilisateur si délai

### 3.3 Analytics & Tracking
- [ ] Collecte métriques engagement
  - [ ] Likes, comments, shares, impressions
  - [ ] Cron job : fetch analytics toutes les 6h
  - [ ] Stockage dans table `publications`
- [ ] Agrégation métriques dashboard
  - [ ] Total engagement par campagne
  - [ ] Engagement par contenu
  - [ ] Tendances temporelles

---

## 🎨 PHASE 4 : DASHBOARD FRONTEND (4h)

### 4.1 Layout & Navigation
- [ ] Header
  - [ ] Logo AstroGrowth
  - [ ] Navigation : Dashboard, Campagnes, Contenus, Profil
  - [ ] Indicateur connexion LinkedIn (✅/❌)
  - [ ] Bouton déconnexion
- [ ] Sidebar (optionnel pour desktop)
  - [ ] Liens rapides
  - [ ] Support/Aide
- [ ] Responsive mobile-first
  - [ ] Breakpoints Tailwind (sm, md, lg)
  - [ ] Menu hamburger sur mobile
  - [ ] Touch-friendly buttons

### 4.2 Page Dashboard (index.html)
- [ ] Metrics Cards (4 KPIs)
  - [ ] Leads générés (total + variation)
  - [ ] Contenus créés (total + variation)
  - [ ] Posts publiés (total + variation)
  - [ ] Engagement total (likes + comments + shares)
- [ ] Détails engagement
  - [ ] Breakdown : Likes, Commentaires, Partages, Impressions
  - [ ] Graphique simple (optionnel)
- [ ] CTA principal
  - [ ] Bouton "Nouvelle Campagne" (prominent)
- [ ] Campagnes actives
  - [ ] Liste des 3-5 dernières campagnes
  - [ ] Statut visuel (en cours, terminée, erreur)
  - [ ] Métriques par campagne (leads, contenus, publiés)
  - [ ] Lien vers détails campagne
- [ ] Contenus récents
  - [ ] Gallery masonry (2-3 colonnes)
  - [ ] Preview image + texte (tronqué)
  - [ ] Badge statut (en attente, approuvé, publié)
  - [ ] Score qualité
  - [ ] Boutons action : 👍 Approuver / 👎 Rejeter
- [ ] Auto-refresh
  - [ ] Polling API /api/metrics toutes les 30s (Alpine.js)
  - [ ] Loading states (skeleton screens)
  - [ ] Optimistic UI sur actions

### 4.3 Page Nouvelle Campagne
- [ ] Wizard 3 étapes
  - [ ] Étape 1 : Nom campagne (input text)
  - [ ] Étape 2 : Type d'entreprise (select : restaurant, dentiste, agent immobilier, autre)
  - [ ] Étape 3 : Localisation (input text : ville, province)
  - [ ] Boutons : Précédent, Suivant, Lancer
- [ ] Validation formulaire
  - [ ] Champs requis
  - [ ] Messages d'erreur en français
- [ ] Confirmation & feedback
  - [ ] Message succès : "Campagne lancée ! Vous recevrez une notification quand les leads seront prêts."
  - [ ] Redirect vers page campagne ou dashboard

### 4.4 Page Détails Campagne
- [ ] Header campagne
  - [ ] Nom, industrie, localisation
  - [ ] Statut (badge coloré)
  - [ ] Dates création/complétion
- [ ] Métriques campagne
  - [ ] Leads générés
  - [ ] Contenus créés
  - [ ] Posts publiés
  - [ ] Engagement total
- [ ] Actions
  - [ ] Bouton "Générer plus de leads" (si status = completed)
  - [ ] Bouton "Générer contenus" (si leads prêts mais pas de contenus)
  - [ ] Bouton "Supprimer campagne" (avec confirmation)
- [ ] Liste leads
  - [ ] Table : Nom business, Ville, Score, Email, Téléphone
  - [ ] Tri et filtres
  - [ ] Export CSV (optionnel)
- [ ] Liste contenus
  - [ ] Même gallery que dashboard
  - [ ] Filtres par statut

### 4.5 Page Galerie Contenus
- [ ] Filtres
  - [ ] Par statut : Tous, En attente, Approuvés, Publiés, Rejetés
  - [ ] Par campagne (dropdown)
  - [ ] Par score qualité (slider)
- [ ] Actions en masse
  - [ ] Sélection multiple (checkboxes)
  - [ ] Approuver sélection
  - [ ] Rejeter sélection
- [ ] Modal preview contenu
  - [ ] Full screen
  - [ ] Image en grand
  - [ ] Texte complet
  - [ ] Hashtags
  - [ ] Score qualité avec breakdown
  - [ ] Actions : Approuver, Modifier (optionnel), Rejeter, Fermer

### 4.6 Page Profil/Settings
- [ ] Informations entreprise
  - [ ] Nom business
  - [ ] Type d'entreprise
  - [ ] Localisation
  - [ ] Téléphone
  - [ ] Website
  - [ ] Bouton "Sauvegarder"
- [ ] Connexion LinkedIn
  - [ ] Statut actuel (✅ Connecté / ❌ Déconnecté)
  - [ ] Bouton "Connecter LinkedIn" (si déconnecté)
  - [ ] Bouton "Déconnecter LinkedIn" (si connecté)
  - [ ] Dernière synchronisation
- [ ] Préférences
  - [ ] Langue (français par défaut)
  - [ ] Notifications email (on/off)
  - [ ] Auto-publication (on/off, seuil score)

### 4.7 Composants Réutilisables
- [ ] Loading spinner
- [ ] Toast notifications (succès, erreur, info)
- [ ] Modal confirmation
- [ ] Empty states (aucune campagne, aucun contenu, etc.)
- [ ] Error states (API down, etc.)

### 4.8 Accessibilité & UX
- [ ] ARIA labels sur tous éléments interactifs
- [ ] Navigation clavier (Tab, Enter, Escape)
- [ ] Focus visible
- [ ] Alt text sur toutes images
- [ ] Messages d'erreur descriptifs en français
- [ ] Copy en français québécois (pas de jargon technique)

---

## 🔗 PHASE 5 : INTÉGRATION (2h)

### 5.1 Workflow Complet End-to-End
- [ ] User crée campagne → API POST /api/campaigns
- [ ] Orchestrator lance AstroLeads scraping
- [ ] AstroLeads scrappe → publie `leads.ready`
- [ ] AstroMedia écoute → génère contenus → publie `content.ready`
- [ ] Si score >= 70 ET LinkedIn connecté → auto-publish
- [ ] Dashboard affiche métriques mises à jour

### 5.2 Error Handling Global
- [ ] Gestion erreurs API (4xx, 5xx)
- [ ] Retry logic avec backoff
- [ ] Fallback graceful (afficher message utilisateur)
- [ ] Logging structuré (JSON) pour debugging

### 5.3 Notifications Utilisateur
- [ ] Email notification "Leads prêts" (optionnel MVP)
- [ ] Email notification "Contenus publiés" (optionnel MVP)
- [ ] In-app notifications (toast)

---

## 🧪 PHASE 6 : TESTS & VALIDATION (2h)

### 6.1 Tests Unitaires Backend
- [ ] Tests AstroLeads scraping (mock Google Maps API)
- [ ] Tests AstroMedia génération (mock Gemini/Imagen)
- [ ] Tests scoring leads
- [ ] Tests quality scoring contenus
- [ ] Tests OAuth LinkedIn flow
- [ ] Tests rate limiting

### 6.2 Tests Intégration
- [ ] Test workflow complet avec données test
- [ ] Test Redis Pub/Sub communication
- [ ] Test auto-publication LinkedIn (mock API)

### 6.3 Données de Démonstration
- [ ] Script seed database
  - [ ] 1 utilisateur test (Marie, restaurant)
  - [ ] 2 campagnes (1 complétée, 1 en cours)
  - [ ] 10-15 leads avec scores variés
  - [ ] 8-10 contenus (statuts variés)
  - [ ] 3-5 publications avec métriques
- [ ] Exécuter seed et valider dashboard affiche correctement

### 6.4 Tests Manuels UX
- [ ] Parcours complet utilisateur (onboarding → première campagne → approbation contenu)
- [ ] Test responsive mobile (iPhone, Android)
- [ ] Test navigation clavier
- [ ] Test messages d'erreur
- [ ] Test performance (temps chargement pages)

### 6.5 Validation Métriques Business
- [ ] Time to first campaign < 5 min ✅
- [ ] Scraping 50 leads < 30 min ✅
- [ ] Génération 1 contenu < 3 sec ✅
- [ ] Quality score > 70 pour 75%+ contenus ✅
- [ ] Interface utilisable sans formation ✅

---

## 📦 PHASE 7 : LIVRAISON (1h)

### 7.1 Documentation
- [ ] README.md complet
  - [ ] Description projet
  - [ ] Architecture overview
  - [ ] Setup instructions
  - [ ] Variables d'environnement
  - [ ] Commandes utiles
- [ ] API Documentation
  - [ ] Endpoints avec exemples
  - [ ] Schémas request/response
- [ ] User Guide (optionnel)
  - [ ] Comment créer première campagne
  - [ ] Comment approuver contenus
  - [ ] Comment connecter LinkedIn

### 7.2 Déploiement
- [ ] Configuration production
  - [ ] Variables env production
  - [ ] SSL/HTTPS
  - [ ] Domain name
- [ ] Monitoring
  - [ ] Health checks endpoints
  - [ ] Logging centralisé
  - [ ] Alertes (optionnel MVP)

### 7.3 Checkpoint Final
- [ ] Vérifier toutes fonctionnalités opérationnelles
- [ ] Créer checkpoint avec description complète
- [ ] Préparer démo pour utilisateur

---

## 📊 MÉTRIQUES DE SUCCÈS MVP

### Techniques
- [ ] Scraping : 50 leads en < 30 min
- [ ] Génération contenu : 1 lead en < 3 sec
- [ ] Quality score : > 70 pour 75%+ contenus
- [ ] Page load : < 2 sec (dashboard)
- [ ] API response : < 500ms (95th percentile)
- [ ] Concurrent users : 20 simultanés sans dégradation

### Business
- [ ] Time to first campaign : < 5 min
- [ ] Content approval rate : > 75%
- [ ] Daily active usage : 80% clients
- [ ] Support tickets : < 5/semaine
- [ ] User satisfaction : 4+/5

### Infrastructure
- [ ] Coût infra : < 100$/mois
- [ ] Coût par client : ~8$/mois (APIs)
- [ ] Uptime : > 99%
- [ ] Max clients : 50 simultanés

---

## 🚀 PROCHAINES ÉTAPES POST-MVP

### Phase 2 Features
- [ ] Email nurturing sequences
- [ ] Instagram auto-publication
- [ ] Analytics avancés (engagement tracking détaillé)
- [ ] A/B testing contenus
- [ ] Templates par industrie
- [ ] Multi-utilisateurs par compte
- [ ] Intégrations CRM (HubSpot, Salesforce)
- [ ] Mobile app native
- [ ] White label option

---

## 📝 NOTES IMPORTANTES

### Contraintes Respectées
- ✅ Budget infra < 100$/mois
- ✅ Stack simple (Python + HTML/Tailwind, pas React)
- ✅ Réutilisation composants existants (concepts AstroLeads/AstroMedia)
- ✅ Support 50 clients max (MVP scope)
- ✅ Interface en français québécois
- ✅ Mobile-first responsive
- ✅ Workflow ultra-simple pour PME

### Standards Code
- ✅ Python : Type hints, docstrings Google style, error handling
- ✅ Frontend : HTML/Tailwind/Alpine.js (pas de build step)
- ✅ API : REST, JSON, status codes standards
- ✅ Security : JWT, bcrypt, encryption tokens, rate limiting
- ✅ Logging : Structured JSON logs
- ✅ Tests : Unitaires + intégration critiques

### Personas Servis
- ✅ Marie (Restaurant) : Interface visuelle, copy casual, approbation facile
- ✅ Dr. Jean (Dentiste) : Simplicité extrême, gros boutons, pas de jargon
