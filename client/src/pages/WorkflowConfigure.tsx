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
import { COUNTRIES, CURRENCIES } from "@/../../shared/countries";

export default function WorkflowConfigure() {
  const { id } = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const [step, setStep] = useState(1);
  const totalSteps = 5;

  // Form state
  const [businessInfo, setBusinessInfo] = useState({
    businessName: "",
    country: "US",
    dialCode: "+1",
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

  const [workflowMission, setWorkflowMission] = useState({
    objective: "",
    kpis: "",
    timeline: "",
    constraints: "",
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
      workflowMission,
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
              </div>

              <div>
                <Label htmlFor="country">Pays *</Label>
                <Select 
                  value={businessInfo.country} 
                  onValueChange={(value) => {
                    const country = COUNTRIES.find(c => c.code === value);
                    if (country) {
                      setBusinessInfo({ 
                        ...businessInfo, 
                        country: value,
                        dialCode: country.dialCode
                      });
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner votre pays" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[300px]">
                    {COUNTRIES.map((country) => (
                      <SelectItem key={country.code} value={country.code}>
                        {country.name} ({country.dialCode})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="city">Ville *</Label>
                  <Input
                    id="city"
                    placeholder="Paris, New York, Dubai..."
                    value={businessInfo.city}
                    onChange={(e) => setBusinessInfo({ ...businessInfo, city: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="province">Province/État/Région</Label>
                  <Input
                    id="province"
                    placeholder="Île-de-France, California, Dubai..."
                    value={businessInfo.province}
                    onChange={(e) => setBusinessInfo({ ...businessInfo, province: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phone">Téléphone *</Label>
                  <div className="flex gap-2">
                    <Select value={businessInfo.dialCode} onValueChange={(value) => setBusinessInfo({ ...businessInfo, dialCode: value })}>
                      <SelectTrigger className="w-[120px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="max-h-[300px]">
                        {COUNTRIES.map((country) => (
                          <SelectItem key={country.code} value={country.dialCode}>
                            {country.dialCode}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Input
                      id="phone"
                      placeholder="123456789"
                      value={businessInfo.phone}
                      onChange={(e) => setBusinessInfo({ ...businessInfo, phone: e.target.value })}
                      className="flex-1"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="postalCode">Code postal</Label>
                  <Input
                    id="postalCode"
                    placeholder="75001, 10001, etc."
                    value={businessInfo.postalCode}
                    onChange={(e) => setBusinessInfo({ ...businessInfo, postalCode: e.target.value })}
                  />
                </div>
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

              <div>
                <Label htmlFor="sector">Secteur d'activité *</Label>
                <Select value={businessInfo.sector} onValueChange={(value) => setBusinessInfo({ ...businessInfo, sector: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner votre secteur" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="restaurant">Restaurant & Hospitality</SelectItem>
                    <SelectItem value="ecommerce">E-commerce & Retail</SelectItem>
                    <SelectItem value="b2b">B2B Services & SaaS</SelectItem>
                    <SelectItem value="sante">Healthcare & Wellness</SelectItem>
                    <SelectItem value="immobilier">Real Estate & Property</SelectItem>
                    <SelectItem value="consulting">Consulting & Coaching</SelectItem>
                    <SelectItem value="finance">Finance & Insurance</SelectItem>
                    <SelectItem value="education">Education & Training</SelectItem>
                    <SelectItem value="technology">Technology & IT</SelectItem>
                    <SelectItem value="creative">Creative & Media</SelectItem>
                    <SelectItem value="autre">Other</SelectItem>
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

        {/* Step 3: Workflow Mission */}
        {step === 3 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-6 w-6 text-primary" />
                Mission du Workflow
              </CardTitle>
              <CardDescription>
                Définissez l'objectif stratégique global que tous les agents devront accomplir ensemble
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="objective">Objectif stratégique principal *</Label>
                <Textarea
                  id="objective"
                  placeholder="Ex: Générer 50 leads qualifiés par mois pour notre restaurant italien à Montréal via Instagram et Google Maps, en ciblant les familles et professionnels 30-55 ans"
                  rows={4}
                  value={workflowMission.objective}
                  onChange={(e) => setWorkflowMission({ ...workflowMission, objective: e.target.value })}
                  className="text-base"
                />
                <p className="text-sm text-slate-500 mt-2">
                  Soyez précis : incluez le nombre, le type de résultat, la cible et les canaux
                </p>
              </div>

              <div>
                <Label htmlFor="kpis">KPIs et métriques de succès *</Label>
                <Textarea
                  id="kpis"
                  placeholder="Ex: 50 leads/mois, taux conversion 15%, coût par lead < 20$, 1000 nouveaux followers Instagram, note Google 4.5+"
                  rows={3}
                  value={workflowMission.kpis}
                  onChange={(e) => setWorkflowMission({ ...workflowMission, kpis: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="timeline">Délai et étapes clés</Label>
                <Textarea
                  id="timeline"
                  placeholder="Ex: Mois 1-2: Setup et premiers contenus, Mois 3-4: Optimisation et scaling, Mois 5-6: Atteinte objectifs"
                  rows={3}
                  value={workflowMission.timeline}
                  onChange={(e) => setWorkflowMission({ ...workflowMission, timeline: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="constraints">Contraintes et priorités</Label>
                <Textarea
                  id="constraints"
                  placeholder="Ex: Budget limité, éviter contenu trop promotionnel, privilégier authenticité, respecter identité visuelle existante"
                  rows={3}
                  value={workflowMission.constraints}
                  onChange={(e) => setWorkflowMission({ ...workflowMission, constraints: e.target.value })}
                />
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
                <p className="text-sm text-blue-900 font-medium mb-2">
                  💡 Pourquoi c'est important ?
                </p>
                <p className="text-sm text-blue-800">
                  Cette mission sera injectée dans le prompt de TOUS vos agents. Chaque agent comprendra son rôle dans la mission globale et travaillera en cohérence avec les autres pour atteindre votre objectif.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 4: Agent Preferences */}
        {step === 4 && (
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

        {/* Step 5: Review & Confirm */}
        {step === 5 && (
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

              {/* Workflow Mission Summary */}
              <div className="p-4 bg-amber-50 rounded-lg border-2 border-amber-200">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-amber-600" />
                  Mission du Workflow
                </h3>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-slate-600 font-medium">Objectif:</span>
                    <p className="text-slate-800 mt-1">{workflowMission.objective || "Non spécifié"}</p>
                  </div>
                  <div>
                    <span className="text-slate-600 font-medium">KPIs:</span>
                    <p className="text-slate-800 mt-1">{workflowMission.kpis || "Non spécifié"}</p>
                  </div>
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
