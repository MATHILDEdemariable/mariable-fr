import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Star, MessageCircle, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface SatisfactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
}

const SatisfactionModal: React.FC<SatisfactionModalProps> = ({ isOpen, onClose, userId }) => {
  const [scoreNPS, setScoreNPS] = useState<number | null>(null);
  const [commentaire, setCommentaire] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleScoreClick = (score: number) => {
    setScoreNPS(score);
  };

  const handleSubmit = async () => {
    if (scoreNPS === null) {
      toast({
        variant: "destructive",
        title: "Score requis",
        description: "Veuillez sélectionner une note de 0 à 10."
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('user_satisfaction_feedback')
        .insert({
          user_id: userId,
          score_nps: scoreNPS,
          commentaire: commentaire.trim() || null,
          page_courante: window.location.pathname
        });

      if (error) throw error;

      // Marquer comme complété dans le localStorage
      localStorage.setItem('satisfaction_feedback_completed', 'true');
      localStorage.setItem('satisfaction_feedback_date', new Date().toISOString());

      toast({
        title: "Merci pour votre retour !",
        description: "Votre évaluation nous aide à améliorer l'application."
      });

      onClose();

    } catch (error: any) {
      console.error('Erreur lors de l\'envoi du feedback:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible d'enregistrer votre retour. Veuillez réessayer."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getScoreLabel = (score: number) => {
    if (score <= 6) return "Pas satisfait";
    if (score <= 8) return "Neutre";
    return "Très satisfait";
  };

  const getScoreColor = (score: number) => {
    if (score <= 6) return "text-red-500";
    if (score <= 8) return "text-yellow-500";
    return "text-green-500";
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Star className="w-5 h-5 text-primary" />
            Questionnaire de satisfaction
          </DialogTitle>
          <DialogDescription>
            Votre avis nous est précieux ! Aidez-nous à améliorer votre expérience en quelques clics.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Score NPS */}
          <div className="space-y-3">
            <Label className="text-base font-medium">
              Sur une échelle de 0 à 10, recommanderiez-vous Mariable à un ami ?
            </Label>
            
            <div className="flex flex-wrap gap-2 justify-center">
              {Array.from({ length: 11 }, (_, i) => (
                <Button
                  key={i}
                  variant={scoreNPS === i ? "default" : "outline"}
                  size="sm"
                  className={`w-10 h-10 ${
                    scoreNPS === i 
                      ? "bg-primary text-primary-foreground" 
                      : "hover:bg-muted"
                  }`}
                  onClick={() => handleScoreClick(i)}
                >
                  {i}
                </Button>
              ))}
            </div>

            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Pas du tout probable</span>
              <span>Extrêmement probable</span>
            </div>

            {scoreNPS !== null && (
              <div className={`text-center text-sm font-medium ${getScoreColor(scoreNPS)}`}>
                {getScoreLabel(scoreNPS)}
              </div>
            )}
          </div>

          {/* Commentaire */}
          <div className="space-y-2">
            <Label htmlFor="commentaire" className="flex items-center gap-2">
              <MessageCircle className="w-4 h-4" />
              Commentaire (optionnel)
            </Label>
            <Textarea
              id="commentaire"
              placeholder="Dites-nous ce que vous pensez de l'application, ce qui pourrait être amélioré..."
              value={commentaire}
              onChange={(e) => setCommentaire(e.target.value)}
              rows={3}
              className="resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 justify-end">
            <Button 
              variant="outline" 
              onClick={onClose}
              disabled={isSubmitting}
            >
              Plus tard
            </Button>
            <Button 
              onClick={handleSubmit}
              disabled={scoreNPS === null || isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Envoi...
                </>
              ) : (
                "Envoyer"
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SatisfactionModal;