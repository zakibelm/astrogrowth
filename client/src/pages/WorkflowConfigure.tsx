import { useState } from "react";
import { useLocation, useParams } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, Check, Building2, Target, Users, Sparkles } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

export default function WorkflowConfigure() {
  const { id } = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const [step, setStep] = useState(1);
  const totalSteps = 4;

  // Form state
  const [businessInfo, setBusinessInfo] = useState({
    businessName: "",
    address: "",
    city: "",
    province: "",
    postalCode: "",
    phone: "",
    website: "",
    sector: "",
    description: "",
  });

  const [marketingGoals, setMarketingGoals] = useState({
    primaryGoal: "",
    leadsPerMonth: "",
    budget: "",
    targetAudience: "",
    uniqueSellingPoint: "",
  });

  const [agentPreferences, setAgentPreferences] = useState({
    contentTone: "professional",
    postingFrequency: "daily",
    responseTime: "1h",
    customInstructions: "",
  });

  // Fetch workflow details
  const { data: workflows } = trpc.workflows.list.useQuery();
  const workflow = workflows?.find((w) => w.id === parseInt(id || "0"));

  const activateWorkflowMutation = trpc.workflows.activate.useMutation({
    onSuccess: () => {
      toast.success("Workflow activé avec succès !");
      navigate("/my-workflow");
    },
    onError: (error) => {
      toast.error(`Erreur: ${error.message}`);
    },
  });

  const progress = (step / totalSteps) * 100;

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSubmit = () => {
    if (!workflow) return;

    const config = {
      businessInfo,
      marketingGoals,
      agentPreferences,
    };

    // Activate workflow with configuration
    activateWorkflowMutation.mutate({
      workflowId: workflow.id,
      config,
    });
  };

  if (!workflow) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-600">Workflow introuvable</p>
          <Button onClick={() => navigate("/workflows")} className="mt-4">
            Retour aux workflows
          </Button>
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
                onClick={() => navigate("/workflows")}
                className="gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Retour
              </Button>
              <div>
                <h1 className="text-2xl font-bold flex items-center gap-2">
                  <span className="text-3xl">{workflow.icon}</span>
                  Configuration: {workflow.name}
                </h1>
                <p className="text-sm text-slate-600">
                  Étape {step} sur {totalSteps}
                </p>
              </div>
            </div>
          </div>
          <Progress value={progress} className="mt-4" />
        </div>
      </div>

      {/* Form Steps */}
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        {/* Step 1: Business Information */}
        {step === 1 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-6 w-6 text-primary" />
                Informations sur votre entreprise
              </CardTitle>
              <CardDescription>
                Ces informations seront utilisées par les agents IA pour personnaliser leur travail
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="businessName">Nom de l'entreprise *</Label>
                <Input
                  id="businessName"
                  placeholder="Ex: Restaurant Chez Mario"
                  value={businessInfo.businessName}
                  onChange={(e) => setBusinessInfo({ ...businessInfo, businessName: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="address">Adresse *</Label>
                  <Input
                    id="address"
                    placeholder="123 Rue Principale"
                    value={businessInfo.address}
                    onChange={(e) => setBusinessInfo({ ...businessInfo, address: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="city">Ville *</Label>
                  <Input
                    id="city"
                    placeholder="Montréal"
                    value={businessInfo.city}
                    onChange={(e) => setBusinessInfo({ ...businessInfo, city: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="province">Province</Label>
                  <Select value={businessInfo.province} onValueChange={(value) => setBusinessInfo({ ...businessInfo, province: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="QC">Québec</SelectItem>
                      <SelectItem value="ON">Ontario</SelectItem>
                      <SelectItem value="BC">Colombie-Britannique</SelectItem>
                      <SelectItem value="AB">Alberta</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="postalCode">Code postal</Label>
                  <Input
                    id="postalCode"
                    placeholder="H2X 1Y7"
                    value={businessInfo.postalCode}
                    onChange={(e) => setBusinessInfo({ ...businessInfo, postalCode: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phone">Téléphone *</Label>
                  <Input
                    id="phone"
                    placeholder="(514) 555-1234"
                    value={businessInfo.phone}
                    onChange={(e) => setBusinessInfo({ ...businessInfo, phone: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="website">Site web</Label>
                  <Input
                    id="website"
                    placeholder="https://www.example.com"
                    value={businessInfo.website}
                    onChange={(e) => setBusinessInfo({ ...businessInfo, website: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="sector">Secteur d'activité *</Label>
                <Select value={businessInfo.sector} onValueChange={(value) => setBusinessInfo({ ...businessInfo, sector: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner votre secteur" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="restaurant">Restaurant</SelectItem>
                    <SelectItem value="ecommerce">E-commerce</SelectItem>
                    <SelectItem value="b2b">Services B2B</SelectItem>
                    <SelectItem value="sante">Santé (dentiste, médecin)</SelectItem>
                    <SelectItem value="immobilier">Immobilier</SelectItem>
                    <SelectItem value="consulting">Consultation/Coaching</SelectItem>
                    <SelectItem value="autre">Autre</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="description">Description de votre entreprise</Label>
                <Textarea
                  id="description"
                  placeholder="Décrivez brièvement votre entreprise, vos services, ce qui vous rend unique..."
                  rows={4}
                  value={businessInfo.description}
                  onChange={(e) => setBusinessInfo({ ...businessInfo, description: e.target.value })}
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Marketing Goals */}
        {step === 2 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-6 w-6 text-primary" />
                Objectifs marketing
              </CardTitle>
              <CardDescription>
                Définissez vos objectifs pour que les agents IA travaillent efficacement
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="primaryGoal">Objectif principal *</Label>
                <Select value={marketingGoals.primaryGoal} onValueChange={(value) => setMarketingGoals({ ...marketingGoals, primaryGoal: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner votre objectif" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="leads">Génération de leads</SelectItem>
                    <SelectItem value="brand">Notoriété de marque</SelectItem>
                    <SelectItem value="sales">Augmentation des ventes</SelectItem>
                    <SelectItem value="engagement">Engagement communauté</SelectItem>
                    <SelectItem value="traffic">Trafic site web</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="leadsPerMonth">Nombre de leads souhaités par mois</Label>
                <Input
                  id="leadsPerMonth"
                  type="number"
                  placeholder="Ex: 50"
                  value={marketingGoals.leadsPerMonth}
                  onChange={(e) => setMarketingGoals({ ...marketingGoals, leadsPerMonth: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="budget">Budget marketing mensuel (CAD)</Label>
                <Select value={marketingGoals.budget} onValueChange={(value) => setMarketingGoals({ ...marketingGoals, budget: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner votre budget" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="<500">Moins de 500$</SelectItem>
                    <SelectItem value="500-1000">500$ - 1000$</SelectItem>
                    <SelectItem value="1000-2500">1000$ - 2500$</SelectItem>
                    <SelectItem value="2500-5000">2500$ - 5000$</SelectItem>
                    <SelectItem value=">5000">Plus de 5000$</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="targetAudience">Audience cible</Label>
                <Textarea
                  id="targetAudience"
                  placeholder="Décrivez votre client idéal (âge, profession, intérêts, localisation...)"
                  rows={3}
                  value={marketingGoals.targetAudience}
                  onChange={(e) => setMarketingGoals({ ...marketingGoals, targetAudience: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="uniqueSellingPoint">Proposition de valeur unique</Label>
                <Textarea
                  id="uniqueSellingPoint"
                  placeholder="Qu'est-ce qui vous différencie de vos concurrents ?"
                  rows={3}
                  value={marketingGoals.uniqueSellingPoint}
                  onChange={(e) => setMarketingGoals({ ...marketingGoals, uniqueSellingPoint: e.target.value })}
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Agent Preferences */}
        {step === 3 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-6 w-6 text-primary" />
                Préférences des agents
              </CardTitle>
              <CardDescription>
                Configurez le comportement de vos agents IA
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="contentTone">Ton du contenu</Label>
                <Select value={agentPreferences.contentTone} onValueChange={(value) => setAgentPreferences({ ...agentPreferences, contentTone: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="professional">Professionnel</SelectItem>
                    <SelectItem value="friendly">Amical</SelectItem>
                    <SelectItem value="casual">Décontracté</SelectItem>
                    <SelectItem value="formal">Formel</SelectItem>
                    <SelectItem value="humorous">Humoristique</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="postingFrequency">Fréquence de publication</Label>
                <Select value={agentPreferences.postingFrequency} onValueChange={(value) => setAgentPreferences({ ...agentPreferences, postingFrequency: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Quotidien (1 post/jour)</SelectItem>
                    <SelectItem value="3xweek">3x par semaine</SelectItem>
                    <SelectItem value="weekly">Hebdomadaire</SelectItem>
                    <SelectItem value="2xweek">2x par semaine</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="responseTime">Temps de réponse aux commentaires</Label>
                <Select value={agentPreferences.responseTime} onValueChange={(value) => setAgentPreferences({ ...agentPreferences, responseTime: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15min">15 minutes</SelectItem>
                    <SelectItem value="1h">1 heure</SelectItem>
                    <SelectItem value="4h">4 heures</SelectItem>
                    <SelectItem value="24h">24 heures</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="customInstructions">Instructions personnalisées pour les agents</Label>
                <Textarea
                  id="customInstructions"
                  placeholder="Ajoutez des instructions spécifiques pour guider vos agents (ex: éviter certains sujets, utiliser certains mots-clés, style d'écriture particulier...)"
                  rows={5}
                  value={agentPreferences.customInstructions}
                  onChange={(e) => setAgentPreferences({ ...agentPreferences, customInstructions: e.target.value })}
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 4: Review & Confirm */}
        {step === 4 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Check className="h-6 w-6 text-green-600" />
                Récapitulatif
              </CardTitle>
              <CardDescription>
                Vérifiez votre configuration avant d'activer le workflow
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Business Info Summary */}
              <div className="p-4 bg-slate-50 rounded-lg">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-primary" />
                  Informations entreprise
                </h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div><span className="text-slate-600">Nom:</span> <span className="font-medium">{businessInfo.businessName}</span></div>
                  <div><span className="text-slate-600">Secteur:</span> <span className="font-medium">{businessInfo.sector}</span></div>
                  <div><span className="text-slate-600">Ville:</span> <span className="font-medium">{businessInfo.city}</span></div>
                  <div><span className="text-slate-600">Téléphone:</span> <span className="font-medium">{businessInfo.phone}</span></div>
                </div>
              </div>

              {/* Marketing Goals Summary */}
              <div className="p-4 bg-blue-50 rounded-lg">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Target className="h-5 w-5 text-blue-600" />
                  Objectifs marketing
                </h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div><span className="text-slate-600">Objectif:</span> <span className="font-medium">{marketingGoals.primaryGoal}</span></div>
                  <div><span className="text-slate-600">Leads/mois:</span> <span className="font-medium">{marketingGoals.leadsPerMonth || "Non spécifié"}</span></div>
                  <div><span className="text-slate-600">Budget:</span> <span className="font-medium">{marketingGoals.budget || "Non spécifié"}</span></div>
                </div>
              </div>

              {/* Agent Preferences Summary */}
              <div className="p-4 bg-green-50 rounded-lg">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Users className="h-5 w-5 text-green-600" />
                  Préférences agents
                </h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div><span className="text-slate-600">Ton:</span> <span className="font-medium">{agentPreferences.contentTone}</span></div>
                  <div><span className="text-slate-600">Fréquence:</span> <span className="font-medium">{agentPreferences.postingFrequency}</span></div>
                  <div><span className="text-slate-600">Réponse:</span> <span className="font-medium">{agentPreferences.responseTime}</span></div>
                </div>
              </div>

              {/* Agents List */}
              <div className="p-4 bg-purple-50 rounded-lg">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-purple-600" />
                  Agents qui seront activés ({(workflow.agentIds as string[]).length})
                </h3>
                <div className="grid grid-cols-2 gap-2 text-sm max-h-40 overflow-y-auto">
                  {(workflow.agentIds as string[]).map((agentId) => (
                    <div key={agentId} className="flex items-center gap-2 text-slate-700">
                      <Check className="h-4 w-4 text-green-600" />
                      <span className="truncate">{agentId}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between mt-6">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={step === 1}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Précédent
          </Button>

          {step < totalSteps ? (
            <Button onClick={handleNext} className="gap-2">
              Suivant
              <ArrowRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={activateWorkflowMutation.isPending}
              className="gap-2 bg-green-600 hover:bg-green-700"
            >
              {activateWorkflowMutation.isPending ? (
                <>
                  <Sparkles className="h-4 w-4 animate-spin" />
                  Activation...
                </>
              ) : (
                <>
                  <Check className="h-4 w-4" />
                  Activer le workflow
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
