import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { CheckCircle, Heart, Send, Users, Calendar, MessageSquare, Phone, Gift, Crown, Check } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { trackEvent } from '@/utils/analytics';
import { useNavigate } from 'react-router-dom';
interface FormData {
  email: string;
  whatsapp: string;
  region: string;
  date_mariage: string;
  nombre_invites: string;
  budget_approximatif: string;
  categories_prestataires: string[];
  commentaires: string;
  consent_contact: boolean;
  type_selection: 'gratuite' | 'premium' | null;
}
const CarnetAdressesInlineSection = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    email: '',
    whatsapp: '',
    region: '',
    date_mariage: '',
    nombre_invites: '',
    budget_approximatif: '',
    categories_prestataires: [],
    commentaires: '',
    consent_contact: false,
    type_selection: null
  });
  const regions = ['Auvergne-Rhône-Alpes', 'Bourgogne-Franche-Comté', 'Bretagne', 'Centre-Val de Loire', 'Corse', 'Grand Est', 'Hauts-de-France', 'Île-de-France', 'Normandie', 'Nouvelle-Aquitaine', 'Occitanie', 'Pays de la Loire', "Provence-Alpes-Côte d'Azur"];
  const categoriesPrestataires = ['Lieu de réception', 'Photographe', 'Vidéaste', 'Traiteur', 'Fleuriste', 'DJ/Musiciens', 'Coiffeur/Maquilleur', 'Wedding Planner'];
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const {
      name,
      value
    } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  const handleCategoryChange = (category: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      categories_prestataires: checked ? [...prev.categories_prestataires, category] : prev.categories_prestataires.filter(c => c !== category)
    }));
  };
  const handleConsentChange = (checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      consent_contact: checked
    }));
  };
  const handleTypeSelectionChange = (type: 'gratuite' | 'premium') => {
    setFormData(prev => ({
      ...prev,
      type_selection: type
    }));
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.region) {
      toast.error('Veuillez renseigner au minimum votre email et votre région');
      return;
    }
    if (!formData.whatsapp) {
      toast.error('Veuillez renseigner votre numéro WhatsApp');
      return;
    }
    if (!formData.consent_contact) {
      toast.error('Veuillez accepter d\'être contacté pour recevoir votre sélection');
      return;
    }
    if (!formData.type_selection) {
      toast.error('Veuillez choisir un type de sélection (gratuite ou premium)');
      return;
    }
    if (formData.categories_prestataires.length === 0) {
      toast.error('Veuillez sélectionner au moins un type de prestataire');
      return;
    }
    setIsSubmitting(true);
    try {
      const {
        error
      } = await supabase.from('carnet_adresses_requests').insert([{
        email: formData.email,
        whatsapp: formData.whatsapp,
        region: formData.region,
        date_mariage: formData.date_mariage || null,
        nombre_invites: formData.nombre_invites || null,
        budget_approximatif: formData.budget_approximatif || null,
        categories_prestataires: formData.categories_prestataires,
        commentaires: formData.commentaires || null,
        consent_contact: formData.consent_contact,
        type_selection: formData.type_selection
      }]);
      if (error) throw error;

      // Track conversion
      trackEvent('carnet_adresses_requested', {
        region: formData.region,
        budget: formData.budget_approximatif,
        type_selection: formData.type_selection,
        categories_count: formData.categories_prestataires.length,
        categories: formData.categories_prestataires.join(', ')
      });
      toast.success('📲 Nous vous recontactons sur WhatsApp !!', {
        duration: 7000
      });

      // Redirection vers /selection avec filtres pré-remplis
      setTimeout(() => {
        navigate(`/selection?region=${encodeURIComponent(formData.region)}`);
      }, 2000);
    } catch (error) {
      console.error('Erreur lors de la soumission:', error);
      toast.error('Une erreur est survenue. Veuillez réessayer.', {
        duration: 5000
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  return <section id="carnet-adresses-section" className="py-24 bg-editorial-beige">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          {/* Header éditorial */}
          <header className="text-center mb-12">
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-editorial-noir mb-4 font-normal">
              Recevez votre <em>sélection de prestataires</em>
            </h2>
            
            <p className="text-lg text-editorial-noir/70 max-w-2xl mx-auto mb-6">
              Choisissez votre formule et recevez une sélection adaptée à vos besoins
            </p>

            {/* Social proof sobre */}
            <p className="text-sm text-editorial-noir/60">
              Déjà 400 couples ont reçu leur sélection
            </p>
          </header>

          {/* Formulaire inline */}
            <Card className="border border-editorial-noir/10 shadow-lg rounded-none bg-white">
            <CardContent className="p-8 md:p-12">
              <form onSubmit={handleSubmit} className="space-y-6">

                {/* Type de sélection */}
                <div className="space-y-4">
                  <Label className="text-premium-charcoal font-semibold mb-4 flex items-center gap-2 text-lg">
                    Choisissez votre formule *
                  </Label>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    {/* Sélection Gratuite */}
                    <div onClick={() => handleTypeSelectionChange('gratuite')} className={`cursor-pointer p-6 rounded-none border-2 transition-all duration-300 ${formData.type_selection === 'gratuite' ? 'border-editorial-olive bg-editorial-olive/5 shadow-lg' : 'border-editorial-olive/20 hover:border-editorial-olive/40 bg-white'}`}>
                      <div className="flex items-start gap-4">
                        <div className={`p-3 rounded-none ${formData.type_selection === 'gratuite' ? 'bg-editorial-olive text-white' : 'bg-editorial-olive/10 text-editorial-olive'}`}>
                          <Gift className="h-6 w-6" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-bold text-premium-black text-lg">Sélection gratuite</h3>
                            <Badge className="bg-green-500 text-white text-xs">GRATUIT</Badge>
                          </div>
                          <ul className="space-y-1 text-sm text-premium-charcoal">
                            <li className="flex items-center gap-2">​<Check className="h-4 w-4 text-premium-sage" />
                              Liste de prestataires triés sur le volet                                                                               
                            </li>
                            <li className="flex items-center gap-2">
                              <Check className="h-4 w-4 text-premium-sage" />
                              Envoyés sous 48H par WhatsApp
                            </li>
                          </ul>
                        </div>
                        {formData.type_selection === 'gratuite' && <CheckCircle className="h-6 w-6 text-premium-sage" />}
                      </div>
                    </div>

                    {/* Sélection Premium */}
                    <div onClick={() => handleTypeSelectionChange('premium')} className={`cursor-pointer p-6 rounded-none border-2 transition-all duration-300 ${formData.type_selection === 'premium' ? 'border-editorial-olive bg-editorial-olive/5 shadow-lg' : 'border-editorial-olive/20 hover:border-editorial-olive/40 bg-white'}`}>
                      <div className="flex items-start gap-4">
                        <div className={`p-3 rounded-none ${formData.type_selection === 'premium' ? 'bg-editorial-olive text-white' : 'bg-editorial-olive/10 text-editorial-olive'}`}>
                          <Crown className="h-6 w-6" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-bold text-premium-black text-lg">Sélection premium</h3>
                            <Badge className="bg-premium-sage text-white text-xs">69€</Badge>
                          </div>
                          <ul className="space-y-1 text-sm text-premium-charcoal">
                            <li className="flex items-center gap-2">
                              <Check className="h-4 w-4 text-premium-sage flex-shrink-0" />
                              Liste de prestataires personnalisée    
                            </li>
                            <li className="flex items-center gap-2">
                              <Check className="h-4 w-4 text-premium-sage flex-shrink-0" />
                              Envoyés sous 72H par WhatsApp
                            </li>
                            <li className="flex items-center gap-2">
                              <Check className="h-4 w-4 text-premium-sage flex-shrink-0" />
                              Vérification de disponibilité à votre date
                            </li>
                            <li className="flex items-center gap-2">
                              <Check className="h-4 w-4 text-premium-sage flex-shrink-0" />
                              Envoi des prix & formules
                            </li>
                            
                            <li className="flex items-center gap-2">
                              <Check className="h-4 w-4 text-premium-sage flex-shrink-0" />
                              Accompagnement WhatsApp jusqu'à trouver VOS prestataires parfaits
                            </li>
                          </ul>
                        </div>
                        {formData.type_selection === 'premium' && <CheckCircle className="h-6 w-6 text-premium-sage" />}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Email + WhatsApp */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="email" className="text-premium-charcoal font-semibold mb-2 flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-premium-sage" />
                      Votre email *
                    </Label>
                    <Input id="email" name="email" type="email" required placeholder="votre@email.com" value={formData.email} onChange={handleInputChange} className="border-premium-sage/30 focus:border-premium-sage" />
                  </div>

                  <div>
                    <Label htmlFor="whatsapp" className="text-premium-charcoal font-semibold mb-2 flex items-center gap-2">
                      <Phone className="h-4 w-4 text-premium-sage" />
                      Numéro WhatsApp *
                    </Label>
                    <Input id="whatsapp" name="whatsapp" type="tel" required placeholder="06 12 34 56 78" value={formData.whatsapp} onChange={handleInputChange} className="border-premium-sage/30 focus:border-premium-sage" />
                  </div>
                </div>

                {/* Région */}
                <div>
                  <Label htmlFor="region" className="text-premium-charcoal font-semibold mb-2 flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-premium-sage" />
                    Région de votre mariage *
                  </Label>
                  <select id="region" name="region" required value={formData.region} onChange={handleInputChange} className="w-full rounded-none border border-editorial-olive/30 bg-white px-3 py-2 text-sm focus:border-editorial-olive focus:outline-none focus:ring-2 focus:ring-editorial-olive/20">
                    <option value="">Sélectionnez une région</option>
                    {regions.map(region => <option key={region} value={region}>{region}</option>)}
                  </select>
                </div>

                {/* Date + Invités + Budget */}
                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <Label htmlFor="date_mariage" className="text-premium-charcoal font-semibold mb-2 flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-premium-sage" />
                      Date approximative
                    </Label>
                    <Input id="date_mariage" name="date_mariage" type="date" placeholder="MM/AAAA" value={formData.date_mariage} onChange={handleInputChange} className="border-premium-sage/30 focus:border-premium-sage" />
                  </div>

                  <div>
                    <Label htmlFor="nombre_invites" className="text-premium-charcoal font-semibold mb-2">
                      Nombre d'invités
                    </Label>
                    <select id="nombre_invites" name="nombre_invites" value={formData.nombre_invites} onChange={handleInputChange} className="w-full rounded-none border border-editorial-olive/30 bg-white px-3 py-2 text-sm focus:border-editorial-olive focus:outline-none focus:ring-2 focus:ring-editorial-olive/20">
                      <option value="">Choisir</option>
                      <option value="Moins de 50">Moins de 50</option>
                      <option value="50-100">50-100</option>
                      <option value="100-150">100-150</option>
                      <option value="Plus de 150">Plus de 150</option>
                    </select>
                  </div>

                  <div>
                    <Label htmlFor="budget_approximatif" className="text-premium-charcoal font-semibold mb-2">
                      Budget mariage total
                    </Label>
                    <select id="budget_approximatif" name="budget_approximatif" value={formData.budget_approximatif} onChange={handleInputChange} className="w-full rounded-none border border-editorial-olive/30 bg-white px-3 py-2 text-sm focus:border-editorial-olive focus:outline-none focus:ring-2 focus:ring-editorial-olive/20">
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
                    {categoriesPrestataires.map(category => <div key={category} className="flex items-center space-x-2">
                        <Checkbox id={category} checked={formData.categories_prestataires.includes(category)} onCheckedChange={checked => handleCategoryChange(category, checked as boolean)} className="border-premium-sage data-[state=checked]:bg-premium-sage" />
                        <label htmlFor={category} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer">
                          {category}
                        </label>
                      </div>)}
                  </div>
                </div>

                {/* Commentaires */}
                <div>
                  <Label htmlFor="commentaires" className="text-premium-charcoal font-semibold mb-2 flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 text-premium-sage" />
                    Commentaires ou précisions (optionnel)
                  </Label>
                  <Textarea id="commentaires" name="commentaires" placeholder="Parlez-nous de vos envies, de votre style de mariage, de vos besoins spécifiques..." value={formData.commentaires} onChange={handleInputChange} className="border-premium-sage/30 focus:border-premium-sage min-h-[100px]" />
                </div>

                {/* Consentement */}
                <div className="flex items-start space-x-3 p-4 bg-editorial-olive/5 rounded-none border border-editorial-olive/20">
                  <Checkbox id="consent_contact" checked={formData.consent_contact} onCheckedChange={checked => handleConsentChange(checked as boolean)} className="border-premium-sage data-[state=checked]:bg-premium-sage mt-0.5" />
                  <label htmlFor="consent_contact" className="text-sm leading-relaxed cursor-pointer text-premium-charcoal">
                    J'accepte d'être contacté(e) pour l'envoi des informations relatives à l'organisation de mon mariage et aux services Mariable *
                  </label>
                </div>

                {/* CTA Submit */}
                <div className="text-center pt-4">
                  <Button type="submit" size="lg" disabled={isSubmitting} className="bg-editorial-olive hover:bg-editorial-noir text-white px-12 py-6 text-lg font-semibold rounded-none w-full md:w-auto">
                    {isSubmitting ? 'Envoi en cours...' : <>
                        Recevoir ma sélection <Send className="ml-2 h-5 w-5" />
                      </>}
                  </Button>
                  <p className="text-sm text-premium-charcoal/70 mt-4">
                    ✓ Sans engagement • ✓ Réponse sous 48H
                  </p>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Bénéfices */}
          <div className="grid md:grid-cols-3 gap-6 mt-12">
            <div className="text-center">
              <div className="bg-editorial-olive/10 w-16 h-16 rounded-none flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-editorial-olive" />
              </div>
              <h3 className="font-semibold text-editorial-noir mb-2">Prestataires vérifiés</h3>
              <p className="text-sm text-editorial-noir/70">Tous nos prestataires sont sélectionnés et testés par nos experts</p>
            </div>

            <div className="text-center">
              <div className="bg-editorial-olive/10 w-16 h-16 rounded-none flex items-center justify-center mx-auto mb-4">
                <Heart className="h-8 w-8 text-editorial-olive" />
              </div>
              <h3 className="font-semibold text-editorial-noir mb-2">Sélection personnalisée</h3>
              <p className="text-sm text-editorial-noir/70">Des recommandations adaptées à votre style et budget</p>
            </div>

            <div className="text-center">
              <div className="bg-editorial-olive/10 w-16 h-16 rounded-none flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-editorial-olive" />
              </div>
              <h3 className="font-semibold text-editorial-noir mb-2">Gain de temps</h3>
              <p className="text-sm text-editorial-noir/70">Économisez 20H de recherche avec notre sélection experte</p>
            </div>
          </div>
        </div>
      </div>
    </section>;
};
export default CarnetAdressesInlineSection;