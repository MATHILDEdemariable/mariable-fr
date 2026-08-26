
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import PremiumHeader from '@/components/home/PremiumHeader';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, CreditCard, Shield, Clock, ArrowLeft } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const Paiement = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handlePremiumCheckout = async () => {
    if (checkoutLoading) return;
    try {
      setCheckoutLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/register-gratuit?redirect=paiement');
        return;
      }
      const { data, error } = await supabase.functions.invoke('create-checkout-session');
      if (error || !data?.url) {
        console.error('❌ Erreur création session Stripe:', error);
        toast({
          title: "Erreur",
          description: "Impossible de créer la session de paiement. Veuillez réessayer.",
          variant: "destructive",
        });
        return;
      }
      window.location.href = data.url;
    } catch (error) {
      console.error('❌ handlePremiumCheckout failed:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setCheckoutLoading(false);
    }
  };


  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const validateForm = () => {
    const email = (document.getElementById('email') as HTMLInputElement).value;
    const name = (document.getElementById('name') as HTMLInputElement).value;
    const phone = (document.getElementById('phone') as HTMLInputElement).value;
    const weddingDate = (document.getElementById('wedding-date') as HTMLInputElement).value;

    if (!email || !name || !phone || !weddingDate) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive",
      });
      return null;
    }

    // Validation email simple
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast({
        title: "Erreur",
        description: "Veuillez saisir une adresse email valide",
        variant: "destructive",
      });
      return null;
    }

    return { email, name, phone, weddingDate };
  };

  const clearForm = () => {
    (document.getElementById('email') as HTMLInputElement).value = '';
    (document.getElementById('name') as HTMLInputElement).value = '';
    (document.getElementById('phone') as HTMLInputElement).value = '';
    (document.getElementById('wedding-date') as HTMLInputElement).value = '';
  };

  const saveToDatabase = async (formData: { email: string; name: string; phone: string; weddingDate: string }) => {
    try {
      const { error } = await supabase
        .from('paiement_accompagnement')
        .insert({
          email: formData.email,
          nom_complet: formData.name,
          telephone_whatsapp: formData.phone,
          date_mariage: formData.weddingDate,
          statut: 'en_attente',
          montant: 29.00,
          devise: 'EUR'
        });

      if (error) {
        console.error('Erreur lors de la sauvegarde:', error);
        throw error;
      }

      return true;
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      return false;
    }
  };

  const handlePayment = async () => {
    const formData = validateForm();
    if (!formData) return;

    setIsSaving(true);

    try {
      // Sauvegarder en base de données
      const saveSuccess = await saveToDatabase(formData);
      
      if (!saveSuccess) {
        toast({
          title: "Erreur",
          description: "Une erreur est survenue lors de la sauvegarde. Veuillez réessayer.",
          variant: "destructive",
        });
        setIsSaving(false);
        return;
      }

      // Afficher message de succès
      toast({
        title: "Informations sauvegardées",
        description: "Vos informations ont été enregistrées avec succès. Redirection vers le paiement...",
      });

      // Vider le formulaire
      clearForm();

      setIsSaving(false);
      setIsLoading(true);
      
      // Simuler un paiement réussi pour rediriger vers /accompagnement
      // En production, ceci devrait être géré par Stripe avec des webhooks
      setTimeout(() => {
        setIsLoading(false);
        window.location.href = '/dashboard';
      }, 1500);

    } catch (error) {
      console.error('Erreur:', error);
      toast({
        title: "Erreur",
        description: "Une erreur inattendue est survenue. Veuillez réessayer.",
        variant: "destructive",
      });
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Helmet>
        <title>Mariable Premium — 29€ à vie | Mariable</title>
        <meta name="description" content="Débloquez tous les outils Mariable, exports PDF illimités, génération IA illimitée et toute la bibliothèque de guides pour 29€ à vie." />
      </Helmet>
      
      <PremiumHeader />
      
      <main className="flex-grow">
        <section className="py-16 md:py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              {/* Back button */}
              <div className="mb-8">
                <Button asChild variant="ghost" className="p-0 h-auto hover:bg-transparent">
                  <Link to="/" className="flex items-center gap-2 text-gray-600 hover:text-gray-800">
                    <ArrowLeft className="h-5 w-5" />
                    <span>Retour</span>
                  </Link>
                </Button>
              </div>

              <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-serif text-black mb-6">
                  Mariable Premium
                </h1>
                <p className="text-lg text-gray-700 max-w-2xl mx-auto">
                  Tous les outils sans limite, exports illimités et toute la bibliothèque de guides — un paiement unique, à vie.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Récapitulatif de l'offre */}
                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-2xl font-serif text-center">
                      Mariable Premium
                    </CardTitle>
                    <div className="text-center">
                      <div className="flex items-baseline justify-center gap-3 mb-2">
                        <div className="text-4xl font-bold text-wedding-olive">29€ TTC</div>
                        <span className="text-gray-400 line-through text-lg">59€</span>
                      </div>
                      <p className="text-sm text-wedding-olive font-medium mt-2">💍 Accès à vie · paiement unique</p>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <h3 className="font-semibold text-lg mb-4">Inclus dans votre application :</h3>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-gray-700">Application personnalisée pour votre mariage</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-gray-700">Planning intelligent et personnalisable</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-gray-700">Partage avec vos proches et prestataires</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-gray-700">Documents partagés et centralisés</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-gray-700">Gestion d'équipe simplifiée</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-gray-700">Timeline interactive du jour J</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-gray-700">Mode collaboratif en temps réel</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-gray-700">Accès vie entière à votre planning</p>
                      </div>
                    </div>

                    <div className="pt-4 border-t">
                      <div className="flex items-center gap-2 mb-4">
                        <span className="text-lg">💡</span>
                        <p className="text-sm font-medium text-gray-700">
                          Votre outil personnel pour organiser et coordonner votre mariage en toute autonomie !
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Formulaire de paiement */}
                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-xl font-serif flex items-center gap-2">
                      <CreditCard className="h-6 w-6" />
                      Informations de paiement
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                          Adresse email *
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-wedding-olive focus:border-transparent"
                          placeholder="votre@email.com"
                          required
                          disabled={isSaving || isLoading}
                        />
                      </div>

                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                          Nom complet *
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-wedding-olive focus:border-transparent"
                          placeholder="Votre nom complet"
                          required
                          disabled={isSaving || isLoading}
                        />
                      </div>

                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                          Numéro de téléphone WhatsApp *
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-wedding-olive focus:border-transparent"
                          placeholder="+33 6 12 34 56 78"
                          required
                          disabled={isSaving || isLoading}
                        />
                        <p className="text-xs text-gray-600 mt-1">
                          Ce numéro sera utilisé pour vous contacter via WhatsApp
                        </p>
                      </div>

                      <div>
                        <label htmlFor="wedding-date" className="block text-sm font-medium text-gray-700 mb-2">
                          Date de mariage prévue *
                        </label>
                        <input
                          type="date"
                          id="wedding-date"
                          name="wedding-date"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-wedding-olive focus:border-transparent"
                          required
                          disabled={isSaving || isLoading}
                        />
                      </div>
                    </div>

                    <div className="pt-4 border-t">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-lg font-semibold">Total</span>
                        <span className="text-2xl font-bold text-wedding-olive">29€ TTC</span>
                      </div>
                      
      <Button 
        onClick={() => window.open('https://buy.stripe.com/7sY00ka2m3xwcMt8Au8bS03', '_blank')}
        className="w-full bg-wedding-olive hover:bg-wedding-olive/90 text-white py-3 text-lg"
      >
        Acheter maintenant
      </Button>

      <Link to="/register-gratuit" className="block mt-3">
        <Button
          variant="outline"
          className="w-full border-wedding-olive text-wedding-olive hover:bg-wedding-olive/5 py-3"
        >
          Je veux utiliser la version gratuite d'abord
        </Button>
      </Link>
      <p className="text-xs text-center text-gray-500 mt-2">
        Inscription gratuite, sans carte bancaire. Vous pourrez passer Premium à tout moment.
      </p>
                    </div>

                    <div className="space-y-3 pt-4 border-t">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Shield className="h-4 w-4" />
                        <span>Paiement sécurisé par Stripe</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Clock className="h-4 w-4" />
                        <span>Accès vie entière après achat</span>
                      </div>
                      <p className="text-xs text-gray-500">
                        En achetant, vous acceptez nos conditions générales de vente et notre politique de confidentialité.
                        Paiement unique, accès permanent à votre application.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Paiement;
