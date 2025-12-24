import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { ExternalLink, Key, Zap } from "lucide-react";

interface ConfigModalProps {
  platform: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ConfigModal({ platform, isOpen, onClose }: ConfigModalProps) {
  const [apiKey, setApiKey] = useState("");
  const [selectedModel, setSelectedModel] = useState("gemini-2.0-flash");

  const handleSave = () => {
    if (!apiKey && platform !== 'linkedin') {
      toast.error("Veuillez entrer une clé API");
      return;
    }
    
    toast.success(`Configuration de ${platform} sauvegardée`);
    onClose();
  };

  const getLinkedInAuthUrl = () => {
    // TODO: Implémenter le vrai OAuth flow
    return "/api/oauth/linkedin";
  };

  if (!platform) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            Configuration {platform}
          </DialogTitle>
          <DialogDescription>
            {platform === 'linkedin' 
              ? "Connectez votre compte LinkedIn pour publier automatiquement"
              : `Configurez votre clé API ${platform} pour activer l'intégration`
            }
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {platform === 'linkedin' && (
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
                <p className="text-sm text-blue-900 dark:text-blue-100 mb-3">
                  Pour connecter LinkedIn, vous devez autoriser AstroGrowth à accéder à votre profil et publier en votre nom.
                </p>
                <Button 
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  onClick={() => {
                    window.location.href = getLinkedInAuthUrl();
                  }}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Se connecter avec LinkedIn
                </Button>
              </div>
            </div>
          )}

          {platform === 'openrouter' && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="model">Modèle Primaire</Label>
                <Select value={selectedModel} onValueChange={setSelectedModel}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gemini-2.0-flash">
                      <div className="flex items-center justify-between w-full">
                        <span>Gemini 2.0 Flash</span>
                        <span className="text-xs text-green-600 ml-4">GRATUIT</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="claude-sonnet-4">
                      <div className="flex items-center justify-between w-full">
                        <span>Claude Sonnet 4</span>
                        <span className="text-xs text-muted-foreground ml-4">$3/1M tokens</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="llama-3.3-70b">
                      <div className="flex items-center justify-between w-full">
                        <span>Llama 3.3 70B</span>
                        <span className="text-xs text-muted-foreground ml-4">$0.35/1M tokens</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="gpt-4">
                      <div className="flex items-center justify-between w-full">
                        <span>GPT-4</span>
                        <span className="text-xs text-muted-foreground ml-4">$10/1M tokens</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground mt-2">
                  <Zap className="h-3 w-3 inline mr-1" />
                  Fallback automatique: OpenRouter → Hugging Face → Ollama
                </p>
              </div>

              <div>
                <Label htmlFor="apikey">Clé API OpenRouter</Label>
                <Input
                  id="apikey"
                  type="password"
                  placeholder="sk-or-v1-..."
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                />
                <p className="text-xs text-muted-foreground mt-2">
                  Obtenez votre clé sur{" "}
                  <a 
                    href="https://openrouter.ai/keys" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    openrouter.ai/keys
                  </a>
                </p>
              </div>
            </div>
          )}

          {platform === 'imagen3' && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="apikey">Clé API Google Cloud</Label>
                <Input
                  id="apikey"
                  type="password"
                  placeholder="AIza..."
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                />
                <p className="text-xs text-muted-foreground mt-2">
                  Créez une clé sur{" "}
                  <a 
                    href="https://console.cloud.google.com/apis/credentials" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    Google Cloud Console
                  </a>
                </p>
              </div>
            </div>
          )}

          {platform === 'googlemaps' && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="apikey">Clé API Google Maps</Label>
                <Input
                  id="apikey"
                  type="password"
                  placeholder="AIza..."
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                />
                <p className="text-xs text-muted-foreground mt-2">
                  Activez l'API Places sur{" "}
                  <a 
                    href="https://console.cloud.google.com/google/maps-apis" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    Google Maps Platform
                  </a>
                </p>
              </div>
            </div>
          )}

          {!['linkedin', 'openrouter', 'imagen3', 'googlemaps'].includes(platform) && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="apikey">Clé API</Label>
                <Input
                  id="apikey"
                  type="password"
                  placeholder="Entrez votre clé API"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                />
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button onClick={handleSave}>
            Sauvegarder
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
