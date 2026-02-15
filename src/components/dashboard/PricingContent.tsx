import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Check, Lock } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const PricingContent = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  const handlePremiumClick = async () => {
    if (!isAuthenticated) {
      navigate('/login?redirect=premium');
      return;
    }
    try {
      setCheckoutLoading(true);
      const { data, error } = await supabase.functions.invoke('create-checkout-session');
      if (error || !data?.url) {
        toast({ title: "Erreur", description: "Impossible de créer la session de paiement.", variant: "destructive" });
        return;
      }
      window.location.href = data.url;
    } catch {
      toast({ title: "Erreur", description: "Une erreur est survenue.", variant: "destructive" });
    } finally {
      setCheckoutLoading(false);
    }
  };

  const faqItems = [
    { question: "Mariable est-il vraiment gratuit ?", answer: "Oui, toutes les fonctionnalités sont accessibles gratuitement. Seuls les exports PDF, les guides, l'IA illimitée et le budget illimité nécessitent le Premium." },
    { question: "Que contient le Premium à 29 € ?", answer: "Un achat unique qui lève toutes les limitations : exports PDF/CSV illimités, IA illimitée, budget sans limite, + 10 guides mariage & checklists PDF, stockage illimité et support prioritaire." },
    { question: "Est-ce un abonnement ?", answer: "Non, c'est un paiement unique de 29 €. Pas de renouvellement automatique." },
    { question: "Puis-je utiliser l'app avec ma famille ?", answer: "Oui, l'application est collaborative. Chacun peut accéder au planning et aux informations importantes." },
  ];

  return (
    <div className="space-y-8 p-4">
      <div className="text-center">
        <h2 className="text-2xl md:text-3xl font-serif font-bold text-foreground mb-2">
          Nos tarifs
        </h2>
        <p className="text-muted-foreground">
          Tout est gratuit. Le Premium lève les dernières limites.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-4 max-w-3xl mx-auto">
        {/* Gratuit */}
        <Card className="relative rounded-none border border-border">
          <CardHeader className="text-center pb-2 pt-4">
            <CardTitle className="text-lg font-serif">Gratuit</CardTitle>
            <div className="text-2xl font-bold text-foreground">0 €</div>
            <p className="text-xs text-muted-foreground">Pour bien démarrer</p>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="space-y-2 mb-4">
              <div className="flex items-start gap-2">
                <Check className="w-4 h-4 text-foreground mt-0.5 flex-shrink-0" />
                <span className="text-xs text-foreground font-medium">Toutes les fonctionnalités</span>
              </div>
              <hr className="border-border" />
              <p className="text-[10px] text-muted-foreground uppercase tracking-wide font-semibold">Limitations</p>
              <div className="flex items-start gap-2">
                <Lock className="w-3 h-3 text-muted-foreground mt-0.5 flex-shrink-0" />
                <span className="text-xs text-muted-foreground">Exports PDF : non inclus</span>
              </div>
              <div className="flex items-start gap-2">
                <Lock className="w-3 h-3 text-muted-foreground mt-0.5 flex-shrink-0" />
                <span className="text-xs text-muted-foreground">Guides PDF : non inclus</span>
              </div>
              <div className="flex items-start gap-2">
                <Lock className="w-3 h-3 text-muted-foreground mt-0.5 flex-shrink-0" />
                <span className="text-xs text-muted-foreground">IA : 1 génération/outil</span>
              </div>
              <div className="flex items-start gap-2">
                <Lock className="w-3 h-3 text-muted-foreground mt-0.5 flex-shrink-0" />
                <span className="text-xs text-muted-foreground">Budget : 3 lignes/catégorie</span>
              </div>
            </div>
            <Button asChild size="sm" className="w-full bg-foreground hover:bg-foreground/90 rounded-none">
              <Link to="/register">S'inscrire gratuitement</Link>
            </Button>
          </CardContent>
        </Card>

        {/* Premium */}
        <Card className="relative rounded-none border-2 border-foreground">
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
            <span className="bg-foreground text-background px-3 py-1 text-xs font-bold">
              ⭐ RECOMMANDÉ
            </span>
          </div>
          <CardHeader className="text-center pb-2 pt-6">
            <CardTitle className="text-lg font-serif">Premium</CardTitle>
            <div className="text-2xl font-bold text-foreground">29 €</div>
            <p className="text-xs text-muted-foreground">Achat unique · Accès à vie</p>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="space-y-2 mb-4">
              <div className="flex items-start gap-2">
                <Check className="w-4 h-4 text-foreground mt-0.5 flex-shrink-0" />
                <span className="text-xs text-foreground font-medium">Tout, sans aucune limitation</span>
              </div>
              <hr className="border-border" />
              <div className="flex items-start gap-2">
                <Check className="w-4 h-4 text-foreground mt-0.5 flex-shrink-0" />
                <span className="text-xs text-foreground">Exports PDF/CSV illimités</span>
              </div>
              <div className="flex items-start gap-2">
              <span className="text-xs text-foreground">+ 10 guides mariage & checklists PDF</span>
              <p className="text-[10px] text-muted-foreground mt-0.5">Guide jour-J · Organisation débutant · Guide prestataires · Checklist marié(e)s & proches · Checklist mairie & cérémonie</p>
              </div>
              <div className="flex items-start gap-2">
                <Check className="w-4 h-4 text-foreground mt-0.5 flex-shrink-0" />
                <span className="text-xs text-foreground">IA illimitée</span>
              </div>
              <div className="flex items-start gap-2">
                <Check className="w-4 h-4 text-foreground mt-0.5 flex-shrink-0" />
                <span className="text-xs text-foreground">Budget illimité</span>
              </div>
              <div className="flex items-start gap-2">
                <Check className="w-4 h-4 text-foreground mt-0.5 flex-shrink-0" />
                <span className="text-xs text-foreground">Stockage illimité</span>
              </div>
              <div className="flex items-start gap-2">
                <Check className="w-4 h-4 text-foreground mt-0.5 flex-shrink-0" />
                <span className="text-xs text-foreground">Support prioritaire</span>
              </div>
            </div>
            <Button 
              onClick={handlePremiumClick}
              disabled={checkoutLoading}
              size="sm" 
              className="w-full bg-foreground hover:bg-foreground/90 rounded-none"
            >
              {checkoutLoading ? "Chargement..." : "Passer au Premium"}
            </Button>
          </CardContent>
        </Card>
      </div>

      <div>
        <h3 className="text-lg font-serif font-bold text-foreground mb-4 text-center">
          Questions fréquentes
        </h3>
        <Accordion type="single" collapsible className="w-full">
          {faqItems.map((item, idx) => (
            <AccordionItem key={idx} value={`item-${idx}`}>
              <AccordionTrigger className="text-sm font-medium text-left">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
};

export default PricingContent;
