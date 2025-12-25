# AstroGrowth - Liste des Fonctionnalités

## 🔐 Authentification et Gestion des Utilisateurs
- [x] Système d'authentification avec OAuth Manus
- [x] Gestion des rôles (admin/user)
- [x] Profils utilisateurs pour propriétaires de PME
- [x] Page de profil avec informations entreprise

## 🎯 Génération de Leads
- [x] Module de scraping Google Maps
- [x] Recherche par industrie (restaurants, dentistes, agents immobiliers)
- [x] Recherche par localisation géographique
- [x] Enrichissement automatique avec email
- [x] Enrichissement automatique avec téléphone
- [x] Système de scoring de qualité (0-100)
- [x] Stockage des leads dans la base de données

## 📝 Génération de Contenu Marketing
- [x] Intégration Gemini 2.0 Flash pour génération de texte
- [x] Intégration Imagen 3 pour génération d'images
- [x] Personnalisation du contenu par lead
- [x] Génération de hashtags optimisés
- [x] Calcul automatique du score de qualité du contenu

## ✅ Système d'Approbation de Contenu
- [x] Interface de preview du contenu (texte + image)
- [x] Actions approuver/modifier/rejeter
- [x] Auto-publication si score supérieur à 70
- [x] Historique des approbations

## 📱 Publication LinkedIn
- [x] Configuration OAuth LinkedIn
- [x] Upload d'images vers LinkedIn
- [x] Création de posts avec texte et image
- [x] Rate limiting intelligent (éviter dépassement limites API)
- [x] Tracking des posts publiés
- [x] Gestion du refresh token

## 📊 Dashboard et Métriques
- [x] Dashboard principal avec métriques en temps réel
- [x] Compteur de leads générés
- [x] Compteur de contenus créés
- [x] Compteur de posts publiés
- [x] Métriques d'engagement
- [ ] Graphiques d'évolution temporelle
- [ ] Filtres par période

## 🚀 Système de Campagnes Marketing
- [x] Création de campagne guidée en 3 étapes
- [x] Étape 1: Nom de la campagne
- [x] Étape 2: Type d'entreprise cible
- [x] Étape 3: Localisation géographique
- [x] Liste des campagnes actives
- [x] Statut des campagnes (en cours, terminée, erreur)
- [x] Historique des campagnes

## 🖼️ Galerie de Contenus
- [x] Affichage en grille des contenus générés
- [x] Preview des images et textes
- [x] Filtres par statut (en attente, approuvé, rejeté, publié)
- [ ] Filtres par campagne
- [ ] Actions en masse pour approbation rapide
- [ ] Recherche dans les contenus

## 🔔 Notifications Propriétaire
- [x] Notification lors de création de nouvelle campagne
- [x] Notification quand les leads sont prêts
- [x] Notification en cas d'erreur système
- [x] Notification lors de publication réussie
- [ ] Centre de notifications dans l'interface

## 🎨 Interface Utilisateur
- [x] Design élégant et professionnel
- [x] Thème de couleurs cohérent
- [x] Navigation intuitive avec sidebar
- [x] Responsive design (mobile et desktop)
- [x] Animations fluides et micro-interactions
- [x] États de chargement élégants
- [x] Gestion des erreurs avec messages clairs
- [x] Interface en français canadien

## 🔧 Infrastructure et Configuration
- [x] Configuration des variables d'environnement
- [x] Schéma de base de données complet
- [x] Migrations de base de données
- [x] Tests unitaires pour les fonctionnalités critiques
- [x] Documentation du code
- [x] Gestion des erreurs et logging


## 🔧 Implémentation Fonctionnelle Réelle
- [x] Implémenter le scraping Google Maps réel avec l'API Maps
- [x] Tester la génération de contenu avec Gemini (texte fonctionnel)
- [x] Tester la génération d'images avec Imagen (images fonctionnelles)
- [x] Créer un script de seed avec données de démonstration
- [x] Workflow complet : créer campagne → générer leads → générer contenu → publier
- [x] Vérifier que toutes les fonctionnalités sont réellement opérationnelles


## 🔥 FONCTIONNALITÉS CONCRÈTES MANQUANTES

### Formulaire & Workflow
- [x] Formulaire création campagne qui déclenche VRAIMENT le scraping
- [x] Bouton "Générer leads" qui appelle l'API Google Maps
- [x] Affichage progression scraping en temps réel
- [x] Notification quand scraping terminé

### Liste de Leads Détaillée
- [x] Page dédiée liste de leads par campagne
- [x] Table avec TOUTES les colonnes : Nom, Adresse, Ville, Téléphone, Email, Site web, Rating, Score
- [x] Filtres et tri sur la table
- [x] Export CSV des leads
- [x] Bouton "Générer contenu" pour chaque lead

### Génération de Contenu Réelle
- [x] Bouton "Générer contenu pour tous les leads" sur page campagne
- [x] Appel API qui génère VRAIMENT texte + image pour chaque lead
- [x] Affichage progression génération
- [x] Preview du contenu généré avec image

### Workflow Complet Utilisable
- [x] Créer campagne → Scraper → Voir leads → Générer contenu → Approuver → Publier
- [x] Chaque étape doit être FONCTIONNELLE et TESTABLE
- [x] Données réelles à chaque étape (pas de placeholder)


## 🎨 RECONSTRUCTION SELON MAQUETTES FRONTEND

### Design System
- [x] Mettre à jour les couleurs dans index.css (vert primaire #00D084)
- [ ] Créer composants Card réutilisables avec variants
- [ ] Créer composants Badge avec couleurs par statut
- [ ] Définir spacing system cohérent

### Dashboard Principal
- [ ] Refaire Home.tsx avec layout exact des maquettes
- [ ] 4 cartes métriques avec icônes et grandes valeurs
- [ ] Section "Campagnes Actives" avec preview images
- [ ] Design mobile-first avec espacement généreux

### Formulaire Nouvelle Campagne
- [ ] Wizard multi-étapes (1/3, 2/3, 3/3)
- [ ] Étape 1 : Input nom de campagne
- [ ] Étape 2 : Dropdown type d'entreprise
- [ ] Étape 3 : Input localisation
- [ ] Bouton vert "Créer la campagne"
- [ ] Navigation entre étapes

### Liste de Leads
- [ ] Cards verticales avec photo restaurant
- [ ] Nom, adresse, téléphone sur chaque card
- [ ] Score coloré (vert/bleu/orange/rouge)
- [ ] Note Google avec étoiles
- [ ] Bouton d'action par lead

### Détails Restaurant
- [x] Page dédiée LeadDetails.tsx
- [x] Grande image en haut
- [x] Toutes infos contact (téléphone, email, site web)
- [x] Score et note Google bien visibles
- [x] Bouton "Générer du contenu" vert

### Approbation de Contenu
- [x] Page ContentApproval.tsx
- [x] Grande preview image générée
- [x] Texte marketing complet
- [x] Score de qualité affiché
- [x] Hashtags listés
- [x] 3 boutons : Approuver (vert) / Rejeter (rouge) / Modifier

### Analytics
- [ ] Page Analytics.tsx avec graphiques
- [ ] Intégration Chart.js ou Recharts
- [ ] Graphiques de performance temporelle
- [ ] Filtres par période

### Détails Campagne
- [ ] Refaire CampaignDetails.tsx selon maquette
- [ ] En-tête avec nom et badge statut
- [ ] 3 cartes métriques
- [ ] Boutons d'action principaux
- [ ] Listes leads et contenus avec preview

### États et Transitions
- [ ] Spinners de chargement élégants
- [ ] Messages de progression
- [ ] Animations de transition
- [ ] États vides avec messages clairs


## 🐛 CORRECTIONS BUGS

- [x] Corriger l'erreur React dans Home.tsx (setLocation appelé pendant le rendu au lieu de useEffect)


## 🚨 ÉLÉMENTS CRITIQUES MANQUANTS

### Navigation
- [x] Créer un bottom navigation bar pour mobile (visible dans les maquettes)
- [x] Icônes de navigation : Dashboard, Campagnes, Contenus, Profil
- [x] Navigation active avec highlight
- [ ] Menu hamburger pour options supplémentaires

### Pages à Reconstruire Exactement
- [x] Dashboard : Layout exact avec cards, espacement, typographie des maquettes
- [x] Liste de restaurants : Cards verticales avec images, layout exact
- [x] Tableau Market 1 : Vue détaillée restaurant avec grande photo en haut
- [x] Nouvelle campagne : Wizard avec indicateurs d'étapes visuels
- [x] Approbation contenu : Grande image + texte + boutons colorés
- [ ] Analytics : Graphiques et métriques selon maquettes
- [x] Vue campagne : Layout exact avec sections bien définies

### Design Exact
- [ ] Respecter les espacements exacts des maquettes
- [ ] Typographie : tailles de police exactes
- [ ] Cards : arrondis, ombres, padding exacts
- [ ] Boutons : style, taille, couleurs exacts
- [ ] Images : ratios et positionnement exacts


## 🐛 CORRECTION MENU NAVIGATION

- [x] Le bottom nav n'apparaît pas sur le dashboard - diagnostiquer le problème
- [x] Vérifier que AppLayout est bien appliqué à toutes les pages
- [x] Vérifier le z-index et le positionnement du bottom nav
- [x] S'assurer que le menu est visible sur mobile et desktop


## 🐛 CORRECTION NAVIGATION

- [x] Les clics sur les onglets du menu ne changent pas de page (navigation par URL fonctionne)
- [x] Vérifier le code de setLocation dans BottomNav
- [x] Tester la navigation vers toutes les pages (Campagnes, Contenus, Profil)


## 📏 PAGES MANQUANTES À CRÉER

Selon les maquettes fournies :

- [x] Page Analytics avec graphiques (visible dans les maquettes)
- [x] Page de liste de leads détaillée avec filtres
- [ ] Page de création de contenu (formulaire)
- [ ] Page de paramètres/configuration
- [ ] Page de notifications
- [x] Compléter le menu avec tous les onglets nécessaires (5 onglets maintenant)


## 🚀 CORRECTIONS PRIORITAIRES

- [x] Corriger la navigation par clic (utiliser setLocation correctement)
- [x] Ajouter filtres de période sur Analytics (7/30/90 jours)
- [x] Connecter workflow génération de leads avec barre de progression en temps réel

## 📄 NOUVELLES PAGES CRITIQUES

### Page Paramètres (Settings Hub)
- [ ] Créer la page Settings avec sections : Profil, Connexions, Clés API, Équipe, Facturation
- [ ] Section Profil Entreprise avec formulaire éditable
- [ ] Section Connexions Plateformes avec statut (3/8 connectés)
- [ ] Section Clés API avec OpenRouter et crédit restant
- [ ] Section Équipe d'Agents (8 agents actifs)
- [ ] Section Facturation avec plan et prochaine facture

### Page Connexions Plateformes
- [ ] Créer page avec 4 tabs : Réseaux Sociaux, Génération Média, Scraping, LLMs
- [ ] Tab Réseaux Sociaux : LinkedIn (connecté), Instagram, Facebook
- [ ] Tab Génération Média : Fal.ai, Imagen 3, DALL-E 3
- [ ] Tab Scraping : PhantomBuster, Apify, Bright Data
- [ ] Tab LLMs : OpenRouter avec multi-modèles
- [ ] Afficher statut, utilisation, permissions pour chaque plateforme
- [ ] Boutons Connecter/Déconnecter/Gérer pour chaque service

### Page Équipe d'Agents
- [ ] Créer page avec liste des 8 agents IA
- [ ] Card pour chaque agent : Explorateur, Qualifier, Copywriter, Designer, Testeur, Distributeur, Analyste, Orchestrateur
- [ ] Afficher rôle, modèle LLM, statut, métriques de performance
- [ ] Boutons Configurer/Modifier/Désactiver pour chaque agent
- [ ] Section statistiques globales de l'équipe

### Page Workflows Agents
- [ ] Créer page avec liste des workflows
- [ ] Workflow "Lead to Publish" avec visualisation des 7 étapes
- [ ] Workflow "Video Campaign" avec 5 étapes
- [ ] Workflow "Nurturing Sequence" avec séquence email
- [ ] Afficher statut, exécutions, temps moyen, taux de succès
- [ ] Visualisation graphique du flow avec conditions et fallbacks
- [ ] Bouton "Créer workflow personnalisé"

## 🗄️ BACKEND ARCHITECTURE

- [ ] Créer table platform_connections pour gérer les connexions
- [ ] Créer table ai_agents pour l'équipe d'agents
- [ ] Créer table agent_workflows pour les workflows
- [ ] Créer table workflow_executions pour tracking
- [ ] Créer service AgentOrchestrator en Python
- [ ] Implémenter exécution de workflow avec logging
- [ ] Ajouter fallbacks et retry logic


## 🔧 CORRECTION MENU NAVIGATION

- [x] Ajouter Paramètres au menu de navigation (remplacé Profil par Paramètres)
- [x] Équipe d'Agents accessible depuis la page Paramètres
- [x] Connexions Plateformes accessible depuis la page Paramètres
- [x] Workflows accessible depuis la page Paramètres
- [x] Décider si ces pages vont dans le bottom nav ou dans un menu hamburger/settings (choisi: Paramètres dans bottom nav)


## 🔗 LIENS NAVIGATION PARAMÈTRES

- [x] Ajouter des boutons/liens dans la page Paramètres vers Équipe d'Agents
- [x] Ajouter des boutons/liens dans la page Paramètres vers Connexions Plateformes
- [x] Ajouter des boutons/liens dans la page Paramètres vers Workflows
- [x] Rendre ces pages accessibles depuis Paramètres

- [x] Ajouter onClick au bouton "Dashboard global" dans la page Équipe d'Agents pour naviguer vers /
- [x] Vérifier tous les boutons similaires dans les autres pages (Connexions, Workflows)


## 🎨 AMÉLIORATIONS UI/UX CONCRÈTES ET VISIBLES

### Animations et Micro-interactions
- [ ] Ajouter animations de transition entre pages (fade-in)
- [x] Ajouter hover effects sur tous les boutons et cards
- [x] Ajouter animations de chargement élégantes (pulse, skeleton)
- [ ] Ajouter animations de succès/erreur (checkmark, shake)
- [ ] Ajouter transitions fluides sur les graphiques

### Dashboard Amélioré
- [x] Ajouter graphiques interactifs Chart.js (évolution leads/contenus)
- [ ] Ajouter graphique en temps réel des publications
- [ ] Ajouter mini-graphiques dans les cards métriques (sparklines)
- [ ] Ajouter section "Activité récente" avec timeline
- [ ] Ajouter section "Campagnes performantes" avec top 3

### Système de Notifications Toast
- [x] Implémenter système de notifications toast (sonner ou react-hot-toast)
- [x] Notifications succès (vert) pour actions réussies
- [x] Notifications erreur (rouge) pour erreurs
- [ ] Notifications info (bleu) pour informations
- [ ] Notifications warning (orange) pour avertissements
- [x] Afficher toasts pour toutes les actions (création, modification, suppression)

### Page Analytics Avancée
- [ ] Créer graphique ROI par campagne (coût vs leads générés)
- [ ] Créer graphique taux de conversion (leads → contenus → publications)
- [ ] Créer graphique engagement par type de contenu
- [ ] Créer graphique performance par localisation
- [ ] Ajouter export PDF des rapports analytics

### Amélioration Page Campagnes
- [ ] Ajouter barre de recherche pour filtrer campagnes
- [ ] Ajouter filtres par statut (actives, terminées, en pause)
- [ ] Ajouter tri par date, nombre de leads, performance
- [ ] Ajouter vue liste ET vue grille (toggle)
- [ ] Ajouter actions en masse (pause, reprendre, supprimer)

### Tooltips et Aide Contextuelle
- [ ] Ajouter tooltips sur tous les scores (explication calcul)
- [ ] Ajouter tooltips sur les métriques (définitions)
- [ ] Ajouter tooltips sur les boutons d'action
- [ ] Ajouter aide contextuelle "?" sur formulaires complexes
- [ ] Ajouter tour guidé pour nouveaux utilisateurs (intro.js)

### Validation Formulaires en Temps Réel
- [ ] Ajouter validation email en temps réel (regex)
- [ ] Ajouter validation téléphone en temps réel
- [ ] Ajouter indicateur de force pour mots de passe
- [ ] Ajouter suggestions auto-complétion pour localisations
- [ ] Ajouter messages d'erreur inline sous chaque champ

### États de Chargement Avancés
- [x] Créer skeletons pour toutes les pages (loading states)
- [x] Ajouter shimmer effect sur les skeletons
- [ ] Ajouter progress bars pour opérations longues
- [ ] Ajouter spinners contextuels sur boutons (loading state)
- [ ] Ajouter états vides avec illustrations (empty states)

### Page Paramètres Complète
- [ ] Section Profil avec avatar upload
- [ ] Section Notifications avec préférences (email, push, SMS)
- [ ] Section Sécurité avec 2FA
- [ ] Section API Keys avec génération/révocation
- [ ] Section Facturation avec historique paiements
- [ ] Section Thème (clair/sombre)

### Amélioration Mobile (Responsive)
- [ ] Optimiser layout mobile pour toutes les pages
- [ ] Ajouter swipe gestures pour navigation
- [ ] Optimiser taille des boutons pour touch (min 44px)
- [ ] Ajouter menu hamburger pour navigation secondaire
- [ ] Tester sur différentes tailles d'écran (iPhone, Android)

### Accessibilité (A11y)
- [ ] Ajouter labels ARIA sur tous les éléments interactifs
- [ ] Ajouter navigation clavier complète (tab, enter, esc)
- [ ] Ajouter focus visible sur tous les éléments
- [ ] Tester avec screen reader (NVDA, JAWS)
- [ ] Respecter ratios de contraste WCAG AA

### Performance Visuelle
- [ ] Optimiser images (lazy loading, WebP)
- [ ] Ajouter placeholders blur pour images
- [ ] Optimiser animations (GPU acceleration)
- [ ] Réduire bundle size (code splitting)
- [ ] Ajouter service worker pour cache



## 🎨 DESIGN INSPIRÉ DES MAQUETTES ANCIENNES

### Amélioration Dashboard
- [x] Réorganiser le layout avec espacement plus généreux
- [x] Améliorer les cards métriques avec icônes colorées et grandes valeurs
- [ ] Ajouter section "Campagnes Actives" avec preview images de restaurants
- [x] Améliorer le graphique avec design plus moderne
- [ ] Ajouter section "Activité Récente" en bas

### Amélioration Page Leads/Restaurants
- [ ] Créer des cards verticales avec grande image en haut
- [ ] Afficher nom, adresse, note Google, score sur chaque card
- [ ] Layout en grille responsive (1 col mobile, 2-3 cols desktop)
- [ ] Ajouter filtres en haut (score, localisation, industrie)

### Amélioration Formulaire Nouvelle Campagne
- [ ] Wizard visuel avec indicateurs d'étapes (1/3, 2/3, 3/3)
- [ ] Design plus aéré avec un seul champ par étape
- [ ] Boutons verts proéminents "Suivant" et "Créer la campagne"
- [ ] Illustrations ou icônes pour chaque étape

### Amélioration Approbation Contenu
- [ ] Grande image en haut (full width)
- [ ] Texte marketing bien lisible avec espacement
- [ ] Score de qualité avec badge coloré
- [ ] 3 boutons d'action bien visibles (Approuver vert, Rejeter rouge, Modifier bleu)

### Amélioration Générale
- [x] Augmenter l'espacement entre sections (plus de white space)
- [x] Utiliser des cards avec ombres subtiles
- [x] Boutons plus grands et plus visibles
- [x] Typographie plus grande pour les titres
- [ ] Images de restaurants/plats plus présentes



## 🔧 ARCHITECTURE COMPLÈTE V2 - ÉLÉMENTS MANQUANTS

### Page Connexions Plateformes (PRIORITÉ HAUTE)
- [x] Créer page avec 4 tabs : Réseaux Sociaux, Génération Média, Scraping, LLMs
- [x] Tab Réseaux Sociaux : LinkedIn (connecté), Instagram, Facebook, Twitter
- [x] Tab Génération Média : Fal.ai, Imagen 3, DALL-E 3, Stable Diffusion
- [x] Tab Scraping : PhantomBuster, Apify, Bright Data, Google Maps API
- [x] Tab LLMs : OpenRouter (multi-modèles), Hugging Face, Ollama
- [x] Afficher statut connexion (connecté/déconnecté) avec badge coloré
- [x] Afficher utilisation API (requêtes/mois, crédits restants)
- [x] Boutons Connecter/Déconnecter/Configurer pour chaque service
- [ ] Modal de configuration avec API keys et paramètres

### LLM Router Multi-Tier (PRIORITÉ HAUTE)
- [x] Créer service llmRouter.ts avec stratégie de fallback
- [x] Tier 1 (Primary): OpenRouter avec sélection de modèles
- [x] Liste modèles OpenRouter : Claude Sonnet 4, Gemini 2.0 Flash, Llama 3.3 70B, GPT-4
- [x] Tier 2 (Fallback): Hugging Face Inference API (gratuit)
- [x] Tier 3 (Emergency): Ollama (local, offline)
- [x] Implémenter retry logic avec exponential backoff
- [x] Logger tous les appels et erreurs
- [x] Tracking des coûts par modèle et par requête

### Gestion Crédits et Monitoring API
- [x] Créer table api_usage dans la base de données
- [x] Tracker requêtes par provider (OpenRouter, HuggingFace, Ollama)
- [x] Calculer coûts en temps réel par modèle
- [x] Afficher crédits restants dans l'interface
- [x] Alertes quand crédits < 20%
- [ ] Dashboard de monitoring avec graphiques d'utilisation
- [ ] Export CSV des logs d'utilisation

### Configuration OpenRouter
- [x] Créer section dans Connexions Plateformes pour OpenRouter
- [x] Dropdown sélection modèle primaire (Claude, Gemini, Llama, GPT-4)
- [x] Afficher prix par 1M tokens pour chaque modèle
- [x] Toggle fallback automatique vers modèles moins chers
- [ ] Configuration rate limiting par modèle
- [ ] Test de connexion avec bouton "Tester"

### Backend Services
- [x] Créer server/services/llmRouter.ts
- [x] Créer server/services/apiMonitoring.ts
- [ ] Créer server/services/platformConnections.ts
- [ ] Ajouter routes tRPC pour gestion des connexions
- [ ] Ajouter routes tRPC pour monitoring API
- [ ] Implémenter encryption des API keys (crypto)

### Base de Données
- [x] Créer table platform_connections (provider, apiKey, status, config)
- [x] Créer table api_usage (provider, model, tokens, cost, timestamp)
- [x] Créer table llm_requests (requestId, provider, model, prompt, response, cost)
- [x] Ajouter indexes pour performance

### Interface Utilisateur
- [ ] Badge "Crédits restants" dans le header
- [ ] Notification toast quand changement de provider (fallback)
- [ ] Page Analytics avec graphiques d'utilisation API
- [ ] Indicateur de santé des providers (vert/orange/rouge)



## 🔧 CORRECTIONS CONNEXIONS PLATEFORMES

### Affichage du vrai statut LinkedIn
- [x] Créer route tRPC platformConnections.getStatus() pour récupérer les statuts réels
- [x] Connecter PlatformConnectionsV2 à la base de données via tRPC
- [x] Afficher linkedinConnected depuis la table users
- [x] Afficher les vraies statistiques d'utilisation

### Modals de Configuration
- [x] Créer modal de configuration LinkedIn (OAuth flow)
- [x] Créer modal de configuration OpenRouter (API key input)
- [x] Créer modal de configuration Google Maps (API key input)
- [x] Créer modal de configuration Imagen 3 (API key input)
- [x] Bouton "Configurer" ouvre le bon modal selon la plateforme

### Routes tRPC
- [x] Créer router platformConnections dans routers.ts
- [x] Route getStatus() - Récupérer statuts de toutes les plateformes
- [ ] Route connect() - Initier connexion OAuth ou sauvegarder API key
- [x] Route disconnect() - Déconnecter une plateforme
- [ ] Route updateConfig() - Mettre à jour configuration d'une plateforme
- [ ] Route testConnection() - Tester une connexion API



## 🎨 CORRECTIONS ERGONOMIE + ANIMATIONS GSAP

### Problèmes Ergonomie à Corriger
- [x] Badge "Connecté" flotte au-dessus du titre - repositionner correctement
- [x] Texte coupé "OpenR..." - afficher le nom complet "OpenRouter"
- [x] Layout désorganisé - réorganiser avec flex/grid propre
- [x] Informations mal alignées - aligner correctement tous les éléments
- [x] Cards trop larges - optimiser la largeur et l'espacement

### Animations GSAP
- [x] Installer GSAP (pnpm add gsap)
- [x] Ajouter animations d'entrée GSAP pour les cards (stagger, fade, scale)
- [x] Ajouter animations hover GSAP sur les cards
- [ ] Ajouter animations de transition entre tabs
- [ ] Ajouter parallax subtil sur scroll

### Dégradés et Effets Boutons
- [x] Bouton "Configurer" avec dégradé bleu (from-blue-500 to-blue-700)
- [x] Bouton "Déconnecter" avec dégradé rouge (from-red-500 to-red-700)
- [x] Bouton "Connecter" avec dégradé vert (from-green-500 to-green-700)
- [x] Hover effects avec scale et brightness
- [ ] Animations de ripple sur click
- [x] Ombres dynamiques sur hover



## 🎯 PERSONNALISATION WORKFLOWS (PRIORITÉ CRITIQUE)

### Questionnaire Configuration Workflow
- [x] Créer page /workflows/:id/configure avec formulaire multi-étapes
- [x] Étape 1: Informations entreprise (nom, adresse, site web, téléphone)
- [x] Étape 2: Objectifs marketing (leads/mois, budget, KPIs)
- [x] Étape 3: Questions spécifiques au workflow choisi
- [x] Étape 4: Configuration agents individuels (personnaliser prompts)
- [x] Validation et sauvegarde configuration en DB

### Schema Business Profile
- [x] Ajouter champs workflow_config dans table user_workflows (JSON)
- [x] Stocker: businessInfo, marketingGoals, agentConfigs, customPrompts
- [ ] Créer table workflow_agent_configs pour config détaillée par agent

### Page "Mon Workflow Actif"
- [x] Créer page /my-workflow avec dashboard personnalisé
- [x] Section "Informations Business" (éditable)
- [x] Section "Agents Actifs" avec liste et statut
- [x] Section "Tâches en Cours" par agent (scraping, génération, publication)
- [x] Section "Résultats Générés" (leads, contenus, publications)
- [ ] Bouton "Modifier Configuration" pour chaque agent

### Personnalisation Automatique Agents
- [x] Injecter infos business dans prompts système de chaque agent
- [x] Template: "Tu travailles pour {businessName}, situé à {address}, site web {website}"
- [x] Ajouter objectifs: "Objectif: générer {leadsGoal} leads/mois dans le secteur {sector}"
- [ ] Permettre override manuel du prompt par l'utilisateur
- [x] Sauvegarder versions personnalisées des prompts

### Vue Claire Activité Agents
- [x] Dashboard temps réel montrant ce que fait chaque agent
- [x] "Lead Scraper: 15 leads trouvés aujourd'hui"
- [x] "Copywriter: 3 posts générés en attente d'approbation"
- [x] "Community Manager: 12 commentaires répondus"
- [x] Timeline d'activité avec horodatage
- [ ] Logs détaillés accessibles par agent


## 🎬 WORKFLOWS VIDÉO (VEO 3 & WAN 2)

### Workflow Créateur de Reels (Veo 3)
- [x] Créer workflow "reels-creator" dans la base de données
- [x] Agent Scriptwriter Reels (scripts 15-60s optimisés)
- [x] Agent Veo 3 Generator (génération vidéo avec Veo 3)
- [x] Agent Video Editor (montage, transitions, effets)
- [x] Agent Hashtag Optimizer (hashtags viraux)
- [x] Agent Multi-Platform Publisher (Instagram, TikTok, YouTube Shorts)

### Workflow Créateur de Stories (Wan 2)
- [x] Créer workflow "stories-creator" dans la base de données
- [x] Agent Story Designer (design stories verticales 9:16)
- [x] Agent Wan 2 Generator (génération vidéo rapide avec Wan 2)
- [x] Agent Text Overlay (ajout texte animé)
- [x] Agent Music Selector (musique tendance)
- [x] Agent Auto-Publisher Stories (Instagram, Facebook)

### Intégration APIs Vidéo
- [ ] Intégrer API Veo 3 pour génération Reels (backend)
- [ ] Intégrer API Wan 2 pour génération Stories (backend)
- [ ] Configurer paramètres vidéo (résolution, durée, format)
- [ ] Gestion file d'attente génération vidéo
- [ ] Stockage vidéos générées sur S3


## 🎯 MISSION WORKFLOW GLOBALE

### Prompt Mission Stratégique
- [x] Ajouter champ "Mission Workflow" dans questionnaire configuration
- [x] Question: "Décrivez l'objectif stratégique principal de ce workflow (ex: Générer 50 leads/mois, Augmenter notoriété locale, Lancer nouveau produit)"
- [x] Champ textarea pour description détaillée de la mission
- [x] Ajouter KPIs cibles spécifiques (nombre, délai, budget)
- [x] Stocker dans workflowConfig.workflowMission

### Injection Mission dans Prompts Agents
- [x] Modifier agent-personalization.ts pour ajouter section MISSION WORKFLOW
- [x] Injecter la mission au début de chaque prompt agent
- [x] Format: "MISSION WORKFLOW: {workflowMission} - Ton rôle dans cette mission: {agent-specific-role}"
- [x] Assurer cohérence entre tous les agents du même workflow
- [x] Permettre aux agents de référencer la mission dans leurs décisions


## 🌍 INTERNATIONALISATION

### Sélecteur Pays et Téléphone International
- [x] Ajouter liste complète de 50+ pays majeurs dans WorkflowConfigure
- [x] Remplacer champ "Province" par "State/Province/Region" dynamique selon pays
- [x] Ajouter sélecteur indicatif téléphonique (+33, +1, +44, +971, etc.)
- [ ] Validation format téléphone selon pays sélectionné
- [x] Adapter format code postal selon pays (ZIP, Postal Code, etc.)

### Multi-Devises
- [x] Ajouter sélecteur devise (USD, EUR, GBP, CAD, AED, etc.)
- [x] Stocker devise préférée dans localStorage (via useCurrency hook)
- [x] Afficher prix workflows dans devise sélectionnée
- [x] Taux de conversion automatique (taux fixes)
- [x] Format monétaire adapté ($ avant/après, espace, virgule/point)

### Support Multi-Langues (FR, EN, AR)
- [x] Intégrer bibliothèque i18n (react-i18next)
- [x] Créer fichiers traduction: fr.json, en.json, ar.json
- [ ] Traduire interface complète (navigation, formulaires, messages)
- [ ] Sélecteur langue dans header (FR par défaut)
- [ ] Support RTL pour arabe (direction: rtl)
- [ ] Stocker préférence langue dans localStorage

### Exemples Internationaux
- [x] Remplacer "Montréal, Québec" par exemples variés
- [x] Exemples: Paris, New York, Dubai dans placeholders
- [x] Adapter secteurs d'activité pour marché international (10 secteurs)
- [ ] Workflows templates avec exemples multi-pays
- [ ] Témoignages clients internationaux


## 💵 SIMPLIFICATION DEVISE USD UNIQUEMENT

- [x] Retirer sélecteur devise du formulaire WorkflowConfigure
- [x] Simplifier useCurrency hook pour retourner toujours USD
- [x] Mettre à jour affichage prix workflows (USD uniquement)
- [x] Retirer champ currency de businessInfo
- [x] Mettre à jour base de données (prix en USD)


## 🎨 CRÉATEUR DE WORKFLOW PERSONNALISÉ

- [ ] Créer table `custom_workflows` (user_id, name, description, selected_agents JSON)
- [ ] Page `/workflows/create` avec interface de sélection agents
- [ ] Afficher les 48 agents avec checkboxes pour sélection
- [ ] Filtres par département (Direction, Prospection, Contenu, etc.)
- [ ] Drag & drop pour définir ordre d'exécution
- [ ] Calculateur prix automatique selon agents sélectionnés
- [ ] Prévisualisation workflow avant sauvegarde
- [ ] Routes tRPC: `customWorkflows.create()`, `customWorkflows.list()`

## 🤖 CRÉATEUR D'AGENT IA PERSONNALISÉ

- [ ] Créer table `custom_agents` (user_id, name, role, systemPrompt, model, tools JSON)
- [ ] Page `/agents/create` avec formulaire création agent
- [ ] Champs: Nom, Emoji, Rôle, Description, Mission
- [ ] Éditeur prompt système avec syntaxe highlighting
- [ ] Sélecteur modèle IA (GPT-4, Claude, Gemini, Llama)
- [ ] Sélecteur outils disponibles (web_search, image_gen, etc.)
- [ ] Test agent en temps réel avant sauvegarde
- [ ] Galerie agents personnalisés dans `/agents` avec badge "Custom"
- [ ] Routes tRPC: `customAgents.create()`, `customAgents.list()`, `customAgents.test()`


## 🔄 WORKFLOW BUILDER SÉQUENTIEL (DRAG & DROP)

### Interface Drag & Drop
- [x] Refaire WorkflowCreator.tsx avec layout 2 colonnes
- [x] Colonne gauche: Liste des 48 agents disponibles (filtres département)
- [x] Colonne droite: Zone canvas pour construire le workflow
- [x] Drag & drop agents de gauche vers droite
- [x] Réorganiser agents dans le canvas (changer ordre)
- [x] Numérotation automatique des étapes (1, 2, 3...)
- [x] Bouton "Retirer" pour supprimer agent du workflow

### Visualisation Flow
- [x] Afficher flèches entre agents (Agent 1 → Agent 2 → Agent 3)
- [x] Highlight agent actif pendant drag
- [x] Animation smooth lors du drop
- [ ] Afficher output/input entre agents
- [ ] Vue compacte vs vue détaillée (toggle)

### Prompt Système Workflow
- [x] Champ textarea "Mission du Workflow" (description globale)
- [x] Champ "Nom du Workflow"
- [x] Champ "Description courte"
- [x] Validation: minimum 2 agents requis
- [x] Calculateur prix automatique (somme agents)

### Sauvegarde et Activation
- [x] Bouton "Sauvegarder Workflow"
- [x] Stocker ordre des agents (array avec positions)
- [x] Stocker prompt système workflow
- [ ] Permettre édition workflow après création
- [ ] Permettre activation workflow personnalisé


## 🐛 CORRECTION ERREUR REACT KEY

- [x] Corriger l'erreur "Each child in a list should have a unique key prop" dans WorkflowCreator
- [x] Ajouter keys uniques sur filteredAgents.map()
- [x] Vérifier toutes les listes dans le composant


## 🔄 AMÉLIORATION WORKFLOW BUILDER

### Réorganisation Drag & Drop Canvas
- [x] Permettre drag & drop ENTRE agents dans le canvas
- [x] Glisser Agent 3 avant Agent 1 pour changer l'ordre
- [x] Utiliser type "workflow-agent" distinct de "agent"
- [x] Animation smooth lors du réordonnancement
- [x] Mise à jour automatique de la numérotation

### Prompt Système Enrichi Orchestrateur
- [x] Section dédiée "Instructions pour l'Orchestrateur"
- [x] Expliquer comment coordonner les agents
- [x] Définir les critères de succès du workflow
- [x] Gestion des erreurs et fallbacks
- [x] Format structuré pour le prompt système

### Visualisation Rôles Agents
- [x] Afficher sous chaque agent son rôle dans la mission
- [x] Badge "Rôle: Lead Generation" sous l'agent
- [ ] Highlight connexions entre agents (output → input)
- [ ] Suggestions d'ordre optimal selon bonnes pratiques


## 🎯 SYSTÈME COMPLET ORCHESTRATION WORKFLOWS

### Phase 1: Persistance DB Workflows Personnalisés
- [x] Implémenter createCustomWorkflow() dans server/db-agents.ts
- [x] Sauvegarder: nom, description, mission, agents (JSON array avec ordre), prix
- [x] Implémenter listCustomWorkflows(userId) pour récupérer workflows créés
- [x] Remplacer routes tRPC mock par vraies fonctions DB

### Phase 2: Galerie Workflows Personnalisés
- [x] Afficher workflows personnalisés dans /workflows avec badge "Personnalisé"
- [x] Bouton "Activer" qui redirige vers /workflows/:id/configure
- [ ] Permettre édition workflow personnalisé (/workflows/:id/edit)
- [ ] Permettre suppression workflow personnalisé

### Phase 3: Orchestrateur Backend
- [ ] Créer server/orchestrator.ts avec classe WorkflowOrchestrator
- [ ] Méthode executeWorkflow(workflowId, userId, config)
- [ ] Lecture mission système + agents + ordre depuis DB
- [ ] Exécution séquentielle: Agent 1 → validation → Agent 2 → validation → Agent 3
- [ ] Appel LLM pour chaque agent avec prompt personnalisé
- [ ] Validation output entre étapes (orchestrateur vérifie qualité)
- [ ] Gestion erreurs et retry (max 3 tentatives)

### Phase 4: Logs et Monitoring
- [ ] Table workflow_executions (workflowId, userId, status, startedAt, completedAt)
- [ ] Table workflow_execution_logs (executionId, agentId, step, status, output, error)
- [ ] Route tRPC executions.getStatus(executionId)
- [ ] Route tRPC executions.getLogs(executionId)
- [ ] Page /executions/:id avec timeline d'exécution en temps réel
- [ ] WebSocket pour updates live pendant exécution
