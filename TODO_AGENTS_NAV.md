# TODO: Ajouter Équipe d'Agents au Menu Bottom Nav

## Objectif
Rendre la page Équipe d'Agents accessible directement depuis le menu bottom nav pour les utilisateurs, séparée de Paramètres (admin).

## Tâches

### Navigation Bottom Nav
- [x] Modifier `client/src/components/BottomNav.tsx`
- [x] Remplacer "Analytics" par "Agents" dans le menu
- [x] Utiliser icône Brain ou Users pour Agents
- [x] Path: `/agents`

### Page Settings
- [x] Retirer le bouton "Gérer l'équipe →" de la page Settings
- [x] Garder uniquement les sections admin (Connexions, Clés API, Facturation)

### Tests
- [x] Vérifier navigation vers /agents depuis bottom nav
- [x] Vérifier que Settings reste accessible pour admin
- [x] Tester sur mobile et desktop

## Justification

**Séparation des rôles:**
- **Paramètres** → Admin uniquement (connexions plateformes, clés API, facturation)
- **Équipe d'Agents** → Utilisateur (personnalisation prompts, modèles, documents RAG)

Chaque utilisateur doit pouvoir configurer ses propres agents sans accéder aux paramètres admin.
