import { useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  ArrowLeft, Building2, Target, Users, Sparkles, Settings, CheckCircle2,
  Clock, TrendingUp, FileText, Send, MessageSquare, BarChart3, Edit
} from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

export default function MyWorkflow() {
  const [, navigate] = useLocation();

  // Fetch user workflows
  const { data: userWorkflows = [], isLoading } = trpc.workflows.getUserWorkflows.useQuery();
  const { data: workflows = [] } = trpc.workflows.list.useQuery();
  const { data: userAgents = [] } = trpc.agents.list.useQuery();

  // Get active workflow
  const activeUserWorkflow = userWorkflows.find((uw) => uw.active);
  const activeWorkflow = workflows.find((w) => w.id === activeUserWorkflow?.workflowId);
  const config = activeUserWorkflow?.workflowConfig as any;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <Sparkles className="h-12 w-12 text-primary animate-pulse mx-auto mb-4" />
          <p className="text-slate-600">Chargement de votre workflow...</p>
        </div>
      </div>
    );
  }

  if (!activeWorkflow || !config) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">🤖</div>
          <h2 className="text-2xl font-bold mb-2">Aucun workflow actif</h2>
          <p className="text-slate-600 mb-6">
            Activez un workflow pour commencer à automatiser votre marketing
          </p>
          <Button onClick={() => navigate("/workflows")} className="gap-2">
            <Sparkles className="h-4 w-4" />
            Découvrir les workflows
          </Button>
        </div>
      </div>
    );
  }

  const agentIds = activeWorkflow.agentIds as string[];
  const activeAgents = userAgents.filter((ua) => agentIds.includes(ua.agentId) && ua.enabled);

  // Mock activity data (à remplacer par vraies données)
  const activities = [
    { agent: "Lead Scraper", action: "15 nouveaux leads trouvés", time: "Il y a 2h", icon: Users, color: "text-blue-600" },
    { agent: "Copywriter", action: "3 posts générés en attente", time: "Il y a 3h", icon: FileText, color: "text-purple-600" },
    { agent: "Community Manager", action: "12 commentaires répondus", time: "Il y a 5h", icon: MessageSquare, color: "text-green-600" },
    { agent: "Analyzer", action: "Rapport hebdomadaire prêt", time: "Il y a 1 jour", icon: BarChart3, color: "text-orange-600" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/workflows")}
                className="gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Retour
              </Button>
              <div>
                <h1 className="text-2xl font-bold flex items-center gap-2">
                  <span className="text-3xl">{activeWorkflow.icon}</span>
                  {activeWorkflow.name}
                </h1>
                <p className="text-sm text-slate-600">
                  {agentIds.length} agents configurés · {activeAgents.length} actifs
                </p>
              </div>
            </div>
            <Badge variant="default" className="bg-green-500">
              <CheckCircle2 className="h-3 w-3 mr-1" />
              Actif
            </Badge>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Business Info & Goals */}
          <div className="space-y-6">
            {/* Business Information */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Building2 className="h-5 w-5 text-primary" />
                    Votre Entreprise
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toast.info("Modification à venir")}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div>
                  <div className="text-slate-600">Nom</div>
                  <div className="font-medium">{config.businessInfo?.businessName || "Non renseigné"}</div>
                </div>
                <div>
                  <div className="text-slate-600">Secteur</div>
                  <div className="font-medium capitalize">{config.businessInfo?.sector || "Non renseigné"}</div>
                </div>
                <div>
                  <div className="text-slate-600">Localisation</div>
                  <div className="font-medium">{config.businessInfo?.city}, {config.businessInfo?.province}</div>
                </div>
                <div>
                  <div className="text-slate-600">Téléphone</div>
                  <div className="font-medium">{config.businessInfo?.phone}</div>
                </div>
                {config.businessInfo?.website && (
                  <div>
                    <div className="text-slate-600">Site web</div>
                    <a
                      href={config.businessInfo.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-primary hover:underline"
                    >
                      {config.businessInfo.website}
                    </a>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Marketing Goals */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Target className="h-5 w-5 text-blue-600" />
                  Objectifs Marketing
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div>
                  <div className="text-slate-600">Objectif principal</div>
                  <div className="font-medium capitalize">{config.marketingGoals?.primaryGoal || "Non défini"}</div>
                </div>
                {config.marketingGoals?.leadsPerMonth && (
                  <div>
                    <div className="text-slate-600">Leads/mois souhaités</div>
                    <div className="font-medium">{config.marketingGoals.leadsPerMonth}</div>
                  </div>
                )}
                {config.marketingGoals?.budget && (
                  <div>
                    <div className="text-slate-600">Budget mensuel</div>
                    <div className="font-medium">{config.marketingGoals.budget}</div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Agent Preferences */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Settings className="h-5 w-5 text-purple-600" />
                  Préférences Agents
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div>
                  <div className="text-slate-600">Ton du contenu</div>
                  <div className="font-medium capitalize">{config.agentPreferences?.contentTone}</div>
                </div>
                <div>
                  <div className="text-slate-600">Fréquence publication</div>
                  <div className="font-medium capitalize">{config.agentPreferences?.postingFrequency}</div>
                </div>
                <div>
                  <div className="text-slate-600">Temps de réponse</div>
                  <div className="font-medium">{config.agentPreferences?.responseTime}</div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Middle & Right Columns: Agents & Activity */}
          <div className="lg:col-span-2 space-y-6">
            {/* Active Agents */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  Agents Actifs ({activeAgents.length}/{agentIds.length})
                </CardTitle>
                <CardDescription>
                  Ces agents travaillent pour vous 24/7
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {agentIds.map((agentId) => {
                    const userAgent = userAgents.find((ua) => ua.agentId === agentId);
                    const isActive = userAgent?.enabled || false;

                    return (
                      <div
                        key={agentId}
                        className={`p-4 rounded-lg border-2 ${
                          isActive
                            ? "border-green-200 bg-green-50"
                            : "border-slate-200 bg-slate-50"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="font-medium text-sm truncate">{agentId}</div>
                          <Badge variant={isActive ? "default" : "secondary"} className="text-xs">
                            {isActive ? "Actif" : "Inactif"}
                          </Badge>
                        </div>
                        {isActive && (
                          <div className="text-xs text-slate-600">
                            Modèle: {userAgent?.llmModel || "gemini-2.0-flash"}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-orange-600" />
                  Activité Récente
                </CardTitle>
                <CardDescription>
                  Ce que vos agents ont fait récemment
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {activities.map((activity, index) => {
                    const Icon = activity.icon;
                    return (
                      <div key={index} className="flex items-start gap-4 p-3 bg-slate-50 rounded-lg">
                        <div className={`p-2 rounded-lg bg-white ${activity.color}`}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-sm">{activity.agent}</div>
                          <div className="text-sm text-slate-600">{activity.action}</div>
                          <div className="text-xs text-slate-500 mt-1">{activity.time}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Results Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                  Résultats Générés
                </CardTitle>
                <CardDescription>
                  Performance de votre workflow
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-3xl font-bold text-blue-600">127</div>
                    <div className="text-sm text-slate-600 mt-1">Leads générés</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-3xl font-bold text-purple-600">45</div>
                    <div className="text-sm text-slate-600 mt-1">Contenus créés</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-3xl font-bold text-green-600">28</div>
                    <div className="text-sm text-slate-600 mt-1">Posts publiés</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex gap-4">
              <Button
                variant="outline"
                className="flex-1 gap-2"
                onClick={() => navigate("/agents")}
              >
                <Settings className="h-4 w-4" />
                Gérer les agents
              </Button>
              <Button
                variant="outline"
                className="flex-1 gap-2"
                onClick={() => navigate("/campaigns")}
              >
                <Send className="h-4 w-4" />
                Voir les campagnes
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
