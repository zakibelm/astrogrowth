import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getLoginUrl } from "@/const";
import { ArrowRight, BarChart3, Sparkles, Target, Zap } from "lucide-react";
import { Link } from "wouter";

export default function Home() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (isAuthenticated) {
    return (
      <Link href="/dashboard">
        <div className="min-h-screen flex items-center justify-center">
          <Button size="lg">Accéder au Dashboard</Button>
        </div>
      </Link>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      {/* Hero Section */}
      <div className="container py-20">
        <div className="text-center max-w-4xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-6">
            <Sparkles className="h-4 w-4" />
            Propulsé par l'Intelligence Artificielle
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
            Marketing Automatisé
            <br />
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Pour Votre Croissance
            </span>
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
            Générez des leads, créez du contenu marketing personnalisé et publiez automatiquement 
            sur LinkedIn. Tout en pilote automatique.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href={getLoginUrl()}>
              <Button size="lg" className="gap-2 text-lg px-8 py-6">
                Commencer Gratuitement
                <ArrowRight className="h-5 w-5" />
              </Button>
            </a>
            <Link href="/dashboard">
              <Button size="lg" variant="outline" className="text-lg px-8 py-6">
                Voir une Démo
              </Button>
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-20">
          <Card className="border-2 hover:border-primary transition-all hover:shadow-xl">
            <CardHeader>
              <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Target className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Génération de Leads</CardTitle>
              <CardDescription>
                Identifiez automatiquement des prospects qualifiés dans votre industrie et région
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary mt-2" />
                  <span>Scraping Google Maps intelligent</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary mt-2" />
                  <span>Enrichissement automatique des contacts</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary mt-2" />
                  <span>Scoring de qualité 0-100</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-primary transition-all hover:shadow-xl">
            <CardHeader>
              <div className="h-12 w-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                <Sparkles className="h-6 w-6 text-accent" />
              </div>
              <CardTitle>Contenu IA</CardTitle>
              <CardDescription>
                Créez du contenu marketing personnalisé avec Gemini 2.0 et Imagen 3
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-accent mt-2" />
                  <span>Textes optimisés pour LinkedIn</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-accent mt-2" />
                  <span>Images professionnelles générées</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-accent mt-2" />
                  <span>Auto-approbation si score élevé</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-primary transition-all hover:shadow-xl">
            <CardHeader>
              <div className="h-12 w-12 bg-green-500/10 rounded-lg flex items-center justify-center mb-4">
                <Zap className="h-6 w-6 text-green-600" />
              </div>
              <CardTitle>Publication Auto</CardTitle>
              <CardDescription>
                Publiez automatiquement sur LinkedIn avec rate limiting intelligent
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-green-600 mt-2" />
                  <span>Connexion OAuth sécurisée</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-green-600 mt-2" />
                  <span>Respect des limites API</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-green-600 mt-2" />
                  <span>Tracking d'engagement</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <Card className="max-w-4xl mx-auto bg-gradient-to-r from-primary to-accent text-primary-foreground border-0">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-3xl mb-2">
              Prêt à Automatiser Votre Marketing ?
            </CardTitle>
            <CardDescription className="text-primary-foreground/80 text-lg">
              Rejoignez les PME québécoises qui font croître leur business avec AstroGrowth
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col sm:flex-row gap-4 justify-center pb-8">
            <a href={getLoginUrl()}>
              <Button size="lg" variant="secondary" className="gap-2 text-lg px-8">
                <BarChart3 className="h-5 w-5" />
                Démarrer Maintenant
              </Button>
            </a>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto mt-20 text-center">
          <div>
            <div className="text-4xl font-bold text-primary mb-2">10x</div>
            <div className="text-sm text-muted-foreground">Plus rapide qu'une agence</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-primary mb-2">80%</div>
            <div className="text-sm text-muted-foreground">Moins cher</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-primary mb-2">100%</div>
            <div className="text-sm text-muted-foreground">Automatisé</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-primary mb-2">24/7</div>
            <div className="text-sm text-muted-foreground">Génération continue</div>
          </div>
        </div>
      </div>
    </div>
  );
}
