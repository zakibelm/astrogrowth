import { useState } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { ArrowLeft, ArrowRight, Check, Loader2 } from "lucide-react";

export default function NewCampaign() {
  const [, setLocation] = useLocation();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    targetIndustry: "",
    targetLocation: "",
  });

  const createCampaign = trpc.campaigns.create.useMutation({
    onSuccess: (data) => {
      toast.success("Campagne créée avec succès!");
      setLocation(`/campaigns/${data.id}`);
    },
    onError: (error) => {
      toast.error(`Erreur: ${error.message}`);
    },
  });

  const handleSubmit = async () => {
    if (!formData.name || !formData.targetIndustry || !formData.targetLocation) {
      toast.error("Veuillez remplir tous les champs");
      return;
    }

    createCampaign.mutate(formData);
  };

  const industries = [
    { value: "restaurant", label: "Restaurant" },
    { value: "dentiste", label: "Cabinet Dentaire" },
    { value: "agent immobilier", label: "Agent Immobilier" },
    { value: "salon de coiffure", label: "Salon de Coiffure" },
    { value: "garage", label: "Garage Automobile" },
    { value: "boutique", label: "Boutique de Détail" },
    { value: "service b2b", label: "Service B2B" },
  ];

  const locations = [
    { value: "Montréal, QC", label: "Montréal" },
    { value: "Québec, QC", label: "Québec" },
    { value: "Laval, QC", label: "Laval" },
    { value: "Gatineau, QC", label: "Gatineau" },
    { value: "Longueuil, QC", label: "Longueuil" },
    { value: "Sherbrooke, QC", label: "Sherbrooke" },
    { value: "Trois-Rivières, QC", label: "Trois-Rivières" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8 max-w-3xl">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            className="mb-4"
            onClick={() => setLocation("/dashboard")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour au Dashboard
          </Button>
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Nouvelle Campagne
          </h1>
          <p className="text-muted-foreground text-lg">
            Créez une campagne de génération de leads en 3 étapes simples
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center gap-4">
            {[1, 2, 3].map((stepNum) => (
              <div key={stepNum} className="flex items-center gap-4">
                <div
                  className={`flex items-center justify-center h-10 w-10 rounded-full font-semibold transition-all ${
                    step > stepNum
                      ? "bg-primary text-primary-foreground"
                      : step === stepNum
                      ? "bg-primary text-primary-foreground ring-4 ring-primary/20"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {step > stepNum ? <Check className="h-5 w-5" /> : stepNum}
                </div>
                {stepNum < 3 && (
                  <div
                    className={`h-0.5 w-16 transition-all ${
                      step > stepNum ? "bg-primary" : "bg-muted"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>
              {step === 1 && "Étape 1: Nom de la Campagne"}
              {step === 2 && "Étape 2: Type d'Entreprise Cible"}
              {step === 3 && "Étape 3: Localisation"}
            </CardTitle>
            <CardDescription>
              {step === 1 && "Donnez un nom descriptif à votre campagne"}
              {step === 2 && "Sélectionnez l'industrie que vous ciblez"}
              {step === 3 && "Choisissez la région géographique"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {step === 1 && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Nom de la Campagne</Label>
                  <Input
                    id="name"
                    placeholder="Ex: Restaurants Montréal Q1 2024"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="mt-2"
                  />
                  <p className="text-sm text-muted-foreground mt-2">
                    Choisissez un nom qui vous aidera à identifier facilement cette campagne
                  </p>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="industry">Type d'Entreprise</Label>
                  <Select
                    value={formData.targetIndustry}
                    onValueChange={(value) =>
                      setFormData({ ...formData, targetIndustry: value })
                    }
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Sélectionnez une industrie" />
                    </SelectTrigger>
                    <SelectContent>
                      {industries.map((industry) => (
                        <SelectItem key={industry.value} value={industry.value}>
                          {industry.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-muted-foreground mt-2">
                    Nous rechercherons des entreprises de ce type dans la région sélectionnée
                  </p>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="location">Localisation</Label>
                  <Select
                    value={formData.targetLocation}
                    onValueChange={(value) =>
                      setFormData({ ...formData, targetLocation: value })
                    }
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Sélectionnez une ville" />
                    </SelectTrigger>
                    <SelectContent>
                      {locations.map((location) => (
                        <SelectItem key={location.value} value={location.value}>
                          {location.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-muted-foreground mt-2">
                    La recherche sera effectuée dans cette région
                  </p>
                </div>

                {/* Summary */}
                <div className="mt-6 p-4 bg-muted rounded-lg">
                  <h3 className="font-semibold text-foreground mb-3">
                    Résumé de la Campagne
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Nom:</span>
                      <span className="font-medium text-foreground">
                        {formData.name || "Non défini"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Industrie:</span>
                      <span className="font-medium text-foreground">
                        {industries.find((i) => i.value === formData.targetIndustry)
                          ?.label || "Non défini"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Localisation:</span>
                      <span className="font-medium text-foreground">
                        {locations.find((l) => l.value === formData.targetLocation)
                          ?.label || "Non défini"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Navigation Buttons */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={() => setStep(Math.max(1, step - 1))}
            disabled={step === 1}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Précédent
          </Button>

          {step < 3 ? (
            <Button
              onClick={() => setStep(Math.min(3, step + 1))}
              disabled={
                (step === 1 && !formData.name) ||
                (step === 2 && !formData.targetIndustry)
              }
            >
              Suivant
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={createCampaign.isPending || !formData.targetLocation}
            >
              {createCampaign.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Création...
                </>
              ) : (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Créer la Campagne
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
