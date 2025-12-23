import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  ArrowLeft,
  Bot,
  Settings,
  Play,
  Pause,
  Trash2,
  Save,
  RotateCcw,
  Edit,
  FileText,
  BarChart3,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { useLocation } from "wouter";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

/**
 * Page Équipe d'Agents IA
 * Gestion avancée des 8 agents avec configuration LLM, prompts, RAG et métriques
 */

interface Agent {
  id: string;
  name: string;
  emoji: string;
  status: "active" | "paused";
  model: string;
  modelCost: string;
  modelLatency: string;
  prompt: string;
  promptLength: number;
  ragDocuments: string[];
  ragChunks: number;
  performance: {
    processed: number;
    avgScore: number;
    avgTime: number;
    successRate: number;
  };
}

const agents: Agent[] = [
  {
    id: "explorateur",
    name: "Agent Explorateur",
    emoji: "🔍",
    status: "active",
    model: "google/gemini-2.0-flash-exp:free",
    modelCost: "Gratuit",
    modelLatency: "~1.2s",
    prompt: "Tu es un expert en prospection B2B. Ton rôle est d'analyser et scorer les leads selon leur potentiel commercial...",
    promptLength: 567,
    ragDocuments: ["guide_prospection.pdf (234 KB)", "criteres_scoring.md (12 KB)", "industries_quebec.csv (45 KB)"],
    ragChunks: 1234,
    performance: {
      processed: 1234,
      avgScore: 78,
      avgTime: 2.3,
      successRate: 94
    }
  },
  {
    id: "qualifier",
    name: "Agent Qualifier",
    emoji: "🎯",
    status: "active",
    model: "openai/gpt-4o-mini",
    modelCost: "~0.15$/1000 tokens",
    modelLatency: "~0.8s",
    prompt: `Tu es un expert en qualification de leads B2B. Analyse chaque lead selon ces critères:

CRITÈRES DE SCORING (0-100):
- Email professionnel trouvé : +20
- Présence LinkedIn active : +15
- Site web moderne : +10
- Reviews Google > 4.0 : +15
- Localisation prioritaire : +10
- Taille entreprise (employés) : +15
- Secteur à fort potentiel : +15

Retourne UNIQUEMENT un JSON:
{
  "score": 85,
  "reasoning": "...",
  "strengths": [...],
  "weaknesses": [...]
}`,
    promptLength: 1234,
    ragDocuments: ["ICP_ideal_customer_profile.md", "scoring_rules_v2.json", "competitors_analysis.pdf"],
    ragChunks: 892,
    performance: {
      processed: 1156,
      avgScore: 82,
      avgTime: 1.8,
      successRate: 96
    }
  },
  {
    id: "copywriter",
    name: "Agent Copywriter",
    emoji: "✍️",
    status: "active",
    model: "anthropic/claude-3.5-sonnet",
    modelCost: "~3$/1M tokens",
    modelLatency: "~1.5s",
    prompt: "Tu es un copywriter expert en marketing B2B québécois. Crée des posts LinkedIn engageants et authentiques qui génèrent des conversations...",
    promptLength: 892,
    ragDocuments: ["best_linkedin_posts.md", "tone_of_voice_guide.pdf", "hashtags_strategy.csv"],
    ragChunks: 567,
    performance: {
      processed: 892,
      avgScore: 88,
      avgTime: 3.2,
      successRate: 92
    }
  },
  {
    id: "designer",
    name: "Agent Designer",
    emoji: "🎨",
    status: "active",
    model: "fal-ai/flux-pro",
    modelCost: "~0.05$/image",
    modelLatency: "~8s",
    prompt: "Génère des images professionnelles et attrayantes pour les posts marketing. Style moderne, couleurs vibrantes, composition équilibrée...",
    promptLength: 445,
    ragDocuments: ["brand_guidelines.pdf", "visual_examples.zip"],
    ragChunks: 234,
    performance: {
      processed: 756,
      avgScore: 91,
      avgTime: 8.5,
      successRate: 89
    }
  },
  {
    id: "testeur",
    name: "Agent Testeur",
    emoji: "🧪",
    status: "active",
    model: "openai/gpt-4o-mini",
    modelCost: "~0.15$/1000 tokens",
    modelLatency: "~0.9s",
    prompt: "Tu es un expert en A/B testing et optimisation de contenu. Évalue la qualité du contenu selon des critères objectifs...",
    promptLength: 678,
    ragDocuments: ["ab_testing_framework.md", "quality_metrics.json"],
    ragChunks: 445,
    performance: {
      processed: 823,
      avgScore: 85,
      avgTime: 1.5,
      successRate: 95
    }
  },
  {
    id: "distributeur",
    name: "Agent Distributeur",
    emoji: "📱",
    status: "active",
    model: "openai/gpt-4o-mini",
    modelCost: "~0.15$/1000 tokens",
    modelLatency: "~1.0s",
    prompt: "Tu es responsable de la distribution du contenu sur les plateformes sociales. Optimise les horaires de publication et gère les rate limits...",
    promptLength: 534,
    ragDocuments: ["platform_apis.md", "best_posting_times.csv"],
    ragChunks: 356,
    performance: {
      processed: 645,
      avgScore: 87,
      avgTime: 2.1,
      successRate: 93
    }
  },
  {
    id: "analyste",
    name: "Agent Analyste",
    emoji: "📊",
    status: "active",
    model: "openai/gpt-4o",
    modelCost: "~5$/1M tokens",
    modelLatency: "~1.8s",
    prompt: "Tu es un data analyst expert. Analyse les métriques de performance et génère des insights actionnables pour optimiser les campagnes...",
    promptLength: 789,
    ragDocuments: ["analytics_framework.md", "kpi_definitions.json", "benchmarks.csv"],
    ragChunks: 678,
    performance: {
      processed: 234,
      avgScore: 93,
      avgTime: 4.5,
      successRate: 97
    }
  },
  {
    id: "orchestrateur",
    name: "Agent Orchestrateur",
    emoji: "🎭",
    status: "active",
    model: "anthropic/claude-3.5-sonnet",
    modelCost: "~3$/1M tokens",
    modelLatency: "~1.3s",
    prompt: "Tu es le chef d'orchestre de l'équipe. Coordonne les agents, gère les priorités et optimise le workflow global...",
    promptLength: 923,
    ragDocuments: ["workflow_rules.md", "agent_coordination.json"],
    ragChunks: 512,
    performance: {
      processed: 156,
      avgScore: 96,
      avgTime: 3.8,
      successRate: 98
    }
  }
];

export default function AgentTeam() {
  const [, setLocation] = useLocation();
  const [expandedAgent, setExpandedAgent] = useState<string | null>(null);

  const toggleAgent = (agentId: string) => {
    setExpandedAgent(expandedAgent === agentId ? null : agentId);
  };

  const globalPerformance = 94.2;
  const activeAgents = agents.filter(a => a.status === "active").length;

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-card border-b border-border p-6">
        <div className="flex items-center gap-3 mb-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setLocation("/settings")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <Bot className="h-6 w-6 text-primary" />
          <div>
            <h1 className="text-2xl font-bold text-foreground">Équipe d'Agents IA</h1>
            <p className="text-sm text-muted-foreground mt-1">
              {activeAgents} agents actifs • Performance globale : {globalPerformance}%
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Config avancée
          </Button>
          <Button variant="outline" size="sm" onClick={() => setLocation("/")}>
            <BarChart3 className="h-4 w-4 mr-2" />
            Dashboard global
          </Button>
          <Button size="sm">
            <Bot className="h-4 w-4 mr-2" />
            Nouvel agent
          </Button>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {agents.map((agent) => (
          <Card key={agent.id} className="overflow-hidden">
            <CardHeader className="cursor-pointer" onClick={() => toggleAgent(agent.id)}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{agent.emoji}</span>
                  <div>
                    <CardTitle className="text-lg">{agent.name}</CardTitle>
                    <CardDescription className="text-xs">
                      {agent.model}
                    </CardDescription>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className="bg-green-100 text-green-700">
                    {agent.status === "active" ? "ACTIF" : "PAUSE"}
                  </Badge>
                  {expandedAgent === agent.id ? (
                    <ChevronUp className="h-5 w-5 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-muted-foreground" />
                  )}
                </div>
              </div>
            </CardHeader>

            {expandedAgent === agent.id && (
              <CardContent className="space-y-6 pt-0">
                {/* Configuration */}
                <div className="border rounded-lg p-4 space-y-4">
                  <h3 className="font-semibold text-foreground flex items-center gap-2">
                    <Settings className="h-4 w-4" />
                    Configuration
                  </h3>

                  {/* Modèle LLM */}
                  <div className="space-y-2">
                    <Label>🧠 Modèle LLM</Label>
                    <Select defaultValue={agent.model}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={agent.model}>{agent.model}</SelectItem>
                        <SelectItem value="anthropic/claude-3.5-haiku">anthropic/claude-3.5-haiku</SelectItem>
                        <SelectItem value="google/gemini-flash-1.5">google/gemini-flash-1.5</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">
                      Coût : {agent.modelCost} • Latence : {agent.modelLatency}
                    </p>
                    <Button variant="outline" size="sm">
                      Changer de modèle
                    </Button>
                  </div>

                  {/* Prompt Système */}
                  <div className="space-y-2">
                    <Label>📝 Prompt Système</Label>
                    <Textarea
                      defaultValue={agent.prompt}
                      rows={8}
                      className="font-mono text-xs"
                    />
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-muted-foreground">
                        {agent.promptLength}/2000 caractères
                      </p>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Edit className="h-3 w-3 mr-1" />
                          Modifier
                        </Button>
                        <Button variant="outline" size="sm">
                          <FileText className="h-3 w-3 mr-1" />
                          Templates
                        </Button>
                        <Button variant="outline" size="sm">
                          <Save className="h-3 w-3 mr-1" />
                          Sauvegarder
                        </Button>
                        <Button variant="outline" size="sm">
                          <RotateCcw className="h-3 w-3 mr-1" />
                          Reset
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Base de Connaissances (RAG) */}
                  <div className="space-y-2">
                    <Label>🗄️ Base de Connaissances (RAG)</Label>
                    <div className="border rounded-lg p-3 space-y-2 bg-muted/30">
                      {agent.ragDocuments.map((doc, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-xs">
                          <span className="text-green-500">✅</span>
                          <span className="text-foreground">{doc}</span>
                        </div>
                      ))}
                      <div className="flex gap-2 mt-3">
                        <Button variant="outline" size="sm" className="text-xs">
                          📎 Ajouter documents
                        </Button>
                        <Button variant="outline" size="sm" className="text-xs">
                          🗑️ Gérer
                        </Button>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Embeddings : {agent.ragChunks.toLocaleString()} chunks • Vector DB : Qdrant
                    </p>
                  </div>
                </div>

                {/* Performance */}
                <div className="border rounded-lg p-4 space-y-3">
                  <h3 className="font-semibold text-foreground flex items-center gap-2">
                    <BarChart3 className="h-4 w-4" />
                    Performance (30 derniers jours)
                  </h3>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-muted-foreground">Traités</p>
                      <p className="font-semibold text-foreground">{agent.performance.processed.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Score moyen</p>
                      <p className="font-semibold text-foreground">{agent.performance.avgScore}/100</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Temps moyen</p>
                      <p className="font-semibold text-foreground">{agent.performance.avgTime}s</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Taux réussite</p>
                      <p className="font-semibold text-foreground">{agent.performance.successRate}%</p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Détails complets
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <Pause className="h-4 w-4 mr-2" />
                    Pause
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1 text-red-600">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Désactiver
                  </Button>
                </div>
              </CardContent>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
