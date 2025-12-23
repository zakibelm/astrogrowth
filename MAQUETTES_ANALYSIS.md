# Analyse des Maquettes Frontend

## 📱 Écrans Identifiés

### 1. **Tableau de Bord Principal** (Dashboard)
- **Éléments** :
  - En-tête avec titre "AstroGrowth"
  - 4 cartes de métriques (Leads, Contenus, Posts, Engagement)
  - Section "Campagnes Actives" avec liste de campagnes
  - Chaque campagne affiche : nom, statut, type, localisation, stats (leads/contenus/publiés)
  - Image de preview du contenu
  - Bouton d'action principal vert

### 2. **Nouvelle Campagne** (Formulaire Multi-étapes)
- **Étape 1** : Nom de la campagne
- **Étape 2** : Type d'entreprise cible
- **Étape 3** : Localisation
- Bouton vert "Créer la campagne"
- Navigation par étapes (1/3, 2/3, 3/3)

### 3. **Liste de Restaurants/Leads**
- **Éléments** :
  - Liste verticale de cartes
  - Chaque carte : nom restaurant, adresse, téléphone, score
  - Note Google avec étoiles
  - Bouton d'action par restaurant
  - Filtres en haut

### 4. **Tableau Market 1** (Vue détaillée restaurant)
- **Sections** :
  - Photo du restaurant
  - Nom et adresse
  - Informations de contact (téléphone, email, site web)
  - Score de qualité
  - Note Google
  - Bouton "Générer du contenu"

### 5. **Approbation de Contenu**
- **Éléments** :
  - Preview de l'image générée (grande)
  - Texte marketing complet
  - Score de qualité (ex: 88/100)
  - Hashtags
  - Boutons d'action : Approuver (vert) / Rejeter (rouge) / Modifier

### 6. **Vue Détaillée Campagne**
- **Sections** :
  - En-tête avec nom campagne et statut
  - Métriques (leads, contenus, posts)
  - Actions : "Générer des leads", "Générer du contenu"
  - Liste des leads générés
  - Liste des contenus créés

### 7. **Analytics** (Graphiques)
- **Éléments** :
  - Graphiques de performance (lignes, barres)
  - Métriques temporelles
  - Évolution des leads/contenus/engagement
  - Période sélectionnable

### 8. **Création de Contenu** (Génération IA)
- **Éléments** :
  - Formulaire avec paramètres
  - Preview en temps réel
  - Bouton "Générer avec IA"
  - État de chargement pendant génération

### 9. **Dashboard Analytique**
- **Éléments** :
  - Vue d'ensemble des campagnes
  - Graphiques de performance
  - Liste des contenus récents
  - Métriques d'engagement détaillées

### 10. **États de Chargement**
- Spinners
- Messages de progression
- Animations de transition

## 🎨 Design System Identifié

### Couleurs
- **Primaire** : Vert (#00D084 ou similaire) - Boutons d'action
- **Secondaire** : Bleu clair pour badges "En cours"
- **Fond** : Blanc/Gris très clair
- **Texte** : Noir/Gris foncé
- **Succès** : Vert
- **Erreur** : Rouge
- **Warning** : Orange

### Typographie
- Titres : Bold, grande taille
- Corps : Regular, taille moyenne
- Métriques : Bold, très grande taille
- Labels : Small, gris

### Composants
- **Cards** : Arrondies, ombre légère, padding généreux
- **Boutons** : Arrondis, vert primaire, texte blanc
- **Badges** : Arrondis, couleurs selon statut
- **Images** : Arrondies, ratio 16:9 ou carré
- **Inputs** : Bordure grise, focus vert
- **Icons** : Lucide React (Users, FileText, Send, etc.)

### Layout
- **Mobile-first** : Design optimisé pour mobile
- **Espacement** : Généreux entre éléments
- **Navigation** : Bottom nav ou top nav
- **Grilles** : 1 colonne sur mobile, 2-3 sur desktop

## 📋 Plan d'Implémentation

### Phase 1 : Restructurer le Design System
- [ ] Mettre à jour index.css avec couleurs exactes des maquettes
- [ ] Créer composants réutilisables (Card, Badge, Button avec variants)
- [ ] Définir spacing system cohérent

### Phase 2 : Dashboard Principal
- [ ] Refaire Home.tsx selon maquette
- [ ] 4 cartes métriques avec icônes
- [ ] Section campagnes actives avec preview images
- [ ] Navigation vers autres pages

### Phase 3 : Formulaire Nouvelle Campagne
- [ ] Refaire NewCampaign.tsx avec wizard multi-étapes
- [ ] Étape 1 : Nom
- [ ] Étape 2 : Type d'entreprise (dropdown)
- [ ] Étape 3 : Localisation
- [ ] Navigation entre étapes
- [ ] Validation et création

### Phase 4 : Pages de Leads
- [ ] Refaire LeadsList.tsx selon maquette
- [ ] Cards verticales avec toutes infos
- [ ] Scores colorés
- [ ] Notes Google avec étoiles
- [ ] Boutons d'action par lead

### Phase 5 : Détails Restaurant
- [ ] Créer page LeadDetails.tsx
- [ ] Grande image en haut
- [ ] Toutes informations de contact
- [ ] Score et note Google
- [ ] Bouton "Générer contenu"

### Phase 6 : Approbation de Contenu
- [ ] Créer page ContentApproval.tsx
- [ ] Grande preview image
- [ ] Texte complet
- [ ] Score de qualité
- [ ] 3 boutons : Approuver / Rejeter / Modifier

### Phase 7 : Analytics
- [ ] Créer page Analytics.tsx
- [ ] Intégrer Chart.js ou Recharts
- [ ] Graphiques de performance
- [ ] Filtres temporels

### Phase 8 : Détails Campagne
- [ ] Refaire CampaignDetails.tsx selon maquette
- [ ] En-tête avec statut
- [ ] Métriques
- [ ] Actions principales
- [ ] Listes leads et contenus

## 🚀 Priorités

1. **Critique** : Dashboard, Nouvelle Campagne, Liste Leads
2. **Important** : Détails Restaurant, Approbation Contenu
3. **Nice to have** : Analytics, Graphiques avancés

## ✅ Checklist de Conformité

Pour chaque écran :
- [ ] Layout identique à la maquette
- [ ] Couleurs exactes
- [ ] Typographie cohérente
- [ ] Espacement fidèle
- [ ] Boutons aux bons endroits
- [ ] Icons appropriées
- [ ] États de chargement
- [ ] Responsive mobile
- [ ] Navigation fonctionnelle
