import { useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
import { motion } from "framer-motion";
import { trpc } from "@/lib/trpc";
import ConfigModal from "@/components/ConfigModal";

/**
 * Page Connexions Plateformes V2 - Architecture Complète
 * 
 * 4 Tabs:
 * 1. Réseaux Sociaux (LinkedIn, Instagram, Facebook, Twitter)
 * 2. Génération Média (Fal.ai, Imagen 3, DALL-E 3, Stable Diffusion)
 * 3. Scraping (PhantomBuster, Apify, Bright Data, Google Maps)
 * 4. LLMs (OpenRouter multi-modèles, Hugging Face, Ollama)
 */

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

export default function PlatformConnectionsV2() {
  const [, setLocation] = useLocation();
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);
  
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
      credits: '$8.50 restants',
      color: 'text-purple-600'
    },
    {
      id: 'fal-ai',
      name: 'Fal.ai',
      description: 'Génération d\'images rapide',
      icon: Zap,
      status: 'disconnected',
      color: 'text-orange-600'
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
      id: 'stable-diffusion',
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
      id: 'google-maps',
      name: 'Google Maps API',
      description: 'Scraping de leads géolocalisés',
      icon: Search,
      status: 'connected',
      usage: '247/10000 requêtes',
      credits: '$42.30 restants',
      color: 'text-red-600'
    },
    {
      id: 'phantombuster',
      name: 'PhantomBuster',
      description: 'Automatisation scraping LinkedIn',
      icon: Search,
      status: 'disconnected',
      color: 'text-purple-600'
    },
    {
      id: 'apify',
      name: 'Apify',
      description: 'Web scraping et automation',
      icon: Search,
      status: 'disconnected',
      color: 'text-orange-600'
    },
    {
      id: 'bright-data',
      name: 'Bright Data',
      description: 'Proxies et scraping professionnel',
      icon: Search,
      status: 'disconnected',
      color: 'text-blue-600'
    }
  ];

  // LLMs avec Multi-Router
  const llmPlatforms: Platform[] = [
    {
      id: 'openrouter',
      name: 'OpenRouter',
      description: 'Multi-LLM Router (Claude, Gemini, Llama, GPT-4)',
      icon: Brain,
      status: 'connected',
      usage: '1.2M tokens ce mois',
      credits: '$15.80 restants',
      color: 'text-purple-600'
    },
    {
      id: 'huggingface',
      name: 'Hugging Face',
      description: 'Inference API (Fallback gratuit)',
      icon: Brain,
      status: 'connected',
      usage: 'Illimité (gratuit)',
      credits: 'Gratuit',
      color: 'text-yellow-600'
    },
    {
      id: 'ollama',
      name: 'Ollama',
      description: 'LLMs locaux (Emergency fallback)',
      icon: Brain,
      status: 'connected',
      usage: 'Local (offline)',
      credits: 'Gratuit',
      color: 'text-green-600'
    }
  ];

  const handleConnect = (platformId: string) => {
    toast.success(`Connexion à ${platformId} en cours...`);
    // TODO: Implémenter OAuth flow
  };

  const handleDisconnect = (platformId: string) => {
    disconnectMutation.mutate({ platform: platformId });
  };

  const handleConfigure = (platformId: string) => {
    setSelectedPlatform(platformId);
  };

  const PlatformCard = ({ platform }: { platform: Platform }) => {
    const Icon = platform.icon;
    const isConnected = platform.status === 'connected';
    const isError = platform.status === 'error';

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="group hover:border-primary/50 transition-all duration-300 hover:shadow-lg">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className={`p-3 rounded-xl bg-gradient-to-br ${
                  isConnected ? 'from-green-500 to-emerald-600' : 
                  isError ? 'from-red-500 to-rose-600' :
                  'from-gray-400 to-gray-500'
                } shadow-lg`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-lg">{platform.name}</CardTitle>
                  <CardDescription className="text-sm mt-1">
                    {platform.description}
                  </CardDescription>
                </div>
              </div>
              <Badge 
                variant={isConnected ? "default" : isError ? "destructive" : "secondary"}
                className="gap-1"
              >
                {isConnected ? <Check className="h-3 w-3" /> : 
                 isError ? <AlertCircle className="h-3 w-3" /> :
                 <X className="h-3 w-3" />}
                {isConnected ? 'Connecté' : isError ? 'Erreur' : 'Déconnecté'}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            {isConnected && (
              <div className="space-y-2 mb-4">
                {platform.usage && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Utilisation:</span>
                    <span className="font-semibold">{platform.usage}</span>
                  </div>
                )}
                {platform.credits && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground flex items-center gap-1">
                      <DollarSign className="h-3 w-3" />
                      Crédits:
                    </span>
                    <span className="font-semibold text-green-600">{platform.credits}</span>
                  </div>
                )}
              </div>
            )}
            <div className="flex gap-2">
              {isConnected ? (
                <>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => handleConfigure(platform.id)}
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Configurer
                  </Button>
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={() => handleDisconnect(platform.id)}
                  >
                    Déconnecter
                  </Button>
                </>
              ) : (
                <Button 
                  className="w-full gap-2"
                  onClick={() => handleConnect(platform.id)}
                >
                  <Check className="h-4 w-4" />
                  Connecter
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header */}
      <div className="border-b bg-card/50 backdrop-blur-xl">
        <div className="container py-8">
          <Button
            variant="ghost"
            className="mb-4"
            onClick={() => setLocation("/settings")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour aux Paramètres
          </Button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-foreground via-primary to-purple-600 bg-clip-text text-transparent mb-2">
                Connexions Plateformes
              </h1>
              <p className="text-muted-foreground text-lg flex items-center gap-2">
                <Activity className="h-4 w-4 text-primary" />
                Gérez vos intégrations et connexions API
              </p>
            </div>
            <Badge variant="secondary" className="px-4 py-2 text-sm">
              <Check className="h-4 w-4 mr-2" />
              3/8 connectés
            </Badge>
          </div>
        </div>
      </div>

      <div className="container py-12">
        <Tabs defaultValue="social" className="space-y-8">
          <TabsList className="grid w-full grid-cols-4 h-auto p-1">
            <TabsTrigger value="social" className="gap-2 py-3">
              <Linkedin className="h-4 w-4" />
              Réseaux Sociaux
            </TabsTrigger>
            <TabsTrigger value="media" className="gap-2 py-3">
              <Image className="h-4 w-4" />
              Génération Média
            </TabsTrigger>
            <TabsTrigger value="scraping" className="gap-2 py-3">
              <Search className="h-4 w-4" />
              Scraping
            </TabsTrigger>
            <TabsTrigger value="llms" className="gap-2 py-3">
              <Brain className="h-4 w-4" />
              LLMs & IA
            </TabsTrigger>
          </TabsList>

          {/* Tab Réseaux Sociaux */}
          <TabsContent value="social" className="space-y-6">
            <Card className="border-2">
              <CardHeader>
                <CardTitle>Réseaux Sociaux</CardTitle>
                <CardDescription>
                  Connectez vos comptes pour publier automatiquement vos contenus marketing
                </CardDescription>
              </CardHeader>
            </Card>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {socialPlatforms.map((platform) => (
                <PlatformCard key={platform.id} platform={platform} />
              ))}
            </div>
          </TabsContent>

          {/* Tab Génération Média */}
          <TabsContent value="media" className="space-y-6">
            <Card className="border-2">
              <CardHeader>
                <CardTitle>Génération Média</CardTitle>
                <CardDescription>
                  Services de génération d'images et médias par IA
                </CardDescription>
              </CardHeader>
            </Card>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {mediaPlatforms.map((platform) => (
                <PlatformCard key={platform.id} platform={platform} />
              ))}
            </div>
          </TabsContent>

          {/* Tab Scraping */}
          <TabsContent value="scraping" className="space-y-6">
            <Card className="border-2">
              <CardHeader>
                <CardTitle>Scraping & Enrichissement</CardTitle>
                <CardDescription>
                  Outils de scraping et d'enrichissement de données
                </CardDescription>
              </CardHeader>
            </Card>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {scrapingPlatforms.map((platform) => (
                <PlatformCard key={platform.id} platform={platform} />
              ))}
            </div>
          </TabsContent>

          {/* Tab LLMs avec Router Configuration */}
          <TabsContent value="llms" className="space-y-6">
            <Card className="border-2 bg-gradient-to-br from-purple-500/5 to-blue-500/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-6 w-6 text-purple-600" />
                  LLM Router Multi-Tier
                </CardTitle>
                <CardDescription>
                  Stratégie de fallback automatique : OpenRouter → Hugging Face → Ollama
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-card rounded-lg p-4 border-2 mb-6">
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <Zap className="h-4 w-4 text-primary" />
                    Configuration du Router
                  </h3>
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
                    <div className="text-xs text-muted-foreground space-y-1">
                      <p>• <strong>Tier 1:</strong> OpenRouter (qualité premium)</p>
                      <p>• <strong>Tier 2:</strong> Hugging Face (gratuit, si Tier 1 échoue)</p>
                      <p>• <strong>Tier 3:</strong> Ollama (local, mode offline)</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {llmPlatforms.map((platform) => (
                <PlatformCard key={platform.id} platform={platform} />
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
