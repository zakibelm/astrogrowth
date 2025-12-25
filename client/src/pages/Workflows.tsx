import { useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ArrowLeft, Check, Sparkles, TrendingUp, Clock } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { useCurrency } from "@/hooks/useCurrency";

export default function Workflows() {
  const [, navigate] = useLocation();
  const [selectedWorkflow, setSelectedWorkflow] = useState<any>(null);
  const [showDialog, setShowDialog] = useState(false);
  const { formatPrice, selectedCurrency } = useCurrency();

  // Fetch workflows (templates + custom)
  const { data: workflows = [], isLoading } = trpc.workflows.list.useQuery();
  const { data: customWorkflows = [], isLoading: isLoadingCustom } = trpc.customWorkflows.list.useQuery();
  
  // Combine both lists
  const allWorkflows = [...workflows, ...customWorkflows];
  const activateWorkflowMutation = trpc.workflows.activate.useMutation({
    onSuccess: () => {
      toast.success("Workflow activé avec succès !");
      setShowDialog(false);
    },
    onError: (error) => {
      toast.error(`Erreur: ${error.message}`);
    },
  });

  const openWorkflowDetails = (workflow: any) => {
    setSelectedWorkflow(workflow);
    setShowDialog(true);
  };

  const activateWorkflow = () => {
    if (selectedWorkflow) {
      activateWorkflowMutation.mutate({ workflowId: selectedWorkflow.id });
    }
  };

  if (isLoading || isLoadingCustom) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <Sparkles className="h-12 w-12 text-primary animate-pulse mx-auto mb-4" />
          <p className="text-slate-600">Chargement des workflows...</p>
        </div>
      </div>
    );
  }

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
                onClick={() => navigate("/agents")}
                className="gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Retour
              </Button>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Workflows Templates
                </h1>
                <p className="text-sm text-slate-600">
                  Activez un workflow pré-configuré en 1 clic
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button onClick={() => navigate("/workflows/create")} className="gap-2" size="sm">
                <Sparkles className="h-4 w-4" />
                Créer Workflow Personnalisé
              </Button>
              <Badge variant="outline" className="text-sm">
                {allWorkflows.length} workflows disponibles
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Workflows Grid */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {allWorkflows.map((workflow) => {
            const isCustom = workflow.isCustom || false;
            const agentIds = isCustom ? (workflow.agents || []).map((a: any) => a.id) : (workflow.agentIds as string[]);
            const price = workflow.monthlyPrice ? (workflow.monthlyPrice / 100).toFixed(2) : "0.00";
            
            return (
              <Card
                key={workflow.id}
                className="relative overflow-hidden border-2 border-slate-200 hover:border-primary/50 hover:shadow-2xl transition-all duration-300 cursor-pointer group"
                onClick={() => openWorkflowDetails(workflow)}
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/10 to-transparent rounded-bl-full" />
                
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="text-4xl mb-2">{workflow.icon || "🎯"}</div>
                    <div className="flex flex-col gap-1">
                      {isCustom && (
                        <Badge variant="default" className="text-xs">
                          Personnalisé
                        </Badge>
                      )}
                      <Badge variant="secondary" className="text-xs">
                        {agentIds.length} agents
                      </Badge>
                    </div>
                  </div>
                  <CardTitle className="text-lg group-hover:text-primary transition-colors">
                    {workflow.name}
                  </CardTitle>
                  <CardDescription className="text-sm line-clamp-2">
                    {workflow.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Clock className="h-4 w-4 text-green-600" />
                    <span>{workflow.estimatedTimeSaved}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <TrendingUp className="h-4 w-4 text-blue-600" />
                    <span>{workflow.estimatedROI}</span>
                  </div>

                  <div className="pt-3 border-t border-slate-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-2xl font-bold text-primary">{formatPrice((workflow.monthlyPrice || 0) / 100)}</div>
                        <div className="text-xs text-slate-500">USD/month</div>
                      </div>
                      <Button
                        size="sm"
                        className="gap-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/workflows/${workflow.id}/configure`);
                        }}
                      >
                        <Sparkles className="h-4 w-4" />
                        Configurer
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Workflow Details Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3 text-2xl">
              <span className="text-4xl">{selectedWorkflow?.icon}</span>
              {selectedWorkflow?.name}
            </DialogTitle>
            <DialogDescription className="text-base">
              {selectedWorkflow?.description}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Metrics */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center gap-2 text-green-700 mb-1">
                  <Clock className="h-5 w-5" />
                  <span className="font-semibold">Temps économisé</span>
                </div>
                <div className="text-2xl font-bold text-green-900">
                  {selectedWorkflow?.estimatedTimeSaved}
                </div>
              </div>

              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center gap-2 text-blue-700 mb-1">
                  <TrendingUp className="h-5 w-5" />
                  <span className="font-semibold">ROI estimé</span>
                </div>
                <div className="text-2xl font-bold text-blue-900">
                  {selectedWorkflow?.estimatedROI}
                </div>
              </div>
            </div>

            {/* Agents List */}
            <div>
              <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                <Check className="h-5 w-5 text-green-600" />
                Agents inclus ({(selectedWorkflow?.agentIds as string[])?.length || 0})
              </h3>
              <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto p-2 bg-slate-50 rounded-lg">
                {(selectedWorkflow?.agentIds as string[] || []).map((agentId: string) => (
                  <div
                    key={agentId}
                    className="flex items-center gap-2 text-sm text-slate-700 bg-white p-2 rounded border border-slate-200"
                  >
                    <Check className="h-4 w-4 text-green-600 flex-shrink-0" />
                    <span className="truncate">{agentId}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Pricing */}
            <div className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg border-2 border-purple-200">
              <div className="text-center">
                <div className="text-4xl font-bold text-purple-900 mb-2">
                  {selectedWorkflow?.monthlyPrice ? (selectedWorkflow.monthlyPrice / 100).toFixed(2) : "0.00"}$ CAD
                </div>
                <div className="text-sm text-purple-700 mb-4">par mois</div>
                <Button
                  size="lg"
                  className="w-full gap-2"
                  onClick={() => navigate(`/workflows/${selectedWorkflow.id}/configure`)}
                >
                  <Sparkles className="h-5 w-5" />
                  Configurer ce workflow
                </Button>
                <p className="text-xs text-slate-600 mt-3">
                  Tous les agents seront automatiquement activés
                </p>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
