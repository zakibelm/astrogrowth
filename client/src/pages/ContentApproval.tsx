import { useParams, useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useState } from "react";
import {
  ArrowLeft,
  Check,
  X,
  Edit,
  Loader2,
  Sparkles,
  Hash,
} from "lucide-react";

/**
 * Page d'approbation de contenu
 * Design selon les maquettes avec grande preview image + texte + actions
 */
export default function ContentApproval() {
  const params = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const contentId = parseInt(params.id || "0");

  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState("");

  const { data: content, isLoading, refetch } = trpc.contents.get.useQuery({ id: contentId });

  const approveContent = trpc.contents.approve.useMutation({
    onSuccess: () => {
      toast.success("Contenu approuvé!");
      refetch();
    },
    onError: (error) => {
      toast.error(`Erreur: ${error.message}`);
    },
  });

  const rejectContent = trpc.contents.reject.useMutation({
    onSuccess: () => {
      toast.success("Contenu rejeté");
      refetch();
    },
    onError: (error) => {
      toast.error(`Erreur: ${error.message}`);
    },
  });

  // Update mutation à implémenter côté serveur

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!content) {
    return (
      <div className="container py-8">
        <p className="text-muted-foreground">Contenu introuvable</p>
      </div>
    );
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return "bg-green-100 text-green-700 border-green-200";
    if (score >= 60) return "bg-blue-100 text-blue-700 border-blue-200";
    if (score >= 40) return "bg-orange-100 text-orange-700 border-orange-200";
    return "bg-red-100 text-red-700 border-red-200";
  };

  const getStatusBadge = () => {
    switch (content.status) {
      case "approved":
        return <Badge className="bg-green-100 text-green-700 border-green-200">Approuvé</Badge>;
      case "rejected":
        return <Badge className="bg-red-100 text-red-700 border-red-200">Rejeté</Badge>;
      case "published":
        return <Badge className="bg-primary/10 text-primary border-primary/20">Publié</Badge>;
      default:
        return <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200">En attente</Badge>;
    }
  };

  const handleSaveEdit = () => {
    // TODO: Implémenter la mutation update
    toast.info("À implémenter: mise à jour du contenu");
    setIsEditing(false);
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
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-foreground">
              Approbation de Contenu
            </h1>
            {getStatusBadge()}
          </div>
        </div>
      </div>

      <div className="container py-8 max-w-4xl">
        {/* Score de qualité */}
        <div className="flex justify-center mb-8">
          <Badge
            className={`text-2xl px-6 py-3 font-bold border-2 ${getScoreColor(
              content.qualityScore || 0
            )}`}
          >
            <Sparkles className="h-5 w-5 mr-2" />
            Score: {content.qualityScore || 0}/100
          </Badge>
        </div>

        {/* Image générée */}
        {content.imageUrl && (
          <Card className="mb-8 overflow-hidden border-2">
            <CardHeader>
              <CardTitle>Image Générée</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <img
                src={content.imageUrl}
                alt="Contenu généré"
                className="w-full h-auto"
              />
            </CardContent>
          </Card>
        )}

        {/* Texte du contenu */}
        <Card className="mb-8 border-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Texte Marketing</CardTitle>
              {!isEditing && content.status === "pending" && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setIsEditing(true);
                    setEditedText(content.textContent || "");
                  }}
                  className="gap-2"
                >
                  <Edit className="h-4 w-4" />
                  Modifier
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {isEditing ? (
              <div className="space-y-4">
                <Textarea
                  value={editedText}
                  onChange={(e) => setEditedText(e.target.value)}
                  rows={10}
                  className="font-sans"
                />
                <div className="flex gap-2">
                  <Button
                    onClick={handleSaveEdit}
                    className="gap-2"
                  >
                    <Check className="h-4 w-4" />
                    Enregistrer
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setIsEditing(false)}
                  >
                    Annuler
                  </Button>
                </div>
              </div>
            ) : (
              <p className="text-foreground whitespace-pre-wrap leading-relaxed">
                {content.textContent}
              </p>
            )}
          </CardContent>
        </Card>

        {/* Hashtags */}
        {content.hashtags && (
          <Card className="mb-8 border-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Hash className="h-5 w-5" />
                Hashtags
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {content.hashtags.split(" ").map((tag, index) => (
                  <Badge key={index} variant="outline" className="text-sm">
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Actions */}
        {content.status === "pending" && (
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              onClick={() => approveContent.mutate({ id: contentId })}
              disabled={approveContent.isPending}
              className="gap-2 px-8 py-6 text-lg rounded-full bg-green-600 hover:bg-green-700 text-white"
            >
              {approveContent.isPending ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Check className="h-5 w-5" />
              )}
              Approuver
            </Button>

            <Button
              size="lg"
              variant="outline"
              onClick={() => rejectContent.mutate({ id: contentId })}
              disabled={rejectContent.isPending}
              className="gap-2 px-8 py-6 text-lg rounded-full border-red-200 text-red-700 hover:bg-red-50"
            >
              {rejectContent.isPending ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <X className="h-5 w-5" />
              )}
              Rejeter
            </Button>
          </div>
        )}

        {content.status === "approved" && (
          <div className="text-center">
            <p className="text-muted-foreground mb-4">
              Ce contenu a été approuvé et est prêt pour la publication
            </p>
            <Button size="lg" className="gap-2 px-8 py-6 text-lg rounded-full">
              <Check className="h-5 w-5" />
              Publier sur LinkedIn
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
