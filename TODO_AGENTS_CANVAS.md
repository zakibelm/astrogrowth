# TODO: Refonte Page Équipe d'Agents - Vue Canevas

## Objectif
Transformer la page Équipe d'Agents en vue canevas avec cards compactes et popup de configuration.

## Tâches

### Vue Canevas (Page Principale)
- [x] Créer layout grille 2x2 ou 4 colonnes responsive
- [x] Cards compactes pour chaque agent avec :
  - [x] Icône/emoji de l'agent
  - [x] Nom de l'agent
  - [x] Description courte (1-2 lignes)
  - [x] Mission principale
  - [x] Badge "Actif/Inactif"
  - [x] Bouton engrenage (⚙️) toujours visible en haut à droite
- [x] Hover effects sur les cards
- [x] Animations GSAP d'entrée

### Popup de Configuration
- [x] Modal/Dialog qui s'ouvre au click sur engrenage
- [x] Contenu du popup :
  - [x] Header avec nom agent et bouton fermer (X)
  - [x] Section "Modèle IA" avec dropdown
  - [x] Section "Prompt Système" avec textarea
  - [x] Section "Documents RAG" avec upload
  - [x] Bouton "Sauvegarder" en bas
- [x] Animations d'ouverture/fermeture
- [x] Backdrop blur

### Design
- [x] Cards avec glassmorphism subtil
- [x] Dégradés de couleur par agent
- [x] Icônes lucide-react pour engrenage
- [x] Responsive mobile/desktop

## Structure Agents

**Lead Scraper** 🔍
- Mission: Scraper et enrichir les leads depuis Google Maps
- Rôle: Analyser données brutes, extraire informations, scorer qualité

**Content Generator** ✍️
- Mission: Générer des posts LinkedIn engageants
- Rôle: Créer copywriting adapté, inclure CTA, ajouter hashtags

**Publisher** 📱
- Mission: Publier les contenus sur LinkedIn
- Rôle: Vérifier qualité, optimiser timing, valider guidelines

**Analyzer** 📊
- Mission: Analyser performances et générer insights
- Rôle: Tracker métriques, identifier patterns, générer recommandations
