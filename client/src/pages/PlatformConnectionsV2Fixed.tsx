import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { 
  ArrowLeft, 
  Check, 
  X, 
  Settings, 
  Linkedin, 
  Instagram, 
  Facebook, 
  Twitter,
  Image,
  Search,
  Brain,
  Zap,
  DollarSign,
  Activity,
  AlertCircle
} from "lucide-react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import ConfigModal from "@/components/ConfigModal";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface Platform {
  id: string;
  name: string;
  description: string;
  icon: any;
  status: 'connected' | 'disconnected' | 'error';
  usage?: string;
  credits?: string;
  color: string;
}

export default function PlatformConnectionsV2Fixed() {
  const [, setLocation] = useLocation();
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);
  
  // Récupérer les vrais statuts depuis la base de données
  const { data: platformStatus, isLoading } = trpc.platformConnections.getStatus.useQuery();
  const disconnectMutation = trpc.platformConnections.disconnect.useMutation({
    onSuccess: (data) => {
      toast.success(data.message);
    },
    onError: () => {
      toast.error('Erreur lors de la déconnexion');
    }
  });

  // Animations GSAP au montage
  useEffect(() => {
    if (cardsRef.current.length > 0) {
      gsap.fromTo(
        cardsRef.current,
        {
          opacity: 0,
          y: 50,
          scale: 0.9
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: "power3.out"
        }
      );
    }
  }, [platformStatus]);

  // Réseaux Sociaux
  const socialPlatforms: Platform[] = [
    {
      id: 'linkedin',
      name: 'LinkedIn',
      description: 'Publication de posts marketing',
      icon: Linkedin,
      status: platformStatus?.linkedin?.status === 'connected' ? 'connected' : 'disconnected',
      usage: '12/100 posts ce mois',
      credits: 'Illimité',
      color: 'text-blue-600'
    },
    {
      id: 'instagram',
      name: 'Instagram',
      description: 'Partage de contenus visuels',
      icon: Instagram,
      status: 'disconnected',
      color: 'text-pink-600'
    },
    {
      id: 'facebook',
      name: 'Facebook',
      description: 'Publication sur pages entreprise',
      icon: Facebook,
      status: 'disconnected',
      color: 'text-blue-700'
    },
    {
      id: 'twitter',
      name: 'Twitter/X',
      description: 'Tweets et engagement',
      icon: Twitter,
      status: 'disconnected',
      color: 'text-gray-900'
    }
  ];

  // Génération Média
  const mediaPlatforms: Platform[] = [
    {
      id: 'imagen3',
      name: 'Imagen 3',
      description: 'Génération d\'images IA (Google)',
      icon: Image,
      status: 'connected',
      usage: '45/1000 images',
      credits: '$15.80 restants',
      color: 'text-purple-600'
    },
    {
      id: 'fal',
      name: 'Fal.ai',
      description: 'Génération d\'images rapide',
      icon: Zap,
      status: 'disconnected',
      color: 'text-yellow-600'
    },
    {
      id: 'dalle3',
      name: 'DALL-E 3',
      description: 'Génération d\'images OpenAI',
      icon: Image,
      status: 'disconnected',
      color: 'text-green-600'
    },
    {
      id: 'stablediffusion',
      name: 'Stable Diffusion',
      description: 'Génération d\'images open-source',
      icon: Image,
      status: 'disconnected',
      color: 'text-indigo-600'
    }
  ];

  // Scraping
  const scrapingPlatforms: Platform[] = [
    {
      id: 'googlemaps',
      name: 'Google Maps API',
      description: 'Scraping de leads locaux',
      icon: Search,
      status: 'connected',
      usage: '1,250 requêtes',
      credits: '$8.50 restants',
      color: 'text-red-600'
    },
    {
      id: 'phantombuster',
      name: 'PhantomBuster',
      description: 'Automation LinkedIn',
      icon: Activity,
      status: 'disconnected',
      color: 'text-blue-600'
    },
    {
      id: 'apify',
      name: 'Apify',
      description: 'Web scraping universel',
      icon: Search,
      status: 'disconnected',
      color: 'text-orange-600'
    },
    {
      id: 'brightdata',
      name: 'Bright Data',
      description: 'Proxy et scraping',
      icon: Activity,
      status: 'disconnected',
      color: 'text-cyan-600'
    }
  ];

  // LLMs
  const llmPlatforms: Platform[] = [
    {
      id: 'openrouter',
      name: 'OpenRouter',
      description: 'Multi-LLM Router (Claude, Gemini, Llama, GPT-4)',
      icon: Brain,
      status: 'connected',
      usage: '1.2M tokens ce mois',
      credits: '$42.30 restants',
      color: 'text-purple-600'
    },
    {
      id: 'huggingface',
      name: 'Hugging Face',
      description: 'Inference API (Fallback gratuit)',
      icon: Brain,
      status: 'connected',
      usage: '500K tokens ce mois',
      credits: 'Gratuit',
      color: 'text-yellow-600'
    }
    // Ollama removed - OpenRouter + HuggingFace provide all needed models
  ];

  const handleConnect = (platformId: string) => {
    toast.success(`Connexion à ${platformId} en cours...`);
  };

  const handleDisconnect = (platformId: string) => {
    disconnectMutation.mutate({ platform: platformId });
  };

  const handleConfigure = (platformId: string) => {
    setSelectedPlatform(platformId);
  };

  const PlatformCard = ({ platform, index }: { platform: Platform; index: number }) => {
    const Icon = platform.icon;
    const isConnected = platform.status === 'connected';
    const isError = platform.status === 'error';
    const cardRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      if (cardRef.current) {
        cardsRef.current[index] = cardRef.current;
        
        // Hover animation GSAP
        const card = cardRef.current;
        
        const handleMouseEnter = () => {
          gsap.to(card, {
            y: -8,
            scale: 1.02,
            boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
            duration: 0.3,
            ease: "power2.out"
          });
        };
        
        const handleMouseLeave = () => {
          gsap.to(card, {
            y: 0,
            scale: 1,
            boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
            duration: 0.3,
            ease: "power2.out"
          });
        };
        
        card.addEventListener('mouseenter', handleMouseEnter);
        card.addEventListener('mouseleave', handleMouseLeave);
        
        return () => {
          card.removeEventListener('mouseenter', handleMouseEnter);
          card.removeEventListener('mouseleave', handleMouseLeave);
        };
      }
    }, [index]);

    return (
      <div ref={cardRef}>
        <Card className="h-full overflow-hidden border-2 transition-colors duration-300">
          <CardHeader className="pb-4">
            {/* Header avec icône et badge */}
            <div className="flex items-start justify-between mb-3">
              <div className={`p-3 rounded-xl bg-gradient-to-br ${
                isConnected ? 'from-green-500 to-emerald-600' : 
                isError ? 'from-red-500 to-rose-600' :
                'from-gray-400 to-gray-500'
              } shadow-lg`}>
                <Icon className="h-7 w-7 text-white" />
              </div>
              <Badge 
                variant={isConnected ? "default" : isError ? "destructive" : "secondary"}
                className="gap-1 px-3 py-1"
              >
                {isConnected ? <Check className="h-3 w-3" /> : 
                 isError ? <AlertCircle className="h-3 w-3" /> :
                 <X className="h-3 w-3" />}
                {isConnected ? 'Connecté' : isError ? 'Erreur' : 'Déconnecté'}
              </Badge>
            </div>
            
            {/* Titre et description */}
            <div>
              <CardTitle className="text-xl mb-2">{platform.name}</CardTitle>
              <CardDescription className="text-sm leading-relaxed">
                {platform.description}
              </CardDescription>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {/* Statistiques */}
            {isConnected && (
              <div className="space-y-2 p-3 bg-muted/50 rounded-lg">
                {platform.usage && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground font-medium">Utilisation:</span>
                    <span className="font-semibold">{platform.usage}</span>
                  </div>
                )}
                {platform.credits && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground font-medium flex items-center gap-1">
                      <DollarSign className="h-3 w-3" />
                      Crédits:
                    </span>
                    <span className="font-semibold text-green-600">{platform.credits}</span>
                  </div>
                )}
              </div>
            )}
            
            {/* Boutons avec dégradés */}
            <div className="flex gap-2">
              {isConnected ? (
                <>
                  <Button 
                    size="sm" 
                    className="flex-1 bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                    onClick={() => handleConfigure(platform.id)}
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Configurer
                  </Button>
                  <Button 
                    size="sm"
                    className="bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                    onClick={() => handleDisconnect(platform.id)}
                  >
                    Déconnecter
                  </Button>
                </>
              ) : (
                <Button 
                  className="w-full gap-2 bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                  onClick={() => handleConnect(platform.id)}
                >
                  <Check className="h-4 w-4" />
                  Connecter
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

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
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              Connexions Plateformes
            </h1>
            <p className="text-muted-foreground mt-2">
              Gérez vos intégrations et connexions API
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container py-8">
        <Tabs defaultValue="social" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="social">Réseaux Sociaux</TabsTrigger>
            <TabsTrigger value="media">Génération Média</TabsTrigger>
            <TabsTrigger value="scraping">Scraping</TabsTrigger>
            <TabsTrigger value="llms">LLMs & IA</TabsTrigger>
          </TabsList>

          <TabsContent value="social" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {socialPlatforms.map((platform, index) => (
                <PlatformCard key={platform.id} platform={platform} index={index} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="media" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mediaPlatforms.map((platform, index) => (
                <PlatformCard key={platform.id} platform={platform} index={index} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="scraping" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {scrapingPlatforms.map((platform, index) => (
                <PlatformCard key={platform.id} platform={platform} index={index} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="llms" className="space-y-6">
            {/* Configuration LLM Router */}
            <Card className="border-2 border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-primary" />
                  Configuration LLM Router
                </CardTitle>
                <CardDescription>
                  Sélectionnez votre modèle primaire et configurez le fallback automatique
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label>Modèle Primaire (Tier 1 - OpenRouter)</Label>
                    <Select defaultValue="gemini-flash">
                      <SelectTrigger className="mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="gemini-flash">
                          Gemini 2.0 Flash (GRATUIT - Priorité)
                        </SelectItem>
                        <SelectItem value="claude-sonnet">
                          Claude Sonnet 4 ($3/1M tokens)
                        </SelectItem>
                        <SelectItem value="llama-70b">
                          Llama 3.3 70B ($0.35/1M tokens)
                        </SelectItem>
                        <SelectItem value="gpt-4">
                          GPT-4 Turbo ($10/1M tokens)
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <span className="text-sm font-medium">Fallback automatique</span>
                    <Badge variant="default">Activé</Badge>
                  </div>
                  <div className="text-xs text-muted-foreground space-y-1 p-3 bg-muted/50 rounded-lg">
                    <p>• <strong>Tier 1:</strong> OpenRouter (qualité premium - Claude, Gemini, Llama, GPT-4)</p>
                    <p>• <strong>Tier 2:</strong> Hugging Face (gratuit, fallback automatique)</p>
                    <p className="text-sm text-muted-foreground mt-2">💡 OpenRouter donne accès à tous les modèles (même open-source), pas besoin d'Ollama local</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {llmPlatforms.map((platform, index) => (
                <PlatformCard key={platform.id} platform={platform} index={index} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Modal de configuration */}
      <ConfigModal 
        platform={selectedPlatform}
        isOpen={selectedPlatform !== null}
        onClose={() => setSelectedPlatform(null)}
      />
    </div>
  );
}
