import { useState } from "react";
import { useLocation } from "wouter";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Save, Sparkles, DollarSign, ArrowRight, X, Plus } from "lucide-react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { AGENTS_DATA, DEPARTMENTS, type AgentData } from "@/../../shared/agents-data";
import { DraggableWorkflowAgent } from "@/components/DraggableWorkflowAgent";

interface WorkflowAgent {
  id: string;
  position: number;
}

interface DraggableAgentProps {
  agent: AgentData;
  index?: number;
  onRemove?: () => void;
  isInWorkflow?: boolean;
}

const DraggableAgent = ({ agent, index, onRemove, isInWorkflow }: DraggableAgentProps) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "agent",
    item: { agentId: agent.id },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag as any}
      className={`cursor-move transition-all ${isDragging ? "opacity-50" : "opacity-100"}`}
    >
      <Card className={`hover:shadow-lg transition-shadow ${isInWorkflow ? "bg-primary/5 border-primary" : ""}`}>
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-3">
            {isInWorkflow && typeof index === "number" && (
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                {index + 1}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-2xl">{agent.emoji}</span>
                <h4 className="font-semibold text-sm truncate">{agent.name}</h4>
              </div>
              <p className="text-xs text-slate-600 line-clamp-2">{agent.description}</p>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="secondary" className="text-xs">
                  {agent.department}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {agent.model}
                </Badge>
              </div>
            </div>
            {isInWorkflow && onRemove && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onRemove}
                className="flex-shrink-0 h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

interface DropZoneProps {
  onDrop: (agentId: string, position: number) => void;
  position: number;
}

const DropZone = ({ onDrop, position }: DropZoneProps) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: "agent",
    drop: (item: { agentId: string }) => onDrop(item.agentId, position),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  return (
    <div
      ref={drop as any}
      className={`border-2 border-dashed rounded-lg p-4 transition-all ${
        isOver ? "border-primary bg-primary/10" : "border-slate-300 bg-slate-50"
      }`}
    >
      <div className="flex items-center justify-center gap-2 text-slate-500">
        <Plus className="h-5 w-5" />
        <span className="text-sm">Glissez un agent ici</span>
      </div>
    </div>
  );
};

export default function WorkflowCreator() {
  const [, navigate] = useLocation();
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [workflowAgents, setWorkflowAgents] = useState<WorkflowAgent[]>([]);
  const [workflowName, setWorkflowName] = useState("");
  const [workflowDescription, setWorkflowDescription] = useState("");
  const [workflowMission, setWorkflowMission] = useState("");

  const createWorkflowMutation = trpc.customWorkflows.create.useMutation({
    onSuccess: () => {
      toast.success("Workflow personnalisé créé !");
      navigate("/workflows");
    },
    onError: (error) => {
      toast.error(`Erreur: ${error.message}`);
    },
  });

  const filteredAgents = Object.values(AGENTS_DATA).filter((agent: AgentData) => {
    const matchesDepartment = selectedDepartment === "all" || agent.department === selectedDepartment;
    const matchesSearch = agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         agent.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDepartment && matchesSearch;
  });

  const handleDrop = (agentId: string, position: number) => {
    // Check if agent already in workflow
    const agentExists = workflowAgents.some((wa) => wa.id === agentId);
    if (agentExists) {
      toast.error("Cet agent est déjà dans le workflow");
      return;
    }

    const newAgents = [...workflowAgents];
    newAgents.splice(position, 0, { id: agentId, position });
    
    // Reindex positions
    const reindexed = newAgents.map((agent, idx) => ({ ...agent, position: idx }));
    setWorkflowAgents(reindexed);
    toast.success("Agent ajouté au workflow");
  };

  const removeAgent = (position: number) => {
    const newAgents = workflowAgents.filter((_, idx) => idx !== position);
    const reindexed = newAgents.map((agent, idx) => ({ ...agent, position: idx }));
    setWorkflowAgents(reindexed);
    toast.success("Agent retiré du workflow");
  };

  const moveAgent = (fromIndex: number, toIndex: number) => {
    const newAgents = [...workflowAgents];
    const [moved] = newAgents.splice(fromIndex, 1);
    newAgents.splice(toIndex, 0, moved);
    const reindexed = newAgents.map((agent, idx) => ({ ...agent, position: idx }));
    setWorkflowAgents(reindexed);
  };

  const calculateTotalPrice = () => {
    return workflowAgents.reduce((total, wa) => {
      const agent = Object.values(AGENTS_DATA).find((a: AgentData) => a.name === wa.id);
      if (!agent) return total;
      
      // Extract price from modelPrice string (e.g., "$3/1M tokens" → 3)
      const priceMatch = agent.modelPrice?.match(/\$?(\d+\.?\d*)/);
      const price = priceMatch ? parseFloat(priceMatch[1]) : 0;
      return total + price;
    }, 0);
  };

  const handleSave = () => {
    if (!workflowName.trim()) {
      toast.error("Veuillez entrer un nom pour le workflow");
      return;
    }
    if (workflowAgents.length < 2) {
      toast.error("Veuillez ajouter au moins 2 agents au workflow");
      return;
    }
    if (!workflowMission.trim()) {
      toast.error("Veuillez décrire la mission du workflow");
      return;
    }

    createWorkflowMutation.mutate({
      name: workflowName,
      description: workflowDescription,
      mission: workflowMission,
      agents: workflowAgents.map((wa, index) => ({ id: wa.id, position: index })),
      totalPrice: Math.round(calculateTotalPrice()),
    });
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <Button variant="ghost" onClick={() => navigate("/workflows")} className="mb-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retour aux workflows
              </Button>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Créateur de Workflow Personnalisé
              </h1>
              <p className="text-slate-600 mt-2">Construisez votre workflow en glissant-déposant les agents dans l'ordre d'exécution</p>
            </div>
            <Button onClick={handleSave} size="lg" className="gap-2" disabled={createWorkflowMutation.isPending}>
              <Save className="h-5 w-5" />
              Sauvegarder Workflow
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: Agent Library */}
            <div className="lg:col-span-1 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Bibliothèque d'Agents</CardTitle>
                  <CardDescription>Glissez les agents vers la droite pour construire votre workflow</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Input
                    placeholder="Rechercher un agent..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />

                  <Tabs value={selectedDepartment} onValueChange={setSelectedDepartment}>
                    <TabsList className="grid grid-cols-3 gap-1">
                      <TabsTrigger value="all">Tous</TabsTrigger>
                      <TabsTrigger value="direction">Direction</TabsTrigger>
                      <TabsTrigger value="prospection">Prospect</TabsTrigger>
                    </TabsList>
                    <TabsList className="grid grid-cols-3 gap-1 mt-2">
                      <TabsTrigger value="content">Contenu</TabsTrigger>
                      <TabsTrigger value="community">Community</TabsTrigger>
                      <TabsTrigger value="advertising">Pub</TabsTrigger>
                    </TabsList>
                  </Tabs>

                  <div className="space-y-2 max-h-[600px] overflow-y-auto">
                    {filteredAgents.map((agent) => (
                      <DraggableAgent key={agent.name} agent={agent} />
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right: Workflow Builder */}
            <div className="lg:col-span-2 space-y-6">
              {/* Workflow Info */}
              <Card>
                <CardHeader>
                  <CardTitle>Informations du Workflow</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="name">Nom du Workflow *</Label>
                    <Input
                      id="name"
                      placeholder="Ex: Lead Generation → Content Creation → LinkedIn Publishing"
                      value={workflowName}
                      onChange={(e) => setWorkflowName(e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="description">Description courte</Label>
                    <Input
                      id="description"
                      placeholder="Ex: Workflow complet de prospection à publication"
                      value={workflowDescription}
                      onChange={(e) => setWorkflowDescription(e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="mission">Mission du Workflow *</Label>
                    <div className="mb-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-sm text-blue-900">
                        <strong>Instructions pour l'Orchestrateur IA :</strong> Décrivez précisément la mission que ce workflow doit accomplir. 
                        L'orchestrateur utilisera ces informations pour coordonner les agents, assigner les rôles selon les bonnes pratiques, 
                        et s'assurer que le travail est bien fait.
                      </p>
                    </div>
                    <Textarea
                      id="mission"
                      placeholder="Ex: Générer 50 leads qualifiés/mois pour restaurant italien à Montréal via Instagram + Google Maps. Critères de succès: leads avec email + téléphone, intéressés par cuisine italienne, budget 50-100$/personne. L'orchestrateur doit coordonner le scraping, la qualification, la création de contenu attractif, et la publication optimisée aux heures de pointe (12h-14h, 18h-21h)."
                      rows={6}
                      value={workflowMission}
                      onChange={(e) => setWorkflowMission(e.target.value)}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Workflow Canvas */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Séquence du Workflow ({workflowAgents.length} agents)</span>
                    <Badge variant="secondary" className="text-lg">
                      <DollarSign className="h-4 w-4 mr-1" />
                      {calculateTotalPrice().toFixed(2)} USD/mois
                    </Badge>
                  </CardTitle>
                  <CardDescription>
                    Les agents s'exécuteront dans l'ordre de haut en bas
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {workflowAgents.length === 0 ? (
                    <DropZone onDrop={handleDrop} position={0} />
                  ) : (
                    <>
                      {workflowAgents.map((wa, index) => {
                        const agent = Object.values(AGENTS_DATA).find((a: AgentData) => a.name === wa.id);
                        if (!agent) return null;

                        return (
                          <div key={`${wa.id}-${index}`} className="space-y-3">
                            <DraggableWorkflowAgent
                              agent={agent}
                              index={index}
                              onRemove={() => removeAgent(index)}
                              onMove={(fromIndex, toIndex) => {
                                const newAgents = [...workflowAgents];
                                const [movedAgent] = newAgents.splice(fromIndex, 1);
                                newAgents.splice(toIndex, 0, movedAgent);
                                setWorkflowAgents(newAgents);
                              }}
                            />
                            
                            {/* Arrow between agents */}
                            {index < workflowAgents.length - 1 && (
                              <div className="flex items-center justify-center">
                                <ArrowRight className="h-6 w-6 text-primary" />
                              </div>
                            )}
                            
                            {/* Drop zone after each agent */}
                            <DropZone onDrop={handleDrop} position={index + 1} />
                          </div>
                        );
                      })}
                    </>
                  )}

                  {workflowAgents.length > 0 && (
                    <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-start gap-3">
                        <Sparkles className="h-5 w-5 text-green-600 mt-0.5" />
                        <div>
                          <h4 className="font-semibold text-green-900">Workflow Prêt</h4>
                          <p className="text-sm text-green-700 mt-1">
                            Votre workflow contient {workflowAgents.length} agents qui s'exécuteront séquentiellement.
                            N'oubliez pas de décrire la mission globale ci-dessus avant de sauvegarder.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </DndProvider>
  );
}
