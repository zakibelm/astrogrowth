import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getLoginUrl } from "@/const";
import { useLocation } from "wouter";
import { Users, FileText, Send, TrendingUp, Plus, ArrowRight } from "lucide-react";

/**
 * Page d'accueil AstroGrowth - Landing page avec accès au dashboard
 * Design selon les maquettes fournies
 */
export default function Home() {
  const { user, loading, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (isAuthenticated && user) {
    // Rediriger vers le dashboard si connecté
    setLocation("/dashboard");
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Hero Section */}
      <div className="container py-12 md:py-24">
        <div className="flex flex-col items-center text-center space-y-8">
          {/* Logo / Titre */}
          <div className="space-y-4">
            <h1 className="text-5xl md:text-7xl font-bold text-foreground tracking-tight">
              AstroGrowth
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl">
              Automatisez votre marketing B2B avec l'intelligence artificielle
            </p>
          </div>

          {/* Value Proposition */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl w-full mt-12">
            <Card className="border-2 hover:border-primary/50 transition-colors">
              <CardHeader>
                <Users className="h-10 w-10 text-primary mb-2" />
                <CardTitle className="text-lg">Génération de Leads</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Identifiez automatiquement des prospects qualifiés via Google Maps
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-primary/50 transition-colors">
              <CardHeader>
                <FileText className="h-10 w-10 text-primary mb-2" />
                <CardTitle className="text-lg">Contenu IA</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Générez du contenu marketing personnalisé avec Gemini et Imagen
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-primary/50 transition-colors">
              <CardHeader>
                <Send className="h-10 w-10 text-primary mb-2" />
                <CardTitle className="text-lg">Publication Auto</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Publiez automatiquement sur LinkedIn avec rate limiting intelligent
                </p>
              </CardContent>
            </Card>
          </div>

          {/* CTA Button */}
          <div className="mt-12">
            <Button
              size="lg"
              className="text-lg px-8 py-6 rounded-full shadow-lg hover:shadow-xl transition-all"
              onClick={() => window.location.href = getLoginUrl()}
            >
              Accéder au Dashboard
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>

          {/* Stats Preview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 w-full max-w-3xl">
            <div className="text-center p-4">
              <div className="text-3xl font-bold text-primary">10x</div>
              <div className="text-sm text-muted-foreground mt-1">Plus rapide</div>
            </div>
            <div className="text-center p-4">
              <div className="text-3xl font-bold text-primary">80%</div>
              <div className="text-sm text-muted-foreground mt-1">Moins cher</div>
            </div>
            <div className="text-center p-4">
              <div className="text-3xl font-bold text-primary">50+</div>
              <div className="text-sm text-muted-foreground mt-1">Clients</div>
            </div>
            <div className="text-center p-4">
              <div className="text-3xl font-bold text-primary">24/7</div>
              <div className="text-sm text-muted-foreground mt-1">Automatisé</div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-border mt-24">
        <div className="container py-8 text-center text-sm text-muted-foreground">
          <p>© 2024 AstroGrowth. Plateforme SaaS de marketing automatisé pour PME québécoises.</p>
        </div>
      </div>
    </div>
  );
}
