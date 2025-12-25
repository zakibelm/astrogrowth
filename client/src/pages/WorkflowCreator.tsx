import { useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, Save, Sparkles, DollarSign } from "lucide-react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";

// Import all agents data
import { AGENTS_DATA, DEPARTMENTS } from "@/../../shared/agents-data";

export default function WorkflowCreator() {
  const [, navigate] = useLocation();
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [selectedAgents, setSelectedAgents] = useState<string[]>([]);
  const [workflowName, setWorkflowName] = useState("");
  const [workflowDescription, setWorkflowDescription] = useState("");

  // Calculate price: $20/agent/month
  const monthlyPrice = selectedAgents.length * 20;

  const toggleAgent = (agentId: string) => {
    setSelectedAgents((prev) =>
      prev.includes(agentId) ? prev.filter((id) => id !== agentId) : [...prev, agentId]
    );
  };

  const filteredAgents = Object.entries(AGENTS_DATA).filter(([_, agent]) => {
    if (selectedDepartment === "all") return true;
    return agent.department === selectedDepartment;
  });

  const createWorkflowMutation = trpc.customWorkflows.create.useMutation({
    onSuccess: () => {
      toast.success("Workflow personnalisé créé !");
      navigate("/workflows");
    },
    onError: (error) => {
      toast.error(`Erreur: ${error.message}`);
    },
  });

  const handleSave = () => {
    if (!workflowName.trim()) {
      toast.error("Veuillez entrer un nom pour le workflow");
      return;
    }
    if (selectedAgents.length === 0) {
      toast.error("Veuillez sélectionner au moins un agent");
      return;
    }

    createWorkflowMutation.mutate({
      name: workflowName,
      description: workflowDescription,
      selectedAgents,
      monthlyPrice: monthlyPrice * 100, // Convert to cents
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <Button variant="ghost" onClick={() => navigate("/workflows")} className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour aux workflows
            </Button>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Créateur de Workflow Personnalisé
            </h1>
            <p className="text-slate-600 mt-2">Composez votre équipe marketing IA sur mesure</p>
          </div>
          <Button onClick={handleSave} size="lg" className="gap-2" disabled={createWorkflowMutation.isPending}>
            <Save className="h-5 w-5" />
            Sauvegarder le Workflow
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Workflow Info */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-purple-600" />
                  Informations du Workflow
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="workflowName">Nom du workflow *</Label>
                  <Input
                    id="workflowName"
                    placeholder="Ex: Workflow Restaurant Local"
                    value={workflowName}
                    onChange={(e) => setWorkflowName(e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="workflowDescription">Description</Label>
                  <Textarea
                    id="workflowDescription"
                    placeholder="Décrivez l'objectif de ce workflow..."
                    rows={4}
                    value={workflowDescription}
                    onChange={(e) => setWorkflowDescription(e.target.value)}
                  />
                </div>

                <div className="pt-4 border-t">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Agents sélectionnés</span>
                    <Badge variant="secondary">{selectedAgents.length}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Prix mensuel</span>
                    <div className="flex items-center gap-1">
                      <DollarSign className="h-4 w-4 text-green-600" />
                      <span className="text-2xl font-bold text-green-600">${monthlyPrice}</span>
                      <span className="text-sm text-slate-500">/mois</span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 mt-2">$20 par agent/mois</p>
                </div>

                {selectedAgents.length > 0 && (
                  <div className="pt-4 border-t">
                    <p className="text-sm font-medium mb-2">Agents sélectionnés :</p>
                    <div className="space-y-1 max-h-[200px] overflow-y-auto">
                      {selectedAgents.map((agentId) => {
                        const agent = AGENTS_DATA[agentId];
                        return (
                          <div key={agentId} className="flex items-center gap-2 text-sm">
                            <span>{agent.emoji}</span>
                            <span className="truncate">{agent.name}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right: Agent Selection */}
          <div className="lg:col-span-2">
            {/* Department Tabs */}
            <div className="flex flex-wrap gap-2 mb-6">
              {DEPARTMENTS.map((dept) => (
                <Button
                  key={dept.id}
                  variant={selectedDepartment === dept.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedDepartment(dept.id)}
                >
                  {dept.name} ({dept.count})
                </Button>
              ))}
            </div>

            {/* Agents Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredAgents.map(([agentId, agent]) => {
                const isSelected = selectedAgents.includes(agentId);
                return (
                  <Card
                    key={agentId}
                    className={`cursor-pointer transition-all ${
                      isSelected ? "ring-2 ring-primary bg-primary/5" : "hover:shadow-md"
                    }`}
                    onClick={() => toggleAgent(agentId)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-3xl">{agent.emoji}</span>
                          <div>
                            <CardTitle className="text-base">{agent.name}</CardTitle>
                            <Badge variant="secondary" className="mt-1 text-xs">
                              {agent.department}
                            </Badge>
                          </div>
                        </div>
                        <Checkbox checked={isSelected} onCheckedChange={() => toggleAgent(agentId)} />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-sm line-clamp-2">{agent.description}</CardDescription>
                      <div className="mt-2 flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {agent.model}
                        </Badge>
                        <span className="text-xs text-slate-500">$20/mois</span>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
