import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Settings, ArrowLeft, Zap, Search, FileText, Send, BarChart3, Upload } from "lucide-react";
import { gsap } from "gsap";
import { toast } from "sonner";

interface Agent {
  id: string;
  name: string;
  icon: typeof Search;
  emoji: string;
  description: string;
  mission: string;
  role: string;
  status: "active" | "inactive";
  color: string;
  model: string;
  prompt: string;
  documents: number;
}

export default function AgentTeamCanvas() {
  const [, setLocation] = useLocation();
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [configOpen, setConfigOpen] = useState(false);
  const cardsRef = useRef<HTMLDivElement[]>([]);

  const agents: Agent[] = [
    {
      id: "lead-scraper",
      name: "Lead Scraper",
      icon: Search,
      emoji: "🔍",
      description: "Scrape et enrichit les leads depuis Google Maps",
      mission: "Identifier et qualifier les prospects B2B pour le secteur des PME québécoises",
      role: "Analyser les données brutes de Google Maps, extraire et structurer les informations pertinentes, enrichir les leads avec des insights marketing, scorer la qualité du lead (0-100)",
      status: "active",
      color: "from-blue-500 to-cyan-500",
      model: "gemini-2.0-flash",
      prompt: "Tu es un expert en scraping de leads B2B pour le secteur des PME québécoises...",
      documents: 0
    },
    {
      id: "content-generator",
      name: "Content Generator",
      icon: FileText,
      emoji: "✍️",
      description: "Génère des posts LinkedIn engageants",
      mission: "Créer du contenu marketing de qualité adapté aux PME québécoises",
      role: "Générer des posts LinkedIn engageants, adapter le ton selon le secteur, inclure un CTA clair, ajouter 3-5 hashtags stratégiques",
      status: "active",
      color: "from-purple-500 to-pink-500",
      model: "claude-sonnet-4",
      prompt: "Tu es un expert en copywriting marketing pour PME québécoises...",
      documents: 0
    },
    {
      id: "publisher",
      name: "Publisher",
      icon: Send,
      emoji: "📱",
      description: "Publie les contenus sur LinkedIn",
      mission: "Assurer la publication optimale des contenus sur les réseaux sociaux",
      role: "Vérifier la qualité du contenu, optimiser le timing de publication, valider les guidelines LinkedIn",
      status: "active",
      color: "from-green-500 to-emerald-500",
      model: "gemini-2.0-flash",
      prompt: "Tu es responsable de la publication sur LinkedIn...",
      documents: 0
    },
    {
      id: "analyzer",
      name: "Analyzer",
      icon: BarChart3,
      emoji: "📊",
      description: "Analyse les performances et génère des insights",
      mission: "Mesurer et optimiser les performances des campagnes marketing",
      role: "Analyser les métriques (likes, commentaires, partages), identifier patterns de succès, générer insights actionnables",
      status: "active",
      color: "from-orange-500 to-red-500",
      model: "llama-3.3-70b",
      prompt: "Tu es un analyste marketing data-driven...",
      documents: 0
    }
  ];

  useEffect(() => {
    // Animation d'entrée GSAP
    gsap.fromTo(
      cardsRef.current,
      { opacity: 0, y: 50, scale: 0.9 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.6,
        stagger: 0.1,
        ease: "back.out(1.7)"
      }
    );
  }, []);

  const handleConfigureAgent = (agent: Agent) => {
    setSelectedAgent(agent);
    setConfigOpen(true);
  };

  const handleSaveConfig = () => {
    toast.success(`Configuration de ${selectedAgent?.name} sauvegardée !`);
    setConfigOpen(false);
  };

  const modelOptions = [
    { value: "gemini-2.0-flash", label: "Gemini 2.0 Flash", price: "GRATUIT" },
    { value: "claude-sonnet-4", label: "Claude Sonnet 4", price: "$3/1M tokens" },
    { value: "llama-3.3-70b", label: "Llama 3.3 70B", price: "$0.35/1M tokens" },
    { value: "gpt-4", label: "GPT-4", price: "$10/1M tokens" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLocation("/")}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour au Dashboard
          </Button>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
              Équipe d'Agents IA
            </h1>
            <p className="text-muted-foreground flex items-center gap-2">
              <Zap className="h-4 w-4 text-green-600" />
              Gérez votre équipe d'agents autonomes
            </p>
          </div>
          <Badge variant="outline" className="text-lg px-4 py-2">
            {agents.filter(a => a.status === "active").length} agents actifs
          </Badge>
        </div>
      </div>

      {/* Grid d'agents */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {agents.map((agent, index) => {
          const Icon = agent.icon;
          return (
            <Card
              key={agent.id}
              ref={(el) => {
                if (el) cardsRef.current[index] = el;
              }}
              className="relative overflow-hidden border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 cursor-pointer group"
            >
              {/* Gradient background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${agent.color} opacity-5 group-hover:opacity-10 transition-opacity`} />
              
              {/* Bouton engrenage */}
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-4 right-4 z-10 bg-background/80 backdrop-blur-sm hover:bg-primary hover:text-primary-foreground hover:scale-110 transition-all shadow-md"
                onClick={(e) => {
                  e.stopPropagation();
                  handleConfigureAgent(agent);
                }}
              >
                <Settings className="h-5 w-5" />
              </Button>

              <CardHeader className="pb-4">
                <div className="flex items-start gap-4">
                  <div className={`p-4 rounded-2xl bg-gradient-to-br ${agent.color} shadow-lg`}>
                    <span className="text-3xl">{agent.emoji}</span>
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-xl mb-2">{agent.name}</CardTitle>
                    <Badge 
                      variant={agent.status === "active" ? "default" : "secondary"}
                      className={agent.status === "active" ? "bg-green-500" : ""}
                    >
                      {agent.status === "active" ? "Actif" : "Inactif"}
                    </Badge>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Description</p>
                  <p className="text-sm">{agent.description}</p>
                </div>

                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Mission</p>
                  <p className="text-xs text-muted-foreground line-clamp-2">{agent.mission}</p>
                </div>

                <div className="pt-2 border-t">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Modèle: {modelOptions.find(m => m.value === agent.model)?.label}</span>
                    <span>{agent.documents} docs RAG</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Popup de configuration */}
      <Dialog open={configOpen} onOpenChange={setConfigOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3 text-2xl">
              <span className="text-3xl">{selectedAgent?.emoji}</span>
              Configuration - {selectedAgent?.name}
            </DialogTitle>
          </DialogHeader>

          {selectedAgent && (
            <div className="space-y-6 py-4">
              {/* Mission & Rôle */}
              <div className="space-y-2">
                <Label className="text-base font-semibold">Mission</Label>
                <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
                  {selectedAgent.mission}
                </p>
              </div>

              <div className="space-y-2">
                <Label className="text-base font-semibold">Rôle</Label>
                <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
                  {selectedAgent.role}
                </p>
              </div>

              {/* Modèle IA */}
              <div className="space-y-2">
                <Label htmlFor="model" className="text-base font-semibold">Modèle IA</Label>
                <Select defaultValue={selectedAgent.model}>
                  <SelectTrigger id="model">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {modelOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        <div className="flex items-center justify-between w-full">
                          <span>{option.label}</span>
                          <span className="text-xs text-muted-foreground ml-4">{option.price}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Prompt Système */}
              <div className="space-y-2">
                <Label htmlFor="prompt" className="text-base font-semibold">Prompt Système</Label>
                <Textarea
                  id="prompt"
                  defaultValue={selectedAgent.prompt}
                  rows={8}
                  className="font-mono text-sm"
                  placeholder="Entrez le prompt système..."
                />
                <p className="text-xs text-muted-foreground">~{Math.ceil(selectedAgent.prompt.length / 4)} tokens</p>
              </div>

              {/* Documents RAG */}
              <div className="space-y-2">
                <Label className="text-base font-semibold">Documents RAG ({selectedAgent.documents})</Label>
                <div className="border-2 border-dashed rounded-lg p-6 text-center hover:border-primary/50 transition-colors cursor-pointer">
                  <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <Label htmlFor="file-upload" className="cursor-pointer">
                    <span className="text-sm font-medium">Uploader des documents</span>
                    <p className="text-xs text-muted-foreground mt-1">PDF, TXT, MD, DOCX</p>
                  </Label>
                  <input
                    id="file-upload"
                    type="file"
                    className="hidden"
                    accept=".pdf,.txt,.md,.docx"
                    multiple
                    onChange={() => toast.info("Upload en cours...")}
                  />
                </div>
              </div>

              {/* Bouton Sauvegarder */}
              <Button
                onClick={handleSaveConfig}
                className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-semibold py-6 text-lg"
              >
                Sauvegarder la configuration
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
