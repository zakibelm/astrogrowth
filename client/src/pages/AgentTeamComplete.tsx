import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Settings, ArrowLeft, Zap, Search, Database, FileText, Mail, BookOpen,
  Video, Clapperboard, Scissors, Image, Frame, Package, Target, TrendingUp,
  Smartphone, Calendar, BarChart3, SearchCheck, TestTube, MessageSquare,
  Bot, Globe, CheckCircle, Upload, Instagram, Facebook, Linkedin
} from "lucide-react";
import { gsap } from "gsap";
import { toast } from "sonner";

interface Agent {
  id: string;
  name: string;
  icon: any;
  emoji: string;
  category: string;
  description: string;
  mission: string;
  role: string;
  status: "active" | "inactive";
  color: string;
  model: string;
  prompt: string;
  documents: number;
}

export default function AgentTeamComplete() {
  const [, setLocation] = useLocation();
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [configOpen, setConfigOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const cardsRef = useRef<HTMLDivElement[]>([]);

  const agents: Agent[] = [
    // PROSPECTION & DONNÉES
    {
      id: "lead-scraper",
      name: "Lead Scraper",
      icon: Search,
      emoji: "🔍",
      category: "prospection",
      description: "Identifie et qualifie les prospects B2B",
      mission: "Scraper Google Maps, enrichir données, scorer qualité",
      role: "Analyser données brutes, extraire infos, enrichir leads, scorer 0-100",
      status: "active",
      color: "from-blue-500 to-cyan-500",
      model: "gemini-2.0-flash",
      prompt: "Tu es un expert en scraping de leads B2B...",
      documents: 0
    },
    {
      id: "data-enricher",
      name: "Data Enricher",
      icon: Database,
      emoji: "📊",
      category: "prospection",
      description: "Enrichit les leads avec données externes",
      mission: "Chercher infos complémentaires (site, réseaux, avis)",
      role: "Enrichir profils leads avec données web, réseaux sociaux, avis clients",
      status: "inactive",
      color: "from-blue-600 to-indigo-600",
      model: "gemini-2.0-flash",
      prompt: "Tu es spécialisé dans l'enrichissement de données B2B...",
      documents: 0
    },
    
    // CONTENU TEXTE
    {
      id: "copywriter-linkedin",
      name: "Copywriter LinkedIn",
      icon: Linkedin,
      emoji: "💼",
      category: "texte",
      description: "Crée posts LinkedIn engageants",
      mission: "Rédiger posts adaptés secteur, CTA, hashtags",
      role: "Créer copywriting professionnel, inclure CTA clair, hashtags stratégiques",
      status: "active",
      color: "from-purple-500 to-pink-500",
      model: "claude-sonnet-4",
      prompt: "Tu es un expert copywriter LinkedIn pour PME québécoises...",
      documents: 0
    },
    {
      id: "copywriter-instagram",
      name: "Copywriter Instagram",
      icon: Instagram,
      emoji: "📸",
      category: "texte",
      description: "Crée captions Instagram captivantes",
      mission: "Rédiger captions courtes, emojis, hashtags tendance",
      role: "Créer captions Instagram engageantes avec emojis et hashtags optimisés",
      status: "inactive",
      color: "from-pink-500 to-rose-500",
      model: "claude-sonnet-4",
      prompt: "Tu es un expert Instagram copywriter...",
      documents: 0
    },
    {
      id: "copywriter-facebook",
      name: "Copywriter Facebook",
      icon: Facebook,
      emoji: "👥",
      category: "texte",
      description: "Crée posts Facebook engageants",
      mission: "Rédiger posts conversationnels, questions, CTA",
      role: "Créer posts Facebook qui génèrent conversations et engagement",
      status: "inactive",
      color: "from-blue-500 to-blue-700",
      model: "claude-sonnet-4",
      prompt: "Tu es un expert Facebook copywriter...",
      documents: 0
    },
    {
      id: "email-marketer",
      name: "Email Marketer",
      icon: Mail,
      emoji: "📧",
      category: "texte",
      description: "Crée campagnes email personnalisées",
      mission: "Rédiger objets accrocheurs, corps email, séquences",
      role: "Créer emails marketing avec objets accrocheurs et séquences nurturing",
      status: "inactive",
      color: "from-green-500 to-teal-500",
      model: "claude-sonnet-4",
      prompt: "Tu es un expert email marketing...",
      documents: 0
    },
    {
      id: "blog-writer",
      name: "Blog Writer",
      icon: BookOpen,
      emoji: "📝",
      category: "texte",
      description: "Crée articles blog SEO-optimisés",
      mission: "Rédiger articles longs, structure H1-H3, mots-clés",
      role: "Créer articles 1000-2000 mots optimisés SEO avec structure claire",
      status: "inactive",
      color: "from-amber-500 to-orange-500",
      model: "claude-sonnet-4",
      prompt: "Tu es un expert rédacteur SEO...",
      documents: 0
    },

    // CONTENU VIDÉO
    {
      id: "scenariste-video",
      name: "Scénariste Vidéo",
      icon: Video,
      emoji: "🎭",
      category: "video",
      description: "Crée scénarios pour vidéos marketing",
      mission: "Structurer storytelling, dialogues, timing, hooks",
      role: "Créer scripts vidéo avec timestamps, hooks, storytelling engageant",
      status: "inactive",
      color: "from-red-500 to-pink-500",
      model: "claude-sonnet-4",
      prompt: "Tu es un scénariste vidéo marketing expert...",
      documents: 0
    },
    {
      id: "metteur-en-scene",
      name: "Metteur en Scène",
      icon: Clapperboard,
      emoji: "🎥",
      category: "video",
      description: "Planifie production vidéo",
      mission: "Définir plans, angles caméra, transitions, effets",
      role: "Créer storyboard, plan de tournage, angles caméra, transitions",
      status: "inactive",
      color: "from-purple-600 to-indigo-600",
      model: "claude-sonnet-4",
      prompt: "Tu es un metteur en scène vidéo professionnel...",
      documents: 0
    },
    {
      id: "monteur-video",
      name: "Monteur Vidéo",
      icon: Scissors,
      emoji: "✂️",
      category: "video",
      description: "Assemble et optimise vidéos",
      mission: "Séquencer clips, transitions, musique, sous-titres",
      role: "Monter vidéos, ajouter transitions, musique, sous-titres optimisés",
      status: "inactive",
      color: "from-cyan-500 to-blue-500",
      model: "gemini-2.0-flash",
      prompt: "Tu es un monteur vidéo expert...",
      documents: 0
    },

    // DESIGN & VISUEL
    {
      id: "designer-affiches",
      name: "Designer d'Affiches",
      icon: Frame,
      emoji: "🖼️",
      category: "design",
      description: "Crée affiches marketing professionnelles",
      mission: "Générer prompts Imagen, composer layouts, typo",
      role: "Créer affiches haute résolution avec design professionnel",
      status: "active",
      color: "from-violet-500 to-purple-500",
      model: "gemini-2.0-flash",
      prompt: "Tu es un designer graphique expert en affiches...",
      documents: 0
    },
    {
      id: "designer-posters",
      name: "Designer de Posters",
      icon: Image,
      emoji: "📜",
      category: "design",
      description: "Crée posters événementiels",
      mission: "Design événements, promotions, annonces",
      role: "Créer posters print et digital pour événements et promotions",
      status: "inactive",
      color: "from-fuchsia-500 to-pink-500",
      model: "gemini-2.0-flash",
      prompt: "Tu es un designer de posters événementiels...",
      documents: 0
    },
    {
      id: "createur-images-produit",
      name: "Créateur d'Images Produit",
      icon: Package,
      emoji: "🛍️",
      category: "design",
      description: "Génère visuels produits attractifs",
      mission: "Créer images produits, packshots, mises en scène",
      role: "Générer images produits haute qualité avec mises en scène attractives",
      status: "inactive",
      color: "from-emerald-500 to-green-500",
      model: "imagen-3",
      prompt: "Tu es un photographe produit professionnel...",
      documents: 0
    },
    {
      id: "designer-logos",
      name: "Designer de Logos",
      icon: Target,
      emoji: "🎯",
      category: "design",
      description: "Crée identités visuelles de marque",
      mission: "Générer concepts logos, variations, guidelines",
      role: "Créer logos vectoriels professionnels avec variations et guidelines",
      status: "inactive",
      color: "from-red-500 to-orange-500",
      model: "imagen-3",
      prompt: "Tu es un designer de logos expert...",
      documents: 0
    },
    {
      id: "createur-infographies",
      name: "Créateur d'Infographies",
      icon: TrendingUp,
      emoji: "📈",
      category: "design",
      description: "Visualise données complexes",
      mission: "Transformer données en infographies claires",
      role: "Créer infographies attrayantes qui simplifient données complexes",
      status: "inactive",
      color: "from-blue-500 to-cyan-500",
      model: "gemini-2.0-flash",
      prompt: "Tu es un designer d'infographies data...",
      documents: 0
    },
    {
      id: "designer-miniatures",
      name: "Designer de Miniatures",
      icon: Smartphone,
      emoji: "🖼️",
      category: "design",
      description: "Crée thumbnails YouTube/vidéo",
      mission: "Générer miniatures cliquables avec texte accrocheur",
      role: "Créer thumbnails optimisées CTR pour YouTube et réseaux sociaux",
      status: "inactive",
      color: "from-red-600 to-pink-600",
      model: "imagen-3",
      prompt: "Tu es un designer de thumbnails YouTube expert...",
      documents: 0
    },

    // PUBLICATION & AUTOMATION
    {
      id: "publisher-linkedin",
      name: "Publisher LinkedIn",
      icon: Linkedin,
      emoji: "🚀",
      category: "publication",
      description: "Publie contenus sur LinkedIn",
      mission: "Vérifier qualité, optimiser timing, guidelines",
      role: "Publier posts LinkedIn au moment optimal avec vérification qualité",
      status: "active",
      color: "from-blue-600 to-indigo-600",
      model: "gemini-2.0-flash",
      prompt: "Tu es responsable publication LinkedIn...",
      documents: 0
    },
    {
      id: "publisher-instagram",
      name: "Publisher Instagram",
      icon: Instagram,
      emoji: "📲",
      category: "publication",
      description: "Publie contenus sur Instagram",
      mission: "Optimiser format (post/story/reel), timing",
      role: "Publier contenus Instagram avec format et timing optimaux",
      status: "inactive",
      color: "from-pink-600 to-rose-600",
      model: "gemini-2.0-flash",
      prompt: "Tu es responsable publication Instagram...",
      documents: 0
    },
    {
      id: "publisher-facebook",
      name: "Publisher Facebook",
      icon: Facebook,
      emoji: "👍",
      category: "publication",
      description: "Publie contenus sur Facebook",
      mission: "Gérer pages, groupes, timing optimal",
      role: "Publier posts Facebook avec gestion pages et groupes",
      status: "inactive",
      color: "from-blue-500 to-blue-700",
      model: "gemini-2.0-flash",
      prompt: "Tu es responsable publication Facebook...",
      documents: 0
    },
    {
      id: "scheduler",
      name: "Scheduler",
      icon: Calendar,
      emoji: "📅",
      category: "publication",
      description: "Optimise calendrier de publication",
      mission: "Analyser meilleurs moments, gérer file d'attente",
      role: "Optimiser planning publication avec analyse meilleurs moments",
      status: "inactive",
      color: "from-green-600 to-emerald-600",
      model: "gemini-2.0-flash",
      prompt: "Tu es un expert en scheduling de contenu...",
      documents: 0
    },

    // ANALYSE & OPTIMISATION
    {
      id: "analyzer-performance",
      name: "Analyzer Performance",
      icon: BarChart3,
      emoji: "📊",
      category: "analyse",
      description: "Analyse performances campagnes",
      mission: "Tracker métriques, identifier patterns, insights",
      role: "Analyser métriques, générer insights actionnables, rapports détaillés",
      status: "active",
      color: "from-orange-500 to-red-500",
      model: "llama-3.3-70b",
      prompt: "Tu es un analyste marketing data-driven...",
      documents: 0
    },
    {
      id: "seo-optimizer",
      name: "SEO Optimizer",
      icon: SearchCheck,
      emoji: "🔎",
      category: "analyse",
      description: "Optimise contenus pour SEO",
      mission: "Analyser mots-clés, structure, backlinks",
      role: "Optimiser SEO avec analyse mots-clés et recommandations",
      status: "inactive",
      color: "from-green-500 to-teal-500",
      model: "claude-sonnet-4",
      prompt: "Tu es un expert SEO...",
      documents: 0
    },
    {
      id: "ab-tester",
      name: "A/B Tester",
      icon: TestTube,
      emoji: "🧪",
      category: "analyse",
      description: "Teste variations de contenus",
      mission: "Créer variantes, analyser résultats, recommander",
      role: "Créer tests A/B, analyser résultats, recommander gagnant",
      status: "inactive",
      color: "from-purple-500 to-violet-500",
      model: "llama-3.3-70b",
      prompt: "Tu es un expert en A/B testing...",
      documents: 0
    },
    {
      id: "sentiment-analyzer",
      name: "Sentiment Analyzer",
      icon: MessageSquare,
      emoji: "💬",
      category: "analyse",
      description: "Analyse sentiments audience",
      mission: "Analyser commentaires, avis, détecter tendances",
      role: "Analyser sentiment commentaires et avis avec alertes",
      status: "inactive",
      color: "from-cyan-500 to-blue-500",
      model: "gemini-2.0-flash",
      prompt: "Tu es un expert en analyse de sentiment...",
      documents: 0
    },

    // AGENTS SPÉCIALISÉS
    {
      id: "chatbot-support",
      name: "Chatbot Support",
      icon: Bot,
      emoji: "💁",
      category: "specialise",
      description: "Répond questions clients automatiquement",
      mission: "Gérer FAQ, qualifier leads, escalader",
      role: "Gérer conversations clients, FAQ, qualification leads",
      status: "inactive",
      color: "from-indigo-500 to-purple-500",
      model: "claude-sonnet-4",
      prompt: "Tu es un chatbot customer support expert...",
      documents: 0
    },
    {
      id: "traducteur",
      name: "Traducteur Multilingue",
      icon: Globe,
      emoji: "🌍",
      category: "specialise",
      description: "Traduit contenus en plusieurs langues",
      mission: "Traduire posts, emails, articles avec adaptation",
      role: "Traduire et localiser contenus avec adaptation culturelle",
      status: "inactive",
      color: "from-teal-500 to-cyan-500",
      model: "claude-sonnet-4",
      prompt: "Tu es un traducteur professionnel multilingue...",
      documents: 0
    },
    {
      id: "compliance-checker",
      name: "Compliance Checker",
      icon: CheckCircle,
      emoji: "✅",
      category: "specialise",
      description: "Vérifie conformité légale contenus",
      mission: "Vérifier RGPD, droits auteur, guidelines",
      role: "Vérifier conformité RGPD, droits d'auteur, guidelines plateformes",
      status: "inactive",
      color: "from-green-600 to-emerald-600",
      model: "claude-sonnet-4",
      prompt: "Tu es un expert en compliance et conformité légale...",
      documents: 0
    }
  ];

  const categories = [
    { id: "all", label: "Tous", count: agents.length },
    { id: "prospection", label: "🔍 Prospection", count: agents.filter(a => a.category === "prospection").length },
    { id: "texte", label: "✍️ Contenu Texte", count: agents.filter(a => a.category === "texte").length },
    { id: "video", label: "🎬 Vidéo", count: agents.filter(a => a.category === "video").length },
    { id: "design", label: "🎨 Design", count: agents.filter(a => a.category === "design").length },
    { id: "publication", label: "📱 Publication", count: agents.filter(a => a.category === "publication").length },
    { id: "analyse", label: "📊 Analyse", count: agents.filter(a => a.category === "analyse").length },
    { id: "specialise", label: "🤖 Spécialisés", count: agents.filter(a => a.category === "specialise").length }
  ];

  const filteredAgents = agents.filter(agent => {
    const matchesSearch = agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         agent.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeTab === "all" || agent.category === activeTab;
    return matchesSearch && matchesCategory;
  });

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
        stagger: 0.08,
        ease: "back.out(1.7)"
      }
    );
  }, [filteredAgents]);

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
    { value: "gpt-4", label: "GPT-4", price: "$10/1M tokens" },
    { value: "imagen-3", label: "Imagen 3", price: "$0.04/image" }
  ];

  const activeAgentsCount = agents.filter(a => a.status === "active").length;

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

        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
              Équipe d'Agents IA
            </h1>
            <p className="text-muted-foreground flex items-center gap-2">
              <Zap className="h-4 w-4 text-green-600" />
              27 agents spécialisés pour automatiser votre marketing
            </p>
          </div>
          <div className="flex gap-4">
            <Badge variant="outline" className="text-lg px-4 py-2">
              {activeAgentsCount} actifs
            </Badge>
            <Badge variant="secondary" className="text-lg px-4 py-2">
              {agents.length} agents
            </Badge>
          </div>
        </div>

        {/* Barre de recherche */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Rechercher un agent..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-12 text-lg"
          />
        </div>

        {/* Tabs catégories */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-8 w-full h-auto gap-2">
            {categories.map((cat) => (
              <TabsTrigger
                key={cat.id}
                value={cat.id}
                className="flex flex-col gap-1 py-3"
              >
                <span className="text-sm font-semibold">{cat.label}</span>
                <Badge variant="secondary" className="text-xs">{cat.count}</Badge>
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {/* Grid d'agents */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredAgents.map((agent, index) => {
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
                    <CardTitle className="text-lg mb-2 pr-8">{agent.name}</CardTitle>
                    <Badge 
                      variant={agent.status === "active" ? "default" : "secondary"}
                      className={agent.status === "active" ? "bg-green-500" : ""}
                    >
                      {agent.status === "active" ? "Actif" : "Inactif"}
                    </Badge>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-3">
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-1">Description</p>
                  <p className="text-sm">{agent.description}</p>
                </div>

                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-1">Mission</p>
                  <p className="text-xs text-muted-foreground line-clamp-2">{agent.mission}</p>
                </div>

                <div className="pt-2 border-t">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span className="truncate">{modelOptions.find(m => m.value === agent.model)?.label}</span>
                    <span>{agent.documents} docs</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Message si aucun résultat */}
      {filteredAgents.length === 0 && (
        <div className="max-w-7xl mx-auto text-center py-20">
          <p className="text-2xl text-muted-foreground">Aucun agent trouvé</p>
          <p className="text-sm text-muted-foreground mt-2">Essayez une autre recherche ou catégorie</p>
        </div>
      )}

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
