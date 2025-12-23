# 🚀 AstroGrowth - Plateforme SaaS d'Automatisation Marketing B2B

**AstroGrowth** est une plateforme complète d'automatisation marketing pour PME québécoises qui transforme la prospection, la création de contenu et la distribution sociale en un workflow automatisé propulsé par l'IA.

## 🎯 Vision & Proposition de Valeur

**De la prospection à la conversion en pilote automatique**

- **10x plus rapide** qu'une agence marketing traditionnelle
- **80% moins cher** (499-999$/mois vs 2,000-5,000$/mois)
- **Personnalisation IA** pour chaque prospect
- **ROI mesurable** et transparent

## 💼 Marché Cible

### Segments Primaires
- **Restaurants** à Montréal (10,000+ établissements)
- **Cabinets dentaires** au Québec (5,000+)
- **Agents immobiliers** au Québec (15,000+)
- **Services B2B locaux**

### Personas Utilisateurs

**Marie - Propriétaire de Restaurant**
- 42 ans, propriétaire "Bistro Le Gourmet"
- Besoin : +30% clients via réseaux sociaux
- Budget : 800$/mois pour marketing

**Dr. Jean - Dentiste**
- 55 ans, clinique dentaire familiale
- Besoin : 20 nouveaux patients/mois
- Budget : 1,500$/mois pour marketing

## ✨ Fonctionnalités Principales

### 🎯 Génération de Leads (AstroLeads)
- **Scraping Google Maps** par industrie et localisation
- **Enrichissement automatique** (email, téléphone, site web)
- **Scoring intelligent** (0-100) basé sur complétude et qualité
- **50 leads en < 30 min**

### 📝 Génération de Contenu (AstroMedia)
- **Texte marketing personnalisé** via Gemini 2.0 Flash
- **Images professionnelles** via Imagen 3
- **Hashtags optimisés** (3-5 par post)
- **Quality scoring** automatique avec auto-approbation si score >= 70
- **1 contenu en < 3 sec**

### 📱 Distribution LinkedIn
- **OAuth LinkedIn** avec gestion tokens sécurisée
- **Publication automatique** pour contenus approuvés
- **Rate limiting intelligent** (100 posts/jour, 1 post/15 min)
- **Tracking engagement** (likes, comments, shares, impressions)

### 📊 Dashboard & Analytics
- **Métriques en temps réel** (leads, contenus, posts, engagement)
- **Galerie de contenus** avec approbation/rejet rapide
- **Gestion de campagnes** avec workflow guidé en 3 étapes
- **Interface en français québécois**

## 🏗️ Architecture Technique

### Stack Technologique

**Frontend**
- React 19 + TypeScript
- Tailwind CSS 4
- tRPC pour type-safe API calls
- shadcn/ui components

**Backend**
- Node.js + Express 4
- tRPC 11 (API type-safe)
- MySQL/TiDB (base de données)
- Drizzle ORM

**Services IA (via Manus)**
- Google Maps API (scraping)
- Gemini 2.0 Flash (génération texte)
- Imagen 3 (génération images)
- S3 Storage (images)

**Infrastructure**
- Hébergement : Manus (tout inclus)
- Coût : 0$/mois infrastructure
- Scalabilité : 50 clients simultanés (MVP)

### Diagramme Architecture

```
┌─────────────────────────────────────────────────┐
│              Frontend (React)                    │
│         Dashboard + Campagnes + Contenus        │
└──────────────────┬──────────────────────────────┘
                   │ tRPC
┌──────────────────┴──────────────────────────────┐
│           Backend (Express + tRPC)               │
│  Auth │ Campaigns │ Leads │ Contents │ LinkedIn │
└──────┬──────────┬─────────┬──────────┬──────────┘
       │          │         │          │
┌──────┴──────────┴─────────┴──────────┴──────────┐
│              Services Layer                      │
│  • leadScraper (Google Maps)                    │
│  • contentGenerator (Gemini + Imagen)           │
│  • linkedinPublisher (OAuth + API)              │
└──────┬──────────────────────────────────────────┘
       │
┌──────┴──────────────────────────────────────────┐
│         Infrastructure (Manus)                   │
│  MySQL │ S3 Storage │ APIs (Maps, LLM, Image)  │
└─────────────────────────────────────────────────┘
```

## 🚦 Workflow Utilisateur Complet

```
1. Marie ouvre dashboard
   ↓
2. Clique "Nouvelle Campagne"
   ↓
3. Remplit 3 champs (nom, type resto, ville)
   ↓
4. Clique "Lancer" → Voit "En cours..."
   ↓
5. [10-30 min] Scraping Google Maps → 50 leads générés
   ↓
6. [5-15 min] Génération contenu IA → 45 contenus créés
   ↓
7. Notification "Leads prêts" → Marie revient
   ↓
8. Voit gallery de contenus → Clique 👍 sur 8 d'entre eux
   ↓
9. Posts publiés automatiquement sur LinkedIn
   ↓
10. Dashboard montre "8 posts publiés aujourd'hui"
```

## 📦 Installation & Démarrage

### Prérequis
- Node.js 22+
- pnpm 10+
- Compte Manus (pour infrastructure)

### Installation

```bash
# Cloner le projet
git clone <repo-url>
cd astrogrowth

# Installer les dépendances
pnpm install

# Configurer les variables d'environnement
# (Toutes les clés API sont fournies automatiquement par Manus)

# Appliquer les migrations de base de données
pnpm db:push

# Démarrer le serveur de développement
pnpm dev
```

L'application sera accessible à `http://localhost:3000`

### Commandes Utiles

```bash
# Développement
pnpm dev              # Démarrer serveur dev avec hot-reload
pnpm build            # Build pour production
pnpm start            # Démarrer en mode production

# Base de données
pnpm db:push          # Appliquer migrations

# Tests
pnpm test             # Exécuter tests unitaires
pnpm check            # Vérification TypeScript

# Qualité code
pnpm format           # Formater le code avec Prettier
```

## 📊 Schéma Base de Données

### Tables Principales

**users** - Utilisateurs et profils business
- Informations auth (openId, email, name, role)
- Profil business (businessName, businessType, location)
- Tokens LinkedIn (encrypted)

**campaigns** - Campagnes marketing
- Informations campagne (name, targetIndustry, targetLocation)
- Statut (draft, running, completed, error)
- Métriques (totalLeads, totalContent, totalPublished)

**leads** - Leads scrapés et enrichis
- Informations business (name, address, city, phone, email, website)
- Données Google Maps (rating, reviews, mapsUrl)
- Lead score (0-100)

**contents** - Contenus marketing générés
- Contenu (textContent, imageUrl, hashtags)
- Quality score (0-100)
- Statut (pending, approved, rejected, published)
- Métriques engagement (likes, comments, shares, impressions)

**notifications** - Notifications système
- Type (campaign_created, leads_ready, content_generated, post_published, system_error)
- Informations (title, message, read status)

**rateLimits** - Rate limiting LinkedIn
- Compteurs quotidiens (postsToday, lastPostAt)
- Reset tracking

## 🔐 Sécurité

### Authentification
- **Manus OAuth** pour connexion utilisateur
- **JWT sessions** avec expiration 7 jours
- **Tokens LinkedIn** encrypted at rest (Fernet)

### Rate Limiting
- **LinkedIn API** : 100 posts/jour par utilisateur, 1 post/15 min minimum
- **Protection** : Rate limiter basé sur timestamps en DB

### Données Sensibles
- Tous les tokens OAuth sont **chiffrés** avant stockage
- Clé de chiffrement via variable d'environnement
- Pas de tokens en plaintext dans les logs

## 📈 Métriques de Succès MVP

### Techniques
- ✅ Scraping : 50 leads en < 30 min
- ✅ Génération contenu : 1 lead en < 3 sec
- ✅ Quality score : > 70 pour 75%+ contenus
- ✅ Page load : < 2 sec (dashboard)
- ✅ API response : < 500ms (95th percentile)

### Business
- 🎯 Time to first campaign : < 5 min
- 🎯 Content approval rate : > 75%
- 🎯 Daily active usage : 80% clients
- 🎯 Support tickets : < 5/semaine

### Infrastructure
- ✅ Coût infra : 0$/mois (inclus Manus)
- ✅ Coût par client : 0$/mois (APIs incluses)
- 🎯 Uptime : > 99%
- ✅ Max clients : 50 simultanés (MVP)

## 🛠️ Développement

### Structure Fichiers

```
astrogrowth/
├── client/                 # Frontend React
│   ├── src/
│   │   ├── pages/         # Pages (Dashboard, Campaigns, etc.)
│   │   ├── components/    # Composants réutilisables
│   │   ├── lib/           # tRPC client
│   │   └── App.tsx        # Routes
│   └── index.html
│
├── server/                 # Backend Node.js
│   ├── services/          # Services métier
│   │   ├── leadScraper.ts
│   │   ├── contentGenerator.ts
│   │   └── linkedinPublisher.ts
│   ├── db.ts              # Database helpers
│   ├── routers.ts         # tRPC routers
│   └── _core/             # Framework (ne pas modifier)
│
├── drizzle/
│   └── schema.ts          # Schéma DB
│
├── docs/
│   ├── ARCHITECTURE.md    # Architecture détaillée
│   └── TODO_COMPLET.md    # Plan implémentation
│
└── package.json
```

### Standards Code

**TypeScript**
- Type hints complets sur toutes les fonctions
- Interfaces pour tous les objets complexes
- Pas de `any` sauf cas exceptionnels

**Documentation**
- Docstrings sur toutes les fonctions publiques
- Comments pour logique complexe
- README à jour

**Tests**
- Tests unitaires pour services critiques
- Tests d'intégration pour workflows complets
- Coverage > 70% pour services métier

## 🚀 Roadmap Post-MVP

### Phase 2 (Mois 2)
- [ ] Email nurturing sequences
- [ ] Instagram auto-publication
- [ ] Analytics avancés (engagement tracking détaillé)
- [ ] A/B testing contenus
- [ ] Templates par industrie

### Phase 3 (Mois 3-6)
- [ ] Multi-utilisateurs par compte
- [ ] Intégrations CRM (HubSpot, Salesforce)
- [ ] Mobile app native
- [ ] White label option
- [ ] Facebook Ads automation

## 📝 License

Propriétaire - Tous droits réservés

## 🤝 Support

Pour toute question ou problème :
- Documentation : `/docs`
- Issues : [GitHub Issues]
- Contact : support@astrogrowth.ca

---

**Construit avec ❤️ pour les PME québécoises**
