import { trpc } from "@/lib/trpc";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLocation } from "wouter";
import { Loader2, FileText } from "lucide-react";

/**
 * Page liste des contenus
 * Design selon les maquettes fournies
 */
export default function Contents() {
  const [, setLocation] = useLocation();
  const { data: contents, isLoading } = trpc.contents.listByUser.useQuery({
    status: undefined,
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return (
          <Badge className="bg-green-100 text-green-700 border-green-200">
            Approuvé
          </Badge>
        );
      case "rejected":
        return (
          <Badge className="bg-red-100 text-red-700 border-red-200">Rejeté</Badge>
        );
      case "published":
        return (
          <Badge className="bg-primary/10 text-primary border-primary/20">
            Publié
          </Badge>
        );
      default:
        return (
          <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200">
            En attente
          </Badge>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border sticky top-0 z-10">
        <div className="container py-4">
          <h1 className="text-2xl font-bold text-foreground">Contenus</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {contents?.length || 0} contenu{contents?.length !== 1 ? "s" : ""} généré
            {contents?.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      <div className="container py-4">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : contents && contents.length > 0 ? (
          <div className="space-y-3">
            {contents.map((content) => (
              <Card
                key={content.id}
                onClick={() => setLocation(`/content/${content.id}`)}
                className="border-2 hover:border-primary/50 transition-all cursor-pointer active:scale-[0.98]"
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    {getStatusBadge(content.status)}
                    <Badge variant="outline" className="font-semibold">
                      {content.qualityScore || 0}/100
                    </Badge>
                  </div>

                  {content.imageUrl && (
                    <div className="mb-3 rounded-lg overflow-hidden">
                      <img
                        src={content.imageUrl}
                        alt="Contenu"
                        className="w-full h-48 object-cover"
                      />
                    </div>
                  )}

                  <p className="text-sm text-foreground line-clamp-3 leading-relaxed">
                    {content.textContent}
                  </p>

                  {content.hashtags && (
                    <div className="mt-3 flex flex-wrap gap-1">
                      {content.hashtags
                        .split(" ")
                        .slice(0, 3)
                        .map((tag, index) => (
                          <span
                            key={index}
                            className="text-xs text-primary font-medium"
                          >
                            {tag}
                          </span>
                        ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="mb-4">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted">
                <FileText className="h-8 w-8 text-muted-foreground" />
              </div>
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Aucun contenu
            </h3>
            <p className="text-muted-foreground">
              Générez du contenu depuis vos campagnes
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
