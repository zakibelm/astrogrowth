import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  Building2, 
  Link2, 
  Key, 
  Users, 
  CreditCard,
  CheckCircle2,
  XCircle,
  Settings as SettingsIcon
} from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";

/**
 * Page Paramètres (Settings Hub)
 * Hub central pour gérer profil, connexions, clés API, équipe et facturation
 */
export default function Settings() {
  const { user } = useAuth();
  const { data: profile } = trpc.profile.get.useQuery();

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-card border-b border-border p-6">
        <div className="flex items-center gap-3">
          <SettingsIcon className="h-6 w-6 text-primary" />
          <div>
            <h1 className="text-2xl font-bold text-foreground">Paramètres</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Gérez votre compte et vos intégrations
            </p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Profil Entreprise */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Profil Entreprise
            </CardTitle>
            <CardDescription>
              Informations sur votre entreprise
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="businessName">Nom de l'entreprise</Label>
                <Input
                  id="businessName"
                  defaultValue={profile?.businessName || user?.businessName || ""}
                  placeholder="Votre entreprise"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="businessType">Type d'entreprise</Label>
                <Input
                  id="businessType"
                  defaultValue={profile?.businessType || user?.businessType || ""}
                  placeholder="Restaurant, Dentiste, etc."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="businessLocation">Localisation</Label>
                <Input
                  id="businessLocation"
                  defaultValue={profile?.businessLocation || user?.businessLocation || ""}
                  placeholder="Montréal, QC"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="businessPhone">Téléphone</Label>
                <Input
                  id="businessPhone"
                  defaultValue={profile?.businessPhone || user?.businessPhone || ""}
                  placeholder="+1 (514) 555-0123"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="businessWebsite">Site web</Label>
              <Input
                id="businessWebsite"
                defaultValue={profile?.businessWebsite || user?.businessWebsite || ""}
                placeholder="https://votreentreprise.com"
              />
            </div>
            <Button className="w-full md:w-auto">
              Enregistrer les modifications
            </Button>
          </CardContent>
        </Card>

        {/* Connexions Plateformes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Link2 className="h-5 w-5" />
              Connexions Plateformes
            </CardTitle>
            <CardDescription>
              3/8 plateformes connectées
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {/* LinkedIn */}
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <div>
                    <p className="font-medium text-foreground">LinkedIn</p>
                    <p className="text-xs text-muted-foreground">Connecté • Dernière sync il y a 2h</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">Gérer</Button>
              </div>

              {/* Fal.ai */}
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <div>
                    <p className="font-medium text-foreground">Fal.ai</p>
                    <p className="text-xs text-muted-foreground">Connecté • 234 crédits restants</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">Gérer</Button>
              </div>

              {/* OpenRouter */}
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <div>
                    <p className="font-medium text-foreground">OpenRouter</p>
                    <p className="text-xs text-muted-foreground">Connecté • 12.45$ de crédit</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">Gérer</Button>
              </div>

              {/* Instagram - Non connecté */}
              <div className="flex items-center justify-between p-3 border rounded-lg bg-muted/50">
                <div className="flex items-center gap-3">
                  <XCircle className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium text-foreground">Instagram</p>
                    <p className="text-xs text-muted-foreground">Non connecté</p>
                  </div>
                </div>
                <Button variant="default" size="sm">Connecter</Button>
              </div>

              {/* PhantomBuster - Non connecté */}
              <div className="flex items-center justify-between p-3 border rounded-lg bg-muted/50">
                <div className="flex items-center gap-3">
                  <XCircle className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium text-foreground">PhantomBuster</p>
                    <p className="text-xs text-muted-foreground">Non connecté</p>
                  </div>
                </div>
                <Button variant="default" size="sm">Connecter</Button>
              </div>
            </div>
            <Button 
              variant="outline" 
              className="w-full mt-4"
              onClick={() => window.location.href = '/platforms'}
            >
              Voir toutes les connexions →
            </Button>
          </CardContent>
        </Card>

        {/* Clés API */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="h-5 w-5" />
              Clés API
            </CardTitle>
            <CardDescription>
              Gérez vos clés d'accès aux services externes
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium text-foreground">OpenRouter API Key</p>
                  <p className="text-xs text-muted-foreground font-mono">sk-or-v1-••••••••••••••••</p>
                </div>
                <Badge variant="outline" className="bg-green-50 text-green-700">
                  Valide
                </Badge>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium text-foreground">Fal.ai API Key</p>
                  <p className="text-xs text-muted-foreground font-mono">fal_••••••••••••••••</p>
                </div>
                <Badge variant="outline" className="bg-green-50 text-green-700">
                  Valide
                </Badge>
              </div>
            </div>
            <Button variant="outline" className="w-full">
              + Ajouter une clé API
            </Button>
          </CardContent>
        </Card>

        {/* Équipe d'Agents */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Équipe d'Agents IA
            </CardTitle>
            <CardDescription>
              8 agents actifs • Performance globale : 94.2%
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { name: "Explorateur", emoji: "🔍", status: "active" },
                { name: "Qualifier", emoji: "🎯", status: "active" },
                { name: "Copywriter", emoji: "✍️", status: "active" },
                { name: "Designer", emoji: "🎨", status: "active" },
                { name: "Testeur", emoji: "🧪", status: "active" },
                { name: "Distributeur", emoji: "📱", status: "active" },
                { name: "Analyste", emoji: "📊", status: "active" },
                { name: "Orchestrateur", emoji: "🎭", status: "active" },
              ].map((agent) => (
                <div
                  key={agent.name}
                  className="flex flex-col items-center justify-center p-3 border rounded-lg bg-card"
                >
                  <span className="text-2xl mb-1">{agent.emoji}</span>
                  <p className="text-xs font-medium text-foreground">{agent.name}</p>
                  <Badge variant="outline" className="mt-1 bg-green-50 text-green-700 text-xs">
                    Actif
                  </Badge>
                </div>
              ))}
            </div>
            <Button 
              variant="outline" 
              className="w-full mt-4"
              onClick={() => window.location.href = '/agents'}
            >
              Gérer l'équipe →
            </Button>
          </CardContent>
        </Card>

        {/* Workflows */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <SettingsIcon className="h-5 w-5" />
              Workflows Agents
            </CardTitle>
            <CardDescription>
              Visualisez et gérez les workflows d'automatisation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Accédez à la visualisation complète du pipeline d'agents et configurez les étapes de traitement.
            </p>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => window.location.href = '/workflows'}
            >
              Voir les workflows →
            </Button>
          </CardContent>
        </Card>

        {/* Facturation */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Facturation
            </CardTitle>
            <CardDescription>
              Plan actuel et informations de paiement
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg bg-primary/5">
              <div>
                <p className="font-semibold text-foreground text-lg">Plan Pro</p>
                <p className="text-sm text-muted-foreground">499 $/mois</p>
              </div>
              <Badge className="bg-primary text-primary-foreground">
                Actif
              </Badge>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Prochaine facturation</span>
                <span className="font-medium text-foreground">15 janvier 2025</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Méthode de paiement</span>
                <span className="font-medium text-foreground">•••• 4242</span>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1">
                Changer de plan
              </Button>
              <Button variant="outline" className="flex-1">
                Historique
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
