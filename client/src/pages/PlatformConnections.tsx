import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowLeft,
  Link2,
  CheckCircle2,
  XCircle,
  Settings,
  ExternalLink
} from "lucide-react";
import { useLocation } from "wouter";

/**
 * Page Connexions Plateformes
 * Gestion des connexions aux services externes (Réseaux Sociaux, Génération Média, Scraping, LLMs)
 */

interface Platform {
  id: string;
  name: string;
  description: string;
  status: "connected" | "disconnected";
  statusText?: string;
  apiKeyPlaceholder?: string;
  docs?: string;
}

const socialPlatforms: Platform[] = [
  {
    id: "linkedin",
    name: "LinkedIn",
    description: "Publication automatique de posts",
    status: "connected",
    statusText: "Connecté • Dernière sync il y a 2h"
  },
  {
    id: "instagram",
    name: "Instagram",
    description: "Partage de contenu visuel",
    status: "disconnected"
  },
  {
    id: "facebook",
    name: "Facebook",
    description: "Publication sur pages d'entreprise",
    status: "disconnected"
  },
  {
    id: "twitter",
    name: "Twitter / X",
    description: "Tweets automatiques",
    status: "disconnected"
  }
];

const mediaPlatforms: Platform[] = [
  {
    id: "fal",
    name: "Fal.ai",
    description: "Génération d'images avec FLUX",
    status: "connected",
    statusText: "Connecté • 234 crédits restants",
    apiKeyPlaceholder: "fal_••••••••••••••••",
    docs: "https://fal.ai/docs"
  },
  {
    id: "replicate",
    name: "Replicate",
    description: "Modèles de génération d'images",
    status: "disconnected",
    apiKeyPlaceholder: "r8_••••••••••••••••",
    docs: "https://replicate.com/docs"
  },
  {
    id: "elevenlabs",
    name: "ElevenLabs",
    description: "Génération de voix IA",
    status: "disconnected",
    apiKeyPlaceholder: "el_••••••••••••••••",
    docs: "https://elevenlabs.io/docs"
  }
];

const scrapingPlatforms: Platform[] = [
  {
    id: "phantombuster",
    name: "PhantomBuster",
    description: "Scraping LinkedIn et réseaux sociaux",
    status: "disconnected",
    apiKeyPlaceholder: "pb_••••••••••••••••",
    docs: "https://phantombuster.com/api-documentation"
  },
  {
    id: "apify",
    name: "Apify",
    description: "Web scraping et automation",
    status: "disconnected",
    apiKeyPlaceholder: "apify_••••••••••••••••",
    docs: "https://docs.apify.com"
  },
  {
    id: "brightdata",
    name: "Bright Data",
    description: "Proxies et scraping à grande échelle",
    status: "disconnected",
    apiKeyPlaceholder: "bd_••••••••••••••••",
    docs: "https://docs.brightdata.com"
  }
];

const llmPlatforms: Platform[] = [
  {
    id: "openrouter",
    name: "OpenRouter",
    description: "Accès unifié à tous les LLMs",
    status: "connected",
    statusText: "Connecté • 12.45$ de crédit",
    apiKeyPlaceholder: "sk-or-v1-••••••••••••••••",
    docs: "https://openrouter.ai/docs"
  },
  {
    id: "openai",
    name: "OpenAI",
    description: "GPT-4, GPT-4o, GPT-4o-mini",
    status: "disconnected",
    apiKeyPlaceholder: "sk-••••••••••••••••",
    docs: "https://platform.openai.com/docs"
  },
  {
    id: "anthropic",
    name: "Anthropic",
    description: "Claude 3.5 Sonnet, Haiku",
    status: "disconnected",
    apiKeyPlaceholder: "sk-ant-••••••••••••••••",
    docs: "https://docs.anthropic.com"
  },
  {
    id: "google",
    name: "Google AI",
    description: "Gemini 2.0 Flash, Pro",
    status: "disconnected",
    apiKeyPlaceholder: "AIza••••••••••••••••",
    docs: "https://ai.google.dev/docs"
  }
];

export default function PlatformConnections() {
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState("social");

  const renderPlatformCard = (platform: Platform) => (
    <Card key={platform.id}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {platform.status === "connected" ? (
              <CheckCircle2 className="h-5 w-5 text-green-500" />
            ) : (
              <XCircle className="h-5 w-5 text-muted-foreground" />
            )}
            <div>
              <CardTitle className="text-base">{platform.name}</CardTitle>
              <CardDescription className="text-xs">
                {platform.description}
              </CardDescription>
            </div>
          </div>
          <Badge variant={platform.status === "connected" ? "default" : "outline"}>
            {platform.status === "connected" ? "Connecté" : "Non connecté"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {platform.status === "connected" ? (
          <>
            {platform.statusText && (
              <p className="text-xs text-muted-foreground">{platform.statusText}</p>
            )}
            {platform.apiKeyPlaceholder && (
              <div className="space-y-2">
                <Label className="text-xs">Clé API</Label>
                <Input
                  type="password"
                  value={platform.apiKeyPlaceholder}
                  disabled
                  className="font-mono text-xs"
                />
              </div>
            )}
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="flex-1">
                <Settings className="h-3 w-3 mr-1" />
                Gérer
              </Button>
              <Button variant="outline" size="sm" className="flex-1 text-red-600">
                Déconnecter
              </Button>
            </div>
          </>
        ) : (
          <>
            {platform.apiKeyPlaceholder && (
              <div className="space-y-2">
                <Label className="text-xs">Clé API</Label>
                <Input
                  type="text"
                  placeholder={platform.apiKeyPlaceholder}
                  className="font-mono text-xs"
                />
              </div>
            )}
            <div className="flex gap-2">
              <Button size="sm" className="flex-1">
                Connecter
              </Button>
              {platform.docs && (
                <Button variant="outline" size="sm" asChild>
                  <a href={platform.docs} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-3 w-3 mr-1" />
                    Docs
                  </a>
                </Button>
              )}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );

  const connectedCount = [
    ...socialPlatforms,
    ...mediaPlatforms,
    ...scrapingPlatforms,
    ...llmPlatforms
  ].filter(p => p.status === "connected").length;

  const totalCount = socialPlatforms.length + mediaPlatforms.length + scrapingPlatforms.length + llmPlatforms.length;

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-card border-b border-border p-6">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setLocation("/settings")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <Link2 className="h-6 w-6 text-primary" />
          <div>
            <h1 className="text-2xl font-bold text-foreground">Connexions Plateformes</h1>
            <p className="text-sm text-muted-foreground mt-1">
              {connectedCount}/{totalCount} plateformes connectées
            </p>
          </div>
        </div>
      </div>

      <div className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="social">Réseaux Sociaux</TabsTrigger>
            <TabsTrigger value="media">Génération Média</TabsTrigger>
            <TabsTrigger value="scraping">Scraping</TabsTrigger>
            <TabsTrigger value="llms">LLMs</TabsTrigger>
          </TabsList>

          <TabsContent value="social" className="space-y-4 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {socialPlatforms.map(renderPlatformCard)}
            </div>
          </TabsContent>

          <TabsContent value="media" className="space-y-4 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mediaPlatforms.map(renderPlatformCard)}
            </div>
          </TabsContent>

          <TabsContent value="scraping" className="space-y-4 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {scrapingPlatforms.map(renderPlatformCard)}
            </div>
          </TabsContent>

          <TabsContent value="llms" className="space-y-4 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {llmPlatforms.map(renderPlatformCard)}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
