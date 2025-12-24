# TODO: Simplifier Architecture LLM

## Objectif
Retirer Ollama de l'architecture puisque OpenRouter + Hugging Face donnent déjà accès à tous les modèles nécessaires.

## Tâches

### LLM Router
- [x] Mettre à jour `server/services/llmRouter.ts` pour retirer Tier 3 (Ollama)
- [x] Simplifier la logique de fallback : OpenRouter → Hugging Face
- [x] Retirer les imports et fonctions liés à Ollama

### Page Connexions Plateformes
- [x] Retirer la card "Ollama" du tab LLMs
- [x] Mettre à jour la description pour refléter l'architecture 2-tier
- [x] Garder uniquement OpenRouter et Hugging Face

### Documentation
- [ ] Mettre à jour README.md
- [ ] Mettre à jour ARCHITECTURE.md
- [ ] Mettre à jour les commentaires dans le code

## Architecture Finale

**Tier 1 (Primary): OpenRouter**
- Claude Sonnet 4 ($3/1M tokens)
- Gemini 2.0 Flash (GRATUIT)
- Llama 3.3 70B ($0.35/1M tokens)
- GPT-4 ($10/1M tokens)
- Mistral Large
- Et tous les autres modèles disponibles sur OpenRouter

**Tier 2 (Fallback): Hugging Face Inference API**
- Modèles open-source gratuits
- Fallback automatique si OpenRouter échoue
- Rate limiting géré par HF

## Avantages
- ✅ Architecture plus simple (2 tiers au lieu de 3)
- ✅ Pas de dépendance locale (Ollama)
- ✅ Tous les modèles accessibles via API
- ✅ Coûts optimisés (Gemini gratuit sur OpenRouter)
- ✅ Fallback robuste avec HF gratuit
