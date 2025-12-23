import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { Loader2, User, Building2, MapPin, Phone, Globe, LogOut } from "lucide-react";
import { toast } from "sonner";

/**
 * Page profil utilisateur
 * Design selon les maquettes fournies
 */
export default function Profile() {
  const { user, loading } = useAuth();
  const logoutMutation = trpc.auth.logout.useMutation();

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
      toast.success("Déconnexion réussie");
      window.location.href = "/";
    } catch (error) {
      toast.error("Erreur lors de la déconnexion");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border">
        <div className="container py-4">
          <h1 className="text-2xl font-bold text-foreground">Profil</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Gérez vos informations personnelles
          </p>
        </div>
      </div>

      <div className="container py-4 space-y-4">
        {/* Informations personnelles */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              Informations personnelles
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Nom complet
              </label>
              <p className="text-base text-foreground mt-1">{user.name || "Non renseigné"}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Email
              </label>
              <p className="text-base text-foreground mt-1">{user.email || "Non renseigné"}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Rôle
              </label>
              <p className="text-base text-foreground mt-1 capitalize">{user.role}</p>
            </div>
          </CardContent>
        </Card>

        {/* Informations entreprise */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Building2 className="h-5 w-5 text-primary" />
              Informations entreprise
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <label className="text-sm font-medium text-muted-foreground flex items-center gap-1.5">
                <Building2 className="h-4 w-4" />
                Nom de l'entreprise
              </label>
              <p className="text-base text-foreground mt-1">
                {user.businessName || "Non renseigné"}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground flex items-center gap-1.5">
                <Building2 className="h-4 w-4" />
                Type d'entreprise
              </label>
              <p className="text-base text-foreground mt-1 capitalize">
                {user.businessType || "Non renseigné"}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground flex items-center gap-1.5">
                <MapPin className="h-4 w-4" />
                Localisation
              </label>
              <p className="text-base text-foreground mt-1">
                {user.businessLocation || "Non renseignée"}
              </p>
            </div>
            {user.businessPhone && (
              <div>
                <label className="text-sm font-medium text-muted-foreground flex items-center gap-1.5">
                  <Phone className="h-4 w-4" />
                  Téléphone
                </label>
                <p className="text-base text-foreground mt-1">{user.businessPhone}</p>
              </div>
            )}
            {user.businessWebsite && (
              <div>
                <label className="text-sm font-medium text-muted-foreground flex items-center gap-1.5">
                  <Globe className="h-4 w-4" />
                  Site web
                </label>
                <p className="text-base text-foreground mt-1">{user.businessWebsite}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Actions */}
        <Card>
          <CardContent className="pt-6">
            <Button
              variant="destructive"
              className="w-full gap-2"
              onClick={handleLogout}
              disabled={logoutMutation.isPending}
            >
              {logoutMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <LogOut className="h-4 w-4" />
              )}
              Se déconnecter
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
