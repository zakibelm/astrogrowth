import { useParams, useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { ArrowLeft, Search, Download, Sparkles, Star, Phone, Mail, Globe, MapPin, Users } from "lucide-react";
import { useState } from "react";

export default function LeadsList() {
  const params = useParams<{ campaignId: string }>();
  const [, setLocation] = useLocation();
  const campaignId = parseInt(params.campaignId || "0");
  const [searchTerm, setSearchTerm] = useState("");

  const { data: campaign } = trpc.campaigns.get.useQuery({ id: campaignId });
  const { data: leads, isLoading } = trpc.leads.listByCampaign.useQuery({ campaignId });

  const generateContentMutation = trpc.generator.generateForLead.useMutation({
    onSuccess: () => {
      toast.success("Contenu généré avec succès!");
    },
    onError: (error) => {
      toast.error(`Erreur: ${error.message}`);
    },
  });

  const handleGenerateContent = async (leadId: number) => {
    generateContentMutation.mutate({ leadId, campaignId });
  };

  const handleExportCSV = () => {
    if (!leads || leads.length === 0) {
      toast.error("Aucun lead à exporter");
      return;
    }

    const headers = ["Nom", "Type", "Adresse", "Ville", "Province", "Téléphone", "Email", "Site Web", "Note Google", "Avis", "Score"];
    const rows = leads.map(lead => [
      lead.businessName,
      lead.businessType,
      lead.address || "",
      lead.city || "",
      lead.province || "",
      lead.phone || "",
      lead.email || "",
      lead.website || "",
      lead.googleRating || "",
      lead.googleReviews || "",
      lead.leadScore || "",
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `leads_${campaign?.name || 'export'}_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success("Leads exportés en CSV");
  };

  const filteredLeads = leads?.filter(lead =>
    lead.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.businessType?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600 bg-green-50";
    if (score >= 60) return "text-blue-600 bg-blue-50";
    if (score >= 40) return "text-orange-600 bg-orange-50";
    return "text-red-600 bg-red-50";
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            className="mb-4"
            onClick={() => setLocation(`/campaigns/${campaignId}`)}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour à la Campagne
          </Button>

          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-2">
                Liste des Leads
              </h1>
              <p className="text-muted-foreground text-lg">
                {campaign?.name} • {leads?.length || 0} leads générés
              </p>
            </div>

            <Button onClick={handleExportCSV} variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Exporter CSV
            </Button>
          </div>
        </div>

        {/* Search Bar */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher par nom, ville ou type d'entreprise..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Leads Table */}
        <Card>
          <CardHeader>
            <CardTitle>Leads Détaillés</CardTitle>
            <CardDescription>
              Toutes les informations des entreprises identifiées
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!filteredLeads || filteredLeads.length === 0 ? (
              <div className="text-center py-12">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  {searchTerm ? "Aucun lead trouvé pour cette recherche" : "Aucun lead généré pour cette campagne"}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nom de l'Entreprise</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Localisation</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Note Google</TableHead>
                      <TableHead className="text-center">Score</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredLeads.map((lead) => (
                      <TableRow key={lead.id} className="hover:bg-muted/50">
                        <TableCell className="font-medium">
                          <div>
                            <div className="font-semibold text-foreground">{lead.businessName}</div>
                            {lead.address && (
                              <div className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                                <MapPin className="h-3 w-3" />
                                {lead.address}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{lead.businessType}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div className="font-medium">{lead.city || "N/A"}</div>
                            <div className="text-muted-foreground">{lead.province || ""}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1 text-sm">
                            {lead.phone && (
                              <div className="flex items-center gap-2 text-muted-foreground">
                                <Phone className="h-3 w-3" />
                                <span>{lead.phone}</span>
                              </div>
                            )}
                            {lead.email && (
                              <div className="flex items-center gap-2 text-muted-foreground">
                                <Mail className="h-3 w-3" />
                                <span>{lead.email}</span>
                              </div>
                            )}
                            {lead.website && (
                              <div className="flex items-center gap-2">
                                <Globe className="h-3 w-3 text-muted-foreground" />
                                <a
                                  href={lead.website}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-primary hover:underline"
                                >
                                  Site web
                                </a>
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          {lead.googleRating ? (
                            <div className="flex items-center gap-2">
                              <div className="flex items-center gap-1">
                                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                <span className="font-medium">{lead.googleRating}</span>
                              </div>
                              <span className="text-sm text-muted-foreground">
                                ({lead.googleReviews || 0} avis)
                              </span>
                            </div>
                          ) : (
                            <span className="text-muted-foreground text-sm">N/A</span>
                          )}
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge className={`font-semibold ${getScoreColor(lead.leadScore || 0)}`}>
                            {lead.leadScore || 0}/100
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleGenerateContent(lead.id!)}
                            disabled={generateContentMutation.isPending}
                            className="gap-2"
                          >
                            <Sparkles className="h-3 w-3" />
                            Générer Contenu
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
