import { useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Save, Sparkles, Bot } from "lucide-react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { DEPARTMENTS } from "@/../../shared/agents-data";

const AI_MODELS = [
  { value: "gpt-4", label: "GPT-4 (OpenAI)", description: "Le plus puissant pour raisonnement complexe" },
  { value: "gpt-4o-mini", label: "GPT-4o Mini (OpenAI)", description: "Rapide et économique" },
  { value: "claude-3-5-sonnet", label: "Claude 3.5 Sonnet (Anthropic)", description: "Excellent pour écriture créative" },
  { value: "gemini-2.0-flash-exp", label: "Gemini 2.0 Flash (Google)", description: "Ultra rapide, multimodal" },
  { value: "llama-3.3-70b", label: "Llama 3.3 70B (Meta)", description: "Open source, performant" },
];

const AVAILABLE_TOOLS = [
  { value: "web_search", label: "Recherche Web", description: "Accès à internet pour recherches" },
  { value: "image_generation", label: "Génération d'Images", description: "Créer des visuels avec IA" },
  { value: "data_analysis", label: "Analyse de Données", description: "Traiter et analyser des données" },
  { value: "email_sending", label: "Envoi d'Emails", description: "Envoyer des emails automatiquement" },
  { value: "social_posting", label: "Publication Social Media", description: "Poster sur réseaux sociaux" },
  { value: "file_processing", label: "Traitement de Fichiers", description: "Lire et traiter documents" },
];

export default function AgentCreator() {
  const [, navigate] = useLocation();
  const [formData, setFormData] = useState({
    name: "",
    emoji: "🤖",
    role: "",
    description: "",
    mission: "",
    systemPrompt: "",
    model: "gpt-4",
    department: "content",
    tools: [] as string[],
  });

  const createAgentMutation = trpc.customAgents.create.useMutation({
    onSuccess: () => {
      toast.success("Agent IA personnalisé créé !");
      navigate("/agents");
    },
    onError: (error) => {
      toast.error(`Erreur: ${error.message}`);
    },
  });

  const toggleTool = (toolValue: string) => {
    setFormData((prev) => ({
      ...prev,
      tools: prev.tools.includes(toolValue)
        ? prev.tools.filter((t) => t !== toolValue)
        : [...prev.tools, toolValue],
    }));
  };

  const handleSave = () => {
    if (!formData.name.trim()) {
      toast.error("Veuillez entrer un nom pour l'agent");
      return;
    }
    if (!formData.role.trim()) {
      toast.error("Veuillez entrer un rôle pour l'agent");
      return;
    }
    if (!formData.systemPrompt.trim()) {
      toast.error("Veuillez entrer un prompt système pour l'agent");
      return;
    }

    createAgentMutation.mutate(formData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <Button variant="ghost" onClick={() => navigate("/agents")} className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour aux agents
            </Button>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Créateur d'Agent IA Personnalisé
            </h1>
            <p className="text-slate-600 mt-2">Créez un agent IA sur mesure selon vos besoins</p>
          </div>
          <Button onClick={handleSave} size="lg" className="gap-2" disabled={createAgentMutation.isPending}>
            <Save className="h-5 w-5" />
            Créer l'Agent
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Preview */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bot className="h-5 w-5 text-purple-600" />
                  Aperçu de l'Agent
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg">
                  <div className="text-6xl mb-3">{formData.emoji}</div>
                  <h3 className="text-xl font-bold">{formData.name || "Nom de l'agent"}</h3>
                  <Badge variant="secondary" className="mt-2">
                    {formData.department}
                  </Badge>
                </div>

                <div>
                  <p className="text-sm font-medium text-slate-700">Rôle</p>
                  <p className="text-sm text-slate-600">{formData.role || "Non défini"}</p>
                </div>

                <div>
                  <p className="text-sm font-medium text-slate-700">Description</p>
                  <p className="text-sm text-slate-600">{formData.description || "Non définie"}</p>
                </div>

                <div>
                  <p className="text-sm font-medium text-slate-700">Modèle IA</p>
                  <Badge>{AI_MODELS.find((m) => m.value === formData.model)?.label}</Badge>
                </div>

                <div>
                  <p className="text-sm font-medium text-slate-700">Outils activés</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {formData.tools.length > 0 ? (
                      formData.tools.map((tool) => (
                        <Badge key={tool} variant="outline" className="text-xs">
                          {AVAILABLE_TOOLS.find((t) => t.value === tool)?.label}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-xs text-slate-500">Aucun outil sélectionné</span>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right: Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Informations de base */}
            <Card>
              <CardHeader>
                <CardTitle>Informations de Base</CardTitle>
                <CardDescription>Définissez l'identité de votre agent IA</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Nom de l'agent *</Label>
                    <Input
                      id="name"
                      placeholder="Ex: Expert SEO Local"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="emoji">Emoji</Label>
                    <Input
                      id="emoji"
                      placeholder="🤖"
                      value={formData.emoji}
                      onChange={(e) => setFormData({ ...formData, emoji: e.target.value })}
                      maxLength={2}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="role">Rôle *</Label>
                  <Input
                    id="role"
                    placeholder="Ex: Spécialiste Référencement Local"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Décrivez ce que fait cet agent..."
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="mission">Mission</Label>
                  <Textarea
                    id="mission"
                    placeholder="Quelle est la mission principale de cet agent ?"
                    rows={2}
                    value={formData.mission}
                    onChange={(e) => setFormData({ ...formData, mission: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="department">Département</Label>
                  <Select value={formData.department} onValueChange={(value) => setFormData({ ...formData, department: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {DEPARTMENTS.filter((d) => d.id !== "all").map((dept) => (
                        <SelectItem key={dept.id} value={dept.id}>
                          {dept.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Configuration IA */}
            <Card>
              <CardHeader>
                <CardTitle>Configuration IA</CardTitle>
                <CardDescription>Choisissez le modèle et les capacités de l'agent</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="model">Modèle IA</Label>
                  <Select value={formData.model} onValueChange={(value) => setFormData({ ...formData, model: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {AI_MODELS.map((model) => (
                        <SelectItem key={model.value} value={model.value}>
                          <div>
                            <div className="font-medium">{model.label}</div>
                            <div className="text-xs text-slate-500">{model.description}</div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Outils disponibles</Label>
                  <div className="grid grid-cols-2 gap-3 mt-2">
                    {AVAILABLE_TOOLS.map((tool) => (
                      <Card
                        key={tool.value}
                        className={`cursor-pointer transition-all ${
                          formData.tools.includes(tool.value) ? "ring-2 ring-primary bg-primary/5" : "hover:shadow-md"
                        }`}
                        onClick={() => toggleTool(tool.value)}
                      >
                        <CardContent className="p-3">
                          <div className="flex items-start justify-between">
                            <div>
                              <p className="text-sm font-medium">{tool.label}</p>
                              <p className="text-xs text-slate-500 mt-1">{tool.description}</p>
                            </div>
                            <input
                              type="checkbox"
                              checked={formData.tools.includes(tool.value)}
                              onChange={() => toggleTool(tool.value)}
                              className="mt-1"
                            />
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Prompt Système */}
            <Card>
              <CardHeader>
                <CardTitle>Prompt Système *</CardTitle>
                <CardDescription>
                  Définissez les instructions que l'agent suivra. Soyez précis et détaillé.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder={`Exemple:
Tu es un expert en référencement local pour les restaurants. Ta mission est d'optimiser la présence en ligne des restaurants sur Google My Business et les annuaires locaux.

Tes responsabilités:
- Optimiser les fiches Google My Business
- Générer des mots-clés locaux pertinents
- Rédiger des descriptions optimisées SEO
- Suggérer des stratégies d'avis clients

Ton style: Professionnel, orienté résultats, avec des recommandations actionnables.`}
                  rows={12}
                  value={formData.systemPrompt}
                  onChange={(e) => setFormData({ ...formData, systemPrompt: e.target.value })}
                  className="font-mono text-sm"
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
