import { useParams, useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  ArrowLeft,
  Phone,
  Mail,
  Globe,
  MapPin,
  Star,
  Sparkles,
  Loader2,
} from "lucide-react";

/**
 * Page de détails d'un lead/restaurant
 * Design selon les maquettes avec grande image en haut
 */
export default function LeadDetails() {
  const params = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const leadId = parseInt(params.id || "0");

  const { data: lead, isLoading } = trpc.leads.get.useQuery({ id: leadId });

  const generateContent = trpc.generator.generateForLead.useMutation({
    onSuccess: () => {
      toast.success("Contenu généré avec succès!");
    },
    onError: (error) => {
      toast.error(`Erreur: ${error.message}`);
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!lead) {
    return (
      <div className="container py-8">
        <p className="text-muted-foreground">Lead introuvable</p>
      </div>
    );
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return "bg-green-100 text-green-700 border-green-200";
    if (score >= 60) return "bg-blue-100 text-blue-700 border-blue-200";
    if (score >= 40) return "bg-orange-100 text-orange-700 border-orange-200";
    return "bg-red-100 text-red-700 border-red-200";
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="container py-6">
          <Button
            variant="ghost"
            onClick={() => window.history.back()}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Button>
        </div>
      </div>

      <div className="container py-8 max-w-4xl">
        {/* Placeholder pour image (à implémenter avec génération d'image) */}

        {/* Informations principales */}
        <Card className="mb-6 border-2">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-3xl mb-2">{lead.businessName}</CardTitle>
                {lead.businessType && (
                  <Badge variant="outline" className="mb-4">
                    {lead.businessType}
                  </Badge>
                )}
              </div>
              <Badge
                className={`text-lg px-4 py-2 font-bold border-2 ${getScoreColor(
                  lead.leadScore || 0
                )}`}
              >
                {lead.leadScore || 0}/100
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Adresse */}
            {lead.address && (
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-medium text-foreground">{lead.address}</div>
                  <div className="text-sm text-muted-foreground">
                    {lead.city}, {lead.province}
                  </div>
                </div>
              </div>
            )}

            {/* Téléphone */}
            {lead.phone && (
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-primary flex-shrink-0" />
                <a
                  href={`tel:${lead.phone}`}
                  className="font-medium text-foreground hover:text-primary transition-colors"
                >
                  {lead.phone}
                </a>
              </div>
            )}

            {/* Email */}
            {lead.email && (
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-primary flex-shrink-0" />
                <a
                  href={`mailto:${lead.email}`}
                  className="font-medium text-foreground hover:text-primary transition-colors"
                >
                  {lead.email}
                </a>
              </div>
            )}

            {/* Site web */}
            {lead.website && (
              <div className="flex items-center gap-3">
                <Globe className="h-5 w-5 text-primary flex-shrink-0" />
                <a
                  href={lead.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-primary hover:underline"
                >
                  Visiter le site web
                </a>
              </div>
            )}

            {/* Note Google */}
            {lead.googleRating && (
              <div className="flex items-center gap-3 pt-4 border-t border-border">
                <Star className="h-5 w-5 text-yellow-500 fill-yellow-500 flex-shrink-0" />
                <div>
                  <div className="font-semibold text-foreground text-lg">
                    {lead.googleRating} / 5.0
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {lead.googleReviews || 0} avis Google
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Action principale */}
        <div className="flex justify-center">
          <Button
            size="lg"
            onClick={() =>
              generateContent.mutate({
                leadId,
                campaignId: lead.campaignId,
              })
            }
            disabled={generateContent.isPending}
            className="gap-2 px-8 py-6 text-lg rounded-full shadow-lg hover:shadow-xl transition-all"
          >
            {generateContent.isPending ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Génération en cours...
              </>
            ) : (
              <>
                <Sparkles className="h-5 w-5" />
                Générer du Contenu Marketing
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
