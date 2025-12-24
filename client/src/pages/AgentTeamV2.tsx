import { useState, useRef, useEffect } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { 
  ArrowLeft, 
  Bot, 
  Brain, 
  Zap, 
  FileText, 
  Upload, 
  Trash2, 
  Save,
  RotateCcw,
  DollarSign,
  Check,
  AlertCircle
} from "lucide-react";
import { toast } from "sonner";
import gsap from "gsap";

interface Agent {
  id: string;
  name: string;
  type: "lead_scraper" | "content_generator" | "publisher" | "analyzer";
  description: string;
  model: string;
  systemPrompt: string;
  enabled: boolean;
  documents: AgentDocument[];
}

interface AgentDocument {
  id: string;
  fileName: string;
  fileSize: number;
  uploadedAt: string;
}

const modelPricing: Record<string, { name: string; price: string; color: string }> = {
  "gemini-2.0-flash": { name: "Gemini 2.0 Flash", price: "GRATUIT", color: "text-green-600" },
  "claude-sonnet-4": { name: "Claude Sonnet 4", price: "$3/1M tokens", color: "text-purple-600" },
  "llama-3.3-70b": { name: "Llama 3.3 70B", price: "$0.35/1M tokens", color: "text-blue-600" },
  "gpt-4": { name: "GPT-4 Turbo", price: "$10/1M tokens", color: "text-orange-600" }
};

const defaultPrompts: Record<string, string> = {
  lead_scraper: `Tu es un expert en scraping de leads B2B pour le secteur des PME québécoises.

**Ton rôle:**
- Analyser les données brutes de Google Maps
- Extraire et structurer les informations pertinentes
- Enrichir les leads avec des insights marketing
- Scorer la qualité du lead (0-100)

**Critères de scoring:**
- Présence site web moderne (+20 points)
- Note Google Maps > 4.0 (+15 points)
- Nombre d'avis > 50 (+15 points)
- Présence réseaux sociaux (+10 points)`,

  content_generator: `Tu es un expert en copywriting marketing pour PME québécoises.

**Ton rôle:**
- Générer des posts LinkedIn engageants
- Adapter le ton selon le secteur
- Inclure un CTA clair
- Ajouter 3-5 hashtags stratégiques

**Structure:**
1. Hook accrocheur
2. Développement (2-3 paragraphes)
3. CTA clair
4. Hashtags pertinents`,

  publisher: `Tu es responsable de la publication sur LinkedIn.

**Ton rôle:**
- Vérifier la qualité du contenu
- Optimiser le timing de publication
- Valider les guidelines LinkedIn

**Checklist:**
- Texte 150-300 mots
- Image qualité (1200x627px)
- CTA actionnable
- 3-5 hashtags`,

  analyzer: `Tu es un analyste marketing data-driven.

**Ton rôle:**
- Analyser les métriques (likes, commentaires, partages)
- Identifier patterns de succès
- Générer insights actionnables

**Métriques clés:**
- Taux d'engagement
- Taux de conversion
- ROI par campagne`
};

export default function AgentTeamV2() {
  const [, setLocation] = useLocation();
  const [agents, setAgents] = useState<Agent[]>([
    {
      id: "1",
      name: "Lead Scraper",
      type: "lead_scraper",
      description: "Scrape et enrichit les leads depuis Google Maps",
      model: "gemini-2.0-flash",
      systemPrompt: defaultPrompts.lead_scraper,
      enabled: true,
      documents: []
    },
    {
      id: "2",
      name: "Content Generator",
      type: "content_generator",
      description: "Génère des posts LinkedIn engageants",
      model: "claude-sonnet-4",
      systemPrompt: defaultPrompts.content_generator,
      enabled: true,
      documents: []
    },
    {
      id: "3",
      name: "Publisher",
      type: "publisher",
      description: "Publie les contenus sur LinkedIn",
      model: "gemini-2.0-flash",
      systemPrompt: defaultPrompts.publisher,
      enabled: true,
      documents: []
    },
    {
      id: "4",
      name: "Analyzer",
      type: "analyzer",
      description: "Analyse les performances et génère des insights",
      model: "llama-3.3-70b",
      systemPrompt: defaultPrompts.analyzer,
      enabled: true,
      documents: []
    }
  ]);

  const [editingAgent, setEditingAgent] = useState<string | null>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    if (cardsRef.current.length > 0) {
      gsap.fromTo(
        cardsRef.current,
        { opacity: 0, y: 50, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
          stagger: 0.15,
          ease: "power3.out"
        }
      );
    }
  }, []);

  const handleModelChange = (agentId: string, model: string) => {
    setAgents(prev => prev.map(agent => 
      agent.id === agentId ? { ...agent, model } : agent
    ));
  };

  const handlePromptChange = (agentId: string, prompt: string) => {
    setAgents(prev => prev.map(agent => 
      agent.id === agentId ? { ...agent, systemPrompt: prompt } : agent
    ));
  };

  const handleResetPrompt = (agentId: string, type: string) => {
    setAgents(prev => prev.map(agent => 
      agent.id === agentId ? { ...agent, systemPrompt: defaultPrompts[type] } : agent
    ));
    toast.success("Prompt réinitialisé");
  };

  const handleSaveAgent = (agentId: string) => {
    // TODO: Implémenter sauvegarde backend
    toast.success("Configuration sauvegardée");
    setEditingAgent(null);
  };

  const handleFileUpload = (agentId: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    // TODO: Implémenter upload vers S3
    const newDocs: AgentDocument[] = Array.from(files).map((file, index) => ({
      id: `${agentId}-doc-${Date.now()}-${index}`,
      fileName: file.name,
      fileSize: file.size,
      uploadedAt: new Date().toISOString()
    }));

    setAgents(prev => prev.map(agent => 
      agent.id === agentId 
        ? { ...agent, documents: [...agent.documents, ...newDocs] }
        : agent
    ));

    toast.success(`${files.length} document(s) uploadé(s)`);
  };

  const handleDeleteDocument = (agentId: string, docId: string) => {
    setAgents(prev => prev.map(agent => 
      agent.id === agentId 
        ? { ...agent, documents: agent.documents.filter(doc => doc.id !== docId) }
        : agent
    ));
    toast.success("Document supprimé");
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const AgentCard = ({ agent, index }: { agent: Agent; index: number }) => {
    const isEditing = editingAgent === agent.id;
    const modelInfo = modelPricing[agent.model];
    const tokenCount = agent.systemPrompt.split(/\s+/).length * 1.3; // Rough estimate

    return (
      <div 
        ref={el => { if (el) cardsRef.current[index] = el; }}
        className="opacity-0"
      >
        <Card className="h-full border-2 hover:border-primary/50 transition-all duration-300">
          <CardHeader>
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 shadow-lg">
                  <Bot className="h-7 w-7 text-white" />
                </div>
                <div>
                  <CardTitle className="text-xl">{agent.name}</CardTitle>
                  <CardDescription className="text-sm mt-1">
                    {agent.description}
                  </CardDescription>
                </div>
              </div>
              <Badge variant={agent.enabled ? "default" : "secondary"} className="gap-1">
                {agent.enabled ? <Check className="h-3 w-3" /> : <AlertCircle className="h-3 w-3" />}
                {agent.enabled ? "Actif" : "Inactif"}
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Sélection Modèle IA */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Brain className="h-4 w-4" />
                Modèle IA
              </Label>
              <Select 
                value={agent.model} 
                onValueChange={(value) => handleModelChange(agent.id, value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(modelPricing).map(([key, info]) => (
                    <SelectItem key={key} value={key}>
                      <div className="flex items-center justify-between w-full">
                        <span>{info.name}</span>
                        <span className={`text-xs ml-4 font-semibold ${info.color}`}>
                          {info.price}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Coût estimé:</span>
                <span className={`font-semibold ${modelInfo.color}`}>
                  {modelInfo.price}
                </span>
              </div>
            </div>

            {/* Prompt Système */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Prompt Système
                </Label>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">
                    ~{Math.round(tokenCount)} tokens
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleResetPrompt(agent.id, agent.type)}
                  >
                    <RotateCcw className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              <Textarea
                value={agent.systemPrompt}
                onChange={(e) => handlePromptChange(agent.id, e.target.value)}
                rows={8}
                className="font-mono text-xs"
                placeholder="Entrez le prompt système..."
              />
            </div>

            {/* Documents RAG */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Upload className="h-4 w-4" />
                Documents RAG ({agent.documents.length})
              </Label>
              
              {/* Liste des documents */}
              {agent.documents.length > 0 && (
                <div className="space-y-2 max-h-40 overflow-y-auto p-3 bg-muted/50 rounded-lg">
                  {agent.documents.map(doc => (
                    <div 
                      key={doc.id}
                      className="flex items-center justify-between p-2 bg-background rounded border"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{doc.fileName}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatFileSize(doc.fileSize)} • {new Date(doc.uploadedAt).toLocaleDateString()}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteDocument(agent.id, doc.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              {/* Upload button */}
              <div>
                <Input
                  type="file"
                  multiple
                  accept=".pdf,.txt,.md,.docx"
                  onChange={(e) => handleFileUpload(agent.id, e)}
                  className="hidden"
                  id={`file-upload-${agent.id}`}
                />
                <label htmlFor={`file-upload-${agent.id}`}>
                  <Button
                    variant="outline"
                    className="w-full"
                    asChild
                  >
                    <span className="cursor-pointer flex items-center justify-center gap-2">
                      <Upload className="h-4 w-4" />
                      Uploader des documents
                    </span>
                  </Button>
                </label>
                <p className="text-xs text-muted-foreground mt-2">
                  Formats acceptés: PDF, TXT, MD, DOCX
                </p>
              </div>
            </div>

            {/* Bouton Sauvegarder */}
            <Button
              className="w-full bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 text-white shadow-lg hover:shadow-xl transition-all duration-300"
              onClick={() => handleSaveAgent(agent.id)}
            >
              <Save className="h-4 w-4 mr-2" />
              Sauvegarder la configuration
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header */}
      <div className="border-b bg-card/50 backdrop-blur-xl sticky top-0 z-10">
        <div className="container py-6">
          <Button
            variant="ghost"
            onClick={() => setLocation("/settings")}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour aux Paramètres
          </Button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                Équipe d'Agents IA
              </h1>
              <p className="text-muted-foreground mt-2">
                Configurez vos agents IA : modèle, prompts système et documents RAG
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => setLocation("/")}
              className="gap-2"
            >
              <Zap className="h-4 w-4" />
              Dashboard Global
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {agents.map((agent, index) => (
            <AgentCard key={agent.id} agent={agent} index={index} />
          ))}
        </div>
      </div>
    </div>
  );
}
