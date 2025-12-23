# 🏗️ AstroGrowth - Architecture Complète

## 📋 Vue d'Ensemble

**AstroGrowth** est une plateforme SaaS d'automatisation marketing B2B qui orchestre trois composants principaux :
- **AstroLeads** : Scraping Google Maps + enrichissement leads
- **AstroMedia** : Génération contenu IA (Gemini + Imagen)
- **Dashboard** : Interface web simple pour PME

**Communication** : Redis Pub/Sub pour découplage et scalabilité
**Base de données** : MySQL/PostgreSQL centralisée
**Hébergement** : Manus (infrastructure incluse)

---

## 🎯 Diagramme Architecture Globale

```mermaid
graph TB
    subgraph "Frontend"
        UI[Dashboard HTML/Tailwind<br/>Alpine.js]
    end
    
    subgraph "Backend Services"
        API[API Gateway<br/>tRPC/Express]
        LEADS[AstroLeads Service<br/>Scraping + Enrichissement]
        MEDIA[AstroMedia Service<br/>Génération Contenu IA]
        LINKEDIN[LinkedIn Service<br/>OAuth + Publication]
    end
    
    subgraph "Infrastructure"
        DB[(MySQL Database<br/>Users, Campaigns, Leads, Contents)]
        REDIS[(Redis<br/>Pub/Sub + Rate Limiting)]
        S3[S3 Storage<br/>Images générées]
    end
    
    subgraph "External APIs"
        GMAPS[Google Maps API<br/>via Manus Proxy]
        GEMINI[Gemini 2.0 Flash<br/>via Manus LLM]
        IMAGEN[Imagen 3<br/>via Manus Image Gen]
        LAPI[LinkedIn API<br/>OAuth + Publishing]
    end
    
    UI -->|tRPC calls| API
    API -->|SQL| DB
    API -->|Trigger scraping| LEADS
    API -->|Trigger generation| MEDIA
    API -->|Publish content| LINKEDIN
    
    LEADS -->|Scrape places| GMAPS
    LEADS -->|Save leads| DB
    LEADS -->|Publish 'leads.ready'| REDIS
    
    MEDIA -->|Subscribe 'leads.ready'| REDIS
    MEDIA -->|Generate text| GEMINI
    MEDIA -->|Generate image| IMAGEN
    MEDIA -->|Upload image| S3
    MEDIA -->|Save content| DB
    MEDIA -->|Publish 'content.ready'| REDIS
    
    LINKEDIN -->|Subscribe 'content.approved'| REDIS
    LINKEDIN -->|OAuth flow| LAPI
    LINKEDIN -->|Upload image| LAPI
    LINKEDIN -->|Create post| LAPI
    LINKEDIN -->|Save publication| DB
    
    API -->|Rate limit check| REDIS
```

---

## 🔄 Workflow Utilisateur Complet

```mermaid
sequenceDiagram
    actor Marie as Marie<br/>(Propriétaire Restaurant)
    participant UI as Dashboard
    participant API as API Gateway
    participant DB as Database
    participant LEADS as AstroLeads
    participant REDIS as Redis Pub/Sub
    participant MEDIA as AstroMedia
    participant LI as LinkedIn Service
    participant LAPI as LinkedIn API
    
    Note over Marie,LAPI: 1. Création Campagne (2 min)
    Marie->>UI: Clique "Nouvelle Campagne"
    UI->>Marie: Formulaire 3 étapes
    Marie->>UI: Remplit (nom, type, ville)
    UI->>API: POST /api/campaigns
    API->>DB: INSERT campaign (status='scraping')
    API->>LEADS: Trigger scraping
    API->>UI: 201 Created
    UI->>Marie: "Campagne lancée ! Vous serez notifiée."
    
    Note over Marie,LAPI: 2. Scraping Leads (10-30 min)
    LEADS->>LEADS: Scrape Google Maps (50 places)
    LEADS->>LEADS: Enrich (email, phone)
    LEADS->>LEADS: Score leads (0-100)
    LEADS->>DB: INSERT leads (bulk)
    LEADS->>DB: UPDATE campaign (status='generating')
    LEADS->>REDIS: PUBLISH 'leads.ready' {campaign_id, leads[]}
    
    Note over Marie,LAPI: 3. Génération Contenu (5-15 min)
    MEDIA->>REDIS: SUBSCRIBE 'leads.ready'
    REDIS->>MEDIA: Message received
    loop Pour chaque lead
        MEDIA->>MEDIA: Generate text (Gemini)
        MEDIA->>MEDIA: Generate image (Imagen)
        MEDIA->>MEDIA: Calculate quality score
        MEDIA->>DB: INSERT content
        alt Score >= 70 AND LinkedIn connected
            MEDIA->>REDIS: PUBLISH 'content.approved' {content_id}
        end
    end
    MEDIA->>DB: UPDATE campaign (status='ready')
    
    Note over Marie,LAPI: 4. Approbation Contenu (30 sec - 2 min)
    Marie->>UI: Ouvre dashboard
    UI->>API: GET /api/contents/pending
    API->>DB: SELECT contents WHERE status='pending'
    API->>UI: Contents list
    UI->>Marie: Gallery avec preview
    Marie->>UI: Clique 👍 sur contenu
    UI->>API: POST /api/contents/:id/approve
    API->>DB: UPDATE content (status='approved')
    API->>REDIS: PUBLISH 'content.approved' {content_id}
    API->>UI: 200 OK
    UI->>Marie: Toast "Contenu approuvé !"
    
    Note over Marie,LAPI: 5. Publication LinkedIn (immédiate)
    LI->>REDIS: SUBSCRIBE 'content.approved'
    REDIS->>LI: Message received
    LI->>DB: SELECT content + user LinkedIn tokens
    LI->>LAPI: Upload image
    LAPI->>LI: asset_urn
    LI->>LAPI: Create post (text + image_urn)
    LAPI->>LI: post_url + post_id
    LI->>DB: INSERT publication
    LI->>DB: UPDATE content (status='published')
    
    Note over Marie,LAPI: 6. Consultation Métriques (quotidien)
    Marie->>UI: Ouvre dashboard
    UI->>API: GET /api/metrics
    API->>DB: Aggregate metrics
    API->>UI: {leads: 50, contents: 45, published: 38, engagement: 234}
    UI->>Marie: Dashboard avec KPIs
```

---

## 📊 Schéma Base de Données

```mermaid
erDiagram
    users ||--o{ campaigns : creates
    users ||--o{ user_profiles : has
    campaigns ||--o{ leads : contains
    campaigns ||--o{ contents : generates
    contents ||--o{ publications : published_as
    
    users {
        int id PK
        string openId UK
        string email
        string name
        enum role
        timestamp createdAt
        timestamp lastSignedIn
    }
    
    user_profiles {
        int id PK
        int userId FK
        string businessName
        string businessType
        string location
        string phone
        string website
        string linkedinAccessToken "encrypted"
        string linkedinRefreshToken "encrypted"
        timestamp linkedinTokenExpiry
        boolean linkedinConnected
        timestamp createdAt
        timestamp updatedAt
    }
    
    campaigns {
        int id PK
        int userId FK
        string name
        string industry
        string location
        enum status "draft|scraping|generating|ready|completed|error"
        int leadsCount
        int contentsCount
        int publishedCount
        json errorDetails
        timestamp createdAt
        timestamp completedAt
    }
    
    leads {
        int id PK
        int campaignId FK
        string businessName
        string address
        string city
        string province
        string postalCode
        string phone
        string email
        string website
        float rating
        int reviewCount
        string placeId
        int leadScore "0-100"
        json rawData
        timestamp createdAt
    }
    
    contents {
        int id PK
        int campaignId FK
        int leadId FK
        text contentText
        string imageUrl
        json hashtags
        int qualityScore "0-100"
        enum status "pending|approved|rejected|published"
        json scoreBreakdown
        timestamp createdAt
        timestamp approvedAt
    }
    
    publications {
        int id PK
        int contentId FK
        int userId FK
        string platform "linkedin|instagram"
        string postUrl
        string postId
        int likes
        int comments
        int shares
        int impressions
        timestamp publishedAt
        timestamp lastSyncedAt
    }
    
    rate_limits {
        int id PK
        int userId FK
        string resource "linkedin_post|api_call"
        int count
        timestamp windowStart
        timestamp windowEnd
    }
```

---

## 🔐 Sécurité & Authentification

### Flow Authentification

```mermaid
sequenceDiagram
    actor User
    participant UI as Dashboard
    participant API as API Gateway
    participant OAuth as Manus OAuth
    participant DB as Database
    
    User->>UI: Clique "Se connecter"
    UI->>OAuth: Redirect /oauth/login
    OAuth->>User: Page login Manus
    User->>OAuth: Email + Password
    OAuth->>OAuth: Validate credentials
    OAuth->>UI: Redirect /oauth/callback?code=xxx
    UI->>API: POST /api/auth/callback {code}
    API->>OAuth: Exchange code for tokens
    OAuth->>API: {access_token, user_info}
    API->>DB: Upsert user
    API->>API: Generate JWT session
    API->>UI: Set-Cookie session_token
    UI->>User: Redirect /dashboard
```

### Stockage Tokens LinkedIn

```python
# Encryption des tokens LinkedIn
from cryptography.fernet import Fernet

# Clé de chiffrement (env var)
ENCRYPTION_KEY = os.getenv("ENCRYPTION_KEY")  # 32 bytes base64
cipher = Fernet(ENCRYPTION_KEY)

# Encrypt avant stockage
encrypted_token = cipher.encrypt(access_token.encode())
await db.execute(
    "UPDATE user_profiles SET linkedinAccessToken = ? WHERE userId = ?",
    (encrypted_token, user_id)
)

# Decrypt avant utilisation
encrypted = await db.fetchone("SELECT linkedinAccessToken FROM user_profiles WHERE userId = ?", (user_id,))
access_token = cipher.decrypt(encrypted).decode()
```

---

## ⚡ Performance & Scalabilité

### Estimations Performance

| Opération | Temps Cible | Réel Estimé | Notes |
|-----------|-------------|-------------|-------|
| Scraping 50 leads | < 30 min | 10-15 min | Dépend API Google Maps |
| Génération 1 contenu | < 3 sec | 1-2 sec | Gemini + Imagen parallèle |
| Publication LinkedIn | < 5 sec | 2-3 sec | Upload image + create post |
| Page load dashboard | < 2 sec | 0.5-1 sec | Avec cache Redis |
| API response (95th) | < 500 ms | 200-300 ms | Queries optimisées |

### Limites Techniques MVP

| Ressource | Limite | Justification |
|-----------|--------|---------------|
| Clients simultanés | 50 max | Budget infra + APIs |
| Leads/jour (total) | 500 | Rate limit Google Maps |
| Contenus/jour (total) | 500 | Rate limit Gemini/Imagen |
| Posts LinkedIn/user | 100/jour | Limite API LinkedIn |
| Concurrent requests | 20 | Single server instance |
| Database connections | 10 | PostgreSQL pool |
| Redis connections | 5 | Pub/Sub + cache |

### Stratégie Scaling Post-MVP

```mermaid
graph LR
    subgraph "MVP (50 clients)"
        S1[Single Server<br/>All services]
    end
    
    subgraph "Phase 2 (200 clients)"
        LB[Load Balancer]
        S2A[Server 1<br/>API + Dashboard]
        S2B[Server 2<br/>AstroLeads]
        S2C[Server 3<br/>AstroMedia]
        LB --> S2A
        LB --> S2B
        LB --> S2C
    end
    
    subgraph "Phase 3 (1000+ clients)"
        K8S[Kubernetes Cluster<br/>Auto-scaling]
    end
    
    S1 -.Upgrade.-> LB
    S2A -.Migrate.-> K8S
```

---

## 💰 Coûts Infrastructure Détaillés

### Coûts Fixes (par mois)

| Service | Plan | Coût | Notes |
|---------|------|------|-------|
| Hébergement Manus | Inclus | 0$ | Infrastructure incluse |
| MySQL Database | Inclus | 0$ | Base de données incluse |
| Redis | Inclus | 0$ | Pub/Sub inclus |
| S3 Storage | Inclus | 0$ | Stockage images inclus |
| **Total Infrastructure** | | **0$/mois** | Tout inclus dans Manus |

### Coûts Variables (par client/mois)

Hypothèse : 1 client = 100 leads/mois + 100 contenus/mois

| API | Utilisation | Coût Unitaire | Coût Total |
|-----|-------------|---------------|------------|
| Google Maps (via Manus) | 100 places | Inclus | 0$ |
| Gemini 2.0 Flash (via Manus) | 100 générations | Inclus | 0$ |
| Imagen 3 (via Manus) | 100 images | Inclus | 0$ |
| LinkedIn API | 100 posts | Gratuit | 0$ |
| **Total par client** | | | **0$/mois** |

**Marge sur plan Starter (499$)** : 499$ (100%) 🎉

---

## 🔧 Choix Techniques Justifiés

### Pourquoi Redis Pub/Sub vs API Polling ?

| Critère | Redis Pub/Sub ✅ | API Polling ❌ |
|---------|------------------|----------------|
| **Latence** | Temps réel (< 1ms) | 5-30 sec (polling interval) |
| **Charge serveur** | Faible (event-driven) | Élevée (polling continu) |
| **Scalabilité** | Excellente (découplage) | Limitée (couplage fort) |
| **Complexité** | Moyenne (setup Redis) | Faible (HTTP simple) |
| **Coût** | Inclus Manus | Inclus Manus |
| **Fiabilité** | Haute (retry + persistence) | Moyenne (peut manquer events) |

**Décision** : Redis Pub/Sub pour temps réel et scalabilité

### Pourquoi HTML/Tailwind vs React ?

| Critère | HTML/Tailwind ✅ | React ❌ |
|---------|------------------|----------|
| **Courbe apprentissage** | Nulle (HTML standard) | Élevée (JSX, hooks, state) |
| **Performance** | Excellente (pas de JS lourd) | Bonne (mais bundle size) |
| **Build time** | 0 sec (pas de build) | 10-30 sec |
| **Maintenance** | Simple (1 fichier HTML) | Complexe (composants, deps) |
| **Mobile** | Natif responsive | Nécessite optimisation |
| **SEO** | Parfait (HTML pur) | Nécessite SSR |

**Décision** : HTML/Tailwind pour simplicité et performance

### Pourquoi MySQL vs MongoDB ?

| Critère | MySQL ✅ | MongoDB ❌ |
|---------|----------|------------|
| **Relations** | Natives (FK, JOIN) | Manuelles (refs) |
| **Transactions** | ACID complet | Limitées |
| **Requêtes complexes** | SQL puissant | Aggregation pipeline complexe |
| **Intégrité données** | Forte (contraintes) | Faible (schemaless) |
| **Coût Manus** | Inclus | Inclus |
| **Expertise équipe** | Élevée | Moyenne |

**Décision** : MySQL pour relations et intégrité

---

## 📁 Structure Fichiers Complète

```
astrogrowth/
├── client/                          # Frontend
│   ├── public/
│   │   ├── logo.svg
│   │   └── favicon.ico
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Home.tsx            # Landing page
│   │   │   ├── Dashboard.tsx        # Dashboard principal
│   │   │   ├── NewCampaign.tsx      # Création campagne (wizard 3 étapes)
│   │   │   ├── CampaignDetails.tsx  # Détails campagne + leads + contenus
│   │   │   ├── ContentGallery.tsx   # Galerie tous contenus avec filtres
│   │   │   └── Profile.tsx          # Profil + settings + LinkedIn connect
│   │   ├── components/
│   │   │   ├── ui/                  # shadcn/ui components
│   │   │   ├── MetricCard.tsx       # Card KPI réutilisable
│   │   │   ├── ContentCard.tsx      # Card contenu avec preview
│   │   │   ├── CampaignCard.tsx     # Card campagne
│   │   │   ├── LoadingSpinner.tsx
│   │   │   ├── Toast.tsx
│   │   │   └── Modal.tsx
│   │   ├── lib/
│   │   │   └── trpc.ts              # tRPC client
│   │   ├── App.tsx                  # Routes
│   │   ├── main.tsx                 # Entry point
│   │   └── index.css                # Tailwind + custom styles
│   └── index.html
│
├── server/                          # Backend
│   ├── services/
│   │   ├── leadScraper.ts           # AstroLeads - Scraping Google Maps
│   │   ├── leadEnricher.ts          # Enrichissement email/phone
│   │   ├── leadScorer.ts            # Scoring 0-100
│   │   ├── contentGenerator.ts      # AstroMedia - Génération texte (Gemini)
│   │   ├── imageGenerator.ts        # Génération images (Imagen)
│   │   ├── qualityScorer.ts         # Scoring qualité contenu
│   │   ├── linkedinOAuth.ts         # OAuth LinkedIn flow
│   │   ├── linkedinPublisher.ts     # Publication LinkedIn
│   │   ├── rateLimiter.ts           # Rate limiting Redis-based
│   │   └── redisPublisher.ts        # Redis Pub/Sub wrapper
│   ├── db.ts                        # Database helpers
│   ├── routers.ts                   # tRPC routers
│   ├── _core/                       # Framework code (ne pas modifier)
│   │   ├── index.ts
│   │   ├── context.ts
│   │   ├── trpc.ts
│   │   ├── llm.ts
│   │   ├── imageGeneration.ts
│   │   └── map.ts
│   └── *.test.ts                    # Tests unitaires
│
├── drizzle/
│   └── schema.ts                    # Schéma DB complet
│
├── shared/
│   └── const.ts                     # Constantes partagées
│
├── storage/
│   └── index.ts                     # S3 helpers
│
├── scripts/
│   ├── seed-demo-data.mjs           # Seed données démo
│   └── migrate-db.mjs               # Migrations manuelles si besoin
│
├── docs/
│   ├── ARCHITECTURE.md              # Ce fichier
│   ├── TODO_COMPLET.md              # Plan implémentation
│   └── API.md                       # Documentation API
│
├── package.json
├── tsconfig.json
├── tailwind.config.js
├── vite.config.ts
└── README.md
```

---

## 🚀 Prochaines Étapes

1. ✅ **Architecture définie** (ce document)
2. ⏭️ **Phase 2** : Implémenter services backend
3. ⏭️ **Phase 3** : Implémenter distribution LinkedIn
4. ⏭️ **Phase 4** : Créer dashboard frontend
5. ⏭️ **Phase 5** : Intégration complète
6. ⏭️ **Phase 6** : Tests et validation
7. ⏭️ **Phase 7** : Livraison et documentation

---

**Document créé le** : 2025-12-23
**Auteur** : Manus AI
**Version** : 1.0
