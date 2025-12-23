import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft,
  Workflow,
  Play,
  Pause,
  RotateCcw,
  Settings,
  ArrowRight,
  CheckCircle2,
  Clock
} from "lucide-react";
import { useLocation } from "wouter";

/**
 * Page Workflows Agents
 * Visualisation et gestion des workflows d'automatisation entre agents
 */

interface WorkflowStep {
  id: string;
  agent: string;
  emoji: string;
  action: string;
  status: "completed" | "in-progress" | "pending" | "error";
  duration?: string;
}

const mainWorkflow: WorkflowStep[] = [
  {
    id: "1",
    agent: "Explorateur",
    emoji: "🔍",
    action: "Scraper Google Maps",
    status: "completed",
    duration: "2.3s"
  },
  {
    id: "2",
    agent: "Qualifier",
    emoji: "🎯",
    action: "Scorer les leads",
    status: "completed",
    duration: "1.8s"
  },
  {
    id: "3",
    agent: "Copywriter",
    emoji: "✍️",
    action: "Générer le texte",
    status: "in-progress",
    duration: "3.2s"
  },
  {
    id: "4",
    agent: "Designer",
    emoji: "🎨",
    action: "Créer l'image",
    status: "pending"
  },
  {
    id: "5",
    agent: "Testeur",
    emoji: "🧪",
    action: "Évaluer la qualité",
    status: "pending"
  },
  {
    id: "6",
    agent: "Distributeur",
    emoji: "📱",
    action: "Publier sur LinkedIn",
    status: "pending"
  },
  {
    id: "7",
    agent: "Analyste",
    emoji: "📊",
    action: "Analyser les résultats",
    status: "pending"
  }
];

export default function AgentWorkflows() {
  const [, setLocation] = useLocation();
  const [isRunning, setIsRunning] = useState(true);

  const getStatusIcon = (status: WorkflowStep["status"]) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case "in-progress":
        return <Clock className="h-5 w-5 text-blue-500 animate-pulse" />;
      case "pending":
        return <Clock className="h-5 w-5 text-muted-foreground" />;
      case "error":
        return <div className="h-5 w-5 rounded-full bg-red-500" />;
    }
  };

  const getStatusBadge = (status: WorkflowStep["status"]) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-100 text-green-700">Terminé</Badge>;
      case "in-progress":
        return <Badge className="bg-blue-100 text-blue-700">En cours</Badge>;
      case "pending":
        return <Badge variant="outline">En attente</Badge>;
      case "error":
        return <Badge className="bg-red-100 text-red-700">Erreur</Badge>;
    }
  };

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
          <Workflow className="h-6 w-6 text-primary" />
          <div>
            <h1 className="text-2xl font-bold text-foreground">Workflows Agents</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Orchestration automatique des agents IA
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant={isRunning ? "outline" : "default"}
            size="sm"
            onClick={() => setIsRunning(!isRunning)}
          >
            {isRunning ? (
              <>
                <Pause className="h-4 w-4 mr-2" />
                Pause
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-2" />
                Démarrer
              </>
            )}
          </Button>
          <Button variant="outline" size="sm">
            <RotateCcw className="h-4 w-4 mr-2" />
            Réinitialiser
          </Button>
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Configurer
          </Button>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Workflow Principal */}
        <Card>
          <CardHeader>
            <CardTitle>Workflow Principal : Génération de Contenu</CardTitle>
            <CardDescription>
              Pipeline complet de la prospection à la publication
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {mainWorkflow.map((step, index) => (
              <div key={step.id}>
                <div className="flex items-center gap-4">
                  {/* Status Icon */}
                  <div className="flex-shrink-0">
                    {getStatusIcon(step.status)}
                  </div>

                  {/* Agent Card */}
                  <Card className="flex-1">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{step.emoji}</span>
                          <div>
                            <p className="font-semibold text-foreground">{step.agent}</p>
                            <p className="text-sm text-muted-foreground">{step.action}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          {step.duration && (
                            <span className="text-xs text-muted-foreground">
                              {step.duration}
                            </span>
                          )}
                          {getStatusBadge(step.status)}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Arrow between steps */}
                {index < mainWorkflow.length - 1 && (
                  <div className="flex items-center justify-center my-2">
                    <ArrowRight className="h-5 w-5 text-muted-foreground" />
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Statistiques */}
        <Card>
          <CardHeader>
            <CardTitle>Statistiques du Workflow</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Exécutions totales</p>
                <p className="text-2xl font-bold text-foreground">1,234</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Taux de réussite</p>
                <p className="text-2xl font-bold text-foreground">94.2%</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Temps moyen</p>
                <p className="text-2xl font-bold text-foreground">18.5s</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Économies</p>
                <p className="text-2xl font-bold text-foreground">2,450$</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Workflows Alternatifs */}
        <Card>
          <CardHeader>
            <CardTitle>Workflows Alternatifs</CardTitle>
            <CardDescription>
              Configurations alternatives pour cas spécifiques
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-semibold text-foreground">Workflow Express</p>
                <p className="text-xs text-muted-foreground">
                  Scraping → Copywriter → Designer → Publication (sans qualification)
                </p>
              </div>
              <Button variant="outline" size="sm">
                Activer
              </Button>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-semibold text-foreground">Workflow Qualité Premium</p>
                <p className="text-xs text-muted-foreground">
                  + Double validation + A/B testing + Analyse approfondie
                </p>
              </div>
              <Button variant="outline" size="sm">
                Activer
              </Button>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-semibold text-foreground">Workflow Analyse Seule</p>
                <p className="text-xs text-muted-foreground">
                  Analyste uniquement pour auditer les campagnes existantes
                </p>
              </div>
              <Button variant="outline" size="sm">
                Activer
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Historique des Exécutions */}
        <Card>
          <CardHeader>
            <CardTitle>Historique Récent</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {[
                { time: "Il y a 2 min", campaign: "Restaurants Montréal", status: "completed", duration: "17.8s" },
                { time: "Il y a 15 min", campaign: "Dentistes Québec", status: "completed", duration: "19.2s" },
                { time: "Il y a 1h", campaign: "Agents Immobiliers", status: "completed", duration: "16.5s" },
                { time: "Il y a 2h", campaign: "Restaurants Montréal", status: "error", duration: "8.3s" }
              ].map((exec, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 border rounded-lg text-sm">
                  <div className="flex items-center gap-3">
                    {exec.status === "completed" ? (
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                    ) : (
                      <div className="h-4 w-4 rounded-full bg-red-500" />
                    )}
                    <div>
                      <p className="font-medium text-foreground">{exec.campaign}</p>
                      <p className="text-xs text-muted-foreground">{exec.time}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground">{exec.duration}</span>
                    <Badge variant={exec.status === "completed" ? "default" : "destructive"}>
                      {exec.status === "completed" ? "Réussi" : "Échec"}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
