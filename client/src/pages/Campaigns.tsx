import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLocation } from "wouter";
import { Plus, Loader2, ArrowRight } from "lucide-react";

/**
 * Page liste des campagnes
 * Design selon les maquettes fournies
 */
export default function Campaigns() {
  const [, setLocation] = useLocation();
  const { data: campaigns, isLoading } = trpc.campaigns.list.useQuery();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border sticky top-0 z-10">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Campagnes</h1>
              <p className="text-sm text-muted-foreground mt-0.5">
                Gérez vos campagnes marketing
              </p>
            </div>
            <Button
              size="sm"
              onClick={() => setLocation("/campaigns/new")}
              className="gap-2 rounded-full"
            >
              <Plus className="h-4 w-4" />
              Nouvelle
            </Button>
          </div>
        </div>
      </div>

      <div className="container py-4">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : campaigns && campaigns.length > 0 ? (
          <div className="space-y-3">
            {campaigns.map((campaign) => (
              <Card
                key={campaign.id}
                onClick={() => setLocation(`/campaigns/${campaign.id}`)}
                className="border-2 hover:border-primary/50 transition-all cursor-pointer active:scale-[0.98]"
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground text-lg mb-1">
                        {campaign.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {campaign.targetIndustry} • {campaign.targetLocation}
                      </p>
                    </div>
                    <ArrowRight className="h-5 w-5 text-muted-foreground flex-shrink-0 ml-2" />
                  </div>

                  <div className="flex items-center gap-2 mb-3">
                    <Badge
                      variant={campaign.status === "running" ? "default" : "secondary"}
                      className={
                        campaign.status === "running"
                          ? "bg-primary/10 text-primary border-primary/20"
                          : ""
                      }
                    >
                      {campaign.status === "draft" && "Brouillon"}
                      {campaign.status === "running" && "En cours"}
                      {campaign.status === "completed" && "Terminée"}
                      {campaign.status === "error" && "Erreur"}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <span className="font-semibold text-foreground">
                        {campaign.totalLeads || 0}
                      </span>
                      <span className="text-muted-foreground">leads</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="font-semibold text-foreground">
                        {campaign.totalContent || 0}
                      </span>
                      <span className="text-muted-foreground">contenus</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="font-semibold text-foreground">
                        {campaign.totalPublished || 0}
                      </span>
                      <span className="text-muted-foreground">publiés</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="mb-4">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted">
                <Plus className="h-8 w-8 text-muted-foreground" />
              </div>
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Aucune campagne
            </h3>
            <p className="text-muted-foreground mb-4">
              Créez votre première campagne pour commencer
            </p>
            <Button onClick={() => setLocation("/campaigns/new")} className="gap-2">
              <Plus className="h-4 w-4" />
              Créer une campagne
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
