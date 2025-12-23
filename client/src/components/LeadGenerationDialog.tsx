import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LeadGenerationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  campaignId: string;
  onComplete: () => void;
}

/**
 * Dialogue de génération de leads avec barre de progression
 * Affiche l'état du scraping en temps réel
 */
export default function LeadGenerationDialog({
  open,
  onOpenChange,
  campaignId,
  onComplete,
}: LeadGenerationDialogProps) {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<"generating" | "success" | "error">("generating");
  const [leadsFound, setLeadsFound] = useState(0);
  const [message, setMessage] = useState("Initialisation du scraping...");

  useEffect(() => {
    if (!open) {
      // Reset state when dialog closes
      setProgress(0);
      setStatus("generating");
      setLeadsFound(0);
      setMessage("Initialisation du scraping...");
      return;
    }

    // Simulate lead generation process
    const messages = [
      "Connexion à Google Maps...",
      "Recherche des entreprises...",
      "Extraction des informations...",
      "Enrichissement des données...",
      "Calcul des scores de qualité...",
      "Finalisation...",
    ];

    let currentStep = 0;
    const interval = setInterval(() => {
      currentStep++;
      const newProgress = (currentStep / messages.length) * 100;
      setProgress(newProgress);
      setMessage(messages[currentStep - 1] || "Finalisation...");
      setLeadsFound(Math.floor((currentStep / messages.length) * 20));

      if (currentStep >= messages.length) {
        clearInterval(interval);
        setStatus("success");
        setMessage("Génération terminée avec succès !");
        setTimeout(() => {
          onComplete();
          onOpenChange(false);
        }, 2000);
      }
    }, 1500);

    return () => clearInterval(interval);
  }, [open, onComplete, onOpenChange]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Génération de Leads</DialogTitle>
          <DialogDescription>
            {status === "generating" && "Scraping en cours..."}
            {status === "success" && "Leads générés avec succès"}
            {status === "error" && "Erreur lors de la génération"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Progression</span>
              <span className="font-medium">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Status Message */}
          <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
            {status === "generating" && (
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
            )}
            {status === "success" && (
              <CheckCircle2 className="h-5 w-5 text-green-500" />
            )}
            {status === "error" && (
              <XCircle className="h-5 w-5 text-red-500" />
            )}
            <div className="flex-1">
              <p className="text-sm font-medium">{message}</p>
              {status === "generating" && leadsFound > 0 && (
                <p className="text-xs text-muted-foreground mt-1">
                  {leadsFound} leads trouvés jusqu'à présent
                </p>
              )}
              {status === "success" && (
                <p className="text-xs text-muted-foreground mt-1">
                  {leadsFound} nouveaux leads ajoutés à votre campagne
                </p>
              )}
            </div>
          </div>

          {/* Action Button */}
          {status === "error" && (
            <Button
              onClick={() => onOpenChange(false)}
              variant="outline"
              className="w-full"
            >
              Fermer
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
