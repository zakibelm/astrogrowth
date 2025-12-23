import { useLocation, useParams } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { ArrowLeft, Loader2, Users, FileText, Send, Play, Sparkles } from "lucide-react";
import { useState } from "react";
import LeadGenerationDialog from "@/components/LeadGenerationDialog";

export default function CampaignDetails() {
  const params = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const [showLeadDialog, setShowLeadDialog] = useState(false);
  const campaignId = parseInt(params.id || "0");

  const { data: campaign, isLoading, refetch } = trpc.campaigns.get.useQuery({ id: campaignId });
  const { data: leads } = trpc.leads.listByCampaign.useQuery({ campaignId });
  const { data: contents } = trpc.contents.listByCampaign.useQuery({ campaignId });

  const scrapeLeads = trpc.scraper.scrapeLeads.useMutation({
    onSuccess: (data) => {
      toast.success(`${data.leadsCount} leads générés avec succès!`);
      refetch();
    },
    onError: (error) => {
      toast.error(`Erreur: ${error.message}`);
    },
  });

  const generateContent = trpc.generator.generateForCampaign.useMutation({
    onSuccess: (data) => {
      toast.success(`${data.generatedCount} contenus générés!`);
      refetch();
    },
    onError: (error) => {
      toast.error(`Erreur: ${error.message}`);
    },
  });

  const updateStatus = trpc.campaigns.updateStatus.useMutation({
    onSuccess: () => {
      toast.success("Statut mis à jour");
      refetch();
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="container py-8">
        <p>Campagne introuvable</p>
      </div>
    );
  }

  const handleStartCampaign = async () => {
    // Show dialog and start generation
    setShowLeadDialog(true);
  };
  
  const handleLeadGenerationComplete = async () => {
    // Update status to running
    await updateStatus.mutateAsync({ id: campaignId, status: 'running' });
    
    // Start lead scraping
    await scrapeLeads.mutateAsync({
      campaignId,
      query: campaign.targetIndustry,
      location: campaign.targetLocation,
      maxResults: 50,
    });
    
    // Refetch data
    refetch();
  };

  const statusColors = {
    draft: "bg-gray-100 text-gray-700",
    running: "bg-blue-100 text-blue-700",
    completed: "bg-green-100 text-green-700",
    error: "bg-red-100 text-red-700",
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            className="mb-4"
            onClick={() => setLocation("/dashboard")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour au Dashboard
          </Button>
          
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-4xl font-bold text-foreground">
                  {campaign.name}
                </h1>
                <Badge className={statusColors[campaign.status]}>
                  {campaign.status === 'draft' && 'Brouillon'}
                  {campaign.status === 'running' && 'En cours'}
                  {campaign.status === 'completed' && 'Terminée'}
                  {campaign.status === 'error' && 'Erreur'}
                </Badge>
              </div>
              <p className="text-muted-foreground text-lg">
                {campaign.targetIndustry} • {campaign.targetLocation}
              </p>
            </div>
            
            {campaign.status === 'draft' && (
              <Button
                size="lg"
                onClick={handleStartCampaign}
                disabled={scrapeLeads.isPending || generateContent.isPending}
                className="gap-2"
              >
                {scrapeLeads.isPending || generateContent.isPending ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Génération en cours...
                  </>
                ) : (
                  <>
                    <Play className="h-5 w-5" />
                    Lancer la Campagne
                  </>
                )}
              </Button>
            )}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Leads Générés
              </CardTitle>
              <Users className="h-5 w-5 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">
                {campaign.totalLeads || 0}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Prospects identifiés
              </p>
              {(campaign.totalLeads || 0) > 0 && (
                <Button
                  variant="link"
                  size="sm"
                  className="mt-2 px-0 h-auto"
                  onClick={() => setLocation(`/campaigns/${campaignId}/leads`)}
                >
                  Voir tous les leads →
                </Button>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Contenus Créés
              </CardTitle>
              <FileText className="h-5 w-5 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">
                {campaign.totalContent || 0}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Posts marketing générés
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Posts Publiés
              </CardTitle>
              <Send className="h-5 w-5 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">
                {campaign.totalPublished || 0}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Publications LinkedIn
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Actions */}
        {campaign.status !== 'draft' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Générer Plus de Leads
                </CardTitle>
                <CardDescription>
                  Rechercher des prospects supplémentaires
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={() => scrapeLeads.mutate({
                    campaignId,
                    query: campaign.targetIndustry,
                    location: campaign.targetLocation,
                    maxResults: 50,
                  })}
                  disabled={scrapeLeads.isPending}
                  className="w-full"
                >
                  {scrapeLeads.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Génération...
                    </>
                  ) : (
                    "Générer des Leads"
                  )}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5" />
                  Générer du Contenu
                </CardTitle>
                <CardDescription>
                  Créer du contenu pour tous les leads
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={() => generateContent.mutate({ campaignId })}
                  disabled={generateContent.isPending || !leads || leads.length === 0}
                  className="w-full"
                >
                  {generateContent.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Génération...
                    </>
                  ) : (
                    "Générer du Contenu"
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Leads List */}
        {leads && leads.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Leads Générés</CardTitle>
              <CardDescription>
                {leads.length} prospect{leads.length > 1 ? 's' : ''} identifié{leads.length > 1 ? 's' : ''}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {leads.slice(0, 10).map((lead) => (
                  <div key={lead.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-semibold text-foreground">{lead.businessName}</h3>
                      <p className="text-sm text-muted-foreground">
                        {lead.city && `${lead.city}, `}{lead.province}
                      </p>
                      {lead.phone && (
                        <p className="text-sm text-muted-foreground">{lead.phone}</p>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-foreground">
                        Score: {lead.leadScore}/100
                      </div>
                      {lead.googleRating && (
                        <div className="text-xs text-muted-foreground">
                          ⭐ {lead.googleRating} ({lead.googleReviews} avis)
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {leads.length > 10 && (
                  <p className="text-center text-sm text-muted-foreground">
                    Et {leads.length - 10} autres leads...
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Contents List */}
        {contents && contents.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Contenus Générés</CardTitle>
              <CardDescription>
                {contents.length} contenu{contents.length > 1 ? 's' : ''} marketing créé{contents.length > 1 ? 's' : ''}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {contents.slice(0, 6).map((content) => (
                  <div key={content.id} className="border rounded-lg overflow-hidden">
                    {content.imageUrl && (
                      <img
                        src={content.imageUrl}
                        alt="Content"
                        className="w-full h-48 object-cover"
                      />
                    )}
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <Badge className={
                          content.status === 'published' ? 'bg-green-100 text-green-700' :
                          content.status === 'approved' ? 'bg-blue-100 text-blue-700' :
                          content.status === 'rejected' ? 'bg-red-100 text-red-700' :
                          'bg-yellow-100 text-yellow-700'
                        }>
                          {content.status === 'published' ? 'Publié' :
                           content.status === 'approved' ? 'Approuvé' :
                           content.status === 'rejected' ? 'Rejeté' :
                           'En attente'}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          Score: {content.qualityScore}/100
                        </span>
                      </div>
                      <p className="text-sm text-foreground line-clamp-3">
                        {content.textContent}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              {contents.length > 6 && (
                <p className="text-center text-sm text-muted-foreground mt-4">
                  Et {contents.length - 6} autres contenus...
                </p>
              )}
            </CardContent>
          </Card>
        )}
      </div>
      
      {/* Lead Generation Dialog */}
      <LeadGenerationDialog
        open={showLeadDialog}
        onOpenChange={setShowLeadDialog}
        campaignId={campaignId.toString()}
        onComplete={handleLeadGenerationComplete}
      />
    </div>
  );
}
