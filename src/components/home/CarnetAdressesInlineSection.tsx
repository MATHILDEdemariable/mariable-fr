import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Heart, Send, Users, Calendar } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { trackEvent } from '@/utils/analytics';
import { useNavigate } from 'react-router-dom';

interface FormData {
  email: string;
  region: string;
  date_mariage: string;
  nombre_invites: string;
  budget_approximatif: string;
  categories_prestataires: string[];
}

const CarnetAdressesInlineSection = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    email: '',
    region: '',
    date_mariage: '',
    nombre_invites: '',
    budget_approximatif: '',
    categories_prestataires: []
  });

  const regions = [
    'Auvergne-Rhône-Alpes', 'Bourgogne-Franche-Comté', 'Bretagne', 'Centre-Val de Loire',
    'Corse', 'Grand Est', 'Hauts-de-France', 'Île-de-France', 'Normandie',
    'Nouvelle-Aquitaine', 'Occitanie', 'Pays de la Loire', "Provence-Alpes-Côte d'Azur"
  ];

  const categoriesPrestataires = [
    'Lieu de réception', 'Photographe', 'Vidéaste', 'Traiteur',
    'Fleuriste', 'DJ/Musiciens', 'Coiffeur/Maquilleur', 'Wedding Planner'
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (category: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      categories_prestataires: checked
        ? [...prev.categories_prestataires, category]
        : prev.categories_prestataires.filter(c => c !== category)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.email || !formData.region) {
      toast.error('Veuillez renseigner au minimum votre email et votre région');
      return;
    }

    if (formData.categories_prestataires.length === 0) {
      toast.error('Veuillez sélectionner au moins un type de prestataire');
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('carnet_adresses_requests')
        .insert([{
          email: formData.email,
          region: formData.region,
          date_mariage: formData.date_mariage || null,
          nombre_invites: formData.nombre_invites || null,
          budget_approximatif: formData.budget_approximatif || null,
          categories_prestataires: formData.categories_prestataires
        }]);

      if (error) throw error;

      // Track conversion
      trackEvent('carnet_adresses_requested', {
        region: formData.region,
        budget: formData.budget_approximatif,
        categories_count: formData.categories_prestataires.length,
        categories: formData.categories_prestataires.join(', ')
      });

      toast.success('🎉 Votre demande a été envoyée ! Vous recevrez votre sélection sous 48H', {
        duration: 7000
      });

      // Redirection vers /selection avec filtres pré-remplis
      setTimeout(() => {
        navigate(`/selection?region=${encodeURIComponent(formData.region)}`);
      }, 2000);

    } catch (error) {
      console.error('Erreur lors de la soumission:', error);
      toast.error('Une erreur est survenue. Veuillez réessayer.', { duration: 5000 });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="carnet-adresses-section" className="py-24 bg-gradient-to-br from-premium-warm via-white to-premium-base">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          {/* Header avec social proof */}
          <div className="text-center mb-12">
            <Badge className="mb-4 px-4 py-2 bg-premium-sage text-white border-0">
              ✨ 100% Gratuit
            </Badge>
            
            <h2 className="text-4xl md:text-5xl font-bold text-premium-black mb-4">
              Recevez GRATUITEMENT votre
              <br />
              <span className="text-premium-sage">
                sélection personnalisée de prestataires
              </span>
            </h2>
            
            <p className="text-xl text-premium-charcoal max-w-3xl mx-auto mb-6">
              Nous vous envoyons sous 48H 5 à 10 prestataires triés selon votre région, budget et style
            </p>

            {/* Social proof */}
            <div className="flex items-center justify-center gap-2 text-premium-charcoal">
              <Users className="h-5 w-5 text-premium-sage" />
              <p className="text-sm font-medium">
                ✓ Déjà <span className="font-bold text-premium-sage">400 couples</span> ont reçu leur sélection
              </p>
            </div>
          </div>

          {/* Formulaire inline */}
          <Card className="border-2 border-premium-sage/20 shadow-2xl">
            <CardContent className="p-8 md:p-12">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email + Région */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="email" className="text-premium-charcoal font-semibold mb-2 flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-premium-sage" />
                      Votre email *
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      required
                      placeholder="votre@email.com"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="border-premium-sage/30 focus:border-premium-sage"
                    />
                  </div>

                  <div>
                    <Label htmlFor="region" className="text-premium-charcoal font-semibold mb-2 flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-premium-sage" />
                      Région de votre mariage *
                    </Label>
                    <select
                      id="region"
                      name="region"
                      required
                      value={formData.region}
                      onChange={handleInputChange}
                      className="w-full rounded-md border border-premium-sage/30 bg-white px-3 py-2 text-sm focus:border-premium-sage focus:outline-none focus:ring-2 focus:ring-premium-sage/20"
                    >
                      <option value="">Sélectionnez une région</option>
                      {regions.map((region) => (
                        <option key={region} value={region}>{region}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Date + Invités + Budget */}
                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <Label htmlFor="date_mariage" className="text-premium-charcoal font-semibold mb-2 flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-premium-sage" />
                      Date approximative
                    </Label>
                    <Input
                      id="date_mariage"
                      name="date_mariage"
                      type="date"
                      placeholder="MM/AAAA"
                      value={formData.date_mariage}
                      onChange={handleInputChange}
                      className="border-premium-sage/30 focus:border-premium-sage"
                    />
                  </div>

                  <div>
                    <Label htmlFor="nombre_invites" className="text-premium-charcoal font-semibold mb-2">
                      Nombre d'invités
                    </Label>
                    <select
                      id="nombre_invites"
                      name="nombre_invites"
                      value={formData.nombre_invites}
                      onChange={handleInputChange}
                      className="w-full rounded-md border border-premium-sage/30 bg-white px-3 py-2 text-sm focus:border-premium-sage focus:outline-none focus:ring-2 focus:ring-premium-sage/20"
                    >
                      <option value="">Choisir</option>
                      <option value="Moins de 50">Moins de 50</option>
                      <option value="50-100">50-100</option>
                      <option value="100-150">100-150</option>
                      <option value="Plus de 150">Plus de 150</option>
                    </select>
                  </div>

                  <div>
                    <Label htmlFor="budget_approximatif" className="text-premium-charcoal font-semibold mb-2">
                      Budget approximatif
                    </Label>
                    <select
                      id="budget_approximatif"
                      name="budget_approximatif"
                      value={formData.budget_approximatif}
                      onChange={handleInputChange}
                      className="w-full rounded-md border border-premium-sage/30 bg-white px-3 py-2 text-sm focus:border-premium-sage focus:outline-none focus:ring-2 focus:ring-premium-sage/20"
                    >
                      <option value="">Choisir</option>
                      <option value="Moins de 10 000€">Moins de 10 000€</option>
                      <option value="10 000€ - 20 000€">10 000€ - 20 000€</option>
                      <option value="20 000€ - 30 000€">20 000€ - 30 000€</option>
                      <option value="Plus de 30 000€">Plus de 30 000€</option>
                    </select>
                  </div>
                </div>

                {/* Catégories de prestataires */}
                <div>
                  <Label className="text-premium-charcoal font-semibold mb-4 flex items-center gap-2">
                    <Heart className="h-4 w-4 text-premium-sage" />
                    Quels types de prestataires recherchez-vous ? *
                  </Label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                    {categoriesPrestataires.map((category) => (
                      <div key={category} className="flex items-center space-x-2">
                        <Checkbox
                          id={category}
                          checked={formData.categories_prestataires.includes(category)}
                          onCheckedChange={(checked) => handleCategoryChange(category, checked as boolean)}
                          className="border-premium-sage data-[state=checked]:bg-premium-sage"
                        />
                        <label
                          htmlFor={category}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                        >
                          {category}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* CTA Submit */}
                <div className="text-center pt-4">
                  <Button
                    type="submit"
                    size="lg"
                    disabled={isSubmitting}
                    className="btn-primary text-white px-12 py-6 text-lg font-semibold ripple w-full md:w-auto"
                  >
                    {isSubmitting ? (
                      'Envoi en cours...'
                    ) : (
                      <>
                        Recevoir ma sélection gratuite <Send className="ml-2 h-5 w-5" />
                      </>
                    )}
                  </Button>
                  <p className="text-sm text-premium-charcoal/70 mt-4">
                    ✓ Sans engagement • ✓ Réponse sous 48H • ✓ 100% gratuit
                  </p>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Bénéfices */}
          <div className="grid md:grid-cols-3 gap-6 mt-12">
            <div className="text-center">
              <div className="bg-premium-sage/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-premium-sage" />
              </div>
              <h3 className="font-semibold text-premium-black mb-2">Prestataires vérifiés</h3>
              <p className="text-sm text-premium-charcoal">Tous nos prestataires sont sélectionnés et testés par nos experts</p>
            </div>

            <div className="text-center">
              <div className="bg-premium-sage/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="h-8 w-8 text-premium-sage" />
              </div>
              <h3 className="font-semibold text-premium-black mb-2">Sélection personnalisée</h3>
              <p className="text-sm text-premium-charcoal">Des recommandations adaptées à votre style et budget</p>
            </div>

            <div className="text-center">
              <div className="bg-premium-sage/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-premium-sage" />
              </div>
              <h3 className="font-semibold text-premium-black mb-2">Gain de temps</h3>
              <p className="text-sm text-premium-charcoal">Économisez 20H de recherche avec notre sélection experte</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CarnetAdressesInlineSection;
